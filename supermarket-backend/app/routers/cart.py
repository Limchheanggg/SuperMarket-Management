from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.cart import CartResponse, CartItemBase

router = APIRouter()

# For now, using in-memory cart (we can improve later with database)
fake_cart = []

@router.get("/")
def get_cart():
    return {"items": fake_cart, "total": sum(item.get("price",0) * item.get("quantity",1) for item in fake_cart)}

@router.post("/add")
def add_to_cart(item: CartItemBase):
    fake_cart.append(item.dict())
    return {"message": "Added to cart", "cart": fake_cart}
