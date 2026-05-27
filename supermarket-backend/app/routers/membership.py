from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.dependencies import require_admin, get_current_user
from ..models.sales import Membership
from ..models.customer import Customer as CustomerModel
from ..models.user import User as UserModel

router = APIRouter()

def get_tier(points: int) -> str:
    if points >= 5000: return "Platinum"
    if points >= 2000: return "Gold"
    if points >= 500: return "Silver"
    return "Bronze"

@router.get("/")
def get_all_memberships(db: Session = Depends(get_db), _=Depends(require_admin)):
    memberships = db.query(Membership).all()
    result = []
    for m in memberships:
        c = db.query(CustomerModel).filter(CustomerModel.Customer_ID == m.Customer_ID).first()
        result.append({
            "Membership_ID": m.Membership_ID,
            "Customer_ID": m.Customer_ID,
            "Customer_Name": f"{c.First_Name} {c.Last_Name}" if c else "Unknown",
            "Tier": m.Tier,
            "Points": m.Points,
            "Total_Spent": m.Total_Spent,
            "Joined_At": m.Joined_At
        })
    return result

@router.post("/register")
def register_membership(data: dict, db: Session = Depends(get_db), _=Depends(require_admin)):
    customer_id = data.get("customer_id")
    customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if db.query(Membership).filter(Membership.Customer_ID == customer_id).first():
        raise HTTPException(status_code=400, detail="Customer already has membership")
    membership = Membership(Customer_ID=customer_id, Tier="Bronze", Points=0, Total_Spent=0)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership

@router.post("/redeem")
def redeem_points(data: dict, db: Session = Depends(get_db)):
    customer_id = data.get("customer_id")
    points_to_redeem = data.get("points", 0)
    membership = db.query(Membership).filter(Membership.Customer_ID == customer_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    if membership.Points < points_to_redeem:
        raise HTTPException(status_code=400, detail="Insufficient points")
    membership.Points -= points_to_redeem
    discount_value = round(points_to_redeem * 0.01, 2)
    db.commit()
    return {"message": "Points redeemed", "discount": discount_value, "remaining_points": membership.Points}

@router.get("/customer/{customer_id}")
def get_customer_membership(customer_id: int, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.Customer_ID == customer_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="No membership found")
    customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == customer_id).first()
    return {
        "Customer_Name": f"{customer.First_Name} {customer.Last_Name}" if customer else "Unknown",
        "Tier": membership.Tier,
        "Points": membership.Points,
        "Total_Spent": membership.Total_Spent,
        "Joined_At": membership.Joined_At
    }

@router.put("/add-points/{customer_id}")
def add_points(customer_id: int, data: dict, db: Session = Depends(get_db), _=Depends(require_admin)):
    membership = db.query(Membership).filter(Membership.Customer_ID == customer_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    membership.Points += data.get("points", 0)
    membership.Total_Spent += data.get("amount_spent", 0)
    membership.Tier = get_tier(membership.Points)
    db.commit()
    return {"Points": membership.Points, "Tier": membership.Tier}