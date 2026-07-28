from fastapi import APIRouter, Depends
from database import get_database
from schemas.notification_schema import NotificationResponse
from schemas.user_schema import UserResponse
from auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=list[NotificationResponse])
async def get_notifications(current_user: UserResponse = Depends(get_current_user)):
    """Fetches all notifications for the current user, newest first."""
    db = get_database()
    
    cursor = db.notifications.find({"user_id": ObjectId(current_user.id)}).sort("createdAt", -1).limit(50)
    
    notifications = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc["user_id"] = str(doc["user_id"])
        notifications.append(NotificationResponse(**doc))
        
    return notifications

@router.patch("/{notification_id}/read")
async def mark_as_read(notification_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Marks a single notification as read."""
    db = get_database()
    
    result = await db.notifications.update_one(
        {"_id": ObjectId(notification_id), "user_id": ObjectId(current_user.id)},
        {"$set": {"isRead": True}}
    )
    
    return {"success": result.modified_count > 0}
