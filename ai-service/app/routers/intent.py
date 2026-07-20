from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import parse_patient_intent
from app.core.logging_config import logger
from app.services.llm_service import parse_patient_intent, handle_chat_with_tools

router = APIRouter(prefix="/api/ai", tags=["intent"])

class IntentRequest(BaseModel):
    message: str

@router.post("/parse-intent")
async def parse_intent(request: IntentRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        result = await parse_patient_intent(request.message)
        return {"success": True, "data": result}
    except ValueError as e:
        logger.error(f"Intent parsing endpoint error: {str(e)}")
        raise HTTPException(status_code=422, detail="Could not understand the request. Please rephrase.") 


@router.post("/chat")
async def chat(request: IntentRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        reply = await handle_chat_with_tools(request.message)
        return {"success": True, "reply": reply}
    except ValueError as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))