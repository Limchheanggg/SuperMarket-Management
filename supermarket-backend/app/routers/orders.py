from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.user import User
import random

router = APIRouter()

@router.get("/")
def get_orders(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    rows = db.execute(text("""
        SELECT id, order_ref, total, method, status, address, created_at
        FROM orders
        WHERE user_id = :uid
        ORDER BY created_at DESC
    """), {"uid": current_user.id}).fetchall()

    result = []
    for r in rows:
        order = dict(r._mapping)
        order["created_at"] = str(order["created_at"])
        items = db.execute(text("""
            SELECT name, qty, unit_price, subtotal
            FROM order_items WHERE order_id = :oid
        """), {"oid": order["id"]}).fetchall()
        order["items"] = [dict(i._mapping) for i in items]
        result.append(order)
    return result

@router.post("/")
def create_order(
    data:         dict,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    order_ref = f"ORD-{random.randint(1000,9999)}"
    address   = data.get("address", {})
    import json
    address_str = json.dumps(address) if isinstance(address, dict) else str(address)

    result = db.execute(text("""
        INSERT INTO orders (order_ref, user_id, total, method, status, address)
        VALUES (:ref, :uid, :total, :method, 'Processing', :address)
    """), {
        "ref":     order_ref,
        "uid":     current_user.id,
        "total":   data.get("total", 0),
        "method":  data.get("payment_method", "Cash"),
        "address": address_str,
    })
    db.commit()
    order_id = result.lastrowid

    for item in data.get("items", []):
        unit_price = float(item.get("Unit_Price", 0))
        qty        = int(item.get("qty", 1))
        db.execute(text("""
            INSERT INTO order_items (order_id, product_id, name, qty, unit_price, subtotal)
            VALUES (:oid, :pid, :name, :qty, :price, :sub)
        """), {
            "oid":   order_id,
            "pid":   item.get("Product_ID"),
            "name":  item.get("Name", ""),
            "qty":   qty,
            "price": unit_price,
            "sub":   unit_price * qty,
        })
    db.commit()

    return {
        "id":       order_id,
        "order_ref": order_ref,
        "total":    data.get("total", 0),
        "method":   data.get("payment_method", "Cash"),
        "status":   "Processing",
    }

@router.get("/{order_id}")
def get_order(
    order_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    order = db.execute(text("""
        SELECT id, order_ref, total, method, status, address, created_at
        FROM orders
        WHERE id = :oid AND user_id = :uid
    """), {"oid": order_id, "uid": current_user.id}).fetchone()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = db.execute(text("""
        SELECT name, qty, unit_price, subtotal
        FROM order_items WHERE order_id = :oid
    """), {"oid": order_id}).fetchall()

    result = dict(order._mapping)
    result["created_at"] = str(result["created_at"])
    result["items"] = [dict(i._mapping) for i in items]
    return result
