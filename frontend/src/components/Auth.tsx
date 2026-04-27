import { useState } from "react";
import { loginUser, registerUser } from "../api/predict";

interface Props {
  onLogin: (user: { id: string; name: string }) => void;
}

export default function Auth({ onLogin }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = isLogin
        ? await loginUser({ username, password })
        : await registerUser({ username, password });
      onLogin({ id: data.userId, name: data.username });
    } catch {
      alert(isLogin ? "Login failed — check your credentials" : "Registration failed — username may already exist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-mri-950 bg-slate-100 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 relative group cursor-pointer select-none">
            <img
              src="/base.png"
              alt="Logo"
              className="w-14 h-14 absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            <img
              src="/mrisprite.png"
              alt="Logo MRI"
              className="w-14 h-14 absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold dark:text-slate-100 text-slate-800 text-center mb-1">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="dark:text-slate-500 text-slate-400 text-sm text-center mb-8">
          Brain Tumour Detector
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-cyan-600 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-cyan-600 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 dark:bg-cyan-700 dark:hover:bg-cyan-600 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition disabled:opacity-40 text-sm mt-2"
          >
            {loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-5 text-sm dark:text-slate-500 dark:hover:text-cyan-400 text-slate-400 hover:text-cyan-600 transition"
        >
          {isLogin ? "New here? Register" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
