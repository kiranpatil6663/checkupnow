from langchain_groq import ChatGroq

from app.core.config import settings
from app.core.logging_config import logger
from app.prompts.intent_parser_v1 import INTENT_PARSER_PROMPT_V1
from app.schemas.intent import PatientIntent

llm = None
structured_llm = None

if settings.groq_api_key:
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=settings.groq_api_key,
        temperature=0,  # deterministic extraction, not creative writing
    )
    structured_llm = llm.with_structured_output(PatientIntent)

MAX_RETRIES = 2


async def parse_patient_intent(patient_message: str) -> PatientIntent:
    """
    Converts a natural-language patient message into structured intent.
    Retries once on validation/parsing failure before raising.
    """
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