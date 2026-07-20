from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, ToolMessage
from app.core.config import settings
from app.core.logging_config import logger
from app.prompts.intent_parser_v1 import INTENT_PARSER_PROMPT_V1
from app.schemas.intent import PatientIntent
from app.tools.doctor_tools import search_doctors

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
    tool_llm = llm.bind_tools([search_doctors])

MAX_RETRIES = 2
AVAILABLE_TOOLS = {"search_doctors": search_doctors}


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

    for tool_call in ai_response.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]

        if tool_name not in AVAILABLE_TOOLS:
            logger.error(f"LLM requested unknown tool: {tool_name}")
            messages.append(ToolMessage(content=f"Error: tool '{tool_name}' does not exist.", tool_call_id=tool_call["id"]))
            continue

        logger.info(f"Executing tool '{tool_name}' with args: {tool_args}")
        tool_result = await AVAILABLE_TOOLS[tool_name].ainvoke(tool_args)
        messages.append(ToolMessage(content=tool_result.model_dump_json(), tool_call_id=tool_call["id"]))

    final_response = await tool_llm.ainvoke(messages)
    return final_response.content