from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from datetime import datetime, date
from typing import Optional

router = APIRouter()

@router.get("/")
def get_sales(
    db: Session = Depends(get_db),
    date_from:   Optional[str] = Query(None),
    date_to:     Optional[str] = Query(None),
    method:      Optional[str] = Query(None),
    cashier:     Optional[str] = Query(None),
    min_amount:  Optional[float] = Query(None),
    max_amount:  Optional[float] = Query(None),
    search:      Optional[str] = Query(None),
):
    where = ["1=1"]
    params = {}

    if date_from:
        where.append("(s.Sale_Year*10000 + s.Sale_Month*100 + s.Sale_Day) >= :dfrom")
        d = datetime.strptime(date_from, "%Y-%m-%d")
        params["dfrom"] = d.year*10000 + d.month*100 + d.day
    if date_to:
        where.append("(s.Sale_Year*10000 + s.Sale_Month*100 + s.Sale_Day) <= :dto")
        d = datetime.strptime(date_to, "%Y-%m-%d")
        params["dto"] = d.year*10000 + d.month*100 + d.day
    if method:
        where.append("s.Payment_Method = :method")
        params["method"] = method
    if cashier:
        where.append("u.full_name LIKE :cashier")
        params["cashier"] = f"%{cashier}%"
    if min_amount is not None:
        where.append("s.Total_Amount >= :min_a")
        params["min_a"] = min_amount
    if max_amount is not None:
        where.append("s.Total_Amount <= :max_a")
        params["max_a"] = max_amount
    if search:
        where.append("(u.full_name LIKE :search OR s.Payment_Method LIKE :search)")
        params["search"] = f"%{search}%"

    where_clause = " AND ".join(where)
    rows = db.execute(text(f"""
        SELECT
            s.Sale_ID,
            s.Sale_Day, s.Sale_Month, s.Sale_Year,
            s.Sale_Time,
            s.Total_Amount,
            s.Payment_Method,
            s.Discount,
            s.Tax,
            COALESCE(CONCAT(c.First_Name,' ',c.Last_Name), 'Walk-in') as customer,
            COALESCE(u.full_name, 'Staff') as cashier,
            (SELECT COUNT(*) FROM SaleItem si WHERE si.Sale_ID = s.Sale_ID) as item_count
        FROM Sale s
        LEFT JOIN Customer c ON c.Customer_ID = s.Customer_ID
        LEFT JOIN users u    ON u.id           = s.Employee_ID
        WHERE {where_clause}
        ORDER BY s.Sale_Year DESC, s.Sale_Month DESC, s.Sale_Day DESC, s.Sale_Time DESC
        LIMIT 500
    """), params).fetchall()

    result = []
    for r in rows:
        d = dict(r._mapping)
        d['Total_Amount'] = float(d['Total_Amount'] or 0)
        d['Discount']     = float(d['Discount'] or 0)
        d['Tax']          = float(d['Tax'] or 0)
        d['date']         = f"{d['Sale_Year']}-{str(d['Sale_Month']).zfill(2)}-{str(d['Sale_Day']).zfill(2)}"
        d['time']         = str(d['Sale_Time'])[:5] if d['Sale_Time'] else '—'
        d['Sale_ID_fmt']  = f"S{str(d['Sale_ID']).zfill(4)}"
        result.append(d)
    return result

@router.get("/cashiers")
def get_cashiers(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT DISTINCT u.full_name as name
        FROM Sale s
        JOIN users u ON u.id = s.Employee_ID
        ORDER BY name
    """)).fetchall()
    return [r.name for r in rows]

@router.get("/methods")
def get_methods(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT DISTINCT Payment_Method FROM Sale ORDER BY Payment_Method")).fetchall()
    return [r.Payment_Method for r in rows]

@router.get("/reports/summary")
def get_summary(date_from: Optional[str] = Query(None), date_to: Optional[str] = Query(None), db: Session = Depends(get_db)):
    today = date.today()
    where = "1=1"
    params = {}
    if date_from:
        d = datetime.strptime(date_from, "%Y-%m-%d")
        where += " AND (s.Sale_Year*10000+s.Sale_Month*100+s.Sale_Day) >= :dfrom"
        params["dfrom"] = d.year*10000+d.month*100+d.day
    if date_to:
        d = datetime.strptime(date_to, "%Y-%m-%d")
        where += " AND (s.Sale_Year*10000+s.Sale_Month*100+s.Sale_Day) <= :dto"
        params["dto"] = d.year*10000+d.month*100+d.day
    params["m"] = today.month
    params["y"] = today.year
    row = db.execute(text(
        "SELECT COUNT(*) as total_transactions,"
        " ROUND(SUM(Total_Amount),2) as total_revenue,"
        " ROUND(AVG(Total_Amount),2) as average_transaction,"
        " SUM(CASE WHEN Sale_Month=:m AND Sale_Year=:y THEN 1 ELSE 0 END) as monthly_sales,"
        " ROUND(SUM(CASE WHEN Sale_Month=:m AND Sale_Year=:y THEN Total_Amount ELSE 0 END),2) as monthly_revenue,"
        " SUM(CASE WHEN Sale_Year=:y THEN 1 ELSE 0 END) as yearly_sales,"
        " ROUND(SUM(CASE WHEN Sale_Year=:y THEN Total_Amount ELSE 0 END),2) as yearly_revenue"
        " FROM Sale s WHERE " + where
    ), params).fetchone()
    methods = db.execute(text(
        "SELECT Payment_Method, ROUND(SUM(Total_Amount),2) as total"
        " FROM Sale s WHERE " + where + " GROUP BY Payment_Method"
    ), params).fetchall()

    return {
        "total_transactions":  row.total_transactions or 0,
        "total_revenue":       float(row.total_revenue or 0),
        "average_transaction": float(row.average_transaction or 0),
        "monthly_sales":       row.monthly_sales or 0,
        "monthly_revenue":     float(row.monthly_revenue or 0),
        "yearly_sales":        row.yearly_sales or 0,
        "yearly_revenue":      float(row.yearly_revenue or 0),
        "by_method":           {r.Payment_Method: float(r.total) for r in methods},
    }

@router.get("/reports/daily")
def get_daily(db: Session = Depends(get_db)):
    today = date.today()
    row = db.execute(text("""
        SELECT COUNT(*) as total_sales,
               ROUND(SUM(Total_Amount),2) as total_revenue,
               ROUND(AVG(Total_Amount),2) as avg_transaction
        FROM Sale
        WHERE Sale_Day=:d AND Sale_Month=:m AND Sale_Year=:y
    """), {"d": today.day, "m": today.month, "y": today.year}).fetchone()
    return {
        "date":            str(today),
        "total_sales":     row.total_sales or 0,
        "total_revenue":   float(row.total_revenue or 0),
        "avg_transaction": float(row.avg_transaction or 0),
    }

@router.get("/reports/monthly")
def get_monthly(year: Optional[int] = Query(None), db: Session = Depends(get_db)):
    today = date.today()
    y = year if year else today.year
    rows = db.execute(text("""
        SELECT Sale_Month as month,
               COUNT(*) as sales,
               ROUND(SUM(Total_Amount),2) as revenue
        FROM Sale WHERE Sale_Year=:y
        GROUP BY Sale_Month ORDER BY Sale_Month
    """), {"y": y}).fetchall()
    data = {r.month: {"sales": r.sales, "revenue": float(r.revenue)} for r in rows}
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return [{"label": months[i], "month": i+1,
             "sales": data.get(i+1,{}).get("sales",0),
             "value": data.get(i+1,{}).get("revenue",0)} for i in range(12)]

@router.get("/reports/best-sellers")
def get_best_sellers(date_from: Optional[str] = Query(None), date_to: Optional[str] = Query(None), db: Session = Depends(get_db)):
    where = "1=1"
    params = {}
    if date_from:
        d = datetime.strptime(date_from, "%Y-%m-%d")
        where += " AND (s.Sale_Year*10000+s.Sale_Month*100+s.Sale_Day) >= :dfrom"
        params["dfrom"] = d.year*10000+d.month*100+d.day
    if date_to:
        d = datetime.strptime(date_to, "%Y-%m-%d")
        where += " AND (s.Sale_Year*10000+s.Sale_Month*100+s.Sale_Day) <= :dto"
        params["dto"] = d.year*10000+d.month*100+d.day
    rows = db.execute(text("""
        SELECT p.Name as name, p.Unit_Price as price,
               SUM(si.Quantity) as total_qty,
               ROUND(SUM(si.Subtotal),2) as total_revenue
        FROM SaleItem si
        JOIN Product p ON p.Product_ID = si.Product_ID
        JOIN Sale s ON s.Sale_ID = si.Sale_ID
        WHERE """ + where + """
        GROUP BY p.Product_ID, p.Name, p.Unit_Price
        ORDER BY total_qty DESC LIMIT 10
    """), params).fetchall()
    return [{"name": r.name, "price": float(r.price),
             "total_qty": int(r.total_qty),
             "total_revenue": float(r.total_revenue)} for r in rows]

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.execute(text("""
        SELECT s.Sale_ID, s.Total_Amount, s.Payment_Method,
               s.Discount, s.Tax, s.Sale_Day, s.Sale_Month, s.Sale_Year,
               s.Sale_Time,
               COALESCE(CONCAT(c.First_Name,' ',c.Last_Name),'Walk-in') as customer,
               COALESCE(u.full_name,'Staff') as cashier
        FROM Sale s
        LEFT JOIN Customer c ON c.Customer_ID = s.Customer_ID
        LEFT JOIN users u    ON u.id           = s.Employee_ID
        WHERE s.Sale_ID = :id
    """), {"id": sale_id}).fetchone()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    items = db.execute(text("""
        SELECT p.Name, p.Product_ID, si.Quantity, si.Unit_Price, si.Subtotal
        FROM SaleItem si JOIN Product p ON p.Product_ID = si.Product_ID
        WHERE si.Sale_ID = :id
    """), {"id": sale_id}).fetchall()
    return {
        "Sale_ID":        sale.Sale_ID,
        "date":           f"{sale.Sale_Day}/{sale.Sale_Month}/{sale.Sale_Year}",
        "time":           str(sale.Sale_Time)[:5] if sale.Sale_Time else '—',
        "Total_Amount":   float(sale.Total_Amount),
        "Payment_Method": sale.Payment_Method,
        "Discount":       float(sale.Discount or 0),
        "Tax":            float(sale.Tax or 0),
        "customer":       sale.customer,
        "cashier":        sale.cashier,
        "items":          [{"Name": i.Name, "Quantity": i.Quantity,
                            "Unit_Price": float(i.Unit_Price),
                            "Subtotal": float(i.Subtotal)} for i in items],
    }

@router.post("/")
def create_sale(data: dict, db: Session = Depends(get_db)):
    now = datetime.now()
    result = db.execute(text("""
        INSERT INTO Sale (Sale_Day, Sale_Month, Sale_Year, Sale_Time,
                          Employee_ID, Customer_ID, Total_Amount, Discount, Tax, Payment_Method)
        VALUES (:d,:m,:y,:t,:eid,:cid,:total,:disc,:tax,:method)
    """), {
        "d": now.day, "m": now.month, "y": now.year, "t": now.strftime("%H:%M:%S"),
        "eid":    data.get("cashier_id") or 1,
        "cid":    data.get("customer_id"),
        "total":  data.get("total", 0),
        "disc":   data.get("discount", 0),
        "tax":    data.get("tax", 0),
        "method": data.get("payment_method", "Cash"),
    })
    db.commit()
    sale_id = result.lastrowid
    for item in data.get("items", []):
        pid = item["Product_ID"]
        qty = item["qty"]

        # Insert sale item
        db.execute(text("""
            INSERT INTO SaleItem (Sale_ID, Product_ID, Quantity, Unit_Price, Subtotal)
            VALUES (:sid,:pid,:qty,:price,:sub)
        """), {"sid": sale_id, "pid": pid,
               "qty": qty, "price": item["Unit_Price"],
               "sub": item["Unit_Price"] * qty})

        # Deduct stock from Inventory
        db.execute(text("""
            INSERT INTO Inventory (Product_ID, Quantity, Last_Updated)
            VALUES (:pid, 0, NOW())
            ON DUPLICATE KEY UPDATE
                Quantity = GREATEST(0, Quantity - :qty),
                Last_Updated = NOW()
        """), {"pid": pid, "qty": qty})

        # Log stock movement
        db.execute(text("""
            INSERT INTO StockMovement (Product_ID, Movement_Type, Quantity, Note)
            VALUES (:pid, 'out', :qty, :note)
        """), {"pid": pid, "qty": qty, "note": f"Sale #{sale_id}"})

    db.commit()
    return {"Sale_ID": f"S{str(sale_id).zfill(4)}", "Total_Amount": data.get("total",0)}
