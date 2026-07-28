# Purpose: To define the shape of our User data.
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for user registration."""
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=15)
    password: str = Field(..., min_length=8)
    role: str = Field(default="Farmer", pattern="^(Admin|Farmer|Buyer)$")

class UserLogin(BaseModel):
    """Schema for logging in."""
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    """Schema representing the document exactly as it is stored in MongoDB."""
    id: str
    name: str
    email: str
    phone: Optional[str]
    hashed_password: str
    role: str
    isVerified: bool = False
    profilePhoto: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    """Schema for returning user data securely (NO PASSWORDS!)."""
    id: str
    name: str
    email: str
    phone: Optional[str]
    role: str
    isVerified: bool
    profilePhoto: Optional[str]
    createdAt: datetime

    class Config:
        from_attributes = True
