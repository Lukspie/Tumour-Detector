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
        blog_post: blog
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
      <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-cyan-900 mb-2">Join the Support Community</h3>
        <p className="text-cyan-700 text-sm mb-4">Share your progress or allow specialists to contact you for further consultation.</p>
        <button onClick={() => setActive(true)} className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-cyan-700 transition">
          Become a Community Member
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-in fade-in duration-500">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-xl">🤝</span> Patient Support Profile
      </h3>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">My Progress Update (Blog)</label>
        <textarea
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none h-24"
          placeholder="How are you feeling today? Any updates on your treatment?"
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={contact}
          onChange={(e) => setContact(e.target.checked)}
          className="w-4 h-4 rounded text-cyan-600"
        />
        <span className="text-sm text-slate-700">Allow oncology specialists to contact me</span>
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-slate-800 text-white py-2 rounded-xl font-bold text-sm hover:bg-black transition"
      >
        {saving ? "Saving..." : "Save & Publish Profile"}
      </button>
    </div>
  );
}