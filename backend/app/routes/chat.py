from fastapi import APIRouter, HTTPException
from app.routes.upload import repositories
from app.services.ai_service import ask_ai, generate_repo_chunks
from app.models.schemas import ChatRequest

router = APIRouter()

# Store embeddings per repo
repo_chunks_store = {}

@router.post("/")
async def chat_repo(request: ChatRequest):
    repo_id = request.repo_id
    question = request.message
    
    if repo_id not in repositories:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    if not question:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    # Generate embeddings for repo if not already done
    if repo_id not in repo_chunks_store:
        repo_chunks_store[repo_id] = await generate_repo_chunks(repositories[repo_id].files)
    
    repo_chunks = repo_chunks_store[repo_id]
    answer = await ask_ai(question, repo_chunks)
    return {"message": answer}
