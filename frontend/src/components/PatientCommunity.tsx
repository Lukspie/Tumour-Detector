import { useState } from "react";
import { updatePatientProfile } from "../api/predict";

interface Props {
  userId: string;
}

export default function PatientCommunity({ userId }: Props) {
  const [active, setActive] = useState(false);
  const [blog, setBlog] = useState("");
  const [contact, setContact] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePatientProfile(userId, {
        username: "User",
        is_patient: true,
        can_be_contacted: contact,
        blog_post: blog,
      });
      alert("Profile updated and shared with community.");
    } catch {
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!active) {
    return (
      <div className="dark:bg-cyan-950/30 dark:border dark:border-cyan-900/50 bg-cyan-50 border border-cyan-100 rounded-2xl p-6 text-center">
        <h3 className="font-bold dark:text-cyan-300 text-cyan-900 mb-2">
          Join the Support Community
        </h3>
        <p className="dark:text-cyan-400/70 text-cyan-700 text-sm mb-4">
          Share your progress or allow specialists to contact you for further consultation.
        </p>
        <button
          onClick={() => setActive(true)}
          className="dark:bg-cyan-700 dark:hover:bg-cyan-600 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition"
        >
          Become a Community Member
        </button>
      </div>
    );
  }

  return (
    <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
      <h3 className="font-bold dark:text-slate-200 text-slate-800">
        Patient Support Profile
      </h3>

      <div className="space-y-2">
        <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-wide">
          My Progress Update
        </label>
        <textarea
          className="w-full dark:bg-mri-700 dark:border-mri-border dark:text-slate-200 dark:placeholder-slate-600 bg-white border border-slate-200 text-slate-800 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none h-24 resize-none"
          placeholder="How are you feeling today? Any updates on your treatment?"
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-3 p-3 dark:bg-mri-700 bg-slate-50 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={contact}
          onChange={(e) => setContact(e.target.checked)}
          className="w-4 h-4 rounded accent-cyan-600"
        />
        <span className="text-sm dark:text-slate-300 text-slate-700">
          Allow oncology specialists to contact me
        </span>
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 bg-slate-800 hover:bg-black text-white py-2 rounded-xl font-semibold text-sm transition disabled:opacity-40"
      >
        {saving ? "Saving..." : "Save & Publish Profile"}
      </button>
    </div>
  );
}
