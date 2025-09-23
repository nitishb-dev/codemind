import os
from typing import List, Dict, Any
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for handling code embeddings and similarity search"""
    
    def __init__(self, model: str = "openai/text-embedding-3-small"):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.model = model

        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY not found. Embedding features will not work.")
            self.client = None
        else:
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
                default_headers={
                    "HTTP-Referer": "http://localhost:10000",
                    "X-Title": "CodeMind Lite"
                }
            )

    async def chunk_repository(self, repo_files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split repository files into logical code chunks for embedding."""
        chunks = []
        
        for file_info in repo_files:
            lines = file_info['content'].split('\n')
            
            current_chunk_lines = []
            chunk_start_line = 0
            
            for i, line in enumerate(lines):
                # A new chunk starts with a top-level (not indented) function or class definition
                is_new_block_start = (line.startswith('def ') or line.startswith('class '))
                
                if is_new_block_start and current_chunk_lines:
                    # Finalize the previous chunk if it's not just whitespace
                    content = '\n'.join(current_chunk_lines).strip()
                    if content:
                        chunks.append({
                            'file': file_info['path'],
                            'content': content,
                            'start_line': chunk_start_line,
                            'end_line': i - 1
                        })
                    
                    # Start the new chunk
                    current_chunk_lines = [line]
                    chunk_start_line = i
                else:
                    current_chunk_lines.append(line)

            # Add the last remaining chunk in the file
            if current_chunk_lines:
                content = '\n'.join(current_chunk_lines).strip()
                if content:
                    chunks.append({
                        'file': file_info['path'],
                        'content': content,
                        'start_line': chunk_start_line,
                        'end_line': len(lines) - 1
                    })
        
        # Filter out very small chunks that are unlikely to be useful
        return [c for c in chunks if len(c['content']) > 20]
    
    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        if not self.client:
            raise ValueError("Embedding service is not configured. OPENROUTER_API_KEY is missing.")
        
        response = await self.client.embeddings.create(
            model=self.model,
            input=texts
        )
        return [item.embedding for item in response.data]

    async def find_relevant_chunks(self, chunks: List[Dict[str, Any]], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Find most relevant code chunks for a query using embeddings"""
        if not self.client or not chunks:
            return []
        
        # Embed query + all chunks
        query_embedding = (await self.embed_texts([query]))[0]
        chunk_embeddings = await self.embed_texts([c["content"] for c in chunks])

        # Compute cosine similarity
        import numpy as np
        def cosine_sim(a, b):
            if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
                return 0.0
            return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        
        for chunk, emb in zip(chunks, chunk_embeddings):
            chunk["relevance_score"] = cosine_sim(query_embedding, emb)
        
        # Sort and return top_k
        chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        return chunks[:top_k]
