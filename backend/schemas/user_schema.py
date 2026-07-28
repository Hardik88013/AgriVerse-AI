# Purpose: To define the shape of our User data.
# How it works: Uses Pydantic to validate data incoming from the frontend (CreateUser) and data outgoing to the frontend (UserResponse).
# Why it exists: To ensure our API only accepts clean, valid data (e.g., ensuring an email is an actual email string).
# Used by: routers/users_router.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    """
    Schema for creating a new user (Incoming Data).
    Input: JSON with name, email, and password.
    """
    name: str = Field(..., min_length=2, max_length=50, example="John Doe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=6, example="secret123")

class UserResponse(BaseModel):
    """
    Schema for returning a user (Outgoing Data).
    Output: JSON with id, name, and email. (We never return the password!)
    """
    id: str
    name: str
    email: str

    class Config:
        # This tells Pydantic to ignore MongoDB's complex BSON object IDs when converting
        from_attributes = True
