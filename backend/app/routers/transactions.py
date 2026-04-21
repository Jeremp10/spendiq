from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile,db: Session = Depends(get_db)):
    return {"filename": file.filename}

@router.get("/")
def get_transactions(db: Session = Depends(get_db)):
    pass
