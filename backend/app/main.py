import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.mongodb import close_client
from .routes.history import router as history_router
from .routes.predict import router as predict_router

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await close_client()


app = FastAPI(
    title="Brain Tumour Detector API",
    description="Backend API that orchestrates the ML service and persists results.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, tags=["Prediction"])
app.include_router(history_router, tags=["History"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
