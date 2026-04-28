import { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../api/predict";
import type { HistoryItem } from "../api/predict";
import type { Patient } from "../data/patients";
import RecentScans from "../components/RecentScans";

interface Props {
  user: { id: string; name: string };
  history: HistoryItem[];
  historyLoading: boolean;
  patients: Patient[];
}

export default function ProfilePage({ user, history, historyLoading, patients }: Props) {
  const [age, setAge] = useState<string>("");
  const [blog, setBlog] = useState("");
  const [contact, setContact] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  useEffect(() => {
    getPatientProfile(user.id)
      .then((data) => {
        setBlog(data.blog_post ?? "");
        setContact(data.can_be_contacted ?? false);
        setAge(data.age != null ? String(data.age) : "");
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      await updatePatientProfile(user.id, {
        username: user.name,
        is_patient: true,
        can_be_contacted: contact,
        blog_post: blog,
        age: age !== "" ? Number(age) : null,
      });
      setSaved(true);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!newUpdate.trim()) return;
    setPublishing(true);
    setPublishError(null);
    setJustPublished(false);
    try {
      await updatePatientProfile(user.id, {
        username: user.name,
        is_patient: true,
        can_be_contacted: contact,
        blog_post: newUpdate.trim(),
        age: age !== "" ? Number(age) : null,
      });
      setBlog(newUpdate.trim());
      setNewUpdate("");
      setJustPublished(true);
    } catch {
      setPublishError("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-cyan-600 dark:bg-cyan-700 flex items-center justify-center text-white text-2xl font-bold uppercase flex-shrink-0">
          {user.name[0]}
        </div>
        <div>
          <h1
            className="text-2xl font-extrabold dark:text-slate-100 text-slate-900 tracking-tight"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {user.name}
          </h1>
          <p className="text-xs font-mono dark:text-slate-500 text-slate-400 mt-0.5 uppercase tracking-widest">
            Patient Account
          </p>
        </div>
      </div>

      {loadingProfile ? (
        <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-xs font-mono dark:text-slate-600 text-slate-400 uppercase tracking-widest">
            Loading profile...
          </p>
        </div>
      ) : (
        <>
          {/* ── Patient info ── */}
          <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-xs font-mono font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest">
              Patient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                  Age
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="e.g. 42"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none transition-colors"
                />
              </div>
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
                  I consent to being contacted by an oncology specialist for further consultation.
                </p>
              </div>
            </label>

            {saveError && (
              <p className="text-xs text-red-500 dark:text-red-400 font-mono">{saveError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              {saved && (
                <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400">Saved.</span>
              )}
            </div>
          </div>

          {/* ── Current status / updates ── */}
          <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-xs font-mono font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest">
              Progress Updates
            </h2>

            {blog ? (
              <div className="space-y-1.5">
                <p className="text-xs font-mono dark:text-slate-500 text-slate-400 uppercase tracking-wider">
                  Current Status
                </p>
                <div className="border-l-2 border-cyan-500 dark:border-cyan-700 pl-4 py-1">
                  <p className="text-sm dark:text-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {blog}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm dark:text-slate-600 text-slate-400 italic">
                No status posted yet.
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                Post an Update
              </label>
              <textarea
                className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none h-28 resize-none transition-colors"
                placeholder="e.g. Awaiting neurosurgery consultation, post-op recovery, currently on radiotherapy..."
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
        </>
      )}

      {/* ── Recent scans ── */}
      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-mono font-semibold dark:text-slate-500 text-slate-500 uppercase tracking-widest">
            Recent Scans
          </h2>
          <span className="text-xs font-mono dark:text-slate-700 text-slate-400">
            {history.length + patients.length} total
          </span>
        </div>
        <RecentScans
          history={history}
          patients={patients}
          loading={historyLoading}
          userName={user.name}
        />
      </div>
    </div>
  );
}
