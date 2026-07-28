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
    
    # Auth & Security
    jwt_secret: str = Field(..., env='JWT_SECRET')
    
    # Email Settings
    smtp_host: str = Field(..., env='SMTP_HOST')
    smtp_port: int = Field(2525, env='SMTP_PORT')
    smtp_user: str = Field(..., env='SMTP_USER')
    smtp_pass: str = Field(..., env='SMTP_PASS')
    frontend_url: str = Field("http://localhost:5173", env='FRONTEND_URL')

    class Config:
        env_file = ".env"

# Instantiate the settings so they can be imported elsewhere
settings = Settings()
