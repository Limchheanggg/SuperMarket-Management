from fastapi import APIRouter, UploadFile, File
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dtdfjnzby",
    api_key="932228833245684",
    api_secret="ZMjyvuiDVr9YJf_o-gQ1lOReJHs"
)

router = APIRouter()

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    result = cloudinary.uploader.upload(contents, folder="amsmart")
    return {"url": result["secure_url"]}
