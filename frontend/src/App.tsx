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
import AboutPage from "./pages/AboutPage";
import DatasetPage from "./pages/DatasetPage";
import ProfilePage from "./pages/ProfilePage";
import { PATIENTS } from "./data/patients";

type Page = "main" | "about" | "dataset" | "profile";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState<Page>("main");
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
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
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
      if (user) await loadHistory();
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
    setPage("main");
  };

  const handleShowAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-mri-900 bg-slate-100 transition-colors duration-300">
      {showAuthModal && (
        <Auth
          initialMode={authMode}
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <Header
        isDark={isDark}
        onToggle={() => setIsDark((d) => !d)}
        user={user}
        onLogout={handleLogout}
        onShowAuth={handleShowAuth}
        page={page}
        onNavigate={setPage}
      />

      {page === "about" && (
        <main className="flex-1">
          <AboutPage />
        </main>
      )}

      {page === "dataset" && (
        <main className="flex-1">
          <DatasetPage />
        </main>
      )}

      {page === "profile" && user && (
        <main className="flex-1">
          <ProfilePage user={user} />
        </main>
      )}

      {page === "main" && (
        <main className="flex-1 relative">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Radial fade so grid doesn't overpower bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 dark:bg-gradient-to-t dark:from-mri-900 to-transparent pointer-events-none" />

          <div className="relative w-full max-w-2xl mx-auto px-4 pt-12 pb-10 space-y-8">
            {/* ── Hero ── */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono tracking-widest uppercase dark:text-slate-600 text-slate-400">
                  EfficientNet-B0 &middot; Grad-CAM &middot; Neural Analysis
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>

              <h1
                className="text-5xl sm:text-6xl font-black tracking-tighter leading-none"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-slate-100 to-cyan-400 animate-flicker">
                  Brain Tumour
                </span>
                <br />
                <span className="dark:text-slate-300 text-slate-700 text-4xl sm:text-5xl font-extrabold">
                  Detection System
                </span>
              </h1>

              <p className="text-sm font-mono dark:text-slate-500 text-slate-400 max-w-md mx-auto leading-relaxed">
                Upload a brain MRI scan for AI-powered tumour classification.
                <br className="hidden sm:block" />
                Returns confidence score and Grad-CAM heatmap of concern regions.
              </p>

              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-semibold dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/60 bg-red-50 text-red-600 border border-red-200 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Not for clinical use
                </span>
              </div>
            </div>

            {/* ── Upload form (no card — self-contained) ── */}
            <div className="dark:bg-mri-800/80 bg-white dark:border dark:border-mri-border border border-slate-200 shadow-xl p-6">
              <UploadForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {error && (
              <div className="dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-mono">
                <strong>ERROR:</strong> {error}
              </div>
            )}

            {loading && (
              <div className="relative overflow-hidden dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 p-12 text-center space-y-5">
                <div
                  className="left-0 right-0 h-px dark:bg-gradient-to-r dark:from-transparent dark:via-cyan-400/80 dark:to-transparent bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scandown"
                  style={{ position: "absolute" }}
                />
                <div className="relative inline-flex items-center justify-center w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 dark:border-mri-border border-slate-200 dark:border-t-cyan-400 border-t-cyan-500 animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border dark:border-mri-border border-slate-100 dark:border-t-red-500 border-t-red-400 animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "0.7s" }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest dark:text-slate-300 text-slate-600">
                    Analysing Scan
                  </p>
                  <p className="text-xs font-mono dark:text-slate-600 text-slate-400">
                    Running neural network inference...
                  </p>
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-6">
                <ResultCard result={result} imageUrl={imageUrl} />
                {result.label === "tumor" && (
                  <PatientCommunity
                    userId={user?.id ?? null}
                    userName={user?.name}
                    onShowAuth={handleShowAuth}
                  />
                )}
              </div>
            )}

            {user && (
              <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-mono font-semibold dark:text-slate-500 text-slate-500 uppercase tracking-widest">
                    Recent Scans
                  </h2>
                  <span className="text-xs font-mono dark:text-slate-700 text-slate-400">
                    {history.length + PATIENTS.length} total
                  </span>
                </div>
                <RecentScans history={history} patients={PATIENTS} loading={historyLoading} />
              </div>
            )}
          </div>
        </main>
      )}

      <footer className="relative text-center text-xs font-mono dark:text-slate-700 text-slate-400 py-4 dark:border-t dark:border-mri-border border-t border-slate-200 uppercase tracking-widest">
        University project &mdash; not for clinical use &middot; EfficientNet-B0 + Grad-CAM
      </footer>

      <RecentActivity />
    </div>
  );
}
