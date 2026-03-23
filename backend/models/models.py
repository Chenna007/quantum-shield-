from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

class RiskLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    SAFE = "SAFE"

class SubscriptionPlan(str, enum.Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    company = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    subscription_plan = Column(String, default="starter")
    stripe_customer_id = Column(String)
    stripe_subscription_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    scans = relationship("ScanResult", back_populates="user")
    alerts = relationship("Alert", back_populates="user")

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    domain = Column(String, nullable=False, index=True)
    tls_version = Column(String)
    cipher_suite = Column(String)
    key_exchange = Column(String)
    cert_signature = Column(String)
    cert_expiry = Column(String)
    cert_issuer = Column(String)
    hsts_enabled = Column(Boolean, default=False)
    ocsp_stapling = Column(Boolean, default=False)
    risk_level = Column(String, default="MEDIUM")
    risk_score = Column(Integer, default=50)
    recommendations = Column(Text)  # JSON array
    raw_details = Column(Text)      # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scans")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    domain = Column(String)
    alert_type = Column(String, default="HIGH")
    title = Column(String, nullable=False)
    description = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    company = Column(String)
    email = Column(String, nullable=False)
    domain = Column(String)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FixRequest(Base):
    __tablename__ = "fix_requests"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    company = Column(String)
    email = Column(String, nullable=False)
    domain = Column(String)
    service_type = Column(String)  # consult, audit, migration
    message = Column(Text)
    status = Column(String, default="pending")  # pending, in_review, active, completed
    created_at = Column(DateTime, default=datetime.utcnow)
