# Purpose: This is the entry point of our backend application.
# How it works: It initializes FastAPI, configures CORS, handles startup/shutdown events, and connects all our routers.
# Why it exists: Without this, Uvicorn (our server) wouldn't know what to run.
# Used by: Uvicorn (run via `uvicorn main:app --reload`)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import connect_to_mongo, close_mongo_connection
from routers import health_router, users_router
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Logic: This function runs before the server starts accepting requests (startup)
    and after it stops accepting requests (shutdown).
    We use it to open and close our database connections safely.
    """
    # Startup logic
    await connect_to_mongo()
    yield
    # Shutdown logic
    await close_mongo_connection()

# Initialize the FastAPI application
app = FastAPI(
    title="AgriSense AI API",
    description="The backend API for the AgriSense Smart Agriculture Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# Why it exists: To allow our React frontend (running on localhost:5173) to communicate with this backend.
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000", # CRA default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# Include our Routers
# Why it exists: This tells FastAPI to connect the routes we defined in separate files to our main application.
from routers import auth_router, farm_router, weather_router, dashboard_router, notification_router
app.include_router(health_router.router)
app.include_router(users_router.router)
app.include_router(auth_router.router)
app.include_router(farm_router.router)
app.include_router(weather_router.router)
app.include_router(dashboard_router.router)
app.include_router(notification_router.router)

if __name__ == "__main__":
    import uvicorn
    # This block allows us to run the file directly using `python main.py`
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
