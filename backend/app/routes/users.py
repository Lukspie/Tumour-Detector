import bcrypt
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..db.mongodb import get_client
from ..core.config import settings

router = APIRouter()

class Credentials(BaseModel):
    username: str
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

@router.post("/register")
async def register(credentials: Credentials):
    client = get_client()
    db = client[settings.MONGODB_DB]
    existing = await db.users.find_one({"username": credentials.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    result = await db.users.insert_one({
        "username": credentials.username,
        "password": hash_password(credentials.password),
    })
    return {"userId": str(result.inserted_id), "username": credentials.username}

@router.post("/login")
async def login(credentials: Credentials):
    client = get_client()
    db = client[settings.MONGODB_DB]
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"userId": str(user["_id"]), "username": user["username"]}


class PatientProfile(BaseModel):
    username: str
    is_patient: bool
    can_be_contacted: bool
    blog_post: Optional[str] = None
    age: Optional[int] = None


@router.get("/users/{user_id}/profile")
async def get_profile(user_id: str):
    client = get_client()
    db = client[settings.MONGODB_DB]
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id")
    user = await db.users.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "is_patient": user.get("is_patient", False),
        "can_be_contacted": user.get("can_be_contacted", False),
        "blog_post": user.get("blog_post", ""),
        "age": user.get("age", None),
    }


@router.put("/users/{user_id}/profile")
async def update_profile(user_id: str, profile: PatientProfile):
    client = get_client()
    db = client[settings.MONGODB_DB]
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id")
    result = await db.users.update_one(
        {"_id": oid},
        {"$set": {
            "is_patient": profile.is_patient,
            "can_be_contacted": profile.can_be_contacted,
            "blog_post": profile.blog_post,
            "age": profile.age,
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "ok"}