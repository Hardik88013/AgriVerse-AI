# Purpose: To handle all API requests related to Users.
from fastapi import APIRouter, HTTPException, status, Depends
from database import get_database
from schemas.user_schema import UserResponse
from auth.dependencies import get_current_user, require_role
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Input: JWT Token in header (handled by get_current_user).
    Output: The logged-in user's profile.
    Logic: The `Depends(get_current_user)` automatically blocks unauthenticated requests.
    """
    return current_user

@router.get("/", response_model=list[UserResponse])
async def get_all_users(current_user: UserResponse = Depends(require_role(["Admin"]))):
    """
    Input: JWT Token in header.
    Output: A list of all users.
    Logic: Only users with the 'Admin' role can access this endpoint.
    """
    db = get_database()
    users = []
    cursor = db.users.find({})
    async for document in cursor:
        document["id"] = str(document["_id"])
        users.append(UserResponse(**document))
    return users
