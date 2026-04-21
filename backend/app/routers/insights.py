from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/spending-by-category")
def spending_by_category(db: Session = Depends(get_db)):
    pass
