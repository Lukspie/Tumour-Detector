import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MODEL_WEIGHTS_PATH: str = "./weights/model.pth"
    MODEL_URL: str = ""          # Optional: HTTPS URL to download weights from
    DEVICE: str = "cpu"          # "cpu" or "cuda"
    MAX_IMAGE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    class Config:
        env_file = ".env"


settings = Settings()
