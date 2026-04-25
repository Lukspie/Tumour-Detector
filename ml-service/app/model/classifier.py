import io
import random
import logging

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

logger = logging.getLogger("ml-service.classifier")

INPUT_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


class BrainTumorClassifier:
    def __init__(self, weights_path: str | None = None, device: str = "cpu"):
        self.device = torch.device(device)
        self.model = self._build_model()
        self.demo_mode = True

        if weights_path:
            try:
                state = torch.load(weights_path, map_location=self.device, weights_only=True)
                self.model.load_state_dict(state)
                self.demo_mode = False
                logger.info("Model weights loaded from %s", weights_path)
            except FileNotFoundError:
                logger.warning("Weights file not found at %s — running in DEMO MODE", weights_path)
            except Exception as exc:
                logger.error("Failed to load weights: %s — running in DEMO MODE", exc)

        self.model.eval()

        self._transform = transforms.Compose([
            transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=MEAN, std=STD),
        ])

    def _build_model(self) -> nn.Module:
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, 1)
        return model.to(self.device)

    @property
    def grad_cam_target_layer(self) -> nn.Module:
        # Last feature block before global average pooling — outputs [B, 1280, 7, 7]
        return self.model.features[-1]

    def preprocess(self, image_bytes: bytes) -> torch.Tensor:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return self._transform(image).unsqueeze(0).to(self.device)

    def predict(self, image_bytes: bytes) -> dict:
        if self.demo_mode:
            prob = round(random.uniform(0.25, 0.95), 4)
            label = "tumor" if prob >= 0.5 else "no_tumor"
            confidence = prob if label == "tumor" else round(1 - prob, 4)
            return {
                "probability": prob,
                "label": label,
                "confidence": confidence,
                "demo_mode": True,
            }

        tensor = self.preprocess(image_bytes)
        with torch.no_grad():
            logit = self.model(tensor)
        prob = float(torch.sigmoid(logit).item())
        label = "tumor" if prob >= 0.5 else "no_tumor"
        confidence = prob if label == "tumor" else 1.0 - prob

        return {
            "probability": round(prob, 4),
            "label": label,
            "confidence": round(confidence, 4),
            "demo_mode": False,
        }
