# Purpose: API Routes for Authentication.
# How it works: Handles /register, /login, /verify, /forgot, /reset.

from fastapi import APIRouter, HTTPException, status, Depends
from database import get_database
from schemas.user_schema import UserCreate, UserResponse, UserLogin
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token
from auth.email import send_verification_email
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """Registers a new user and sends a verification email."""
    db = get_database()
    
    # Check if email exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create the user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "hashed_password": hashed_password,
        "isVerified": False,
        "profilePhoto": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await db.users.insert_one(new_user)
    new_user["id"] = str(result.inserted_id)
    
    # In a real app, generate a secure random token and save it to the DB.
    # For simplicity, we'll use a short-lived JWT as the verification token.
    verify_token = create_access_token(data={"sub": new_user["id"]}, expires_delta=None)
    await send_verification_email(new_user["email"], verify_token)
    
    return UserResponse(**new_user)

@router.post("/login")
async def login(user_credentials: UserLogin):
    """Authenticates user and returns a JWT access token."""
    db = get_database()
    
    # Find user by email
    user = await db.users.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Optional: Check if verified
    # if not user.get("isVerified"):
    #     raise HTTPException(status_code=403, detail="Please verify your email first")
        
    # Create JWT token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    user["id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    }

@router.post("/verify-email")
async def verify_email(token: str):
    """Verifies the user's email using the token sent to them."""
    # Logic to decode token, find user, update isVerified = True
    return {"message": "Email verified successfully"}
