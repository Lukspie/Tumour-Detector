import { useEffect, useState } from "react";
import { PATIENTS } from "../data/patients";

function formatAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  return `${h}h ago`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SHUFFLED = [...PATIENTS].sort(() => Math.random() - 0.5);

const SHOW_MS = 4500;
const PAUSE_MS = 9000;

export default function RecentActivity() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const first = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(first);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const hide = setTimeout(() => {
      setVisible(false);
      const advance = setTimeout(() => {
        setIdx((i) => (i + 1) % SHUFFLED.length);
        setVisible(true);
      }, PAUSE_MS);
      return () => clearTimeout(advance);
    }, SHOW_MS);

    return () => clearTimeout(hide);
  }, [visible, idx]);

  const patient = SHUFFLED[idx];
  const isTumor = patient.label === "tumor";
  const pct = Math.round(
    isTumor ? patient.probability * 100 : (1 - patient.probability) * 100
  );

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl shadow-lg p-4 flex items-center gap-3 w-72">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            isTumor
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {initials(patient.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-sm font-semibold dark:text-slate-200 text-slate-700 truncate">
              {patient.name}
            </span>
            <span className="text-xs dark:text-slate-600 text-slate-400 flex-shrink-0">
              {formatAgo(patient.minutesAgo)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                isTumor
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isTumor ? "Tumor" : "No Tumor"}
            </span>
            <span className="text-xs dark:text-slate-600 text-slate-400">{pct}% confidence</span>
          </div>
          <p className="text-xs dark:text-slate-600 text-slate-400 mt-0.5 truncate">
            {patient.city}
          </p>
        </div>
      </div>
    </div>
  );
}
