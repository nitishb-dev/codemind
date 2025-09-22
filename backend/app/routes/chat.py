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
        # 👇 Detect if user is asking for repo-wide summary
        global_summary_keywords = ["summarize", "summary", "overview", "all files", "entire repo", "whole repository"]
        is_global_summary = any(word in request.message.lower() for word in global_summary_keywords)

        if is_global_summary:
            # pass all files to AI
            response_message = await generate_ai_response(repo, request.message, all_files=True)
            relevant_files = [f["path"] for f in repo["files"]]
        else:
            # Generate AI response with embeddings
            response_message = await generate_ai_response(repo, request.message)
            
            # Keep only keyword-matched relevant files (max 3)
            relevant_files = []
            question_words = request.message.lower().split()
            
            for file_info in repo['files']:
                file_content_lower = file_info['content'].lower()
                file_path_lower = file_info['path'].lower()
                
                for word in question_words:
                    if len(word) > 3 and (word in file_content_lower or word in file_path_lower):
                        relevant_files.append(file_info['path'])
                        break
            
            relevant_files = relevant_files[:3]

        return ChatResponse(
            message=response_message,
            relevant_files=relevant_files
        )
        
    except Exception as e:
        logger.error(f"Chat request failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")
