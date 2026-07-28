from pydantic import BaseModel, Field
from datetime import datetime

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str = Field(default="info", pattern="^(info|warning|success|error)$")
    isRead: bool = False
    createdAt: datetime

    class Config:
        from_attributes = True
