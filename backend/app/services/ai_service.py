from app.services.embeddings import get_embeddings_async, cosine_similarity, get_openrouter_client
import numpy as np
from app.services.utils import chunk_text
 

async def generate_repo_chunks(files):
    """Asynchronously split repo files into chunks and generate embeddings in a batch."""
    text_chunks = []
    for f in files:
        for txt in chunk_text(f.content, chunk_size=200):
            text_chunks.append(txt)

    if not text_chunks:
        return []

    # Embed the document chunks
    embeddings = await get_embeddings_async(text_chunks)
    
    return [
        {"content": content, "embedding": embedding}
        for content, embedding in zip(text_chunks, embeddings)
    ]

async def ask_ai(question, repo_chunks):
    """Find relevant chunks and query the AI model via OpenRouter."""
    # Asynchronously get the embedding for the user's question
    q_embeddings = await get_embeddings_async([question])
    if not q_embeddings:
        return "I could not process the question."
    q_emb = q_embeddings[0]

    sims = [cosine_similarity(q_emb, chunk["embedding"]) for chunk in repo_chunks]
    
    # Get top 3 chunks and reverse to have the most relevant one first in the context
    top_indices = np.argsort(sims)[-3:]
    top_chunks_content = [repo_chunks[i]["content"] for i in top_indices]
    context = "\n\n".join(reversed(top_chunks_content))
    
    client = get_openrouter_client()
    
    # Use the OpenAI-compatible chat completions endpoint via OpenRouter
    resp = await client.chat.completions.create(
        model="google/gemini-flash-1.5", # The model name on OpenRouter
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant analyzing Python code. Use the provided context to answer the user's question."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{question}"}
        ]
    )
    return resp.choices[0].message.content
