from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..core.dependencies import require_staff
from ..models.sales import Sale, SaleItem, Membership
from ..models.customer import Customer as CustomerModel
from ..models.user import User as UserModel
from ..models.product import Product as ProductModel
from ..models.inventory import Inventory, StockMovement
from datetime import datetime, date

router = APIRouter()

@router.get("/reports/summary")
def get_summary(db: Session = Depends(get_db), _=Depends(require_staff)):
    sales = db.query(Sale).all()
    total = sum(s.Total_Amount for s in sales)
    by_method = {}
    for s in sales:
        by_method[s.Payment_Method] = by_method.get(s.Payment_Method, 0) + s.Total_Amount
    return {
        "total_revenue": round(total, 2),
        "monthly_revenue": round(total, 2),
        "total_transactions": len(sales),
        "average_transaction": round(total / len(sales), 2) if sales else 0,
        "by_method": by_method
    }

@router.get("/reports/daily")
def get_daily(db: Session = Depends(get_db), _=Depends(require_staff)):
    today = date.today()
    sales = db.query(Sale).filter(func.date(Sale.Created_At) == today).all()
    total = sum(s.Total_Amount for s in sales)
    return {
        "date": today.strftime("%Y-%m-%d"),
        "total_revenue": round(total, 2),
        "total_sales": len(sales),
    }

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).order_by(Sale.Created_At.desc()).all()
    result = []
    for s in sales:
        customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == s.Customer_ID).first()
        cashier = db.query(UserModel).filter(UserModel.id == s.Cashier_ID).first()
        items = db.query(SaleItem).filter(SaleItem.Sale_ID == s.Sale_ID).all()
        result.append({
            "Sale_ID": f"S{s.Sale_ID:03d}",
            "date": s.Created_At.strftime("%Y-%m-%d") if s.Created_At else "",
            "Customer": f"{customer.First_Name} {customer.Last_Name}" if customer else "Walk-in",
            "cashier": cashier.full_name if cashier else "Staff",
            "items": len(items),
            "Total_Amount": s.Total_Amount,
            "method": s.Payment_Method,
            "status": s.Status,
            "Discount": s.Discount,
            "Tax": s.Tax,
        })
    return result

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.Sale_ID == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    items = db.query(SaleItem).filter(SaleItem.Sale_ID == sale_id).all()
    item_details = []
    for item in items:
        product = db.query(ProductModel).filter(ProductModel.Product_ID == item.Product_ID).first()
        item_details.append({
            "Product_ID": item.Product_ID,
            "Name": product.Name if product else "Unknown",
            "Quantity": item.Quantity,
            "Unit_Price": item.Unit_Price,
            "Subtotal": item.Subtotal,
        })
    return {"Sale_ID": sale.Sale_ID, "Total_Amount": sale.Total_Amount, "items": item_details}

@router.post("/")
def create_sale(data: dict, db: Session = Depends(get_db)):
    sale = Sale(
        Customer_ID=data.get("customer_id"),
        Cashier_ID=data.get("cashier_id"),
        Total_Amount=data.get("total", 0),
        Discount=data.get("discount", 0),
        Tax=data.get("tax", 0),
        Payment_Method=data.get("payment_method", "Cash"),
        Status="completed"
    )
    db.add(sale)
    db.flush()
    for item in data.get("items", []):
        sale_item = SaleItem(
            Sale_ID=sale.Sale_ID,
            Product_ID=item["Product_ID"],
            Quantity=item["qty"],
            Unit_Price=item["Unit_Price"],
            Subtotal=item["Unit_Price"] * item["qty"]
        )
        db.add(sale_item)
        inv = db.query(Inventory).filter(Inventory.Product_ID == item["Product_ID"]).first()
        if inv:
            inv.Quantity = max(0, inv.Quantity - item["qty"])
            db.add(StockMovement(
                Product_ID=item["Product_ID"],
                Movement_Type="out",
                Quantity=item["qty"],
                Note=f"Sale #{sale.Sale_ID}"
            ))
    db.commit()
    db.refresh(sale)
    return {"Sale_ID": f"S{sale.Sale_ID:03d}", "Total_Amount": sale.Total_Amount, "status": sale.Status}