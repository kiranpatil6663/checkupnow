from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, ToolMessage
from app.core.config import settings
from app.core.logging_config import logger
from app.prompts.intent_parser_v1 import INTENT_PARSER_PROMPT_V1
from app.schemas.intent import PatientIntent
from app.tools.doctor_tools import search_doctors
from app.tools.slot_tools import check_slots

llm = None
structured_llm = None
tool_llm = None

if settings.groq_api_key:
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=settings.groq_api_key,
        temperature=0,
    )
    structured_llm = llm.with_structured_output(PatientIntent)
    tool_llm = llm.bind_tools([search_doctors, check_slots])

MAX_RETRIES = 2
AVAILABLE_TOOLS = {"search_doctors": search_doctors, "check_slots": check_slots}


async def parse_patient_intent(patient_message: str) -> PatientIntent:
    """Stage 1 — unchanged. Converts a message into structured intent."""
    if not structured_llm:
        raise ValueError("GROQ API key is not configured. Set groq_api_key in the .env file before calling this endpoint.")

    chain = INTENT_PARSER_PROMPT_V1 | structured_llm
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result: PatientIntent = await chain.ainvoke({"patient_message": patient_message})
            logger.info(f"Intent parsed successfully on attempt {attempt}: {result.intent}")
            return result
        except Exception as e:
            last_error = e
            logger.warning(f"Intent parsing attempt {attempt} failed: {str(e)}")

    logger.error(f"Intent parsing failed after {MAX_RETRIES} attempts: {str(last_error)}")
    raise ValueError(f"Failed to parse patient intent after {MAX_RETRIES} attempts") from last_error


async def handle_chat_with_tools(patient_message: str) -> str:
    """
    Stage 2 — lets the LLM decide whether to call a tool (e.g. search_doctors),
    executes it if requested, and returns a natural-language reply grounded in the real result.
    """
    if not tool_llm:
        raise ValueError("GROQ API key is not configured. Set groq_api_key in the .env file before calling this endpoint.")

    messages = [HumanMessage(content=patient_message)]

    ai_response = await tool_llm.ainvoke(messages)
    messages.append(ai_response)

    if not ai_response.tool_calls:
        logger.info("handle_chat_with_tools: no tool call made, direct response returned")
        return ai_response.content

    tool_results_raw = []

    for tool_call in ai_response.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]

        if tool_name not in AVAILABLE_TOOLS:
            logger.error(f"LLM requested unknown tool: {tool_name}")
            messages.append(ToolMessage(content=f"Error: tool '{tool_name}' does not exist.", tool_call_id=tool_call["id"]))
            continue

        logger.info(f"Executing tool '{tool_name}' with args: {tool_args}")
        tool_result = await AVAILABLE_TOOLS[tool_name].ainvoke(tool_args)
        tool_results_raw.append((tool_name, tool_result))
        messages.append(ToolMessage(content=tool_result.model_dump_json(), tool_call_id=tool_call["id"]))

    final_response = await tool_llm.ainvoke(messages)
    logger.info(f"handle_chat_with_tools: final content={final_response.content!r}, tool_calls={final_response.tool_calls}")

    if final_response.content:
        return final_response.content

    logger.warning("handle_chat_with_tools: model returned empty final content, using fallback narration")
    return build_fallback_reply(tool_results_raw)


def build_fallback_reply(tool_results_raw: list) -> str:
    """
    Safety net for when the LLM's final narration turn comes back empty
    (a known quirk with some tool-calling models). Builds a plain but
    accurate reply directly from the structured tool results, so the
    user never sees a blank response.
    """
    if not tool_results_raw:
        return "I wasn't able to find an answer to that. Could you rephrase your request?"

    parts = []
    for tool_name, result in tool_results_raw:
        if tool_name == "search_doctors":
            if not result.success or result.count == 0:
                parts.append(result.message or "No doctors found matching that.")
            else:
                names = ", ".join(f"{d.name} ({d.speciality})" for d in result.doctors)
                parts.append(f"I found {result.count} doctor(s): {names}.")

        elif tool_name == "check_slots":
            if not result.success:
                parts.append(result.message or "I couldn't check slots for that doctor.")
            elif not result.available_slots:
                parts.append(f"No available slots for {result.doctor_name} on {result.date}.")
            else:
                slots = ", ".join(result.available_slots)
                parts.append(f"{result.doctor_name} has these slots open on {result.date}: {slots}.")

    return " ".join(parts)