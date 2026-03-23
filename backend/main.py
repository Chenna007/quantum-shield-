from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, scanner, reports, alerts, subscriptions, contact, fix

app = FastAPI(
    title="QuantumShield API",
    version="1.0.0",
    description="Quantum cryptography risk assessment API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://quantumshield.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(scanner.router, prefix="/api/scanner", tags=["scanner"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(fix.router, prefix="/api/fix", tags=["fix"])

@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}
