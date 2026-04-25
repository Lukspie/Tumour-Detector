from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..db.mongodb import get_db
from ..models.prediction import HistoryItem, HistoryResponse

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    limit: int = Query(default=20, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    cursor = db.predictions.find(
        {},
        {"label": 1, "probability": 1, "confidence": 1, "filename": 1, "timestamp": 1},
    ).sort("timestamp", -1).limit(limit)

    items: list[HistoryItem] = []
    async for doc in cursor:
        items.append(HistoryItem(
            id=str(doc["_id"]),
            label=doc["label"],
            probability=doc["probability"],
            confidence=doc["confidence"],
            filename=doc.get("filename", "unknown"),
            timestamp=doc["timestamp"].isoformat(),
        ))

    total = await db.predictions.count_documents({})
    return HistoryResponse(predictions=items, total=total)
