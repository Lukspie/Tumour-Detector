import { useState } from "react";
import { loginUser } from "../api/predict";

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
      const data = await loginUser({ username, password });
      onLogin({ id: data.userId, name: data.username });
    } catch (err) {
      alert("Auth failed — check backend console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white text-xl">AI</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-500 text-sm text-center mb-8">Brain Tumour Detector Community</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-sm text-cyan-600 font-medium hover:underline"
        >
          {isLogin ? "New here? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}