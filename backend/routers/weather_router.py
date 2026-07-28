from fastapi import APIRouter, HTTPException, Depends
from database import get_database
from schemas.weather_schema import WeatherResponse
from schemas.user_schema import UserResponse
from auth.dependencies import get_current_user
from services.weather_service import get_weather_for_farm
from bson import ObjectId

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/{farm_id}", response_model=WeatherResponse)
async def get_farm_weather(farm_id: str, current_user: UserResponse = Depends(get_current_user)):
    """
    Fetches the current weather and 7-day forecast for a specific farm.
    Data is cached for 30 minutes in MongoDB to prevent API rate limits.
    """
    db = get_database()
    
    # 1. Verify Farm exists and belongs to user
    farm = await db.farms.find_one({"_id": ObjectId(farm_id)})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    if str(farm["owner_id"]) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # 2. Extract coordinates (GeoJSON is [longitude, latitude])
    lon = farm["location"]["coordinates"][0]
    lat = farm["location"]["coordinates"][1]
    
    # 3. Call the highly-optimized weather service
    weather_data = await get_weather_for_farm(farm_id, lat, lon)
    
    return weather_data
