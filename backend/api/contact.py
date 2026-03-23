from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import ContactSubmission
import smtplib
from email.mime.text import MIMEText
import os

router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@quantumshield.io")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")

class ContactRequest(BaseModel):
    name: str
    company: str | None = None
    email: EmailStr
    domain: str | None = None
    message: str

def send_notification_email(contact: ContactRequest):
    """Send email notification to admin (runs in background)."""
    if not SMTP_USER:
        return  # Skip if not configured

    try:
        body = f"""
New Contact Form Submission - QuantumShield

Name: {contact.name}
Company: {contact.company or 'N/A'}
Email: {contact.email}
Domain: {contact.domain or 'N/A'}

Message:
{contact.message}
        """
        msg = MIMEText(body)
        msg["Subject"] = f"QuantumShield Contact: {contact.name} from {contact.company or 'Unknown'}"
        msg["From"] = SMTP_USER
        msg["To"] = ADMIN_EMAIL

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/submit")
def submit_contact(
    request: ContactRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    submission = ContactSubmission(
        name=request.name,
        company=request.company,
        email=request.email,
        domain=request.domain,
        message=request.message,
    )
    db.add(submission)
    db.commit()

    background_tasks.add_task(send_notification_email, request)

    return {"message": "Contact form submitted successfully", "id": submission.id}
