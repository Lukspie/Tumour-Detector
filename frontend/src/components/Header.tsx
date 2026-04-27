interface Props {
  isDark: boolean;
  onToggle: () => void;
  user: { name: string };
  onLogout: () => void;
}

export default function Header({ isDark, onToggle, user, onLogout }: Props) {
  return (
    <header className="bg-white dark:bg-mri-800 border-b border-slate-200 dark:border-mri-border text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full px-6 py-4 flex items-center gap-4">
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
          <h1 className="text-lg font-bold leading-tight tracking-wide dark:text-slate-100 text-slate-900">
            Brain Tumour Detector
          </h1>
          <p className="text-xs dark:text-slate-500 text-slate-400">
            EfficientNet-B0 &middot; Grad-CAM &middot; Cloud ML
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onToggle}
            className="text-xs px-3 py-1.5 rounded-lg border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-500 dark:hover:text-cyan-400 border-slate-300 text-slate-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
          >
            {isDark ? "Light mode" : "Dark mode"}
          </button>

          <button
            onClick={onLogout}
            className="text-xs dark:text-slate-500 dark:hover:text-cyan-400 text-slate-400 hover:text-cyan-600 transition-colors hidden sm:block"
          >
            {user.name} &middot; Logout
          </button>
        </div>
      </div>
    </header>
  );
}
