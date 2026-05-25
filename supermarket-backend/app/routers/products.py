from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..models.category import Category as CategoryModel
from ..schemas.product import Product, ProductBase

router = APIRouter()

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductModel).all()
    return products

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(CategoryModel).all()
    return categories

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.Product_ID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/")
def create_product(product: ProductBase, db: Session = Depends(get_db)):
    new_product = ProductModel(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
