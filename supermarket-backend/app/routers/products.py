from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel

router = APIRouter()

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        result.append({
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
            "Current_Stock": 99,
        })
    return result

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(CategoryModel).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
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
        "Reorder_Level": p.Reorder_Level,
        "Is_Perishable": p.Is_Perishable,
        "Product_Image": p.Product_Image,
        "Current_Stock": 99,
    }

@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):
    product = ProductModel(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
