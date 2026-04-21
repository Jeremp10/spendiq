from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import transactions, insights, auth

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Connect the routers
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(insights.router)


@app.get("/")
def root():
    return {"status": "running"}
