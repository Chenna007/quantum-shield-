from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import User, ScanResult, Alert
from services.scanner_service import scan_domain
from api.auth import get_current_user
import json

router = APIRouter()

PLAN_LIMITS = {
    "starter": 10,
    "professional": 100,
    "enterprise": 999999,
}

class ScanRequest(BaseModel):
    domain: str

@router.post("/scan")
async def scan(
    request: ScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check scan quota
    from datetime import datetime
    from sqlalchemy import func
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    scans_this_month = db.query(func.count(ScanResult.id)).filter(
        ScanResult.user_id == current_user.id,
        ScanResult.created_at >= month_start
    ).scalar()

    limit = PLAN_LIMITS.get(current_user.subscription_plan, 10)
    if scans_this_month >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Scan limit reached ({limit}/month). Upgrade your plan to continue."
        )

    # Run scan
    result = await scan_domain(request.domain)

    # Save to DB
    scan_record = ScanResult(
        user_id=current_user.id,
        domain=result["domain"],
        tls_version=result.get("tls_version"),
        cipher_suite=result.get("cipher_suite"),
        key_exchange=result.get("key_exchange"),
        cert_signature=result.get("cert_signature"),
        cert_expiry=result.get("cert_expiry"),
        cert_issuer=result.get("cert_issuer"),
        hsts_enabled=result.get("hsts_enabled", False),
        risk_level=result.get("risk_level", "UNKNOWN"),
        risk_score=result.get("risk_score", 0),
        recommendations=json.dumps(result.get("recommendations", [])),
        raw_details=json.dumps(result.get("details", [])),
    )
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    # Create alert for high risk findings
    if result.get("risk_level") in ["CRITICAL", "HIGH"]:
        alert = Alert(
            user_id=current_user.id,
            domain=result["domain"],
            alert_type=result["risk_level"],
            title=f"{result['risk_level']}: Quantum-Vulnerable Cryptography Detected",
            description=f"Domain {result['domain']} uses {result.get('cert_signature', 'unknown')} "
                       f"which is vulnerable to quantum attacks. Risk score: {result.get('risk_score')}/100",
        )
        db.add(alert)
        db.commit()

    result["scan_id"] = scan_record.id
    return result

@router.get("/history")
def scan_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20,
):
    scans = db.query(ScanResult).filter(
        ScanResult.user_id == current_user.id
    ).order_by(ScanResult.created_at.desc()).limit(limit).all()

    return [
        {
            "id": s.id,
            "domain": s.domain,
            "tls_version": s.tls_version,
            "cipher_suite": s.cipher_suite,
            "risk_level": s.risk_level,
            "risk_score": s.risk_score,
            "created_at": s.created_at,
        }
        for s in scans
    ]

@router.get("/{scan_id}")
def get_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = db.query(ScanResult).filter(
        ScanResult.id == scan_id,
        ScanResult.user_id == current_user.id,
    ).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    return {
        "id": scan.id,
        "domain": scan.domain,
        "tls_version": scan.tls_version,
        "cipher_suite": scan.cipher_suite,
        "key_exchange": scan.key_exchange,
        "cert_signature": scan.cert_signature,
        "cert_expiry": scan.cert_expiry,
        "cert_issuer": scan.cert_issuer,
        "hsts_enabled": scan.hsts_enabled,
        "risk_level": scan.risk_level,
        "risk_score": scan.risk_score,
        "recommendations": json.loads(scan.recommendations or "[]"),
        "details": json.loads(scan.raw_details or "[]"),
        "created_at": scan.created_at,
    }
