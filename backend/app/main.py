import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, docs, chat, health
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CodeMind Lite API",
    description="AI-powered repository analysis and chat",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(upload.router)
app.include_router(docs.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "CodeMind Lite API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=10000, reload=True)