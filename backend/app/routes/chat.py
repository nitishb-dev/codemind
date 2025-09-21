from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.routes.upload import repositories
from app.services.ai_service import generate_ai_response
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_repository(request: ChatRequest):
    """Chat with the uploaded repository using AI"""
    
    if request.repo_id not in repositories:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    repo = repositories[request.repo_id]
    
    try:
        # Generate AI response
        response_message = await generate_ai_response(repo, request.message)
        
        return ChatResponse(
            message=response_message,
            relevant_files=[f['path'] for f in repo['files'][:3]]
        )
    except Exception as e:
        logger.error(f"Chat request failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")