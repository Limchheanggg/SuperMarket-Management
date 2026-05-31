from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter()

@router.get("/")
def get_memberships(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT m.Membership_ID as id, m.Customer_ID,
               c.First_Name, c.Last_Name,
               CONCAT(c.First_Name, ' ', c.Last_Name) as full_name,
               m.Tier as tier, m.Points as points,
               m.Total_Spent as total_spent, m.Joined_At as joined_at
        FROM Membership m
        JOIN Customer c ON c.Customer_ID = m.Customer_ID
        ORDER BY m.Points DESC
    """)).fetchall()
    return [dict(r._mapping) for r in result]

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    customer_id = data.get("customer_id")
    if not customer_id:
        raise HTTPException(status_code=400, detail="customer_id required")
    existing = db.execute(text(
        "SELECT Membership_ID FROM Membership WHERE Customer_ID=:cid"),
        {"cid": customer_id}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")
    db.execute(text("""
        INSERT INTO Membership (Customer_ID, Tier, Points, Total_Spent, Joined_At)
        VALUES (:cid, 'Bronze', 0, 0, NOW())
    """), {"cid": customer_id})
    db.commit()
    return {"message": "Membership registered"}

@router.put("/add-points/{member_id}")
def add_points(member_id: int, data: dict, db: Session = Depends(get_db)):
    points = data.get("points", 0)
    spent  = data.get("total_spent", 0)
    m = db.execute(text(
        "SELECT * FROM Membership WHERE Membership_ID=:id"),
        {"id": member_id}).fetchone()
    if not m:
        raise HTTPException(status_code=404, detail="Member not found")
    new_points = m.Points + points
    new_spent  = m.Total_Spent + spent
    if new_spent >= 500:   tier = "Platinum"
    elif new_spent >= 200: tier = "Gold"
    elif new_spent >= 50:  tier = "Silver"
    else:                  tier = "Bronze"
    db.execute(text("""
        UPDATE Membership SET Points=:p, Total_Spent=:s, Tier=:t
        WHERE Membership_ID=:id
    """), {"p": new_points, "s": new_spent, "t": tier, "id": member_id})
    db.commit()
    return {"message": "Points updated", "tier": tier}

@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM Membership WHERE Membership_ID=:id"), {"id": member_id})
    db.commit()
    return {"message": "Member removed"}

@router.get("/customers")
def get_unregistered_customers(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT c.Customer_ID as id,
               CONCAT(c.First_Name, ' ', c.Last_Name) as full_name,
               c.Loyalty_Points
        FROM Customer c
        WHERE c.Customer_ID NOT IN (SELECT Customer_ID FROM Membership)
        ORDER BY c.First_Name
    """)).fetchall()
    return [dict(r._mapping) for r in result]
