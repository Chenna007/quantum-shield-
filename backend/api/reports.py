from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import ScanResult
from api.auth import get_current_user, User
import json
import csv
import io
from fpdf import FPDF

router = APIRouter()

@router.get("/")
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
):
    scans = db.query(ScanResult).filter(
        ScanResult.user_id == current_user.id
    ).order_by(ScanResult.created_at.desc()).offset(offset).limit(limit).all()

    total = db.query(ScanResult).filter(ScanResult.user_id == current_user.id).count()

    return {
        "total": total,
        "reports": [
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
    }

@router.get("/{scan_id}/export/csv")
def export_csv(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = db.query(ScanResult).filter(
        ScanResult.id == scan_id, ScanResult.user_id == current_user.id
    ).first()
    if not scan:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scan not found")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Field", "Value"])
    writer.writerow(["Domain", scan.domain])
    writer.writerow(["TLS Version", scan.tls_version])
    writer.writerow(["Cipher Suite", scan.cipher_suite])
    writer.writerow(["Key Exchange", scan.key_exchange])
    writer.writerow(["Certificate Signature", scan.cert_signature])
    writer.writerow(["Certificate Expiry", scan.cert_expiry])
    writer.writerow(["Risk Level", scan.risk_level])
    writer.writerow(["Risk Score", scan.risk_score])
    writer.writerow(["Scan Date", scan.created_at])

    recommendations = json.loads(scan.recommendations or "[]")
    for i, rec in enumerate(recommendations, 1):
        writer.writerow([f"Recommendation {i}", rec])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=quantumshield-{scan.domain}-report.csv"}
    )

@router.get("/{scan_id}/export/pdf")
def export_pdf(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = db.query(ScanResult).filter(
        ScanResult.id == scan_id, ScanResult.user_id == current_user.id
    ).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    pdf = FPDF()
    pdf.add_page()
    
    # Fonts
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "QuantumShield Security Report", align="C", ln=True)
    
    pdf.set_font("helvetica", "I", 12)
    pdf.cell(0, 10, f"Domain: {scan.domain}", align="C", ln=True)
    pdf.cell(0, 10, f"Date: {scan.created_at.strftime('%Y-%m-%d %H:%M')}", align="C", ln=True)
    pdf.ln(10)
    
    # Executive Summary
    pdf.set_font("helvetica", "B", 16)
    pdf.set_fill_color(220, 230, 240)
    pdf.cell(0, 10, " Executive Summary", ln=True, fill=True)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(50, 10, "Risk Level:")
    pdf.set_font("helvetica", "", 12)
    pdf.cell(50, 10, str(scan.risk_level))
    pdf.ln(8)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(50, 10, "Risk Score:")
    pdf.set_font("helvetica", "", 12)
    pdf.cell(50, 10, f"{scan.risk_score} / 100")
    pdf.ln(15)
    
    # Technical Details
    pdf.set_font("helvetica", "B", 16)
    pdf.cell(0, 10, " Technical Configuration", ln=True, fill=True)
    pdf.ln(5)
    
    details = [
        ("TLS Version", scan.tls_version),
        ("Cipher Suite", scan.cipher_suite),
        ("Key Exchange", scan.key_exchange),
        ("Certificate Signature", scan.cert_signature),
        ("Certificate Expiry", scan.cert_expiry),
        ("Certificate Issuer", scan.cert_issuer),
        ("HSTS Enabled", "Yes" if scan.hsts_enabled else "No"),
    ]
    
    for label, val in details:
        pdf.set_font("helvetica", "B", 12)
        pdf.cell(60, 10, f"{label}:")
        pdf.set_font("helvetica", "", 12)
        pdf.cell(100, 10, str(val))
        pdf.ln(8)
        
    pdf.ln(10)
    
    # Recommendations
    pdf.set_font("helvetica", "B", 16)
    pdf.cell(0, 10, " Security Recommendations", ln=True, fill=True)
    pdf.ln(5)
    
    recommendations = json.loads(scan.recommendations or "[]")
    if not recommendations:
        pdf.set_font("helvetica", "I", 12)
        pdf.cell(0, 10, "No specific recommendations at this time.", ln=True)
    else:
        pdf.set_font("helvetica", "", 12)
        for idx, rec in enumerate(recommendations, 1):
            pdf.multi_cell(0, 8, f"{idx}. {rec}", ln=True)
            pdf.ln(2)

    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=quantumshield-{scan.domain}.pdf"}
    )

@router.get("/stats")
def report_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from sqlalchemy import func
    from datetime import datetime

    total = db.query(func.count(ScanResult.id)).filter(ScanResult.user_id == current_user.id).scalar()
    
    by_risk = db.query(ScanResult.risk_level, func.count(ScanResult.id)).filter(
        ScanResult.user_id == current_user.id
    ).group_by(ScanResult.risk_level).all()

    avg_score = db.query(func.avg(ScanResult.risk_score)).filter(ScanResult.user_id == current_user.id).scalar()

    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    this_month = db.query(func.count(ScanResult.id)).filter(
        ScanResult.user_id == current_user.id,
        ScanResult.created_at >= month_start
    ).scalar()

    return {
        "total_scans": total,
        "this_month": this_month,
        "avg_risk_score": round(avg_score or 0, 1),
        "by_risk_level": {r[0]: r[1] for r in by_risk},
    }
