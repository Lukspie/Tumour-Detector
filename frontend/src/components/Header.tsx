export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 relative group cursor-pointer select-none flex-shrink-0">
          <img
            src="/base.png"
            alt="Logo"
            className="w-10 h-10 absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          />
          <img
            src="/mrisprite.png"
            alt="Logo MRI"
            className="w-10 h-10 absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight tracking-wide">
            Brain Tumour Detector
          </h1>
          <p className="text-slate-400 text-xs">
            EfficientNet-B0 &middot; Grad-CAM &middot; Cloud ML
          </p>
        </div>
        <span className="ml-auto text-xs text-slate-500 hidden sm:block">
          For educational purposes only &mdash; not a medical device
        </span>
      </div>
    </header>
  );
}