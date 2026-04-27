from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction
from collections import defaultdict

router = APIRouter()

@router.get("/spending-by-category")
def spending_by_category(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()

    category_totals = defaultdict(float)
    for transaction in transactions:
        category_totals[transaction.category] += transaction.amount

    return dict(category_totals)
