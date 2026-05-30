from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.user import User

router = APIRouter()

def ensure_table(db):
    db.execute(text('''
        CREATE TABLE IF NOT EXISTS Membership (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            tier VARCHAR(20) DEFAULT "Bronze",
            points INT DEFAULT 0,
            total_spent FLOAT DEFAULT 0,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    '''))
    db.commit()

@router.get("/")
def get_memberships(db: Session = Depends(get_db)):
    ensure_table(db)
    result = db.execute(text('''
        SELECT m.id, m.user_id, u.full_name, u.email, u.phone,
               m.tier, m.points, m.total_spent, m.joined_at
        FROM Membership m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.points DESC
    ''')).fetchall()
    return [dict(r._mapping) for r in result]

@router.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    # Returns all users with role=customer not yet in membership
    ensure_table(db)
    result = db.execute(text('''
        SELECT u.id, u.full_name, u.email, u.phone
        FROM users u
        WHERE u.role = "customer"
        AND u.id NOT IN (SELECT user_id FROM Membership)
        ORDER BY u.full_name
    ''')).fetchall()
    return [dict(r._mapping) for r in result]

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    ensure_table(db)
    user_id = data.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing = db.execute(text("SELECT id FROM Membership WHERE user_id=:uid"), {"uid": user_id}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")
    db.execute(text('''
        INSERT INTO Membership (user_id, tier, points, total_spent)
        VALUES (:uid, "Bronze", 0, 0)
    '''), {"uid": user_id})
    db.commit()
    return {"message": "Membership registered"}

@router.put("/add-points/{member_id}")
def add_points(member_id: int, data: dict, db: Session = Depends(get_db)):
    ensure_table(db)
    points = data.get("points", 0)
    spent  = data.get("total_spent", 0)
    m = db.execute(text("SELECT * FROM Membership WHERE id=:id"), {"id": member_id}).fetchone()
    if not m:
        raise HTTPException(status_code=404, detail="Member not found")
    new_points = m.points + points
    new_spent  = m.total_spent + spent
    # Auto upgrade tier
    if new_spent >= 500:   tier = "Platinum"
    elif new_spent >= 200: tier = "Gold"
    elif new_spent >= 50:  tier = "Silver"
    else:                  tier = "Bronze"
    db.execute(text('''
        UPDATE Membership SET points=:p, total_spent=:s, tier=:t WHERE id=:id
    '''), {"p": new_points, "s": new_spent, "t": tier, "id": member_id})
    db.commit()
    return {"message": "Points updated", "tier": tier}

@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM Membership WHERE id=:id"), {"id": member_id})
    db.commit()
    return {"message": "Member removed"}
