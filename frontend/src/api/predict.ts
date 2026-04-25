const BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export interface PredictionResult {
  id: string;
  label: "tumor" | "no_tumor";
  probability: number;
  confidence: number;
  gradcam_base64: string | null;
  explanation: string;
  demo_mode: boolean;
  filename: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  label: "tumor" | "no_tumor";
  probability: number;
  confidence: number;
  filename: string;
  timestamp: string;
}

export async function predictTumour(file: File): Promise<PredictionResult> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${BASE}/predict`, { method: "POST", body });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Prediction failed");
  }
  return res.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error("Failed to load history");
  const data: { predictions: HistoryItem[] } = await res.json();
  return data.predictions;
}
