import os
import zipfile
from pathlib import Path
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

async def extract_python_files(zip_path: str, temp_dir: str) -> List[Dict[str, Any]]:
    """Extract Python files from uploaded ZIP"""
    
    # Extract ZIP file
    extract_dir = os.path.join(temp_dir, "extracted")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    # Find Python files
    python_files = []
    for root, dirs, files in os.walk(extract_dir):
        for f in files:
            if f.endswith('.py'):
                file_path = os.path.join(root, f)
                try:
                    with open(file_path, 'r', encoding='utf-8') as py_file:
                        content = py_file.read()
                        python_files.append({
                            'path': os.path.relpath(file_path, extract_dir),
                            'content': content
                        })
                except Exception as e:
                    logger.warning(f"Could not read file {file_path}: {e}")
    
    return python_files

def clean_temp_directory(temp_dir: str):
    """Clean up temporary directory"""
    try:
        import shutil
        shutil.rmtree(temp_dir)
    except Exception as e:
        logger.warning(f"Could not clean temp directory {temp_dir}: {e}")