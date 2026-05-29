from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel
from ..models.inventory import Inventory

router = APIRouter()

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
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
            "Current_Stock": inv.Quantity if inv else 0,
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
    inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
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
        "Current_Stock": inv.Quantity if inv else 0,
    }

@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):
    # Strip image if too large (>1MB base64 ~ 1.3M chars)
    if data.get("Product_Image") and len(data["Product_Image"]) > 1_300_000:
        data["Product_Image"] = None

    product = ProductModel(
        Barcode=data.get("Barcode"),
        Name=data.get("Name"),
        Description=data.get("Description"),
        Category_ID=data.get("Category_ID"),
        Brand=data.get("Brand"),
        Unit=data.get("Unit"),
        Unit_Price=data.get("Unit_Price"),
        Unit_Mass_Kg=data.get("Unit_Mass_Kg"),
        Reorder_Level=data.get("Reorder_Level", 10),
        Is_Perishable=data.get("Is_Perishable", 0),
        Product_Image=data.get("Product_Image"),
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    # Auto-create inventory record with 0 stock
    inv = Inventory(Product_ID=product.Product_ID, Quantity=0)
    db.add(inv)
    db.commit()

    return {"Product_ID": product.Product_ID, "Name": product.Name, "message": "Product created"}

@router.put("/{product_id}")
def update_product(product_id: int, data: dict, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Strip image if too large
    if data.get("Product_Image") and len(data["Product_Image"]) > 1_300_000:
        data.pop("Product_Image")  # keep existing image

    updatable = ["Barcode","Name","Description","Category_ID","Brand","Unit",
                 "Unit_Price","Unit_Mass_Kg","Reorder_Level","Is_Perishable","Product_Image"]
    for field in updatable:
        if field in data:
            setattr(product, field, data[field])

    db.commit()
    db.refresh(product)
    return {"Product_ID": product.Product_ID, "Name": product.Name, "message": "Product updated"}

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Delete related inventory records first (avoid FK constraint)
    from ..models.inventory import StockMovement
    db.query(StockMovement).filter(StockMovement.Product_ID == product_id).delete()
    db.query(Inventory).filter(Inventory.Product_ID == product_id).delete()

    db.delete(product)
    db.commit()
    return {"message": f"Product '{product.Name}' deleted successfully"}