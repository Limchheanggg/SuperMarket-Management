from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..core.dependencies import get_current_user
from datetime import datetime, date, timedelta
from typing import Optional

router = APIRouter()

@router.get("/")
def get_sales(
    db: Session = Depends(get_db),
    date_from:          Optional[str] = Query(None),
    date_to:            Optional[str] = Query(None),
    method:             Optional[str] = Query(None),
    cashier:            Optional[str] = Query(None),
    min_amount:         Optional[float] = Query(None),
    max_amount:         Optional[float] = Query(None),
    search:             Optional[str] = Query(None),
    customer_user_id:   Optional[int] = Query(None),
    limit:              Optional[int] = Query(500),
):
    where = ["1=1"]
    params = {}
    if customer_user_id:
        where.append("c.User_ID = :cuid")
        params["cuid"] = customer_user_id

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
        d['time']         = (lambda t: f"{int(str(t).split(':')[0]):02d}:{str(t).split(':')[1]}")(d['Sale_Time']) if d['Sale_Time'] else '—'
        d['Sale_ID_fmt']  = f"S{str(d['Sale_ID']).zfill(4)}"
        result.append(d)
    return result

@router.get("/cashiers")
def get_cashiers(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT DISTINCT u.full_name as name
        FROM Sale s
        JOIN users u ON u.id = s.Employee_ID
        WHERE u.role IN ('cashier', 'employee')
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


@router.get("/my")
def get_my_sales(user_id: int, db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT s.Sale_ID, s.Total_Amount, s.Payment_Method, s.Discount,
               s.Sale_Day, s.Sale_Month, s.Sale_Year, s.Sale_Time,
               (SELECT COUNT(*) FROM SaleItem si WHERE si.Sale_ID = s.Sale_ID) as item_count
        FROM Sale s
        JOIN Customer c ON c.Customer_ID = s.Customer_ID
        WHERE c.User_ID = :uid
        ORDER BY s.Sale_Year DESC, s.Sale_Month DESC, s.Sale_Day DESC, s.Sale_Time DESC
        LIMIT 500
    """), {"uid": user_id}).fetchall()
    result = []
    for r in rows:
        d = dict(r._mapping)
        d["date"] = f"{d['Sale_Year']}-{str(d['Sale_Month']).zfill(2)}-{str(d['Sale_Day']).zfill(2)}"
        d["Sale_ID_fmt"] = f"S{d['Sale_ID']}"
        result.append(d)
    return result

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.execute(text("""
        SELECT s.Sale_ID, s.Total_Amount, s.Payment_Method,
               s.Discount, s.Tax, s.Sale_Day, s.Sale_Month, s.Sale_Year,
               s.Sale_Time, s.Customer_Note,
               COALESCE(CONCAT(c.First_Name,' ',c.Last_Name),'Walk-in') as customer,
               COALESCE(u.full_name,'Staff') as cashier,
               cp.Code as coupon_code,
               cu.email as customer_email,
               cu.phone as customer_phone,
               cu.address as customer_address
        FROM Sale s
        LEFT JOIN Customer c ON c.Customer_ID = s.Customer_ID
        LEFT JOIN users u    ON u.id           = s.Employee_ID
        LEFT JOIN Coupon cp  ON cp.Coupon_ID   = s.Coupon_ID
        LEFT JOIN users cu   ON cu.id          = c.User_ID
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
        "time":           (lambda t: f"{int(str(t).split(':')[0]):02d}:{str(t).split(':')[1]}")(sale.Sale_Time) if sale.Sale_Time else '—',
        "Total_Amount":   float(sale.Total_Amount),
        "Payment_Method": sale.Payment_Method,
        "Discount":       float(sale.Discount or 0),
        "Tax":            float(sale.Tax or 0),
        "customer":         sale.customer,
        "cashier":          sale.cashier,
        "Customer_Note":    sale.Customer_Note,
        "Coupon_Code":      sale.coupon_code,
        "customer_email":   sale.customer_email,
        "customer_phone":   sale.customer_phone,
        "customer_address": sale.customer_address,
        "items":          [{"Name": i.Name, "Quantity": i.Quantity,
                            "Unit_Price": float(i.Unit_Price),
                            "Subtotal": float(i.Subtotal)} for i in items],
    }

@router.post("/")
def create_sale(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    import json
    from decimal import Decimal, ROUND_HALF_UP
    from collections import defaultdict

    def money(value):
        return Decimal(str(value)).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

    items = data.get("items")
    if not isinstance(items, list) or not items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    quantities = defaultdict(int)
    cart_lines = []
    validated_items = []

    for item in items:
        if not isinstance(item, dict):
            raise HTTPException(status_code=400, detail="Invalid cart item")

        pid = item.get("Product_ID")
        qty = item.get("qty")

        if isinstance(pid, bool) or not isinstance(pid, int) or pid <= 0:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        if isinstance(qty, bool) or not isinstance(qty, int) or qty <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid quantity for product {pid}",
            )

        quantities[pid] += qty
        cart_lines.append({"Product_ID": pid, "qty": qty})

    payment_method = data.get("payment_method", "Cash")
    if payment_method not in ("Cash", "ABA", "Acleda"):
        raise HTTPException(status_code=400, detail="Invalid payment method")

    customer_info = data.get("customer_info", {})
    if customer_info and not isinstance(customer_info, dict):
        raise HTTPException(status_code=400, detail="Invalid customer information")

    note = json.dumps(customer_info) if customer_info else None
    now = datetime.now()

    try:
        # Resolve the customer from the authenticated account, never from
        # the customer_id supplied by the browser.
        role = current_user.role or "customer"
        customer_id = None

        if role == "customer":
            customer = db.execute(text("""
                SELECT Customer_ID
                FROM Customer
                WHERE User_ID = :uid
                LIMIT 1
                FOR UPDATE
            """), {"uid": current_user.id}).fetchone()

            customer_id = customer.Customer_ID if customer else None

        cashier_id = (
            current_user.id
            if role in ("cashier", "employee")
            else 527
        )

        membership = None
        tier = "None"

        if customer_id:
            membership = db.execute(text("""
                SELECT Membership_ID, Tier, Total_Spent
                FROM Membership
                WHERE Customer_ID = :cid
                ORDER BY Membership_ID DESC
                LIMIT 1
                FOR UPDATE
            """), {"cid": customer_id}).fetchone()

            if membership and membership.Tier:
                tier = membership.Tier

        # Fetch authoritative prices and reject inactive/missing products.
        for pid, qty in sorted(quantities.items()):
            product = db.execute(text("""
                SELECT Product_ID, Unit_Price, Is_Active
                FROM Product
                WHERE Product_ID = :pid
                FOR UPDATE
            """), {"pid": pid}).fetchone()

            if not product:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product {pid} does not exist",
                )

            if product.Is_Active is not None and int(product.Is_Active) != 1:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product {pid} is unavailable",
                )

            price = money(product.Unit_Price)
            if price < 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid database price for product {pid}",
                )

            for line in cart_lines:
                if line["Product_ID"] == pid:
                    validated_items.append({
                        "Product_ID": pid,
                        "qty": line["qty"],
                        "Unit_Price": price,
                    })

        subtotal = money(sum(
            (item["Unit_Price"] * item["qty"] for item in validated_items),
            Decimal("0.00"),
        ))
        tax = money(subtotal * Decimal("0.10"))
        purchase_total = money(subtotal + tax)

        # Lock and revalidate coupons during checkout.
        coupon_id = None
        discount = Decimal("0.00")
        coupon_code = data.get("coupon")

        if coupon_code:
            code = str(coupon_code).strip().upper()
            coupon = db.execute(text("""
                SELECT *
                FROM Coupon
                WHERE Code = :code
                FOR UPDATE
            """), {"code": code}).fetchone()

            if not coupon or not coupon.Is_Active:
                raise HTTPException(status_code=400, detail="Coupon not found or inactive")

            if coupon.Expiry_Date < date.today():
                raise HTTPException(status_code=400, detail="Coupon has expired")

            if coupon.Uses_Count >= coupon.Uses_Limit:
                raise HTTPException(status_code=400, detail="Coupon usage limit reached")

            if purchase_total < money(coupon.Min_Purchase or 0):
                raise HTTPException(
                    status_code=400,
                    detail=f"Minimum purchase ${float(coupon.Min_Purchase):.2f} required",
                )

            tier_order = {
                "Bronze": 0, "Silver": 1, "Gold": 2, "Platinum": 3
            }

            if tier == "None":
                raise HTTPException(
                    status_code=400,
                    detail="Membership required to use coupons",
                )

            if tier not in tier_order or coupon.Tier_Required not in tier_order:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid membership tier",
                )

            if tier_order[tier] < tier_order[coupon.Tier_Required]:
                raise HTTPException(
                    status_code=400,
                    detail=f"{coupon.Tier_Required} membership required",
                )

            discount_value = Decimal(str(coupon.Discount_Value))

            if discount_value < 0:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid coupon discount value",
                )

            if coupon.Discount_Type == "percentage":
                if discount_value > 100:
                    raise HTTPException(
                        status_code=400,
                        detail="Coupon percentage cannot exceed 100%",
                    )
                discount = money(purchase_total * discount_value / Decimal("100"))
            elif coupon.Discount_Type == "fixed":
                discount = min(money(discount_value), purchase_total)
            else:
                raise HTTPException(status_code=400, detail="Invalid coupon discount type")

            coupon_id = coupon.Coupon_ID

        discount = min(discount, purchase_total)
        total = money(purchase_total - discount)

        result = db.execute(text("""
            INSERT INTO Sale (
                Sale_Day, Sale_Month, Sale_Year, Sale_Time,
                Employee_ID, Customer_ID, Total_Amount, Discount, Tax,
                Payment_Method, Customer_Note, Coupon_ID
            )
            VALUES (
                :d, :m, :y, :t, :eid, :cid, :total, :disc, :tax,
                :method, :note, :coupon_id
            )
        """), {
            "d": now.day,
            "m": now.month,
            "y": now.year,
            "t": now.strftime("%H:%M:%S"),
            "eid": cashier_id,
            "cid": customer_id,
            "total": total,
            "disc": discount,
            "tax": tax,
            "method": payment_method,
            "note": note,
            "coupon_id": coupon_id,
        })
        sale_id = result.lastrowid

        # Deduct stock atomically.
        for pid, qty in sorted(quantities.items()):
            deduction = db.execute(text("""
                UPDATE Inventory
                SET Quantity = Quantity - :qty,
                    Last_Updated = NOW()
                WHERE Product_ID = :pid
                  AND Quantity >= :qty
            """), {"pid": pid, "qty": qty})

            if deduction.rowcount != 1:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product {pid} is out of stock or has insufficient quantity",
                )

        for item in validated_items:
            db.execute(text("""
                INSERT INTO SaleItem (
                    Sale_ID, Product_ID, Quantity, Unit_Price, Subtotal
                )
                VALUES (:sid, :pid, :qty, :price, :sub)
            """), {
                "sid": sale_id,
                "pid": item["Product_ID"],
                "qty": item["qty"],
                "price": item["Unit_Price"],
                "sub": item["Unit_Price"] * item["qty"],
            })

        for pid, qty in sorted(quantities.items()):
            db.execute(text("""
                INSERT INTO StockMovement (
                    Product_ID, Movement_Type, Quantity, Note, Created_At
                )
                VALUES (:pid, 'out', :qty, :note, NOW())
            """), {
                "pid": pid,
                "qty": qty,
                "note": f"Sale #{sale_id}",
            })

        if coupon_id:
            updated = db.execute(text("""
                UPDATE Coupon
                SET Uses_Count = Uses_Count + 1
                WHERE Coupon_ID = :cid
                  AND Is_Active = 1
                  AND Uses_Count < Uses_Limit
                  AND Expiry_Date >= :today
            """), {
                "cid": coupon_id,
                "today": date.today(),
            })

            if updated.rowcount != 1:
                raise HTTPException(
                    status_code=400,
                    detail="Coupon is no longer available",
                )

        # Award points based on the discounted amount before tax.
        if customer_id:
            discount_before_tax = (
                money(discount * subtotal / purchase_total)
                if purchase_total > 0
                else Decimal("0.00")
            )
            eligible_spend = max(
                Decimal("0.00"),
                money(subtotal - discount_before_tax),
            )
            points = int(eligible_spend.quantize(
                Decimal("1"), rounding=ROUND_HALF_UP
            ))

            db.execute(text("""
                UPDATE Customer
                SET Loyalty_Points = Loyalty_Points + :pts
                WHERE Customer_ID = :cid
            """), {"pts": points, "cid": customer_id})

            if membership:
                new_total_spent = money(
                    Decimal(str(membership.Total_Spent or 0)) + eligible_spend
                )

                if new_total_spent >= 500:
                    new_tier = "Platinum"
                elif new_total_spent >= 200:
                    new_tier = "Gold"
                elif new_total_spent >= 50:
                    new_tier = "Silver"
                else:
                    new_tier = "Bronze"

                db.execute(text("""
                    UPDATE Membership
                    SET Points = COALESCE(Points, 0) + :pts,
                        Total_Spent = :total_spent,
                        Tier = :tier
                    WHERE Membership_ID = :mid
                """), {
                    "pts": points,
                    "total_spent": new_total_spent,
                    "tier": new_tier,
                    "mid": membership.Membership_ID,
                })

        db.commit()

        return {
            "Sale_ID": f"S{str(sale_id).zfill(4)}",
            "Total_Amount": float(total),
        }

    except Exception:
        db.rollback()
        raise
