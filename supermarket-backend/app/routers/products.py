from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel
from ..models.inventory import Inventory

router = APIRouter()

def build_product(p, db):
    cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
    inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
    quantity = inv.Quantity if inv else 0
    return {
        "Product_ID": p.Product_ID,
        "Barcode": p.Barcode,
        "Name": p.Name,
        "Description": p.Description,
        "Category_ID": p.Category_ID,
        "Category_Name": cat.Category_Name if cat else "General",
        "Brand": p.Brand,
        "Unit": p.Unit,
        "Unit_Price": p.Unit_Price,
        "Unit_Mass_Kg": p.Unit_Mass_Kg,
        "Reorder_Level": p.Reorder_Level,
        "Is_Perishable": p.Is_Perishable,
        "Product_Image": p.Product_Image,
        "Current_Stock": quantity,
        "Status": "Out of Stock" if quantity == 0 else "Low Stock" if quantity <= p.Reorder_Level else "In Stock",
    }

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
    return [build_product(p, db) for p in products]

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(CategoryModel).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return build_product(p, db)

@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):
    if db.query(ProductModel).filter(ProductModel.Barcode == data.get("Barcode")).first():
        raise HTTPException(status_code=400, detail="Barcode already exists")
    product = ProductModel(**{k: v for k, v in data.items() if k != "emoji"})
    db.add(product)
    db.commit()
    db.refresh(product)
    inv = Inventory(Product_ID=product.Product_ID, Quantity=0)
    db.add(inv)
    db.commit()
    return build_product(product, db)

@router.put("/{product_id}")
def update_product(product_id: int, data: dict, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in data.items():
        if hasattr(p, key) and key != "emoji":
            setattr(p, key, value)
    db.commit()
    return build_product(p, db)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"message": "Product deleted"}