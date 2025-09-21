from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    repo_id: str
    message: str

class ChatResponse(BaseModel):
    message: str
    relevant_files: List[str] = []

class Repository(BaseModel):
    id: str
    name: str
    uploaded_at: str
    file_count: int

class DocumentationRequest(BaseModel):
    repo_id: str

class DocumentationResponse(BaseModel):
    documentation: str