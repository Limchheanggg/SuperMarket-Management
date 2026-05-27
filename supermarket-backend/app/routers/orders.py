from fastapi import APIRouter
import random
from datetime import datetime

router = APIRouter()

orders_store = []

@router.get("/")
def get_orders():
    return orders_store

@router.post("/")
def create_order(data: dict):
    order = {
        "id": f"ORD-{random.randint(1000,9999)}",
        "date": datetime.now().strftime("%d %b %Y"),
        "items": data.get("items", []),
        "total": data.get("total", 0),
        "method": data.get("payment_method", "Cash"),
        "status": "Processing",
        "address": data.get("address", {})
    }
    orders_store.append(order)
    return order
