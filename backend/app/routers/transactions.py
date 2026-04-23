from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.csv_parser import parse_csv
from app.services.classifier import predict_category
from app.models import Transaction
import uuid


router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile,db: Session = Depends(get_db)):
    content = await file.read()
    transactions = parse_csv(content)

    saved = []
    for t in transactions:
        category = predict_category(t["description"])
        db_transaction = Transaction(
            id=str(uuid.uuid4()),
            user_id="demo-user",
            date=t["date"],
            description=t["description"],
            amount=t["amount"],
            category=category,
        )
        db.add(db_transaction)
        saved.append(db_transaction)

    db.commit()

    return {"uploaded": len(saved), "transactions": len(saved)}

@router.get("/")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()
