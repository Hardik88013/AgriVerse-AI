# Purpose: To handle all API requests related to Users.
# How it works: Defines GET and POST routes for the Users collection.
# Why it exists: To separate user-related logic from other features (like ML predictions).
# Used by: main.py

from fastapi import APIRouter, HTTPException, status
from database import get_database
from schemas.user_schema import UserCreate, UserResponse
from bson import ObjectId

# Initialize the router with a prefix
router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """
    Input: UserCreate schema (name, email, password)
    Output: UserResponse schema (id, name, email)
    Logic: Inserts a new document into the 'users' collection in MongoDB.
    Time Complexity: O(1) for insertion.
    Future improvements: Hash the password using bcrypt before saving it!
    """
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user dictionary
    user_dict = user.model_dump()
    
    # In a real app, hash the password here! For now, we save it raw (bad practice, but okay for foundation)
    
    # Insert into database
    result = await db.users.insert_one(user_dict)
    
    # Return the response matching our UserResponse schema
    return UserResponse(
        id=str(result.inserted_id),
        name=user.name,
        email=user.email
    )

@router.get("/", response_model=list[UserResponse])
async def get_all_users():
    """
    Input: None
    Output: A list of UserResponse objects.
    Logic: Retrieves all users from the MongoDB collection.
    Time Complexity: O(N) where N is number of users.
    Future improvements: Add pagination (limit and offset) so we don't return 1,000,000 users at once!
    """
    db = get_database()
    users = []
    
    # Iterate through the async cursor
    cursor = db.users.find({})
    async for document in cursor:
        users.append(UserResponse(
            id=str(document["_id"]),
            name=document.get("name", ""),
            email=document.get("email", "")
        ))
        
    return users
