from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint for Render deployment."""
    return {"status": "ok"}
