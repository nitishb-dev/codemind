from fastapi import APIRouter, HTTPException
from app.models.schemas import DocumentationRequest, DocumentationResponse
from app.routes.upload import repositories
from app.services.ai_service import generate_documentation
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate_docs", response_model=DocumentationResponse)
async def generate_documentation_endpoint(request: DocumentationRequest):
    """Generate documentation for uploaded repository"""
    
    if request.repo_id not in repositories:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    repo = repositories[request.repo_id]
    
    try:
        # Generate AI documentation
        documentation = await generate_documentation(repo)
        
        return DocumentationResponse(documentation=documentation)
        
    except Exception as e:
        logger.error(f"Documentation generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Documentation generation failed: {str(e)}")