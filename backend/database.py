# Purpose: To establish a connection to our MongoDB database.
# How it works: Uses the 'motor' library to create an asynchronous connection to MongoDB.
# Why it exists: So our application can persist data (like users) permanently.
# Used by: main.py, and all routers that need database access.

from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging

# Initialize a logger to print messages to the console
logger = logging.getLogger(__name__)

class Database:
    """
    A class to manage the MongoDB connection.
    We use a class so we can maintain a single connection instance (singleton pattern).
    """
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    """
    Logic: Connects to MongoDB using the URI from our settings.
    Time Complexity: O(1) - Just establishes a connection pool.
    """
    logger.info("Connecting to MongoDB...")
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_uri)
        # Test the connection by sending a ping command
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB!")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """
    Logic: Closes the MongoDB connection gracefully when the server shuts down.
    """
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """
    Logic: Returns the database instance to be used by our routes.
    """
    return db.client[settings.database_name]
