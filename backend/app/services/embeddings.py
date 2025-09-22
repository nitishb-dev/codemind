from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for handling code embeddings and similarity search"""
    
    def __init__(self):
        # TODO: Initialize embedding model (sentence-transformers or OpenAI)
        pass
    
    async def chunk_repository(self, repo_files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split repository files into chunks for embedding"""
        chunks = []
        
        for file_info in repo_files:
            content = file_info['content']
            lines = content.split('\n')
            
            # Simple chunking by functions/classes
            current_chunk = []
            chunk_start_line = 0
            
            for i, line in enumerate(lines):
                current_chunk.append(line)
                
                # End chunk at function/class definitions or file end
                if (line.strip().startswith('def ') or 
                    line.strip().startswith('class ') or 
                    i == len(lines) - 1):
                    
                    if len(current_chunk) > 5:  # Only keep meaningful chunks
                        chunks.append({
                            'file': file_info['path'],
                            'content': '\n'.join(current_chunk),
                            'start_line': chunk_start_line,
                            'end_line': i
                        })
                    
                    current_chunk = []
                    chunk_start_line = i + 1
        
        return chunks
    
    async def find_relevant_chunks(self, chunks: List[Dict[str, Any]], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Find most relevant code chunks for a query"""
        # TODO: Implement actual embedding-based similarity search
        # For now, return simple keyword matching
        
        relevant_chunks = []
        query_lower = query.lower()
        
        for chunk in chunks:
            content_lower = chunk['content'].lower()
            score = 0
            
            # Simple keyword matching
            for word in query_lower.split():
                if word in content_lower:
                    score += content_lower.count(word)
            
            if score > 0:
                chunk['relevance_score'] = score
                relevant_chunks.append(chunk)
        
        # Sort by relevance and return top_k
        relevant_chunks.sort(key=lambda x: x['relevance_score'], reverse=True)
        return relevant_chunks[:top_k]