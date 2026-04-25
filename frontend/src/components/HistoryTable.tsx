import type { HistoryItem } from "../api/predict";

interface Props {
  items: HistoryItem[];
  loading: boolean;
}

export default function HistoryTable({ items, loading }: Props) {
  if (loading) {
    return <p className="text-slate-500 text-sm text-center py-4">Loading history…</p>;
  }
  if (items.length === 0) {
    return <p className="text-slate-400 text-sm text-center py-4">No predictions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-left text-xs uppercase tracking-wide">
            <th className="pb-2 pr-4">File</th>
            <th className="pb-2 pr-4">Result</th>
            <th className="pb-2 pr-4">Probability</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-2 pr-4 max-w-[150px] truncate text-slate-600">{item.filename}</td>
              <td className="py-2 pr-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    item.label === "tumor"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.label === "tumor" ? "Tumour" : "No Tumour"}
                </span>
              </td>
              <td className="py-2 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.label === "tumor" ? "bg-red-400" : "bg-green-400"}`}
                      style={{ width: `${Math.round(item.probability * 100)}%` }}
                    />
                  </div>
                  <span className="text-slate-600">{Math.round(item.probability * 100)}%</span>
                </div>
              </td>
              <td className="py-2 text-slate-400 text-xs whitespace-nowrap">
                {new Date(item.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
