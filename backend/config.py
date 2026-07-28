# Purpose: This file loads our environment variables from the .env file.
# How it works: It uses Pydantic Settings to automatically parse and validate the variables.
# Why it exists: To keep our secrets (like MONGODB_URI) secure and accessible across the app.
# Used by: database.py

from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

# Load variables from .env file into the system environment
load_dotenv()

class Settings(BaseSettings):
    """
    Settings class to hold our environment variables.
    Pydantic will automatically look for these keys in the environment.
    """
    mongodb_uri: str = Field(..., env='MONGODB_URI')
    database_name: str = Field("agrisense_db", env='DATABASE_NAME')

    class Config:
        env_file = ".env"

# Instantiate the settings so they can be imported elsewhere
settings = Settings()
