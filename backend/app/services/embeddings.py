import numpy as np
import os
import asyncio
from typing import List
from openai import AsyncOpenAI, OpenAIError
import httpx
 
_async_client = None

def get_openrouter_client():
    """
    Returns a singleton async OpenAI client configured for OpenRouter.
    This lazy initialization prevents the app from crashing on startup if
    the OPENROUTER_API_KEY is not set.
    """
    global _async_client
    if _async_client is None:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise OpenAIError(
                "The OPENROUTER_API_KEY environment variable is not set. "
                "Please provide the key to use AI-powered features."
            )
        
        # Configure the client to use OpenRouter's API
        _async_client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            # Add recommended headers for OpenRouter
            default_headers={
                "HTTP-Referer": "http://localhost:10000", # Can be your app's URL
                "X-Title": "CodeMind Lite"
            },
            http_client=httpx.AsyncClient(
                http2=True, # Recommended for performance
            ),
        )
    return _async_client

async def get_embeddings_async(texts: List[str]) -> List[np.ndarray]:
    """
    Asynchronously gets embeddings for a list of texts using an OpenRouter model,
    handling rate limiting by processing in smaller batches with delays.
    """
    if not texts:
        return []
    
    client = get_openrouter_client()
    
    all_embeddings = []
    # Process in batches to respect rate limits.
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        
        # Use a model available on OpenRouter, e.g., text-embedding-3-small
        resp = await client.embeddings.create(
            model="text-embedding-3-small", 
            input=batch
        )
        all_embeddings.extend([np.array(data.embedding) for data in resp.data])
        
        # If there are more batches to process, wait a bit to avoid hitting RPM limits.
        if i + batch_size < len(texts):
            await asyncio.sleep(1)  # Wait 1 second between batches
    return all_embeddings

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
