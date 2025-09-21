from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file before anything else
load_dotenv()

from app.routes import upload, docs, chat, health

app = FastAPI(title="CodeMind Lite Backend")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router, prefix="/health")
app.include_router(upload.router, prefix="/upload")
app.include_router(docs.router, prefix="/generate_docs")
app.include_router(chat.router, prefix="/chat")
