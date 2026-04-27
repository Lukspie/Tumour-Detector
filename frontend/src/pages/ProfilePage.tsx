import { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../api/predict";

interface Props {
  user: { id: string; name: string };
}

export default function ProfilePage({ user }: Props) {
  const [blog, setBlog] = useState("");
  const [contact, setContact] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    getPatientProfile(user.id)
      .then((data) => {
        setBlog(data.blog_post ?? "");
        setContact(data.can_be_contacted ?? false);
      })
      .catch(() => {
        // no profile yet — form stays empty
      })
      .finally(() => setLoadingProfile(false));
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updatePatientProfile(user.id, {
        username: user.name,
        is_patient: true,
        can_be_contacted: contact,
        blog_post: blog,
      });
      setSaved(true);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-cyan-600 dark:bg-cyan-700 flex items-center justify-center text-white text-2xl font-bold uppercase flex-shrink-0 shadow-lg">
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

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="text-xs font-mono font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest">
            Patient Follow-Up Profile
          </h2>
          <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">
            This information is shared with our oncology review team. All fields are optional.
          </p>
        </div>

        {loadingProfile ? (
          <div className="h-20 flex items-center">
            <span className="text-xs font-mono dark:text-slate-600 text-slate-400">Loading profile...</span>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                Clinical Notes / Current Status
              </label>
              <textarea
                className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 dark:focus:border-cyan-600 outline-none h-32 resize-none transition-colors"
                placeholder="e.g. Awaiting neurosurgery consultation, post-op recovery, undergoing radiotherapy..."
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
                  I consent to being contacted by an oncology specialist for further consultation.
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
              {saved && (
                <span className="text-xs text-emerald-500 dark:text-emerald-400 font-mono">
                  Profile saved.
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
