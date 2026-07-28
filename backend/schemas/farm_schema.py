from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GeoLocation(BaseModel):
    """GeoJSON format for MongoDB."""
    type: str = "Point"
    coordinates: List[float] # [longitude, latitude]

class FarmCreate(BaseModel):
    """Schema for registering a new farm."""
    name: str = Field(..., min_length=2, max_length=100)
    village: str
    district: str
    state: str
    country: str = "India"
    pinCode: str
    location: GeoLocation
    area: float = Field(..., gt=0)
    unit: str = Field(default="Acres", pattern="^(Acres|Hectares|SqMeters)$")
    irrigationType: str
    waterSource: str
    farmType: str = Field(default="Conventional", pattern="^(Organic|Conventional|Mixed)$")
    
    # Soil Info (Optional at registration)
    soilType: Optional[str] = None
    pH: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    organicCarbon: Optional[float] = None
    
    # Crop Info
    previousCrop: Optional[str] = None
    currentCrop: Optional[str] = None
    plantingDate: Optional[datetime] = None
    expectedHarvestDate: Optional[datetime] = None

class FarmResponse(BaseModel):
    """Schema for returning farm data."""
    id: str
    owner_id: str
    name: str
    village: str
    district: str
    state: str
    location: GeoLocation
    area: float
    unit: str
    farmType: str
    images: List[str] = []
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
