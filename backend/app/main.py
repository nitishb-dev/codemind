import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import upload, docs, chat, health
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CodeMind Lite API",
    description="AI-powered repository analysis and chat using Gemini via OpenRouter",
    version="1.0.0"
)

# CORS middleware for local development
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(upload.router, tags=["Upload"])
app.include_router(docs.router, tags=["Documentation"])
app.include_router(chat.router, tags=["Chat"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CodeMind Lite API is running",
        "version": "1.0.0",
        "ai_provider": "Gemini via OpenRouter"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 10000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "app.main:app", 
        host=host, 
        port=port, 
        reload=debug
    )