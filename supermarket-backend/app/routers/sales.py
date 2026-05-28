from fastapi import APIRouter
from datetime import datetime
import random

router = APIRouter()

MOCK_SALES = [
    {"Sale_ID":"S001","date":"2025-05-28","Customer":"Lyveng C.","cashier":"Ana R.","items":7,"Total_Amount":34.62,"Payment_Method":"Card","status":"Completed"},
    {"Sale_ID":"S002","date":"2025-05-28","Customer":"Limchheang K.","cashier":"Bora S.","items":3,"Total_Amount":12.45,"Payment_Method":"Cash","status":"Completed"},
    {"Sale_ID":"S003","date":"2025-05-28","Customer":"Hengveasna H.","cashier":"Ana R.","items":11,"Total_Amount":56.30,"Payment_Method":"Card","status":"Completed"},
    {"Sale_ID":"S004","date":"2025-05-27","Customer":"Walk-in","cashier":"Kemal T.","items":5,"Total_Amount":21.80,"Payment_Method":"ABA","status":"Completed"},
    {"Sale_ID":"S005","date":"2025-05-27","Customer":"Walk-in","cashier":"Bora S.","items":2,"Total_Amount":9.98,"Payment_Method":"Cash","status":"Completed"},
    {"Sale_ID":"S006","date":"2025-05-26","Customer":"Lyveng C.","cashier":"Ana R.","items":4,"Total_Amount":28.50,"Payment_Method":"Card","status":"Completed"},
]

@router.get("/")
def get_sales():
    return MOCK_SALES

@router.get("/reports/summary")
def get_summary():
    total = sum(s["Total_Amount"] for s in MOCK_SALES)
    today = datetime.now().strftime("%Y-%m-%d")
    today_sales = [s for s in MOCK_SALES if s["date"] == today]
    monthly = sum(s["Total_Amount"] for s in MOCK_SALES)
    return {
        "total_revenue": total,
        "monthly_revenue": monthly,
        "monthly_sales": len(MOCK_SALES),
        "yearly_revenue": monthly * 12,
        "yearly_sales": len(MOCK_SALES) * 12,
        "total_transactions": len(MOCK_SALES),
        "average_transaction": total / len(MOCK_SALES),
        "best_selling_products": [],
        "by_method": {
            "Card": sum(s["Total_Amount"] for s in MOCK_SALES if s["Payment_Method"]=="Card"),
            "Cash": sum(s["Total_Amount"] for s in MOCK_SALES if s["Payment_Method"]=="Cash"),
            "ABA":  sum(s["Total_Amount"] for s in MOCK_SALES if s["Payment_Method"]=="ABA"),
        }
    }

@router.get("/reports/daily")
def get_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    today_sales = [s for s in MOCK_SALES if s["date"] == today]
    total = sum(s["Total_Amount"] for s in today_sales)
    return {
        "date": today,
        "total_revenue": total,
        "total_sales": len(today_sales),
        "avg_transaction": total / len(today_sales) if today_sales else 0,
        "sales": today_sales
    }

@router.post("/")
def create_sale(data: dict):
    sale = {
        "Sale_ID": f"S{random.randint(100,999)}",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "Customer": data.get("customer", "Walk-in"),
        "cashier": data.get("cashier", "Staff"),
        "items": len(data.get("items", [])),
        "Total_Amount": data.get("total", 0),
        "Payment_Method": data.get("payment_method", "Cash"),
        "status": "Completed"
    }
    MOCK_SALES.append(sale)
    return sale
