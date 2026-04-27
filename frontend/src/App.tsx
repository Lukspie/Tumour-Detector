import { useCallback, useEffect, useState } from "react";
import { fetchHistory, predictTumour } from "./api/predict";
import type { HistoryItem, PredictionResult } from "./api/predict";
import Header from "./components/Header";
import RecentScans from "./components/RecentScans";
import ResultCard from "./components/ResultCard";
import Auth from "./components/Auth";
import UploadForm from "./components/UploadForm";
import PatientCommunity from "./components/PatientCommunity";
import RecentActivity from "./components/RecentActivity";
import { PATIENTS } from "./data/patients";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem("tumour_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    if (user) loadHistory();
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

  const handleLogin = (u: { id: string; name: string }) => {
    localStorage.setItem("tumour_user", JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("tumour_user");
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-mri-900 bg-slate-100 transition-colors duration-300">
      <Header
        isDark={isDark}
        onToggle={() => setIsDark((d) => !d)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Upload card */}
        <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
          <UploadForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div className="dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-4 dark:border-mri-border dark:border-t-cyan-400 border-slate-200 border-t-cyan-600 rounded-full animate-spin" />
            <p className="dark:text-slate-500 text-slate-400 text-sm">Running AI analysis...</p>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div className="space-y-6">
            <ResultCard result={result} imageUrl={imageUrl} />
            <PatientCommunity userId={user.id} />
          </div>
        )}

        {/* Recent Scans */}
        <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-widest">
              Recent Scans
            </h2>
            {history.length + PATIENTS.length > 0 && (
              <span className="text-xs dark:text-slate-600 text-slate-400">
                {history.length + PATIENTS.length} total
              </span>
            )}
          </div>
          <RecentScans history={history} patients={PATIENTS} loading={historyLoading} />
        </div>
      </main>

      <footer className="text-center text-xs dark:text-slate-700 text-slate-400 py-4 dark:border-t dark:border-mri-border border-t border-slate-200">
        University project &mdash; not for clinical use &middot; EfficientNet-B0 + Grad-CAM
      </footer>

      <RecentActivity />
    </div>
  );
}
