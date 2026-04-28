import { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../api/predict";

interface Props {
  userId: string | null;
  userName?: string;
  onShowAuth?: (mode: "login" | "register") => void;
}

type State = "loading" | "prompt" | "form" | "blog";

export default function PatientCommunity({ userId, userName, onShowAuth }: Props) {
  const [state, setState] = useState<State>(userId ? "loading" : "prompt");
  const [dismissed, setDismissed] = useState(false);

  // Registration form fields (first-time only)
  const [initNotes, setInitNotes] = useState("");
  const [contact, setContact] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Blog view fields (returning patient)
  const [existingBlog, setExistingBlog] = useState("");
  const [canBeContacted, setCanBeContacted] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  useEffect(() => {
    if (!userId) {
      setState("prompt");
      return;
    }
    setState("loading");
    getPatientProfile(userId)
      .then((data) => {
        if (data.is_patient) {
          setExistingBlog(data.blog_post ?? "");
          setCanBeContacted(data.can_be_contacted ?? false);
          setState("blog");
        } else {
          setState("prompt");
        }
      })
      .catch(() => setState("prompt"));
  }, [userId]);

  if (dismissed) return null;

  // ── Shared banner ────────────────────────────────────────────────────────────
  const Banner = ({ title }: { title: string }) => (
    <div className="px-5 py-3 dark:bg-red-950/30 bg-red-50 border-b dark:border-red-900/40 border-red-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 flex-shrink-0">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
          {title}
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
  );

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
        <Banner title="Tumour Indicators Detected" />
        <div className="p-6">
          <p className="text-xs font-mono dark:text-slate-600 text-slate-400 uppercase tracking-widest">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ── Prompt (first time, not logged in) ───────────────────────────────────────
  if (state === "prompt" && !userId) {
    return (
      <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
        <Banner title="Tumour Indicators Detected" />
        <div className="p-6 space-y-4">
          <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
            This scan shows potential indicators of an intracranial tumour. Create an account to register for specialist follow-up and track your diagnostic progression.
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
              className="px-4 py-2.5 rounded-xl text-sm border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-600 dark:hover:text-cyan-400 border-slate-200 text-slate-600 hover:border-cyan-400 transition-colors"
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
      </div>
    );
  }

  // ── Prompt (first time, logged in) ────────────────────────────────────────────
  if (state === "prompt" && userId) {
    return (
      <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
        <Banner title="Tumour Indicators Detected" />
        <div className="p-6 space-y-4">
          <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
            This scan shows potential indicators of an intracranial tumour. Register a follow-up profile to receive specialist consultation and track your diagnostic progression over time.
          </p>
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
        </div>
      </div>
    );
  }

  // ── Registration form (first time only) ─────────────────────────────────────
  if (state === "form") {
    const handleRegister = async () => {
      if (!userId) return;
      setRegistering(true);
      setRegError(null);
      try {
        await updatePatientProfile(userId, {
          username: userName ?? "User",
          is_patient: true,
          can_be_contacted: contact,
          blog_post: initNotes,
        });
        setExistingBlog(initNotes);
        setCanBeContacted(contact);
        setNewUpdate("");
        setState("blog");
      } catch {
        setRegError("Failed to save profile. Please try again.");
      } finally {
        setRegistering(false);
      }
    };

    return (
      <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
        <Banner title="Tumour Indicators Detected" />
        <div className="p-6 space-y-5">
          <p className="text-xs dark:text-slate-500 text-slate-400">
            This is a one-time setup. Your consent preferences and initial status will be saved to your follow-up profile.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
              Initial Status <span className="normal-case font-normal opacity-60">(optional)</span>
            </label>
            <textarea
              className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none h-24 resize-none transition-colors"
              placeholder="e.g. Awaiting neurosurgery consultation, currently on corticosteroids..."
              value={initNotes}
              onChange={(e) => setInitNotes(e.target.value)}
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

          {regError && (
            <p className="text-xs text-red-500 dark:text-red-400 font-mono">{regError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegister}
              disabled={registering}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
            >
              {registering ? "Registering..." : "Complete Registration"}
            </button>
            <button
              onClick={() => setState("prompt")}
              className="px-4 py-2.5 text-sm dark:text-slate-500 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Blog view (registered patient) ───────────────────────────────────────────
  const handlePublish = async () => {
    if (!userId || !newUpdate.trim()) return;
    setPublishing(true);
    setPublishError(null);
    setJustPublished(false);
    try {
      await updatePatientProfile(userId, {
        username: userName ?? "User",
        is_patient: true,
        can_be_contacted: canBeContacted,
        blog_post: newUpdate.trim(),
      });
      setExistingBlog(newUpdate.trim());
      setNewUpdate("");
      setJustPublished(true);
    } catch {
      setPublishError("Failed to publish update. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="dark:bg-mri-800 dark:border dark:border-red-900/40 bg-white border border-red-200 rounded-2xl overflow-hidden">
      <Banner title="Tumour Indicators — Follow-Up Active" />

      <div className="p-6 space-y-5">
        {/* Contact consent badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider ${
            canBeContacted
              ? "dark:bg-cyan-950/40 dark:text-cyan-400 dark:border dark:border-cyan-900/60 bg-cyan-50 text-cyan-700 border border-cyan-200"
              : "dark:bg-mri-700 dark:text-slate-500 dark:border dark:border-mri-border bg-slate-50 text-slate-500 border border-slate-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${canBeContacted ? "bg-cyan-400 animate-pulse" : "bg-slate-400"}`} />
            Specialist contact: {canBeContacted ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Current / last status */}
        <div className="space-y-2">
          <p className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
            Current Status
          </p>
          {existingBlog ? (
            <div className="dark:bg-mri-700 bg-slate-50 border-l-2 border-cyan-500 dark:border-cyan-700 rounded-r-xl px-4 py-3">
              <p className="text-sm dark:text-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {existingBlog}
              </p>
            </div>
          ) : (
            <p className="text-sm dark:text-slate-600 text-slate-400 italic">
              No status posted yet.
            </p>
          )}
        </div>

        {/* New update */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
            Post an Update
          </label>
          <textarea
            className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none h-24 resize-none transition-colors"
            placeholder="What's your current status? Any new developments..."
            value={newUpdate}
            onChange={(e) => { setNewUpdate(e.target.value); setJustPublished(false); }}
          />
        </div>

        {publishError && (
          <p className="text-xs text-red-500 dark:text-red-400 font-mono">{publishError}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            disabled={publishing || !newUpdate.trim()}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
          >
            {publishing ? "Publishing..." : "Publish Update"}
          </button>
          {justPublished && (
            <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400">
              Update published.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
