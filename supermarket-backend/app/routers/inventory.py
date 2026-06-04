from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.product import Product

router = APIRouter()

# Shared in-memory stock store
stock_store = {}

def get_stock(product_id: int) -> int:
    return stock_store.get(product_id, 99)

@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    try:
        rows = db.execute(text("""
            SELECT
                p.Product_ID,
                p.Barcode,
                p.Name,
                p.Brand,
                p.Unit,
                p.Unit_Price,
                p.Reorder_Level,
                p.Is_Perishable,
                p.Product_Image,
                p.Category_ID,
                COALESCE(c.Category_Name, 'General') as Category_Name
            FROM Product p
            LEFT JOIN Category c ON c.Category_ID = p.Category_ID
            ORDER BY p.Name
        """)).fetchall()

        result = []
        for p in rows:
            d = dict(p._mapping)
            stock = get_stock(d['Product_ID'])
            reorder = d.get('Reorder_Level') or 10
            if stock <= 0:
                status = "Out of Stock"
            elif stock <= reorder:
                status = "Low Stock"
            else:
                status = "In Stock"
            d['Quantity'] = stock
            d['Status']   = status
            result.append(d)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restock")
def restock(data: dict):
    pid = data.get("product_id")
    qty = int(data.get("quantity", 0))
    stock_store[pid] = get_stock(pid) + qty
    return {"message": f"Restocked {qty} units", "new_stock": stock_store[pid]}

@router.put("/{product_id}")
def adjust_stock(product_id: int, data: dict, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    stock_store[product_id] = int(data.get("quantity", 0))
    return {"message": "Stock adjusted", "new_stock": stock_store[product_id]}

@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [
        {"Product_ID": p.Product_ID, "Name": p.Name,
         "Reorder_Level": p.Reorder_Level, "Quantity": get_stock(p.Product_ID)}
        for p in products if get_stock(p.Product_ID) <= (p.Reorder_Level or 10)
    ]
