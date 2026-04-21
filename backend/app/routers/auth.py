from fastapi import APIRouter


router = APIRouter()

@router.get("/me")
def get_me():
    return{"id": "demo-user", "email": "demo@spendiq.com"}
