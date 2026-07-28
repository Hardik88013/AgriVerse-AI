import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True
)

async def upload_image(file: UploadFile, folder: str = "agrisense/farms") -> str:
    """
    Input: A file from the user's computer.
    Output: The secure Cloudinary URL of the uploaded image.
    Logic: Reads the file, uploads it to Cloudinary in a specific folder, and returns the URL.
    """
    try:
        # Read the file contents
        contents = await file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image"
        )
        
        # Cloudinary returns a lot of metadata. We just want the URL.
        return result.get("secure_url")
        
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {str(e)}")
        raise e
