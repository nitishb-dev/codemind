import os
import zipfile
from pathlib import Path
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

async def extract_python_files(zip_path: str, temp_dir: str) -> List[Dict[str, Any]]:
    """Extract Python files from uploaded ZIP"""
    
    try:
        # Extract ZIP file
        extract_dir = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        # Find Python files
        python_files = []
        
        for root, dirs, files in os.walk(extract_dir):
            # Skip common directories that don't contain source code
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__', 'node_modules', 'venv', 'env']]
            
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    try:
                        # Try different encodings
                        content = None
                        for encoding in ['utf-8', 'latin-1', 'cp1252']:
                            try:
                                with open(file_path, 'r', encoding=encoding) as py_file:
                                    content = py_file.read()
                                break
                            except UnicodeDecodeError:
                                continue
                        
                        if content is not None:
                            relative_path = os.path.relpath(file_path, extract_dir)
                            python_files.append({
                                'path': relative_path,
                                'content': content,
                                'size': len(content)
                            })
                        else:
                            logger.warning(f"Could not decode file {file_path}")
                            
                    except Exception as e:
                        logger.warning(f"Could not read file {file_path}: {e}")
        
        logger.info(f"Extracted {len(python_files)} Python files")
        return python_files
        
    except zipfile.BadZipFile:
        raise ValueError("Invalid ZIP file")
    except Exception as e:
        logger.error(f"Error extracting Python files: {e}")
        raise

def clean_temp_directory(temp_dir: str):
    """Clean up temporary directory"""
    try:
        import shutil
        shutil.rmtree(temp_dir)
        logger.info(f"Cleaned up temporary directory: {temp_dir}")
    except Exception as e:
        logger.warning(f"Could not clean temp directory {temp_dir}: {e}")