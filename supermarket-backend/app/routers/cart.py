from fastapi import APIRouter

router = APIRouter()
cart_store = []

@router.get("/")
def get_cart():
    total = sum(item.get("Unit_Price", 0) * item.get("qty", 1) for item in cart_store)
    return {"items": cart_store, "total": total}

@router.post("/")
def add_to_cart(item: dict):
    existing = next((i for i in cart_store if i.get("Product_ID") == item.get("Product_ID")), None)
    if existing:
        existing["qty"] = existing.get("qty", 1) + 1
    else:
        item["qty"] = 1
        cart_store.append(item)
    return {"message": "Added to cart", "cart": cart_store}

@router.delete("/{product_id}")
def remove_from_cart(product_id: int):
    global cart_store
    cart_store = [i for i in cart_store if i.get("Product_ID") != product_id]
    return {"message": "Removed", "cart": cart_store}

@router.delete("/")
def clear_cart():
    cart_store.clear()
    return {"message": "Cart cleared"}
