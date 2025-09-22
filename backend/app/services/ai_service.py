import os
import requests
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        self.model = "x-ai/grok-4-fast:free"  # Free model from OpenRouter
        
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY not found. AI features will use fallback responses.")
    
    async def generate_response(self, context: str, question: str) -> str:
        """Generate AI response using a model from OpenRouter"""
        
        if not self.api_key:
            return self._fallback_response(context, question)
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:10000",  # Required by OpenRouter
                "X-Title": "CodeMind Lite"
            }
            
            prompt = f"""You are an AI assistant helping users understand their Python code repository.

Repository Context:
{context[:3000]}  # Limit context to avoid token limits

User Question: {question}

Please provide a helpful, accurate response about the code. If you can't find specific information in the context, say so clearly. Keep responses concise but informative."""

            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
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
        
        # Count files in context
        file_count = context.count("File: ")
        
        if "main.py" in question_lower:
            if "main.py" in context:
                return "I found main.py in your repository. It appears to be the main entry point of your application. The file contains the core logic and initialization code."
            else:
                return "I don't see a main.py file in your repository."
        
        elif "function" in question_lower:
            func_count = context.count("def ")
            return f"I found approximately {func_count} functions across all Python files in your repository."
        
        elif "structure" in question_lower or "files" in question_lower:
            return f"Your repository contains {file_count} Python files. The structure includes various modules and components organized in a typical Python project layout."
        
        elif "class" in question_lower:
            class_count = context.count("class ")
            return f"I found approximately {class_count} classes in your repository."
        
        elif "import" in question_lower or "dependencies" in question_lower:
            import_count = context.count("import ")
            return f"Your code has approximately {import_count} import statements, indicating various dependencies and modules being used."
        
        else:
            return f"I can help you understand your repository with {file_count} Python files. Try asking about specific files, functions, classes, or the overall structure. Note: AI features are limited without API configuration."

# Global service instance
ai_service = AIService()

async def generate_ai_response(repo: Dict[str, Any], message: str) -> str:
    """Generate AI response for repository chat"""
    
    # Build context from repository files
    context = f"Repository: {repo['name']}\n"
    context += f"Total files: {repo['file_count']}\n\n"
    
    for file_info in repo['files'][:5]:  # Limit to first 5 files to avoid token limits
        context += f"File: {file_info['path']}\n"
        context += f"Content preview:\n{file_info['content'][:1000]}...\n\n"
    
    return await ai_service.generate_response(context, message)

async def generate_documentation(repo: Dict[str, Any]) -> str:
    """Generate documentation for the repository"""
    
    context = f"Repository: {repo['name']}\n"
    for file_info in repo['files']:
        context += f"File: {file_info['path']}\n{file_info['content'][:500]}...\n\n"
    
    question = "Generate comprehensive documentation for this Python repository including overview, file descriptions, and usage instructions."
    
    return await ai_service.generate_response(context, question)