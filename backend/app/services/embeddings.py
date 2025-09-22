from typing import List, Dict, Any
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for handling code embeddings and similarity search"""
    
    def __init__(self, model: str = "text-embedding-3-small"):
        self.client = OpenAI()  # make sure OPENAI_API_KEY is in your env
        self.model = model

    async def chunk_repository(self, repo_files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split repository files into chunks for embedding"""
        chunks = []
        
        for file_info in repo_files:
            content = file_info['content']
            lines = content.split('\n')
            
            current_chunk = []
            chunk_start_line = 0
            
            for i, line in enumerate(lines):
                current_chunk.append(line)
                
                if (line.strip().startswith('def ') or 
                    line.strip().startswith('class ') or 
                    i == len(lines) - 1):
                    
                    if len(current_chunk) > 5:
                        chunks.append({
                            'file': file_info['path'],
                            'content': '\n'.join(current_chunk),
                            'start_line': chunk_start_line,
                            'end_line': i
                        })
                    
                    current_chunk = []
                    chunk_start_line = i + 1
        
        return chunks
    
    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts
        )
        return [item.embedding for item in response.data]

    async def find_relevant_chunks(self, chunks: List[Dict[str, Any]], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Find most relevant code chunks for a query using embeddings"""
        
        # Embed query + all chunks
        query_embedding = (await self.embed_texts([query]))[0]
        chunk_embeddings = await self.embed_texts([c["content"] for c in chunks])

        # Compute cosine similarity
        import numpy as np
        def cosine_sim(a, b):
            return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        
        for chunk, emb in zip(chunks, chunk_embeddings):
            chunk["relevance_score"] = cosine_sim(query_embedding, emb)
        
        # Sort and return top_k
        chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        return chunks[:top_k]
