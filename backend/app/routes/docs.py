from fastapi import APIRouter, HTTPException
from app.routes.upload import repositories
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate_docs")
async def generate_documentation(request: dict):
    """Generate documentation for uploaded repository"""
    repo_id = request.get('repo_id')
    
    if repo_id not in repositories:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    repo = repositories[repo_id]
    
    # Simple documentation generation
    doc_content = f"# {repo['name']} Documentation\n\n"
    doc_content += f"This repository contains {repo['file_count']} Python files.\n\n"
    
    doc_content += "## File Overview\n\n"
    for file_info in repo['files']:
        doc_content += f"- **{file_info['path']}**: {len(file_info['content'].split('\\n'))} lines\n"
    
    return {"documentation": doc_content}