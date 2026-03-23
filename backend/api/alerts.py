from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Alert
from api.auth import get_current_user, User

router = APIRouter()

@router.get("/")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    unread_only: bool = False,
):
    query = db.query(Alert).filter(Alert.user_id == current_user.id)
    if unread_only:
        query = query.filter(Alert.is_read == False)
    alerts = query.order_by(Alert.created_at.desc()).limit(50).all()
    return [
        {
            "id": a.id,
            "domain": a.domain,
            "type": a.alert_type,
            "title": a.title,
            "description": a.description,
            "is_read": a.is_read,
            "created_at": a.created_at,
        }
        for a in alerts
    ]

@router.patch("/{alert_id}/read")
def mark_read(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.patch("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Alert).filter(Alert.user_id == current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "All alerts marked as read"}
