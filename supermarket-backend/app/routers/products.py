from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel

router = APIRouter()

def serialize(p, cat, db=None):
    inv = db.execute(text("SELECT Quantity FROM Inventory WHERE Product_ID=:pid"), {"pid": p.Product_ID}).fetchone()
    stock = inv.Quantity if inv else 0
    return {
        "Product_ID": p.Product_ID,
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
        "Current_Stock": stock,
        "Is_Active": p.Is_Active if p.Is_Active is not None else 1,
    }

@router.get("/")
def get_all_products(include_inactive: bool = False, db: Session = Depends(get_db)):
    q = db.query(ProductModel)
    if not include_inactive:
        q = q.filter((ProductModel.Is_Active == 1) | (ProductModel.Is_Active.is_(None)))
    products = q.all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        result.append(serialize(p, cat, db))
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
    return serialize(p, cat, db)

@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):
    product = ProductModel(
        Name=data.get("Name"),
        Description=data.get("Description"), Category_ID=data.get("Category_ID"),
        Brand=data.get("Brand"), Unit=data.get("Unit"),
        Unit_Price=data.get("Unit_Price"), Unit_Mass_Kg=data.get("Unit_Mass_Kg"),
        Reorder_Level=data.get("Reorder_Level", 10),
        Is_Perishable=data.get("Is_Perishable", 0),
        Product_Image=data.get("Product_Image"),
        Is_Active=1,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}")
def update_product(product_id: int, data: dict, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for field in ["Name","Description","Category_ID","Brand","Unit","Unit_Price","Unit_Mass_Kg","Reorder_Level","Is_Perishable","Product_Image","Is_Active"]:
        if field in data:
            setattr(p, field, data[field])
    db.commit()
    db.refresh(p)
    cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
    return serialize(p, cat, db)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Soft delete: hides product from shop but preserves sales history."""
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.Is_Active = 0
    db.commit()
    return {"message": f"Product {product_id} deactivated (hidden from shop, sales history preserved)"}

@router.put("/{product_id}/restore")
def restore_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.Is_Active = 1
    db.commit()
    return {"message": f"Product {product_id} restored"}

@router.get("/recent/list")
def get_recent_products(limit: int = 6, db: Session = Depends(get_db)):
    products = db.query(ProductModel).filter(
        (ProductModel.Is_Active == 1) | (ProductModel.Is_Active.is_(None))
    ).order_by(ProductModel.Product_ID.desc()).limit(limit).all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        result.append(serialize(p, cat, db))
    return result

@router.get("/bestsellers/list")
def get_bestsellers(limit: int = 10, db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT p.Product_ID, SUM(si.Quantity) as total_sold
        FROM SaleItem si JOIN Product p ON p.Product_ID = si.Product_ID
        WHERE p.Is_Active = 1 OR p.Is_Active IS NULL
        GROUP BY p.Product_ID ORDER BY total_sold DESC LIMIT :limit
    """), {"limit": limit}).fetchall()
    result = []
    for row in rows:
        p = db.query(ProductModel).filter(ProductModel.Product_ID == row.Product_ID).first()
        if p:
            cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
            result.append(serialize(p, cat, db))
    if len(result) < limit:
        existing_ids = {r['Product_ID'] for r in result}
        extra = db.query(ProductModel).filter(
            (ProductModel.Is_Active == 1) | (ProductModel.Is_Active.is_(None)),
            ~ProductModel.Product_ID.in_(existing_ids)
        ).order_by(ProductModel.Product_ID.desc()).limit(limit - len(result)).all()
        for p in extra:
            cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
            result.append(serialize(p, cat, db))
    return result
