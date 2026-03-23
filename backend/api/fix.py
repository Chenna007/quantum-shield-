from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import FixRequest
from api.auth import get_current_user, User
from typing import Optional

router = APIRouter()

class FixRequestBody(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    domain: Optional[str] = None
    service_type: str  # consult | audit | migration
    message: Optional[str] = None

@router.post("/request")
def submit_fix_request(
    body: FixRequestBody,
    db: Session = Depends(get_db),
):
    fix_req = FixRequest(
        name=body.name,
        company=body.company,
        email=body.email,
        domain=body.domain,
        service_type=body.service_type,
        message=body.message,
    )
    db.add(fix_req)
    db.commit()
    db.refresh(fix_req)
    return {"message": "Fix request submitted", "id": fix_req.id, "status": fix_req.status}

@router.get("/my-requests")
def my_fix_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    requests = db.query(FixRequest).filter(
        FixRequest.user_id == current_user.id
    ).order_by(FixRequest.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "service_type": r.service_type,
            "domain": r.domain,
            "status": r.status,
            "created_at": r.created_at,
        }
        for r in requests
    ]
