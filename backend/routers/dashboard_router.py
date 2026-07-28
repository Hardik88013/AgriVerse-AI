from fastapi import APIRouter, Depends
from database import get_database
from schemas.user_schema import UserResponse
from auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(current_user: UserResponse = Depends(get_current_user)):
    """
    Returns aggregated KPIs for the dashboard.
    Instead of sending all farm data, we compute the totals on the database side.
    """
    db = get_database()
    user_id = ObjectId(current_user.id)
    
    # Run MongoDB Aggregation Pipeline
    pipeline = [
        {"$match": {"owner_id": user_id}},
        {"$group": {
            "_id": None,
            "totalFarms": {"$sum": 1},
            "totalArea": {"$sum": "$area"}
        }}
    ]
    
    result = await db.farms.aggregate(pipeline).to_list(1)
    
    if not result:
        return {"totalFarms": 0, "totalArea": 0, "activeAlerts": 0}
        
    stats = result[0]
    
    # Count unread notifications
    active_alerts = await db.notifications.count_documents({"user_id": user_id, "isRead": False})
    
    return {
        "totalFarms": stats.get("totalFarms", 0),
        "totalArea": stats.get("totalArea", 0),
        "activeAlerts": active_alerts
    }
