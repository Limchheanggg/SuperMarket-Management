from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel
from .stock import get_stock

router = APIRouter()

def serialize(p, cat, db=None):
    stock = get_stock(p.Product_ID, db)
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
        "Current_Stock": stock,
    }

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
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
    existing = db.query(ProductModel).filter(ProductModel.Barcode == data.get("Barcode")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Barcode already exists")
    product = ProductModel(
        Barcode=data.get("Barcode"), Name=data.get("Name"),
        Description=data.get("Description"), Category_ID=data.get("Category_ID"),
        Brand=data.get("Brand"), Unit=data.get("Unit"),
        Unit_Price=data.get("Unit_Price"), Unit_Mass_Kg=data.get("Unit_Mass_Kg"),
        Reorder_Level=data.get("Reorder_Level", 10),
        Is_Perishable=data.get("Is_Perishable", 0),
        Product_Image=data.get("Product_Image"),
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
    for field in ["Barcode","Name","Description","Category_ID","Brand","Unit","Unit_Price","Unit_Mass_Kg","Reorder_Level","Is_Perishable","Product_Image"]:
        if field in data:
            setattr(p, field, data[field])
    db.commit()
    db.refresh(p)
    cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
    return serialize(p, cat, db)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    try:
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        for tbl in ["Inventory", "StockMovement", "SaleItem"]:
            try: db.execute(text(f"DELETE FROM {tbl} WHERE Product_ID = {product_id}"))
            except: pass
        db.delete(p)
        db.commit()
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        return {"message": f"Product {product_id} deleted"}
    except Exception as e:
        db.rollback()
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent/list")
def get_recent_products(limit: int = 6, db: Session = Depends(get_db)):
    products = db.query(ProductModel).order_by(
        ProductModel.Product_ID.desc()
    ).limit(limit).all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        result.append(serialize(p, cat, db))
    return result


@router.get("/bestsellers/list")
def get_bestsellers(limit: int = 10, db: Session = Depends(get_db)):
    from sqlalchemy import text
    rows = db.execute(text("""
        SELECT p.Product_ID, SUM(si.Quantity) as total_sold
        FROM SaleItem si
        JOIN Product p ON p.Product_ID = si.Product_ID
        GROUP BY p.Product_ID
        ORDER BY total_sold DESC
        LIMIT :limit
    """), {"limit": limit}).fetchall()

    result = []
    for row in rows:
        p = db.query(ProductModel).filter(ProductModel.Product_ID == row.Product_ID).first()
        if p:
            cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
            result.append(serialize(p, cat, db))

    # If not enough sales data, fill with newest products
    if len(result) < limit:
        existing_ids = {r['Product_ID'] for r in result}
        extra = db.query(ProductModel).filter(
            ~ProductModel.Product_ID.in_(existing_ids)
        ).order_by(ProductModel.Product_ID.desc()).limit(limit - len(result)).all()
        for p in extra:
            cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
            result.append(serialize(p, cat, db))

    return result


@router.get("/recent/list")
def get_recent_products(limit: int = 6, db: Session = Depends(get_db)):
    products = db.query(ProductModel).order_by(
        ProductModel.Product_ID.desc()
    ).limit(limit).all()
    result = []
    for p in products:
        cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
        result.append(serialize(p, cat, db))
    return result


@router.get("/bestsellers/list")
def get_bestsellers(limit: int = 10, db: Session = Depends(get_db)):
    from sqlalchemy import text as sqltext
    rows = db.execute(sqltext("""
        SELECT p.Product_ID, SUM(si.Quantity) as total_sold
        FROM SaleItem si JOIN Product p ON p.Product_ID = si.Product_ID
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
            ~ProductModel.Product_ID.in_(existing_ids)
        ).order_by(ProductModel.Product_ID.desc()).limit(limit - len(result)).all()
        for p in extra:
            cat = db.query(CategoryModel).filter(CategoryModel.Category_ID == p.Category_ID).first()
            result.append(serialize(p, cat, db))
    return result
