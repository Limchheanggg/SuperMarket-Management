from fastapi import APIRouter

router = APIRouter()
orders_store = []

@router.get("/")
def get_orders():
    return orders_store

@router.post("/")
def create_order(data: dict):
    import random
    order = {
        "id": f"ORD-{random.randint(1000,9999)}",
        "date": "2025-05-26",
        "items": data.get("items", []),
        "total": data.get("total", 0),
        "method": data.get("payment_method", "Card"),
        "status": "Processing"
    }
    orders_store.append(order)
    return order
