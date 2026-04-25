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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
      {/* Header stripe */}
      <div className={`px-6 py-4 ${isTumour ? "bg-red-600" : "bg-green-600"} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">Result</p>
            <p className="text-2xl font-bold mt-0.5">
              {isTumour ? "Tumour Detected" : "No Tumour Found"}
            </p>
          </div>
          <div className="text-5xl font-black opacity-90">{pct}%</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Probability bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>No Tumour</span>
            <span>Tumour</span>
          </div>
          <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                isTumour ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">
            Confidence: <strong>{confPct}%</strong>
          </p>
        </div>

        {/* Images side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              Original MRI
            </p>
            <img
              src={imageUrl}
              alt="Original MRI"
              className="w-full rounded-xl object-contain bg-black aspect-square"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              Grad-CAM Heatmap
            </p>
            {result.gradcam_base64 ? (
              <img
                src={`data:image/jpeg;base64,${result.gradcam_base64}`}
                alt="Grad-CAM activation map"
                className="w-full rounded-xl object-contain bg-black aspect-square"
              />
            ) : (
              <div className="w-full rounded-xl bg-slate-100 aspect-square flex items-center justify-center text-slate-400 text-sm text-center px-4">
                Heatmap unavailable
                {result.demo_mode && <br />}
                {result.demo_mode && "(demo mode — no weights loaded)"}
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className={`rounded-xl p-4 text-sm ${isTumour ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"}`}>
          {result.explanation}
        </div>

        {/* Meta */}
        <div className="text-xs text-slate-400 flex justify-between flex-wrap gap-2">
          <span>File: {result.filename}</span>
          <span>{new Date(result.timestamp).toLocaleString()}</span>
          {result.demo_mode && (
            <span className="text-amber-500 font-semibold">DEMO MODE — results are random</span>
          )}
        </div>
      </div>
    </div>
  );
}
