from pydantic import BaseModel

class Category(BaseModel):
    Category_ID: int
    Category_Name: str

    class Config:
        from_attributes = True
