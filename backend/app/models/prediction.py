from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    id: str
    label: Literal["tumor", "no_tumor"]
    probability: float = Field(..., ge=0, le=1, description="P(tumour)")
    confidence: float = Field(..., ge=0, le=1)
    gradcam_base64: str | None = None
    explanation: str
    demo_mode: bool
    filename: str
    timestamp: str


class HistoryItem(BaseModel):
    id: str
    label: Literal["tumor", "no_tumor"]
    probability: float
    confidence: float
    filename: str
    timestamp: str


class HistoryResponse(BaseModel):
    predictions: list[HistoryItem]
    total: int
