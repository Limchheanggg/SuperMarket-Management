from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.sales import Sale, SaleItem
from ..models.inventory import Inventory
from datetime import datetime, date

router = APIRouter()

@router.get("/reports/summary")
def get_summary(db: Session = Depends(get_db)):
    today = date.today()
    r = db.execute(text("""
        SELECT
            COALESCE(SUM(Total_Amount),0) as total,
            COUNT(*) as total_count,
            COALESCE(SUM(CASE WHEN Sale_Month=:m AND Sale_Year=:y THEN Total_Amount ELSE 0 END),0) as monthly,
            COALESCE(SUM(CASE WHEN Sale_Year=:y THEN Total_Amount ELSE 0 END),0) as yearly,
            COUNT(CASE WHEN Sale_Month=:m AND Sale_Year=:y THEN 1 END) as monthly_count,
            COUNT(CASE WHEN Sale_Year=:y THEN 1 END) as yearly_count
        FROM Sale
    """), {"m": today.month, "y": today.year}).fetchone()

    by_method = db.execute(text("""
        SELECT Payment_Method, ROUND(SUM(Total_Amount),2) as total
        FROM Sale GROUP BY Payment_Method
    """)).fetchall()

    return {
        "total_revenue":       round(float(r.total), 2),
        "monthly_revenue":     round(float(r.monthly), 2),
        "yearly_revenue":      round(float(r.yearly), 2),
        "total_transactions":  r.total_count,
        "monthly_sales":       r.monthly_count,
        "yearly_sales":        r.yearly_count,
        "average_transaction": round(float(r.total) / r.total_count, 2) if r.total_count else 0,
        "by_method":           {row.Payment_Method: float(row.total) for row in by_method},
    }

@router.get("/reports/daily")
def get_daily(db: Session = Depends(get_db)):
    today = date.today()
    r = db.execute(text("""
        SELECT COALESCE(SUM(Total_Amount),0) as total, COUNT(*) as cnt
        FROM Sale
        WHERE Sale_Day=:d AND Sale_Month=:m AND Sale_Year=:y
    """), {"d": today.day, "m": today.month, "y": today.year}).fetchone()
    total = float(r.total)
    cnt   = r.cnt
    return {
        "date":              today.strftime("%Y-%m-%d"),
        "total_revenue":     round(total, 2),
        "total_sales":       cnt,
        "avg_transaction":   round(total / cnt, 2) if cnt else 0,
    }

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    # Single SQL join — no Python loops over 10k rows
    rows = db.execute(text("""
        SELECT
            s.Sale_ID, s.Sale_Day, s.Sale_Month, s.Sale_Year,
            s.Total_Amount, s.Payment_Method, s.Discount, s.Tax,
            u.full_name as cashier_name,
            COUNT(si.Item_ID) as item_count
        FROM Sale s
        LEFT JOIN users u ON u.id = s.Employee_ID
        LEFT JOIN SaleItem si ON si.Sale_ID = s.Sale_ID
        GROUP BY s.Sale_ID, s.Sale_Day, s.Sale_Month, s.Sale_Year,
                 s.Total_Amount, s.Payment_Method, s.Discount, s.Tax, u.full_name
        ORDER BY s.Sale_ID DESC
        LIMIT 200
    """)).fetchall()

    return [{
        "Sale_ID":      f"S{r.Sale_ID:03d}",
        "date":         f"{r.Sale_Day}/{r.Sale_Month}/{r.Sale_Year}",
        "Customer":     "Walk-in",
        "cashier":      r.cashier_name or "Staff",
        "items":        r.item_count,
        "Total_Amount": float(r.Total_Amount),
        "method":       r.Payment_Method,
        "status":       "completed",
        "Discount":     float(r.Discount or 0),
        "Tax":          float(r.Tax or 0),
    } for r in rows]

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.execute(text("""
        SELECT s.Sale_ID, s.Total_Amount, s.Payment_Method,
               s.Discount, s.Tax, s.Sale_Day, s.Sale_Month, s.Sale_Year
        FROM Sale s WHERE s.Sale_ID = :id
    """), {"id": sale_id}).fetchone()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    items = db.execute(text("""
        SELECT p.Name, si.Quantity, si.Unit_Price, si.Subtotal
        FROM SaleItem si
        JOIN Product p ON p.Product_ID = si.Product_ID
        WHERE si.Sale_ID = :id
    """), {"id": sale_id}).fetchall()

    return {
        "Sale_ID":      sale.Sale_ID,
        "Total_Amount": float(sale.Total_Amount),
        "Discount":     float(sale.Discount or 0),
        "Tax":          float(sale.Tax or 0),
        "date":         f"{sale.Sale_Day}/{sale.Sale_Month}/{sale.Sale_Year}",
        "method":       sale.Payment_Method,
        "items": [{
            "Name":       r.Name,
            "Quantity":   r.Quantity,
            "Unit_Price": r.Unit_Price,
            "Subtotal":   r.Subtotal,
        } for r in items],
    }

@router.post("/")
def create_sale(data: dict, db: Session = Depends(get_db)):
    now = datetime.now()
    sale = Sale(
        Sale_Day       = now.day,
        Sale_Month     = now.month,
        Sale_Year      = now.year,
        Sale_Time      = now.time(),
        Employee_ID    = data.get("cashier_id") or 2,
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
            Subtotal   = item["Unit_Price"] * item["qty"],
        ))
        inv = db.query(Inventory).filter(Inventory.Product_ID == item["Product_ID"]).first()
        if inv:
            inv.Quantity = max(0, inv.Quantity - item["qty"])
    db.commit()
    db.refresh(sale)
    return {"Sale_ID": f"S{sale.Sale_ID:03d}", "Total_Amount": float(sale.Total_Amount), "status": "completed"}

@router.delete("/clear")
def clear_all_sales(db: Session = Depends(get_db)):
    db.execute(text("SET FOREIGN_KEY_CHECKS=0"))
    db.execute(text("DELETE FROM SaleItem"))
    db.execute(text("DELETE FROM Sale"))
    db.execute(text("SET FOREIGN_KEY_CHECKS=1"))
    db.commit()
    return {"message": "All sales cleared"}

@router.get("/reports/best-sellers")
def get_best_sellers(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT p.Name as name, p.Unit_Price as price,
               SUM(si.Quantity) as total_qty,
               ROUND(SUM(si.Subtotal),2) as total_revenue
        FROM SaleItem si
        JOIN Product p ON p.Product_ID = si.Product_ID
        GROUP BY p.Product_ID, p.Name, p.Unit_Price
        ORDER BY total_qty DESC
        LIMIT 10
    """)).fetchall()
    return [{"name": r.name, "price": float(r.price),
             "total_qty": int(r.total_qty),
             "total_revenue": float(r.total_revenue)} for r in rows]

@router.get("/reports/monthly")
def get_monthly(db: Session = Depends(get_db)):
    from datetime import date
    year = date.today().year
    rows = db.execute(text("""
        SELECT Sale_Month as month,
               COUNT(*) as sales,
               ROUND(SUM(Total_Amount),2) as revenue
        FROM Sale
        WHERE Sale_Year = :year
        GROUP BY Sale_Month
        ORDER BY Sale_Month
    """), {"year": year}).fetchall()
    # Fill all 12 months (0 for missing)
    data = {r.month: {"sales": r.sales, "revenue": float(r.revenue)} for r in rows}
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return [{"label": months[i], "month": i+1,
             "sales": data.get(i+1, {}).get("sales", 0),
             "value": data.get(i+1, {}).get("revenue", 0)} for i in range(12)]
