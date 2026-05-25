from pydantic import BaseModel
from typing import List, Optional

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItem(CartItemBase):
    id: int
    product_name: Optional[str] = None
    price: Optional[float] = None
    emoji: Optional[str] = None

class CartResponse(BaseModel):
    items: List[CartItem]
    total: float
