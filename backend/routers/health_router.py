# Purpose: To define simple endpoints to check if our API is running.
# How it works: Uses FastAPI's APIRouter to group endpoints.
# Why it exists: So deployment platforms (like Render) can easily check if our server crashed.
# Used by: main.py

from fastapi import APIRouter

# Initialize the router
router = APIRouter()

@router.get("/")
async def root():
    """
    Input: None
    Output: A simple welcome message.
    Logic: Just returns a dictionary which FastAPI converts to JSON.
    """
    return {"message": "Welcome to AgriSense AI API"}

@router.get("/health")
async def health_check():
    """
    Input: None
    Output: Status string.
    Logic: Returns 200 OK with status "healthy".
    """
    return {"status": "healthy"}

@router.get("/version")
async def get_version():
    """
    Input: None
    Output: Version string.
    """
    return {"version": "1.0.0"}
