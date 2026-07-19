from fastapi import FastAPI
from app.core.config import settings
from app.core.logging_config import logger
from app.routers import intent

app = FastAPI(
    title="CheckUpNow AI Service",
    description="AI orchestration layer for CheckUpNow (LangChain, tool-calling, agentic reasoning)",
    version="0.1.0",
)

app.include_router(intent.router)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "checkupnow-ai-service",
        "environment": settings.environment,
    }

@app.on_event("startup")
async def startup_event():
    logger.info("CheckUpNow AI Service starting up...")