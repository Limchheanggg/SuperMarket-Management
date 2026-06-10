from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from datetime import date

router = APIRouter()

@router.get("/")
def get_coupons(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM Coupon ORDER BY Tier_Required, Discount_Value DESC")).fetchall()
    return [dict(r._mapping) for r in rows]

@router.get("/active")
def get_active_coupons(db: Session = Depends(get_db)):
    today = date.today()
    rows = db.execute(text("""
        SELECT * FROM Coupon
        WHERE Is_Active=1 AND Expiry_Date >= :today AND Uses_Count < Uses_Limit
        ORDER BY Discount_Value DESC
    """), {"today": today}).fetchall()
    return [dict(r._mapping) for r in rows]

@router.post("/")
def create_coupon(data: dict, db: Session = Depends(get_db)):
    existing = db.execute(text("SELECT Coupon_ID FROM Coupon WHERE Code=:code"),
                          {"code": data.get("Code","").upper()}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    db.execute(text("""
        INSERT INTO Coupon (Code,Description,Discount_Type,Discount_Value,
        Min_Purchase,Tier_Required,Uses_Limit,Expiry_Date,Is_Active)
        VALUES (:code,:desc,:dtype,:dval,:minp,:tier,:uses,:expiry,:active)
    """), {
        "code": data.get("Code","").upper(),
        "desc": data.get("Description",""),
        "dtype": data.get("Discount_Type","percentage"),
        "dval": data.get("Discount_Value",10),
        "minp": data.get("Min_Purchase",0),
        "tier": data.get("Tier_Required","Bronze"),
        "uses": data.get("Uses_Limit",100),
        "expiry": data.get("Expiry_Date"),
        "active": 1,
    })
    db.commit()
    return {"message": "Coupon created"}

@router.put("/{coupon_id}")
def update_coupon(coupon_id: int, data: dict, db: Session = Depends(get_db)):
    db.execute(text("""
        UPDATE Coupon SET Description=:desc, Discount_Type=:dtype, Discount_Value=:dval,
        Min_Purchase=:minp, Tier_Required=:tier, Uses_Limit=:uses,
        Expiry_Date=:expiry, Is_Active=:active
        WHERE Coupon_ID=:id
    """), {
        "id": coupon_id,
        "desc": data.get("Description",""),
        "dtype": data.get("Discount_Type","percentage"),
        "dval": data.get("Discount_Value",10),
        "minp": data.get("Min_Purchase",0),
        "tier": data.get("Tier_Required","Bronze"),
        "uses": data.get("Uses_Limit",100),
        "expiry": data.get("Expiry_Date"),
        "active": data.get("Is_Active",1),
    })
    db.commit()
    return {"message": "Coupon updated"}

@router.delete("/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM Coupon WHERE Coupon_ID=:id"), {"id": coupon_id})
    db.commit()
    return {"message": "Coupon deleted"}

@router.post("/validate")
def validate_coupon(data: dict, db: Session = Depends(get_db)):
    code = data.get("code","").upper()
    total = float(data.get("total",0))
    tier = data.get("tier","Bronze")
    today = date.today()
    TIER_ORDER = {"Bronze":0,"Silver":1,"Gold":2,"Platinum":3}
    coupon = db.execute(text("SELECT * FROM Coupon WHERE Code=:code AND Is_Active=1"),
                        {"code": code}).fetchone()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    if coupon.Expiry_Date < today:
        raise HTTPException(status_code=400, detail="Coupon has expired")
    if coupon.Uses_Count >= coupon.Uses_Limit:
        raise HTTPException(status_code=400, detail=f"Coupon limit reached ({coupon.Uses_Count}/{coupon.Uses_Limit} uses)")
    if total < coupon.Min_Purchase:
        raise HTTPException(status_code=400, detail=f"Minimum purchase ${coupon.Min_Purchase:.2f} required")
    if tier == "None" or tier is None:
        raise HTTPException(status_code=400, detail="Membership required to use coupons. Join our membership program first!")
    if TIER_ORDER.get(tier,0) < TIER_ORDER.get(coupon.Tier_Required,0):
        raise HTTPException(status_code=400, detail=f"{coupon.Tier_Required} membership required. Your tier: {tier}")
    discount = round(total * coupon.Discount_Value/100, 2) if coupon.Discount_Type=='percentage' \
               else min(float(coupon.Discount_Value), total)
    return {
        "valid": True, "code": code,
        "description": coupon.Description,
        "discount_type": coupon.Discount_Type,
        "discount_value": coupon.Discount_Value,
        "discount_amount": discount,
        "final_total": round(total - discount, 2),
    }
