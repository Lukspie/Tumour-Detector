from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..db.mongodb import get_client
from ..core.config import settings

router = APIRouter()

class Credentials(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(credentials: Credentials):
    client = get_client()
    db = client[settings.MONGODB_DB]
    existing = await db.users.find_one({"username": credentials.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    result = await db.users.insert_one({
        "username": credentials.username,
        "password": credentials.password,  
    })
    return {"userId": str(result.inserted_id), "username": credentials.username}

@router.post("/login")
async def login(credentials: Credentials):
    client = get_client()
    db = client[settings.MONGODB_DB]
    user = await db.users.find_one({
        "username": credentials.username,
        "password": credentials.password,
    })
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"userId": str(user["_id"]), "username": user["username"]}