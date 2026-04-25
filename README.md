# Brain Tumour Detector

Cloud-based MRI brain tumour classification using EfficientNet-B0 and Grad-CAM.

## Architecture

| Service | Technology | Cloud Host |
|---|---|---|
| Frontend | React + TypeScript + Tailwind | Vercel |
| Backend API | FastAPI + Python | Render |
| Database | MongoDB | Atlas |
| ML Service | PyTorch + FastAPI | Google Cloud Run |

## Quick Start (Local)

```bash
# Clone
git clone <repo-url>
cd tumour-detector

# Start all services
docker compose up --build
```

Open http://localhost:5173

> **Note:** Without model weights, the ML service runs in **DEMO MODE** (random predictions).
> To get real predictions, train the model first (see below).

---

## Training the Model

1. Download the dataset: [Kaggle Brain MRI Dataset](https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection)
2. Extract so you have: `ml-service/data/yes/` and `ml-service/data/no/`
3. Install dependencies and train:

```bash
cd ml-service
pip install -r requirements.txt
python train.py --data-dir ./data --epochs 20 --batch-size 32
# Weights saved to ./weights/model.pth
```

4. Rebuild and restart:

```bash
docker compose up --build ml-service
```

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
MONGODB_DB=tumour_detector
ML_SERVICE_URL=https://ml-service-xxxx-ew.a.run.app
CORS_ORIGINS=["https://your-app.vercel.app"]
```

### ML Service (`ml-service/.env`)
```
MODEL_WEIGHTS_PATH=./weights/model.pth
MODEL_URL=                    # Optional HTTPS URL to auto-download weights
DEVICE=cpu
```

### Frontend (`.env.local`)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## Cloud Deployment

### 1. ML Service → Google Cloud Run

```bash
cd ml-service

# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ml-service

# Deploy
gcloud run deploy ml-service \
  --image gcr.io/YOUR_PROJECT_ID/ml-service \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --set-env-vars MODEL_WEIGHTS_PATH=/app/weights/model.pth,MODEL_URL=YOUR_PUBLIC_WEIGHTS_URL
```

Copy the Cloud Run URL — you'll need it for the backend.

### 2. Database → MongoDB Atlas

1. Create free M0 cluster at https://cloud.mongodb.com
2. Add a database user, whitelist `0.0.0.0/0` (or Render's IPs)
3. Copy the connection string

### 3. Backend → Render

1. Push this repo to GitHub
2. New Web Service on Render → connect the repo → Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables (MONGODB_URL, ML_SERVICE_URL, CORS_ORIGINS)

### 4. Frontend → Vercel

1. Import the repo in https://vercel.com/new
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`
4. Deploy

---

## API

| Method | Path | Description |
|---|---|---|
| POST | `/predict` | Upload MRI image → get prediction |
| GET | `/history` | Last 20 predictions |
| GET | `/health` | Health check |

---

## Project Structure

```
tumour-detector/
├── frontend/       React app → Vercel
├── backend/        FastAPI → Render
├── ml-service/     PyTorch API → Google Cloud Run
└── docker-compose.yml
```
