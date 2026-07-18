from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title="CheckUpNow AI Service",
    description="AI orchestration layer for CheckUpNow (LangChain, tool-calling, agentic reasoning)",
    version="0.1.0",
)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "checkupnow-ai-service",
        "environment": settings.environment,
    }