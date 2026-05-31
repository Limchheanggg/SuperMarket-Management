from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.user import User

router = APIRouter()

def format_time(t) -> str:
    """Convert timedelta or time object to HH:MM string"""
    if t is None:
        return "00:00"
    if hasattr(t, 'seconds'):
        # timedelta
        total = int(t.total_seconds())
        h = (total % 86400) // 3600
        m = (total % 3600) // 60
        return f"{h:02d}:{m:02d}"
    # datetime.time object
    return str(t)[:5]

def shift_to_dict(r) -> dict:
    d = dict(r._mapping)
    d['start_time'] = format_time(d.get('start_time'))
    d['end_time']   = format_time(d.get('end_time'))
    if d.get('shift_date'):
        d['shift_date'] = str(d['shift_date'])
    return d

@router.get("/")
def get_all_shifts(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("""
            SELECT s.id, s.user_id, u.full_name, u.role,
                   s.shift_name, s.shift_date, s.start_time, s.end_time, s.status, s.note
            FROM Employee_Shift s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.shift_date DESC, s.start_time ASC
        """)).fetchall()
        return [shift_to_dict(r) for r in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
def get_user_shifts(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT s.id, s.user_id, u.full_name, u.role,
               s.shift_name, s.shift_date, s.start_time, s.end_time, s.status, s.note
        FROM Employee_Shift s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = :uid
        ORDER BY s.shift_date DESC
    """), {"uid": user_id}).fetchall()
    return [shift_to_dict(r) for r in result]

@router.post("/")
def create_shift(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.execute(text("""
        INSERT INTO Employee_Shift (user_id, shift_name, shift_date, start_time, end_time, status, note)
        VALUES (:uid, :sname, :sdate, :stime, :etime, :status, :note)
    """), {
        "uid":    data.get("user_id"),
        "sname":  data.get("shift_name", "Morning"),
        "sdate":  data.get("shift_date"),
        "stime":  data.get("start_time", "06:00"),
        "etime":  data.get("end_time", "14:00"),
        "status": data.get("status", "scheduled"),
        "note":   data.get("note", ""),
    })
    db.commit()
    return {"message": "Shift created successfully"}

@router.put("/{shift_id}")
def update_shift(shift_id: int, data: dict, db: Session = Depends(get_db)):
    db.execute(text("""
        UPDATE Employee_Shift
        SET shift_name=:sname, shift_date=:sdate, start_time=:stime,
            end_time=:etime, status=:status, note=:note
        WHERE id=:id
    """), {
        "id":     shift_id,
        "sname":  data.get("shift_name"),
        "sdate":  data.get("shift_date"),
        "stime":  data.get("start_time"),
        "etime":  data.get("end_time"),
        "status": data.get("status", "scheduled"),
        "note":   data.get("note", ""),
    })
    db.commit()
    return {"message": "Shift updated successfully"}

@router.delete("/{shift_id}")
def delete_shift(shift_id: int, db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM Employee_Shift WHERE id=:id"), {"id": shift_id})
    db.commit()
    return {"message": "Shift deleted"}
