from fastapi import APIRouter
from app.models.schemas import HealthResponse
import os

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for deployment and monitoring"""
    
    # Check if OpenRouter API key is configured
    api_key_configured = bool(os.getenv("OPENROUTER_API_KEY"))
    
    return HealthResponse(
        status="healthy",
        message=f"CodeMind Lite API is running. AI features: {'enabled' if api_key_configured else 'fallback mode'}",
        ai_provider="Gemini via OpenRouter"
    )

@router.get("/")
async def simple_health():
    """Simple health check that returns 'ok' for basic monitoring"""
    return "ok"