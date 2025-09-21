from fastapi import APIRouter, UploadFile, HTTPException
import os, zipfile, uuid, tempfile, shutil
from app.models.schemas import Repository, RepositoryData
from typing import Dict
from datetime import datetime

router = APIRouter()
repositories: Dict[str, RepositoryData] = {}  # Temporary in-memory store

@router.post("/", response_model=Repository)
async def upload_repo(file: UploadFile):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed.")
    
    temp_dir = tempfile.mkdtemp(prefix="codemind_")
    try:
        zip_path = os.path.join(temp_dir, file.filename)
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract to a sub-directory
        extract_path = os.path.join(temp_dir, "extracted")
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(extract_path)
        
        # Collect .py files
        files = []
        for root, _, filenames in os.walk(extract_path):
            for fname in filenames:
                if fname.endswith(".py"):
                    full_path = os.path.join(root, fname)
                    path = os.path.relpath(full_path, extract_path)
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="ignore") as f_content:
                            content = f_content.read()
                        files.append({"path": path, "content": content})
                    except Exception:
                        continue # Skip files that can't be read
        
        if not files:
            raise HTTPException(status_code=400, detail="No readable Python (.py) files found in the ZIP archive.")

        repo_id = str(uuid.uuid4())
        repo_data = RepositoryData(
            id=repo_id,
            name=file.filename.replace(".zip", ""),
            file_count=len(files),
            files=files,
            uploaded_at=datetime.utcnow()
        )
        repositories[repo_id] = repo_data
        
        # Return only the metadata, not the full file content
        return Repository.model_validate(repo_data.model_dump())
    finally:
        # Clean up the temporary directory
        shutil.rmtree(temp_dir)
