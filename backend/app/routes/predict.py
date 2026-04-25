import logging
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.config import settings
from ..db.mongodb import get_db
from ..models.prediction import PredictionResponse

logger = logging.getLogger("backend.predict")
router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}


def _make_explanation(label: str, probability: float) -> str:
    pct = round(probability * 100, 1)
    if label == "tumor":
        if probability >= 0.80:
            return (
                f"Strong indicators of a brain tumour were detected ({pct}% probability). "
                "The highlighted regions in the heatmap show areas the model found most "
                "significant. This is an automated screening tool — always consult a "
                "certified radiologist for diagnosis."
            )
        return (
            f"Possible tumour indicators detected ({pct}% probability). "
            "The result is borderline; expert medical evaluation is essential."
        )
    conf_pct = round((1 - probability) * 100, 1)
    return (
        f"No significant tumour indicators were detected ({conf_pct}% confidence). "
        "This tool does not replace professional medical diagnosis — "
        "regular check-ups are recommended."
    )


@router.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=422, detail="File must be JPEG, PNG, WebP or BMP")

    image_bytes = await file.read()
    if len(image_bytes) > settings.MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit")

    # ── Forward to ML service ────────────────────────────────────────────────
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(
                f"{settings.ML_SERVICE_URL}/predict",
                files={"file": (file.filename, image_bytes, file.content_type)},
            )
            resp.raise_for_status()
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="ML service is unreachable")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=502, detail=f"ML service error: {exc.response.text}")
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="ML service timed out")

    ml = resp.json()

    explanation = _make_explanation(ml["label"], ml["probability"])
    now = datetime.now(timezone.utc)

    doc = {
        "label":          ml["label"],
        "probability":    ml["probability"],
        "confidence":     ml["confidence"],
        "gradcam_base64": ml.get("gradcam_base64"),
        "explanation":    explanation,
        "demo_mode":      ml.get("demo_mode", False),
        "filename":       file.filename or "unknown",
        "timestamp":      now,
    }

    result = await db.predictions.insert_one(doc)
    logger.info("Saved prediction %s label=%s prob=%.4f", result.inserted_id, ml["label"], ml["probability"])

    return PredictionResponse(
        id=str(result.inserted_id),
        timestamp=now.isoformat(),
        **{k: v for k, v in doc.items() if k != "timestamp"},
    )
