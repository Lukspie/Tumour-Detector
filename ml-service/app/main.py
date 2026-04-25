import logging
import os
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .model.classifier import BrainTumorClassifier
from .model.gradcam import GradCAM

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")
logger = logging.getLogger("ml-service")

_classifier: BrainTumorClassifier | None = None
_gradcam: GradCAM | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _classifier, _gradcam

    weights = settings.MODEL_WEIGHTS_PATH

    # Download weights from URL if they are missing and a URL is configured
    if settings.MODEL_URL and not os.path.exists(weights):
        logger.info("Downloading model weights from %s", settings.MODEL_URL)
        os.makedirs(os.path.dirname(weights) or ".", exist_ok=True)
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.get(settings.MODEL_URL, follow_redirects=True)
            resp.raise_for_status()
            with open(weights, "wb") as f:
                f.write(resp.content)
        logger.info("Weights saved to %s", weights)

    _classifier = BrainTumorClassifier(
        weights_path=weights if os.path.exists(weights) else None,
        device=settings.DEVICE,
    )
    _gradcam = GradCAM(_classifier.model, _classifier.grad_cam_target_layer)
    logger.info("ML service ready  |  demo_mode=%s  |  device=%s", _classifier.demo_mode, settings.DEVICE)

    yield  # app runs here


app = FastAPI(title="Brain Tumour ML Service", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "demo_mode": _classifier.demo_mode if _classifier else True,
        "device": settings.DEVICE,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if _classifier is None:
        raise HTTPException(status_code=503, detail="Model not initialised")

    image_bytes = await file.read()
    if len(image_bytes) > settings.MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit")

    result = _classifier.predict(image_bytes)

    gradcam_b64: str | None = None
    if not result["demo_mode"] and _gradcam is not None:
        try:
            tensor = _classifier.preprocess(image_bytes)
            cam = _gradcam.generate(tensor)
            gradcam_b64 = _gradcam.overlay(image_bytes, cam)
        except Exception as exc:
            logger.warning("Grad-CAM failed: %s", exc)

    return {**result, "gradcam_base64": gradcam_b64}
