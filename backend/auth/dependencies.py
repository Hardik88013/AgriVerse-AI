# Purpose: FastMail configuration and email sending logic.
# How it works: FastAPI Dependency Injection uses this to extract the user from the JWT.
# Why it exists: Protects routes. If a route has `Depends(get_current_user)`, it guarantees the user is logged in.

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from config import settings
from database import get_database
from schemas.user_schema import UserResponse
from bson import ObjectId

# This tells FastAPI where our login endpoint is, so Swagger UI can use it.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Input: JWT Token from the Authorization header (Bearer <token>).
    Output: User document from MongoDB.
    Logic: Decodes the token, checks if it's expired, and finds the user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    db = get_database()
    # Fetch user from DB using the decoded user_id
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise credentials_exception
        
    if user is None:
        raise credentials_exception
        
    # Format the ObjectId as a string for Pydantic
    user["id"] = str(user["_id"])
    return UserResponse(**user)

def require_role(allowed_roles: list[str]):
    """
    Input: A list of allowed roles (e.g., ["Admin", "Farmer"]).
    Output: A dependency function that checks the user's role.
    Logic: Role-Based Access Control (RBAC).
    """
    def role_checker(current_user: UserResponse = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )
        return current_user
    return role_checker
