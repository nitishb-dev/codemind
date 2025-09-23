import os
import requests
from typing import Dict, Any, List
import logging

from app.services.embeddings import EmbeddingService
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        self.model = "x-ai/grok-4-fast:free"
        
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY not found. AI features will use fallback responses.")
    
    async def generate_response(self, context: str, question: str) -> str:
        """Generate AI response using OpenRouter Grok-4"""
        
        if not self.api_key:
            return self._fallback_response(context, question)
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:10000",
                "X-Title": "CodeMind Lite"
            }
            
            # Pass the full context now
            prompt = f"""You are an AI assistant helping users understand their Python code repository.

Repository Context:
{context}

User Question: {question}

Please provide a helpful, accurate response about the code. If you can't find specific information in the context, say so clearly. Keep responses concise but informative."""
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,  # Increase if needed
                "temperature": 0.7
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=60  # give more time for large repos
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                return self._fallback_response(context, question)
                
        except Exception as e:
            logger.error(f"Error calling AI API: {e}")
            return self._fallback_response(context, question)
    
    def _fallback_response(self, context: str, question: str) -> str:
        """Fallback response when AI API is not available"""
        question_lower = question.lower()
        file_count = context.count("File: ")
        func_count = context.count("def ")
        class_count = context.count("class ")
        import_count = context.count("import ")
        
        if "main.py" in question_lower:
            return "Your repository contains main.py. It appears to be the main entry point of your application."
        elif "function" in question_lower:
            return f"I found approximately {func_count} functions across all Python files."
        elif "class" in question_lower:
            return f"I found approximately {class_count} classes across all Python files."
        elif "import" in question_lower or "dependencies" in question_lower:
            return f"There are approximately {import_count} import statements in the repository."
        elif "summary" in question_lower or "overview" in question_lower or "all files" in question_lower:
            return f"The repository has {file_count} Python files. It contains various modules and components."
        else:
            return f"I can help analyze your repository with {file_count} Python files. Ask about specific files, functions, classes, or structure."

# Global service instance
ai_service = AIService()

embedding_service = EmbeddingService()

async def generate_ai_response(repo: Dict[str, Any], message: str, all_files: bool = False) -> Dict[str, Any]:
    """
    Generate AI response for repository chat.
    If all_files is True, uses the entire repo as context.
    Otherwise, it uses embeddings to find relevant chunks.
    """
    context = f"Repository: {repo['name']}\n"
    relevant_file_paths = set()
    
    # List .py files in the repo
    py_files = [file_info['path'] for file_info in repo['files'] if file_info['path'].endswith('.py')]

    if all_files or not ai_service.api_key:
        # Build context from all repository files for summary or if in fallback mode
        context += f"Total files: {repo['file_count']}\n\n"
        
        for file_info in repo['files']:
            context += f"File: {file_info['path']}\n"
            context += f"Content:\n{file_info['content']}\n\n"
            relevant_file_paths.add(file_info['path'])
    else:
        # Use embeddings to find relevant context for specific questions
        try:
            chunks = await embedding_service.chunk_repository(repo['files'])
            relevant_chunks = await embedding_service.find_relevant_chunks(chunks, message, top_k=5)
            
            if not relevant_chunks:
                # Fallback to all files if no relevant chunks found
                logger.info("No relevant chunks found, falling back to full context.")
                return await generate_ai_response(repo, message, all_files=True)

            context += "Here are the most relevant code snippets based on your question:\n\n"
            
            for chunk in relevant_chunks:
                context += f"File: {chunk['file']} (lines {chunk['start_line']}-{chunk['end_line']})\n"
                context += f"Content:\n{chunk['content']}\n\n"
                relevant_file_paths.add(chunk['file'])
        except Exception as e:
            logger.error(f"Embedding-based search failed: {e}. Falling back to full context.")
            # Fallback to all files on any embedding error
            return await generate_ai_response(repo, message, all_files=True)
    
    response_message = await ai_service.generate_response(context, message)

    if py_files:
        # Add list of files at the end of the message
        response_message += f"\n\nHere are some of the Python files in this repository: {', '.join(py_files)}"

    return {
        "message": response_message,
        "relevant_files": list(relevant_file_paths)
    }

async def generate_documentation(repo: Dict[str, Any]) -> str:
    """Generate documentation for the repository"""

    
    context = f"Repository: {repo['name']}\n"
    for file_info in repo['files']:
        context += f"File: {file_info['path']}\n{file_info['content']}\n\n"
    
    question = "Generate comprehensive documentation for this Python repository including overview, file descriptions, and usage instructions."
    
    return await ai_service.generate_response(context, question)
