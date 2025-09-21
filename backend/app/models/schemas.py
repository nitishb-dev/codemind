from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class FileInfo(BaseModel):
    path: str
    content: str

# This model represents the full data stored in memory
class RepositoryData(BaseModel):
    id: str
    name: str
    file_count: int
    files: List[FileInfo]
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

# This model is for the API response for the /upload endpoint
class Repository(BaseModel):
    id: str
    name: str
    uploaded_at: datetime
    file_count: int

class DocsRequest(BaseModel):
    repo_id: str

class ChatRequest(BaseModel):
    repo_id: str
    message: str
