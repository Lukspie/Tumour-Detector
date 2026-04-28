import type { HistoryItem, PredictionResult } from "../api/predict";
import type { Patient } from "../data/patients";

interface Props {
  history: HistoryItem[];
  patients: Patient[];
  loading: boolean;
  userName: string;
  currentScan?: PredictionResult | null;
}

type ScanEntry = {
  id: string;
  displayName: string;
  displaySub: string;
  label: "tumor" | "no_tumor";
  probability: number;
  sortMs: number;
  isPatient: boolean;
};

function avatarInitials(entry: ScanEntry): string {
  const words = entry.displayName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return entry.displayName.slice(0, 2).toUpperCase();
}

function formatAgo(ms: number): string {
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RecentScans({ history, patients, loading, userName, currentScan }: Props) {
  if (loading) {
    return (
      <p className="text-xs font-mono dark:text-slate-600 text-slate-400 text-center py-6 uppercase tracking-widest">
        Loading...
      </p>
    );
  }

  const now = Date.now();

  const currentEntry: ScanEntry | null = currentScan
    ? {
        id: "current",
        displayName: userName,
        displaySub: "just now",
        label: currentScan.label,
        probability: currentScan.probability,
        sortMs: 0,
        isPatient: false,
      }
    : null;

  const historyEntries: ScanEntry[] = history.map((item) => ({
    id: item.id,
    displayName: userName,
    displaySub: new Date(item.timestamp).toLocaleString(),
    label: item.label,
    probability: item.probability,
    sortMs: now - new Date(item.timestamp).getTime(),
    isPatient: false,
  }));

  const patientEntries: ScanEntry[] = patients.map((p, i) => ({
    id: `patient-${i}`,
    displayName: p.name,
    displaySub: p.city,
    label: p.label,
    probability: p.probability,
    sortMs: p.minutesAgo * 60000,
    isPatient: true,
  }));

  const combined = [
    ...(currentEntry ? [currentEntry] : []),
    ...historyEntries,
    ...patientEntries,
  ].sort((a, b) => a.sortMs - b.sortMs);

  if (combined.length === 0) {
    return (
      <p className="text-xs font-mono dark:text-slate-600 text-slate-400 text-center py-6 uppercase tracking-widest">
        No scans yet.
      </p>
    );
  }

  return (
    <ul className="divide-y dark:divide-mri-700 divide-slate-100">
      {combined.map((entry) => {
        const isTumor = entry.label === "tumor";
        const pct = Math.round(
          isTumor ? entry.probability * 100 : (1 - entry.probability) * 100
        );

        return (
          <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div
              className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono ${
                isTumor
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {avatarInitials(entry)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-slate-200 text-slate-700 truncate">
                {entry.displayName}
              </p>
              <p className="text-xs font-mono dark:text-slate-600 text-slate-400 truncate">
                {entry.isPatient ? entry.displaySub : formatAgo(entry.sortMs)}
              </p>
            </div>

            <span
              className={`text-xs font-mono font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                isTumor
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isTumor ? "Tumor" : "Clear"}
            </span>

            <div className="flex items-center gap-2 flex-shrink-0 w-20 hidden sm:flex">
              <div className="flex-1 h-1.5 dark:bg-mri-700 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isTumor ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono dark:text-slate-500 text-slate-400 w-7 text-right">
                {pct}%
              </span>
            </div>

            <span className="text-xs font-mono dark:text-slate-600 text-slate-400 flex-shrink-0 w-14 text-right hidden sm:block">
              {entry.id === "current" ? "now" : formatAgo(entry.sortMs)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
