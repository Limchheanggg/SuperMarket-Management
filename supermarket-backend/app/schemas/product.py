from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    Barcode: str
    Name: str
    Description: Optional[str] = None
    Category_ID: int
    Brand: Optional[str] = None
    Unit: str
    Unit_Price: float
    Unit_Mass_Kg: Optional[float] = None
    Reorder_Level: int = 10
    Is_Perishable: int = 0
    Product_Image: Optional[str] = None
    emoji: Optional[str] = None   # for frontend

class Product(ProductBase):
    Product_ID: int

    class Config:
        from_attributes = True
