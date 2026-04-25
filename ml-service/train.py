"""
Brain Tumour Classifier — Training Script
==========================================
Dataset: Kaggle "Brain MRI Images for Brain Tumor Detection"
  https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection

Expected directory layout after download:
  data/
    yes/   <- MRI scans containing a tumour
    no/    <- MRI scans with no tumour

Usage:
  python train.py --data-dir ./data --epochs 20 --batch-size 32
  python train.py --data-dir ./data --epochs 5  --batch-size 16   # quick test

The best model weights are saved to ./weights/model.pth.
Copy that file to the ml-service root before building the Docker image.
"""

import argparse
import os
import time

import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms


# ──────────────────────────────────────────────────────────────────────────────
# Model
# ──────────────────────────────────────────────────────────────────────────────

def build_model(device: torch.device) -> nn.Module:
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, 1)   # binary output
    return model.to(device)


# ──────────────────────────────────────────────────────────────────────────────
# Data
# ──────────────────────────────────────────────────────────────────────────────

TRAIN_TF = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(p=0.1),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

VAL_TF = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def get_loaders(data_dir: str, batch_size: int, val_split: float = 0.2):
    full = datasets.ImageFolder(data_dir, transform=VAL_TF)
    print(f"Classes: {full.class_to_idx}")          # e.g. {'no': 0, 'yes': 1}
    n_val = int(len(full) * val_split)
    n_train = len(full) - n_val
    train_set, val_set = random_split(full, [n_train, n_val])

    # Apply augmentation only to the training split
    train_set.dataset = datasets.ImageFolder(data_dir, transform=TRAIN_TF)

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True,
                              num_workers=min(4, os.cpu_count() or 1), pin_memory=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False,
                            num_workers=min(4, os.cpu_count() or 1), pin_memory=True)
    return train_loader, val_loader


# ──────────────────────────────────────────────────────────────────────────────
# Train / eval loops
# ──────────────────────────────────────────────────────────────────────────────

def run_epoch(model, loader, criterion, optimizer, device, training: bool):
    model.train(training)
    total_loss = correct = total = 0
    ctx = torch.enable_grad() if training else torch.no_grad()
    with ctx:
        for images, labels in loader:
            images = images.to(device)
            labels = labels.float().unsqueeze(1).to(device)
            if training:
                optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            if training:
                loss.backward()
                optimizer.step()
            total_loss += loss.item()
            preds = (torch.sigmoid(outputs) >= 0.5).float()
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    return total_loss / len(loader), correct / total


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Train brain tumour classifier")
    parser.add_argument("--data-dir",   default="./data",            help="Root of yes/no dataset")
    parser.add_argument("--epochs",     type=int,   default=20)
    parser.add_argument("--batch-size", type=int,   default=32)
    parser.add_argument("--lr",         type=float, default=1e-4)
    parser.add_argument("--output",     default="./weights/model.pth")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    train_loader, val_loader = get_loaders(args.data_dir, args.batch_size)
    print(f"Train: {len(train_loader.dataset)} samples  |  Val: {len(val_loader.dataset)} samples")

    model = build_model(device)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=args.epochs)

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    best_val_acc = 0.0

    for epoch in range(1, args.epochs + 1):
        t0 = time.time()
        tr_loss, tr_acc = run_epoch(model, train_loader, criterion, optimizer, device, training=True)
        vl_loss, vl_acc = run_epoch(model, val_loader, criterion, optimizer, device, training=False)
        scheduler.step()
        elapsed = time.time() - t0

        print(
            f"Epoch {epoch:02d}/{args.epochs}  "
            f"train_loss={tr_loss:.4f} train_acc={tr_acc:.4f}  "
            f"val_loss={vl_loss:.4f} val_acc={vl_acc:.4f}  "
            f"({elapsed:.1f}s)"
        )

        if vl_acc > best_val_acc:
            best_val_acc = vl_acc
            torch.save(model.state_dict(), args.output)
            print(f"  ✓ Saved best model  val_acc={vl_acc:.4f}")

    print(f"\nDone. Best val accuracy: {best_val_acc:.4f}  →  {args.output}")


if __name__ == "__main__":
    main()
