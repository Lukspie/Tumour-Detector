import { useState } from "react";
import { updatePatientProfile } from "../api/predict";

interface Props {
  userId: string | null;
  userName?: string;
  onShowAuth?: (mode: "login" | "register") => void;
}

type State = "prompt" | "form" | "saved";

export default function PatientCommunity({ userId, userName, onShowAuth }: Props) {
  const [state, setState] = useState<State>("prompt");
  const [blog, setBlog] = useState("");
  const [contact, setContact] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await updatePatientProfile(userId, {
        username: userName ?? "User",
        is_patient: true,
        can_be_contacted: contact,
        blog_post: blog,
      });
      setState("saved");
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (state === "saved") {
    return (
      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600/20 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold dark:text-slate-200 text-slate-800">Follow-Up Profile Registered</p>
            <p className="text-xs dark:text-slate-500 text-slate-400 mt-0.5">
              Your profile has been saved. You can update it at any time from your account.
              {contact && " An oncology specialist may reach out for further consultation."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "prompt") {
    return (
      <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
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

        <div className="p-6 space-y-4">
          <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
            This scan shows potential indicators of an intracranial tumour. If you wish to be contacted by an oncology specialist or track your diagnostic progression, register a follow-up profile.
          </p>

          {userId ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setState("form")}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold transition-colors"
              >
                Register Follow-Up Profile
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="px-4 py-2.5 rounded-xl text-sm dark:text-slate-500 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600 transition-colors"
              >
                Not now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-mono dark:text-slate-500 text-slate-400">
                Create an account to enable follow-up tracking and specialist contact.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowAuth?.("register")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={() => onShowAuth?.("login")}
                  className="px-4 py-2.5 rounded-xl text-sm border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-600 dark:hover:text-cyan-400 border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="px-4 py-2.5 rounded-xl text-sm dark:text-slate-600 dark:hover:text-slate-400 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
      <div>
        <h3 className="font-bold dark:text-slate-100 text-slate-900 tracking-tight">
          Follow-Up Patient Profile
        </h3>
        <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">
          This information will be reviewed by our oncology team. All fields are optional.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
          Clinical Notes / Current Status
        </label>
        <textarea
          className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none h-28 resize-none transition-colors"
          placeholder="e.g. Awaiting neurosurgery consultation, currently on corticosteroids..."
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 p-4 dark:bg-mri-700 dark:border-mri-border bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:dark:border-cyan-800 hover:border-cyan-200 transition-colors">
        <input
          type="checkbox"
          checked={contact}
          onChange={(e) => setContact(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-cyan-600 flex-shrink-0 cursor-pointer"
        />
        <div>
          <span className="text-sm dark:text-slate-200 text-slate-800 font-medium">
            Consent to specialist contact
          </span>
          <p className="text-xs dark:text-slate-500 text-slate-400 mt-0.5">
            I consent to being contacted by an oncology specialist for further consultation regarding this scan result.
          </p>
        </div>
      </label>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-mono">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          onClick={() => setState("prompt")}
          className="px-4 py-2.5 text-sm dark:text-slate-500 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
