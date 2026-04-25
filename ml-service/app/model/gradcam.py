import io
import base64
import logging

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image

logger = logging.getLogger("ml-service.gradcam")


class GradCAM:
    """Grad-CAM visualisation for a single target layer."""

    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self._activations: torch.Tensor | None = None
        self._gradients: torch.Tensor | None = None

        target_layer.register_forward_hook(self._fwd_hook)
        target_layer.register_full_backward_hook(self._bwd_hook)

    def _fwd_hook(self, _module, _inp, output):
        self._activations = output.detach()

    def _bwd_hook(self, _module, _grad_inp, grad_output):
        self._gradients = grad_output[0].detach()

    def generate(self, input_tensor: torch.Tensor) -> np.ndarray:
        """Return normalised CAM heatmap as float32 array in [0, 1]."""
        self.model.zero_grad()
        with torch.enable_grad():
            # input_tensor must have requires_grad=True for backward to work
            inp = input_tensor.clone().requires_grad_(True)
            output = self.model(inp)
            output.backward()

        # Global-average-pool the gradients → channel weights
        weights = self._gradients.mean(dim=[2, 3], keepdim=True)   # [1, C, 1, 1]
        cam = (weights * self._activations).sum(dim=1).squeeze()    # [H, W]
        cam = F.relu(torch.from_numpy(cam.cpu().numpy())).numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        return cam.astype(np.float32)

    def overlay(self, image_bytes: bytes, cam: np.ndarray, alpha: float = 0.45) -> str:
        """Blend Grad-CAM heatmap onto the original image; return base64 JPEG."""
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        image_np = np.array(image)

        cam_u8 = np.uint8(255 * cv2.resize(cam, (224, 224)))
        heatmap = cv2.applyColorMap(cam_u8, cv2.COLORMAP_JET)
        heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        blended = np.clip(
            (1 - alpha) * image_np + alpha * heatmap_rgb, 0, 255
        ).astype(np.uint8)

        _, buf = cv2.imencode(".jpg", cv2.cvtColor(blended, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 88])
        return base64.b64encode(buf).decode()
