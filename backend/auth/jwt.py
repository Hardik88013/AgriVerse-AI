# Purpose: To generate and decode JSON Web Tokens.
# How it works: Uses python-jose to sign the tokens securely using a secret key.
# Why it exists: To implement stateless authentication.

from datetime import datetime, timedelta
from jose import jwt, JWTError
from config import settings
from typing import Optional

# Security Constants
SECRET_KEY = settings.jwt_secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Input: Payload data (usually just the user ID).
    Output: The signed JWT string.
    Logic: Adds an expiration time to the payload and signs it.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """
    Input: Payload data.
    Output: A longer-lived signed JWT string.
    """
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
