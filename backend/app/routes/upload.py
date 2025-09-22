import os
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import Repository
from app.services.utils import extract_python_files
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for development (use database in production)
repositories = {}

@router.post("/upload", response_model=Repository)
async def upload_repository(file: UploadFile = File(...)):
    """Upload and process a Python repository ZIP file"""
    
    # Validate file type
    if not file.filename or not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")
    
    # Check file size (50MB limit)
    max_size = 50 * 1024 * 1024  # 50MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(status_code=400, detail="File size exceeds 50MB limit")
    
    # Reset file pointer
    await file.seek(0)
    
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
        
        if not python_files:
            raise HTTPException(status_code=400, detail="No Python files found in the uploaded ZIP")
        
        # Store repository data
        repositories[repo_id] = {
            'id': repo_id,
            'name': file.filename.replace('.zip', ''),
            'files': python_files,
            'temp_dir': temp_dir,
            'uploaded_at': datetime.now().isoformat(),
            'file_count': len(python_files)
        }
        
        logger.info(f"Successfully uploaded repository {repo_id} with {len(python_files)} Python files")
        
        return Repository(
            id=repo_id,
            name=repositories[repo_id]['name'],
            uploaded_at=repositories[repo_id]['uploaded_at'],
            file_count=repositories[repo_id]['file_count']
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/repositories")
async def list_repositories():
    """List all uploaded repositories (for debugging)"""
    return {
        "repositories": [
            {
                "id": repo_id,
                "name": repo_data["name"],
                "file_count": repo_data["file_count"],
                "uploaded_at": repo_data["uploaded_at"]
            }
            for repo_id, repo_data in repositories.items()
        ]
    }