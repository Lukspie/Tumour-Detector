import { useState } from "react";

interface Props {
  userId: string | null;
  onShowAuth?: (mode: "login" | "register") => void;
  onNavigateProfile?: () => void;
}

export default function PatientCommunity({ userId, onShowAuth, onNavigateProfile }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
      {/* Banner */}
      <div className="px-5 py-3 dark:bg-red-950/30 bg-red-50 border-b dark:border-red-900/40 border-red-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 flex-shrink-0">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
            Tumour Indicators Detected
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="p-5 space-y-3">
        {userId ? (
          <>
            <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
              A potential intracranial tumour has been identified. Track your diagnostic progression and connect with specialists in your{" "}
              <button
                onClick={onNavigateProfile}
                className="dark:text-cyan-400 text-cyan-600 hover:underline font-medium"
              >
                Profile
              </button>
              .
            </p>
          </>
        ) : (
          <>
            <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
              A potential intracranial tumour has been identified. Create an account to register for specialist follow-up and track your diagnostic progression.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onShowAuth?.("register")}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => onShowAuth?.("login")}
                className="px-4 py-2 rounded-xl text-sm border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-600 dark:hover:text-cyan-400 border-slate-200 text-slate-600 hover:border-cyan-400 transition-colors"
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
