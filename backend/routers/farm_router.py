from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from database import get_database
from schemas.farm_schema import FarmCreate, FarmResponse
from schemas.user_schema import UserResponse
from auth.dependencies import get_current_user
from services.cloudinary_service import upload_image
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/farms", tags=["Farms"])

@router.post("/", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
async def create_farm(farm: FarmCreate, current_user: UserResponse = Depends(get_current_user)):
    """Creates a new farm linked to the current user."""
    db = get_database()
    
    farm_dict = farm.model_dump()
    farm_dict["owner_id"] = ObjectId(current_user.id)
    farm_dict["images"] = []
    farm_dict["createdAt"] = datetime.utcnow()
    farm_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.farms.insert_one(farm_dict)
    
    # We must format ObjectIds to strings for Pydantic
    farm_dict["id"] = str(result.inserted_id)
    farm_dict["owner_id"] = str(farm_dict["owner_id"])
    
    return FarmResponse(**farm_dict)

@router.get("/", response_model=list[FarmResponse])
async def get_my_farms(skip: int = 0, limit: int = 10, district: str = None, current_user: UserResponse = Depends(get_current_user)):
    """
    Fetches all farms for the logged-in user.
    Includes pagination (skip, limit) and optional filtering by district.
    """
    db = get_database()
    
    # Build query: Must belong to current user
    query = {"owner_id": ObjectId(current_user.id)}
    if district:
        query["district"] = district
        
    farms = []
    # Find, skip, limit, and sort by newest first
    cursor = db.farms.find(query).skip(skip).limit(limit).sort("createdAt", -1)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        document["owner_id"] = str(document["owner_id"])
        farms.append(FarmResponse(**document))
        
    return farms

@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(farm_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Fetch details for a specific farm. User must own it."""
    db = get_database()
    
    farm = await db.farms.find_one({"_id": ObjectId(farm_id)})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    if str(farm["owner_id"]) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this farm")
        
    farm["id"] = str(farm["_id"])
    farm["owner_id"] = str(farm["owner_id"])
    return FarmResponse(**farm)

@router.post("/{farm_id}/images", status_code=status.HTTP_200_OK)
async def upload_farm_image(
    farm_id: str, 
    file: UploadFile = File(...), 
    current_user: UserResponse = Depends(get_current_user)
):
    """Uploads an image to Cloudinary and saves the URL to the Farm."""
    db = get_database()
    
    # 1. Validate Farm exists and belongs to user
    farm = await db.farms.find_one({"_id": ObjectId(farm_id)})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    if str(farm["owner_id"]) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this farm")
        
    # 2. Upload to Cloudinary
    try:
        image_url = await upload_image(file)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload image")
        
    # 3. Update MongoDB
    await db.farms.update_one(
        {"_id": ObjectId(farm_id)},
        {"$push": {"images": image_url}, "$set": {"updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Image uploaded successfully", "url": image_url}
