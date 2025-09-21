from fastapi import APIRouter, HTTPException
from app.routes.upload import repositories
from app.models.schemas import DocsRequest

router = APIRouter()

@router.post("/")
async def generate_documentation(request: DocsRequest):
    """Generate documentation for uploaded repository"""
    repo_id = request.repo_id
    if repo_id not in repositories:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    repo = repositories[repo_id]
    doc_content = f"# {repo.name} Documentation\n\n"
    doc_content += f"This repository contains {repo.file_count} Python files.\n\n"
    
    doc_content += "## File Overview\n\n"
    for file_info in repo.files:
        # Use splitlines() for more robust line counting
        line_count = len(file_info.content.splitlines())
        doc_content += f"- **{file_info.path}**: {line_count} lines\n"
    
    return {"documentation": doc_content}
