import os
import tempfile
import zipfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import Repository
from app.services.utils import extract_python_files
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage (use database in production)
repositories = {}

@router.post("/upload", response_model=Repository)
async def upload_repository(file: UploadFile = File(...)):
    """Upload and process a Python repository ZIP file"""
    
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    repo_id = f"repo_{len(repositories) + 1}"
    
    try:
        # Save uploaded file
        zip_path = os.path.join(temp_dir, file.filename)
        with open(zip_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract and process Python files
        python_files = await extract_python_files(zip_path, temp_dir)
        
        # Store repository data
        repositories[repo_id] = {
            'name': file.filename.replace('.zip', ''),
            'files': python_files,
            'temp_dir': temp_dir,
            'uploaded_at': '2024-01-01T00:00:00Z',  # Use proper timestamp
            'file_count': len(python_files)
        }
        
        return Repository(
            id=repo_id,
            name=repositories[repo_id]['name'],
            uploaded_at=repositories[repo_id]['uploaded_at'],
            file_count=repositories[repo_id]['file_count']
        )
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")