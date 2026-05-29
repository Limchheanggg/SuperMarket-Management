from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..models.sales import Sale, SaleItem
from ..models.customer import Customer as CustomerModel
from ..models.user import User as UserModel
from ..models.product import Product as ProductModel
from ..models.inventory import Inventory, StockMovement
from datetime import datetime, date

router = APIRouter()

def sale_to_dict(s, customer=None, cashier=None, item_count=0):
    return {
        "Sale_ID": f"S{s.Sale_ID:03d}",
        "date": f"{s.Sale_Day}/{s.Sale_Month}/{s.Sale_Year}",
        "Customer": f"{customer.First_Name} {customer.Last_Name}" if customer else "Walk-in",
        "cashier": cashier.full_name if cashier else "Staff",
        "items": item_count,
        "Total_Amount": float(s.Total_Amount),
        "method": s.Payment_Method,
        "status": "completed",
        "Discount": float(s.Discount or 0),
        "Tax": float(s.Tax or 0),
    }

@router.get("/reports/summary")
def get_summary(db: Session = Depends(get_db)):
    sales = db.query(Sale).all()
    total = sum(float(s.Total_Amount) for s in sales)
    by_method = {}
    for s in sales:
        by_method[s.Payment_Method] = by_method.get(s.Payment_Method, 0) + float(s.Total_Amount)
    today = date.today()
    monthly = sum(float(s.Total_Amount) for s in sales if s.Sale_Month == today.month and s.Sale_Year == today.year)
    yearly  = sum(float(s.Total_Amount) for s in sales if s.Sale_Year == today.year)
    monthly_count = len([s for s in sales if s.Sale_Month == today.month and s.Sale_Year == today.year])
    yearly_count  = len([s for s in sales if s.Sale_Year == today.year])
    return {
        "total_revenue":       round(total, 2),
        "monthly_revenue":     round(monthly, 2),
        "yearly_revenue":      round(yearly, 2),
        "total_transactions":  len(sales),
        "monthly_sales":       monthly_count,
        "yearly_sales":        yearly_count,
        "average_transaction": round(total / len(sales), 2) if sales else 0,
        "by_method":           {k: round(v, 2) for k, v in by_method.items()},
    }

@router.get("/reports/daily")
def get_daily(db: Session = Depends(get_db)):
    today = date.today()
    sales = db.query(Sale).filter(
        Sale.Sale_Day   == today.day,
        Sale.Sale_Month == today.month,
        Sale.Sale_Year  == today.year
    ).all()
    total = sum(float(s.Total_Amount) for s in sales)
    return {
        "date":          today.strftime("%Y-%m-%d"),
        "total_revenue": round(total, 2),
        "total_sales":   len(sales),
        "avg_transaction": round(total / len(sales), 2) if sales else 0,
    }

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).all()
    result = []
    for s in sales:
        customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == s.Customer_ID).first()
        cashier  = db.query(UserModel).filter(UserModel.id == s.Employee_ID).first()
        items    = db.query(SaleItem).filter(SaleItem.Sale_ID == s.Sale_ID).all()
        result.append(sale_to_dict(s, customer, cashier, len(items)))
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
            "Name":       product.Name if product else "Unknown",
            "Quantity":   item.Quantity,
            "Unit_Price": item.Unit_Price,
            "Subtotal":   item.Subtotal,
        })
    return {"Sale_ID": sale.Sale_ID, "Total_Amount": float(sale.Total_Amount), "items": item_details}

@router.post("/")
def create_sale(data: dict, db: Session = Depends(get_db)):
    now = datetime.now()
    sale = Sale(
        Sale_Day       = now.day,
        Sale_Month     = now.month,
        Sale_Year      = now.year,
        Sale_Time      = now.time(),
        Employee_ID    = data.get("cashier_id") or 1,
        Customer_ID    = data.get("customer_id"),
        Total_Amount   = data.get("total", 0),
        Discount       = data.get("discount", 0),
        Tax            = data.get("tax", 0),
        Payment_Method = data.get("payment_method", "Cash"),
    )
    db.add(sale)
    db.flush()

    for item in data.get("items", []):
        db.add(SaleItem(
            Sale_ID    = sale.Sale_ID,
            Product_ID = item["Product_ID"],
            Quantity   = item["qty"],
            Unit_Price = item["Unit_Price"],
            Subtotal   = item["Unit_Price"] * item["qty"]
        ))
        inv = db.query(Inventory).filter(Inventory.Product_ID == item["Product_ID"]).first()
        if inv:
            inv.Quantity = max(0, inv.Quantity - item["qty"])
            db.add(StockMovement(
                Product_ID     = item["Product_ID"],
                Movement_Type  = "out",
                Quantity       = item["qty"],
                Note           = f"Sale #{sale.Sale_ID}"
            ))
    db.commit()
    db.refresh(sale)
    return {"Sale_ID": f"S{sale.Sale_ID:03d}", "Total_Amount": float(sale.Total_Amount), "status": "completed"}

@router.delete("/clear")
def clear_all_sales(db: Session = Depends(get_db)):
    db.query(SaleItem).delete()
    db.query(Sale).delete()
    db.commit()
    return {"message": "All sales cleared"}