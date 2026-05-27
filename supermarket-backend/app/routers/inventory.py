from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.inventory import Inventory, StockMovement
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel

router = APIRouter()

@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
    result = []
    for p in products:
        inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        quantity = inv.Quantity if inv else 0
        result.append({
            "Product_ID": p.Product_ID,
            "Barcode": p.Barcode,
            "Name": p.Name,
            "Category_Name": cat.Category_Name if cat else "General",
            "Unit_Price": p.Unit_Price,
            "Unit": p.Unit,
            "Quantity": quantity,
            "Reorder_Level": p.Reorder_Level,
            "Status": "Out of Stock" if quantity == 0 else "Low Stock" if quantity <= p.Reorder_Level else "In Stock",
            "Product_Image": p.Product_Image,
            "Is_Perishable": p.Is_Perishable,
        })
    return result

@router.get("/{product_id}")
def get_product_stock(product_id: int, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.Product_ID == product_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return inv

@router.post("/restock")
def restock_product(data: dict, db: Session = Depends(get_db)):
    product_id = data.get("product_id")
    quantity = data.get("quantity", 0)
    note = data.get("note", "Manual restock")

    inv = db.query(Inventory).filter(Inventory.Product_ID == product_id).first()
    if inv:
        inv.Quantity += quantity
    else:
        inv = Inventory(Product_ID=product_id, Quantity=quantity)
        db.add(inv)

    movement = StockMovement(Product_ID=product_id, Movement_Type="in", Quantity=quantity, Note=note)
    db.add(movement)
    db.commit()
    return {"message": "Stock updated", "new_quantity": inv.Quantity}

@router.put("/{product_id}")
def update_stock(product_id: int, data: dict, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.Product_ID == product_id).first()
    new_qty = data.get("quantity", 0)
    if inv:
        old_qty = inv.Quantity
        inv.Quantity = new_qty
    else:
        old_qty = 0
        inv = Inventory(Product_ID=product_id, Quantity=new_qty)
        db.add(inv)

    movement = StockMovement(
        Product_ID=product_id,
        Movement_Type="adjustment",
        Quantity=new_qty - old_qty,
        Note=data.get("note", "Stock adjustment")
    )
    db.add(movement)
    db.commit()
    return {"message": "Stock adjusted", "new_quantity": new_qty}

@router.get("/movements/{product_id}")
def get_movements(product_id: int, db: Session = Depends(get_db)):
    return db.query(StockMovement).filter(StockMovement.Product_ID == product_id).order_by(StockMovement.Created_At.desc()).limit(20).all()