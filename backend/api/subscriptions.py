from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import User
from api.auth import get_current_user
import stripe
import os

router = APIRouter()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

STRIPE_PRICES = {
    "starter": os.getenv("STRIPE_STARTER_PRICE_ID", "price_starter"),
    "professional": os.getenv("STRIPE_PROFESSIONAL_PRICE_ID", "price_professional"),
    "enterprise": os.getenv("STRIPE_ENTERPRISE_PRICE_ID", "price_enterprise"),
}

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

class CreateSubscriptionRequest(BaseModel):
    plan: str
    payment_method_id: str

class UpgradeRequest(BaseModel):
    new_plan: str

@router.post("/create")
def create_subscription(
    request: CreateSubscriptionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.plan not in STRIPE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid plan")

    try:
        # Create or retrieve Stripe customer
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.name,
                payment_method=request.payment_method_id,
                invoice_settings={"default_payment_method": request.payment_method_id},
            )
            current_user.stripe_customer_id = customer.id
            db.commit()
        
        # Create subscription
        subscription = stripe.Subscription.create(
            customer=current_user.stripe_customer_id,
            items=[{"price": STRIPE_PRICES[request.plan]}],
            payment_behavior="default_incomplete",
            expand=["latest_invoice.payment_intent"],
        )

        current_user.stripe_subscription_id = subscription.id
        current_user.subscription_plan = request.plan
        db.commit()

        return {
            "subscription_id": subscription.id,
            "client_secret": subscription.latest_invoice.payment_intent.client_secret,
            "status": subscription.status,
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.stripe_subscription_id:
        raise HTTPException(status_code=400, detail="No active subscription")

    try:
        stripe.Subscription.delete(current_user.stripe_subscription_id)
        current_user.stripe_subscription_id = None
        current_user.subscription_plan = "starter"
        db.commit()
        return {"message": "Subscription cancelled successfully"}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event["type"] == "customer.subscription.updated":
        sub = event["data"]["object"]
        user = db.query(User).filter(User.stripe_subscription_id == sub["id"]).first()
        if user:
            user.subscription_plan = sub.get("metadata", {}).get("plan", user.subscription_plan)
            db.commit()

    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        user = db.query(User).filter(User.stripe_subscription_id == sub["id"]).first()
        if user:
            user.stripe_subscription_id = None
            user.subscription_plan = "starter"
            db.commit()

    return {"received": True}

@router.get("/status")
def subscription_status(
    current_user: User = Depends(get_current_user),
):
    return {
        "plan": current_user.subscription_plan,
        "has_active_subscription": bool(current_user.stripe_subscription_id),
        "stripe_customer_id": current_user.stripe_customer_id,
    }
