# Detektor mozgových nádorov

Cloudová webová aplikácia na klasifikáciu mozgových nádorov z MRI snímkov pomocou EfficientNet-B0 a Grad-CAM.

## Architektúra

| Služba | Technológia | Cloud hosting |
|---|---|---|
| Frontend | React + TypeScript + Tailwind | Vercel |
| Backend API | FastAPI + Python | Render |
| Databáza | MongoDB | Atlas |
| ML Služba | PyTorch + FastAPI | Google Cloud Run |

```
Používateľ → Vercel (Frontend)
                 ↓
           Render (Backend API)  ←→  MongoDB Atlas (Databáza)
                 ↓
        Google Cloud Run (ML Služba)
```

---

## Rýchly štart pre frontend vývojárov

Ak pracuješ iba na frontende, nepotrebuješ Docker ani Python. Backend beží už v cloude.

```bash
# 1. Klonuj repozitár
git clone https://github.com/Lukspie/Tumour-Detector.git
cd Tumour-Detector/frontend

# 2. Nainštaluj závislosti
npm install

# 3. Vytvor súbor .env.local
echo "VITE_BACKEND_URL=https://tumour-detector-h8yp.onrender.com" > .env.local

# 4. Spusti vývojový server
npm run dev
```

Otvor http://localhost:5173 — frontend sa pripája na živý backend.

Po pushnutí zmien na `main` sa Vercel automaticky predeployuje.

---

## Spustenie lokálne

```bash
# Klonovanie repozitára
git clone https://github.com/Lukspie/Tumour-Detector.git
cd Tumour-Detector

# Spustenie všetkých služieb
docker compose up --build
```

Otvor http://localhost:5173

> **Poznámka:** Bez súboru s váhami modelu beží ML služba v **DEMO MÓDE** (náhodné predikcie).
> Pre reálne predikcie je potrebné model najprv natrénovať (pozri nižšie).

---

## Trénovanie modelu

1. Stiahni dataset: [Kaggle Brain MRI Dataset](https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection)

   ```bash
   pip install kaggle
   # Vlož kaggle.json do ~/.kaggle/
   kaggle datasets download -d navoneel/brain-mri-images-for-brain-tumor-detection -p ./ml-service/data --unzip
   ```

2. Po stiahnutí bude štruktúra: `ml-service/data/yes/` a `ml-service/data/no/`

3. Nainštaluj závislosti a spusti trénovanie:

```bash
cd ml-service
pip install -r requirements.txt
python train.py --data-dir ./data --epochs 20 --batch-size 16
# Váhy sa uložia do ./weights/model.pth
```

4. Nahraj `model.pth` na verejné úložisko (napr. Google Cloud Storage) a nastav `MODEL_URL`.

---

## Premenné prostredia

### Backend (`backend/.env`)
```
MONGODB_URL=mongodb+srv://<user>:<heslo>@cluster.mongodb.net/
MONGODB_DB=tumour_detector
ML_SERVICE_URL=https://ml-service-xxxx-ew.a.run.app
CORS_ORIGINS=["https://tumour-detector.vercel.app"]
```

### ML Služba (`ml-service/.env`)
```
MODEL_WEIGHTS_PATH=./weights/model.pth
MODEL_URL=                    # Voliteľné: HTTPS URL na automatické stiahnutie váh
DEVICE=cpu
```

### Frontend (`.env.local`)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## Nasadenie do cloudu

### 1. ML Služba → Google Cloud Run

```bash
cd ml-service
gcloud builds submit --tag europe-west1-docker.pkg.dev/PROJECT_ID/ml-service/ml-service
gcloud run deploy ml-service \
  --image europe-west1-docker.pkg.dev/PROJECT_ID/ml-service/ml-service \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --set-env-vars MODEL_WEIGHTS_PATH=/app/weights/model.pth,MODEL_URL=TVOJA_URL
```

### 2. Databáza → MongoDB Atlas

1. Vytvor bezplatný M0 cluster na https://cloud.mongodb.com
2. Pridaj databázového používateľa, povol prístup z `0.0.0.0/0`
3. Skopíruj connection string

### 3. Backend → Render

1. Pripoj GitHub repozitár na https://render.com
2. Nová Web Service → Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Nastav premenné prostredia (MONGODB_URL, ML_SERVICE_URL, CORS_ORIGINS)

### 4. Frontend → Vercel

1. Importuj repozitár na https://vercel.com/new
2. Root Directory: `frontend`
3. Pridaj premennú prostredia: `VITE_BACKEND_URL=https://your-backend.onrender.com`
4. Nasaď

---

## API

| Metóda | Cesta | Popis |
|---|---|---|
| POST | `/predict` | Nahranie MRI snímku → výsledok predikcie |
| GET | `/history` | Posledných 20 predikcií |
| GET | `/health` | Kontrola stavu služby |

### Príklad odpovede `/predict`
```json
{
  "id": "6632f1a3b4c8d2e5f1234567",
  "label": "tumor",
  "probability": 0.8734,
  "confidence": 0.8734,
  "gradcam_base64": "...",
  "explanation": "Boli detegované silné indikátory mozgového nádoru (87.3%)...",
  "demo_mode": false,
  "timestamp": "2026-04-25T10:30:00+00:00"
}
```

---

## Štruktúra projektu

```
Tumour-Detector/
├── frontend/        React aplikácia → Vercel
├── backend/         FastAPI → Render
├── ml-service/      PyTorch API → Google Cloud Run
│   ├── train.py     Skript na trénovanie modelu
│   └── weights/     Váhy modelu (nie sú v repozitári)
└── docker-compose.yml
```

---

## Tím

| Člen | Zodpovednosť |
|---|---|
| Lukáš | Backend, databáza, ML model, nasadenie |
| Člen 2 | Frontend |
| Člen 3 | Frontend / testovanie |
