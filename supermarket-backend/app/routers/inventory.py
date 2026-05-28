from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.product import Product

router = APIRouter()

# In-memory stock store (replace with DB later)
stock_store = {}

def get_stock(product_id):
    return stock_store.get(product_id, 99)

@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    from ..models.category import Category
    products = db.query(Product).all()
    result = []
    for p in products:
        cat = db.query(Category).filter(Category.Category_ID == p.Category_ID).first()
        stock = get_stock(p.Product_ID)
        status = "In Stock" if stock > p.Reorder_Level else ("Low Stock" if stock > 0 else "Out of Stock")
        result.append({
            "Product_ID": p.Product_ID,
            "Barcode": p.Barcode,
            "Name": p.Name,
            "Category_Name": cat.Category_Name if cat else "General",
            "Category_ID": p.Category_ID,
            "Brand": p.Brand,
            "Unit": p.Unit,
            "Unit_Price": p.Unit_Price,
            "Reorder_Level": p.Reorder_Level,
            "Quantity": stock,
            "Status": status,
            "Product_Image": p.Product_Image,
        })
    return result

@router.post("/restock")
def restock(data: dict, db: Session = Depends(get_db)):
    pid = data.get("product_id")
    qty = data.get("quantity", 0)
    current = get_stock(pid)
    stock_store[pid] = current + qty
    return {"message": f"Restocked {qty} units", "new_stock": stock_store[pid]}

@router.put("/{product_id}")
def adjust_stock(product_id: int, data: dict, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    stock_store[product_id] = data.get("quantity", 0)
    return {"message": "Stock adjusted", "new_stock": stock_store[product_id]}

@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [{"Product_ID": p.Product_ID, "Name": p.Name, "Reorder_Level": p.Reorder_Level, "Quantity": get_stock(p.Product_ID)} for p in products if get_stock(p.Product_ID) <= p.Reorder_Level]
