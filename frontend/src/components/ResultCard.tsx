import type { PredictionResult } from "../api/predict";

interface Props {
  result: PredictionResult;
  imageUrl: string;
}

export default function ResultCard({ result, imageUrl }: Props) {
  const isTumour = result.label === "tumor";
  const pct = Math.round(result.probability * 100);
  const confPct = Math.round(result.confidence * 100);

  return (
    <div className="dark:bg-mri-800 bg-white rounded-2xl shadow-md overflow-hidden dark:border dark:border-mri-border border border-slate-200">
      <div className={`px-6 py-4 ${isTumour ? "bg-red-700 dark:bg-red-900/70" : "bg-emerald-600 dark:bg-emerald-900/70"} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-70">Result</p>
            <p className="text-2xl font-bold mt-0.5">
              {isTumour ? "Tumour Detected" : "No Tumour Found"}
            </p>
          </div>
          <div className="text-5xl font-black opacity-80">{pct}%</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex justify-between text-xs dark:text-slate-500 text-slate-400 mb-1">
            <span>No Tumour</span>
            <span>Tumour</span>
          </div>
          <div className="relative h-2 rounded-full dark:bg-mri-700 bg-slate-100 overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                isTumour ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs dark:text-slate-500 text-slate-400 mt-1 text-right">
            Confidence: <strong className="dark:text-slate-300 text-slate-600">{confPct}%</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold dark:text-slate-500 text-slate-400 mb-2 uppercase tracking-wide">
              Original MRI
            </p>
            <img
              src={imageUrl}
              alt="Original MRI"
              className="w-full rounded-xl object-contain bg-black aspect-square"
            />
          </div>
          <div>
            <p className="text-xs font-semibold dark:text-slate-500 text-slate-400 mb-2 uppercase tracking-wide">
              Grad-CAM Heatmap
            </p>
            {result.gradcam_base64 ? (
              <img
                src={`data:image/jpeg;base64,${result.gradcam_base64}`}
                alt="Grad-CAM activation map"
                className="w-full rounded-xl object-contain bg-black aspect-square"
              />
            ) : (
              <div className="w-full rounded-xl dark:bg-mri-700 bg-slate-100 aspect-square flex items-center justify-center dark:text-slate-500 text-slate-400 text-sm text-center px-4">
                Heatmap unavailable
                {result.demo_mode && (
                  <><br />(demo mode)</>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-4 text-sm ${
          isTumour
            ? "dark:bg-red-950/40 dark:text-red-300 bg-red-50 text-red-900"
            : "dark:bg-emerald-950/40 dark:text-emerald-300 bg-emerald-50 text-emerald-900"
        }`}>
          {result.explanation}
        </div>

        <div className="text-xs dark:text-slate-600 text-slate-400 flex justify-between flex-wrap gap-2">
          <span>File: {result.filename}</span>
          <span>{new Date(result.timestamp).toLocaleString()}</span>
          {result.demo_mode && (
            <span className="text-amber-500 font-semibold">DEMO MODE &mdash; results are random</span>
          )}
        </div>
      </div>
    </div>
  );
}
