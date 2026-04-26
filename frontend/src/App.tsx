import { useCallback, useEffect, useState } from "react";
import { fetchHistory, predictTumour } from "./api/predict";
import type { HistoryItem, PredictionResult } from "./api/predict";
import Header from "./components/Header";
import HistoryTable from "./components/HistoryTable";
import ResultCard from "./components/ResultCard";
import Auth from "./components/Auth";
import UploadForm from "./components/UploadForm";
import PatientCommunity from "./components/PatientCommunity";

export default function App() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch {
      // silently ignore — history is non-critical
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [loadHistory, user]);

  const handleSubmit = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setImageUrl(URL.createObjectURL(file));

    try {
      const prediction = await predictTumour(file);
      setResult(prediction);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-700">Upload MRI Scan</h2>
              <button 
                onClick={() => setUser(null)}
                className="text-xs text-slate-400 hover:text-cyan-600 transition-colors font-medium"
              >
                Logout ({user.name})
              </button>
            </div>
            <UploadForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
            <h2 className="font-semibold text-slate-700 mb-4">
              Recent Predictions
              {history.length > 0 && (
                <span className="ml-2 text-xs text-slate-400 font-normal">({history.length})</span>
              )}
            </h2>
            <HistoryTable items={history} loading={historyLoading} />
          </div>
        </div>

        <div className="space-y-8">
          {loading && (
            <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center space-y-4">
              <div className="inline-block w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Running AI analysis…</p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <ResultCard result={result} imageUrl={imageUrl} />
              <PatientCommunity userId={user.id} />
            </div>
          )}

          {!loading && !result && (
            <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center text-slate-400 space-y-3">
              <div className="text-6xl select-none">🔬</div>
              <p className="font-medium text-slate-500">Results will appear here</p>
              <p className="text-sm">Upload an MRI image and click Analyse MRI</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        University project &mdash; not for clinical use &middot; EfficientNet-B0 + Grad-CAM
      </footer>
    </div>
  );
}