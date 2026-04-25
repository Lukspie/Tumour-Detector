FROM python:3.12-slim

# System dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 libsm6 libxrender1 libxext6 libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

# Create weights directory (weights are mounted or downloaded at runtime)
RUN mkdir -p ./weights

# Cloud Run sets PORT; default to 8001 for local use
ENV PORT=8001

EXPOSE $PORT

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
