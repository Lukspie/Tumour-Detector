import { useState } from "react";

const TUMOR_IMAGES = [
  "/samples/tumor_1.jpg",
  "/samples/tumor_2.jpg",
  "/samples/tumor_3.jpg",
  "/samples/tumor_4.jpg",
  "/samples/tumor_5.jpg",
  "/samples/tumor_6.jpg",
];

const HEALTHY_IMAGES = [
  "/samples/healthy_1.jpg",
  "/samples/healthy_2.jpg",
  "/samples/healthy_3.jpg",
  "/samples/healthy_4.jpg",
  "/samples/healthy_5.jpg",
  "/samples/healthy_6.jpg",
];

function ImageGrid({ images, label, accent }: { images: string[]; label: string; accent: string }) {
  const [zoomed, setZoomed] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${accent}`} />
        <h3 className="font-semibold dark:text-slate-200 text-slate-700 text-sm uppercase tracking-widest">
          {label}
        </h3>
        <span className="text-xs dark:text-slate-600 text-slate-400 ml-1">({images.length} shown)</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setZoomed(src)}
            className="group aspect-square rounded-xl overflow-hidden dark:bg-black bg-slate-900 border dark:border-mri-border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <img
              src={src}
              alt={`${label} sample ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setZoomed(null)}
        >
          <img
            src={zoomed}
            alt="Zoomed MRI"
            className="max-h-[85vh] max-w-[85vw] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoomed(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default function DatasetPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 space-y-8">

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8 space-y-2">
        <h2 className="text-2xl font-bold dark:text-slate-100 text-slate-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Training Dataset
        </h2>
        <p className="dark:text-slate-400 text-slate-500 text-sm leading-relaxed">
          The model was trained on 253 real brain MRI scans sourced from Kaggle. Below is a sample from each class. Click any image to expand it.
        </p>
        <div className="flex gap-6 pt-2">
          <div className="text-center">
            <p className="text-xl font-extrabold dark:text-red-400 text-red-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>155</p>
            <p className="text-xs dark:text-slate-500 text-slate-400">Tumour</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold dark:text-emerald-400 text-emerald-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>98</p>
            <p className="text-xs dark:text-slate-500 text-slate-400">Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold dark:text-cyan-400 text-cyan-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>253</p>
            <p className="text-xs dark:text-slate-500 text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8">
        <ImageGrid images={TUMOR_IMAGES} label="Tumour" accent="bg-red-500" />
      </div>

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8">
        <ImageGrid images={HEALTHY_IMAGES} label="Healthy" accent="bg-emerald-500" />
      </div>

      <div className="dark:bg-mri-700/50 bg-slate-50 border dark:border-mri-border border-slate-200 rounded-xl px-5 py-4">
        <p className="text-xs dark:text-slate-500 text-slate-400 leading-relaxed">
          Dataset sourced from Kaggle (Brain MRI Images for Brain Tumor Detection). Images are T1-weighted MRI scans. The model generalises best to similar scan types and orientations.
        </p>
      </div>

    </div>
  );
}
