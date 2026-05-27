from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..models.sales import Sale, SaleItem
from ..models.product import Product as ProductModel
from ..models.inventory import Inventory
from ..models.customer import Customer as CustomerModel
import datetime

router = APIRouter()

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).order_by(Sale.Created_At.desc()).all()
    result = []
    for s in sales:
        items = db.query(SaleItem).filter(SaleItem.Sale_ID == s.Sale_ID).all()
        customer = None
        if s.Customer_ID:
            c = db.query(CustomerModel).filter(CustomerModel.Customer_ID == s.Customer_ID).first()
            if c:
                customer = f"{c.First_Name} {c.Last_Name}"
        result.append({
            "Sale_ID": s.Sale_ID,
            "Customer": customer or "Walk-in",
            "Total_Amount": s.Total_Amount,
            "Discount": s.Discount,
            "Tax": s.Tax,
            "Payment_Method": s.Payment_Method,
            "Status": s.Status,
            "Created_At": s.Created_At,
            "Items_Count": len(items)
        })
    return result

@router.get("/{sale_id}")
def get_sale_detail(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.Sale_ID == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    items = db.query(SaleItem).filter(SaleItem.Sale_ID == sale_id).all()
    items_detail = []
    for item in items:
        p = db.query(ProductModel).filter(ProductModel.Product_ID == item.Product_ID).first()
        items_detail.append({
            "Product_Name": p.Name if p else "Unknown",
            "Quantity": item.Quantity,
            "Unit_Price": item.Unit_Price,
            "Subtotal": item.Subtotal
        })
    return {
        "Sale_ID": sale.Sale_ID,
        "Total_Amount": sale.Total_Amount,
        "Discount": sale.Discount,
        "Tax": sale.Tax,
        "Payment_Method": sale.Payment_Method,
        "Status": sale.Status,
        "Created_At": sale.Created_At,
        "Items": items_detail
    }

@router.post("/")
def create_sale(data: dict, db: Session = Depends(get_db)):
    items = data.get("items", [])
    subtotal = sum(i["quantity"] * i["unit_price"] for i in items)
    discount = data.get("discount", 0)
    tax_rate = data.get("tax_rate", 0.1)
    tax = round((subtotal - discount) * tax_rate, 2)
    total = round(subtotal - discount + tax, 2)

    sale = Sale(
        Customer_ID=data.get("customer_id"),
        Cashier_ID=data.get("cashier_id"),
        Total_Amount=total,
        Discount=discount,
        Tax=tax,
        Payment_Method=data.get("payment_method", "Cash"),
        Status="completed"
    )
    db.add(sale)
    db.flush()

    for item in items:
        sale_item = SaleItem(
            Sale_ID=sale.Sale_ID,
            Product_ID=item["product_id"],
            Quantity=item["quantity"],
            Unit_Price=item["unit_price"],
            Subtotal=round(item["quantity"] * item["unit_price"], 2)
        )
        db.add(sale_item)

        # Deduct from inventory
        inv = db.query(Inventory).filter(Inventory.Product_ID == item["product_id"]).first()
        if inv:
            inv.Quantity = max(0, inv.Quantity - item["quantity"])

    # Add loyalty points if customer
    if data.get("customer_id"):
        customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == data["customer_id"]).first()
        if customer:
            points_earned = int(total)
            customer.Loyalty_Points = (customer.Loyalty_Points or 0) + points_earned

    db.commit()
    db.refresh(sale)
    return {"Sale_ID": sale.Sale_ID, "Total": total, "Tax": tax, "Discount": discount}

# ── Reports ────────────────────────────────────────────────
@router.get("/reports/daily")
def daily_report(db: Session = Depends(get_db)):
    today = datetime.date.today()
    sales = db.query(Sale).filter(func.date(Sale.Created_At) == today).all()
    total_revenue = sum(s.Total_Amount for s in sales)
    return {
        "date": str(today),
        "total_sales": len(sales),
        "total_revenue": round(total_revenue, 2),
        "avg_transaction": round(total_revenue / len(sales), 2) if sales else 0
    }

@router.get("/reports/summary")
def revenue_summary(db: Session = Depends(get_db)):
    from sqlalchemy import extract
    import datetime
    current_month = datetime.date.today().month
    current_year = datetime.date.today().year

    monthly = db.query(Sale).filter(
        extract('month', Sale.Created_At) == current_month,
        extract('year', Sale.Created_At) == current_year
    ).all()

    yearly = db.query(Sale).filter(
        extract('year', Sale.Created_At) == current_year
    ).all()

    # Best selling products
    best = db.query(
        SaleItem.Product_ID,
        func.sum(SaleItem.Quantity).label("total_qty"),
        func.sum(SaleItem.Subtotal).label("total_revenue")
    ).group_by(SaleItem.Product_ID).order_by(func.sum(SaleItem.Quantity).desc()).limit(5).all()

    best_products = []
    for b in best:
        p = db.query(ProductModel).filter(ProductModel.Product_ID == b.Product_ID).first()
        best_products.append({
            "name": p.Name if p else "Unknown",
            "total_qty": b.total_qty,
            "total_revenue": round(b.total_revenue, 2)
        })

    return {
        "monthly_revenue": round(sum(s.Total_Amount for s in monthly), 2),
        "monthly_sales": len(monthly),
        "yearly_revenue": round(sum(s.Total_Amount for s in yearly), 2),
        "yearly_sales": len(yearly),
        "best_selling_products": best_products
    }