import { useState } from "react";
import { loginUser, registerUser } from "../api/predict";

interface Props {
  initialMode?: "login" | "register";
  onLogin: (user: { id: string; name: string }) => void;
  onClose: () => void;
}

export default function Auth({ initialMode = "login", onLogin, onClose }: Props) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = isLogin
        ? await loginUser({ username, password })
        : await registerUser({ username, password });
      onLogin({ id: data.userId, name: data.username });
      onClose();
    } catch {
      setError(
        isLogin
          ? "Login failed — check your credentials."
          : "Registration failed — username may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-mri-700 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition text-xl leading-none"
        >
          ×
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 relative group cursor-default select-none">
            <img src="/base.png" alt="Logo" className="w-14 h-14 absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
            <img src="/mrisprite.png" alt="Logo MRI" className="w-14 h-14 absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        <h2 className="text-xl font-bold dark:text-slate-100 text-slate-800 text-center mb-1">
          {isLogin ? "Sign in" : "Create account"}
        </h2>
        <p className="dark:text-slate-500 text-slate-400 text-xs font-mono text-center mb-8 uppercase tracking-widest">
          Cortex AI — Neural Analysis
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-cyan-600 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="w-full px-4 py-3 rounded-xl dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-cyan-600 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 font-mono px-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 dark:bg-cyan-700 dark:hover:bg-cyan-600 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition disabled:opacity-40 text-sm mt-2"
          >
            {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setIsLogin(!isLogin); setError(null); }}
          className="w-full mt-5 text-sm dark:text-slate-500 dark:hover:text-cyan-400 text-slate-400 hover:text-cyan-600 transition"
        >
          {isLogin ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
