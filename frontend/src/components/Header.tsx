type Page = "main" | "about" | "dataset";

interface Props {
  isDark: boolean;
  onToggle: () => void;
  user: { name: string };
  onLogout: () => void;
  page: Page;
  onNavigate: (page: Page) => void;
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    </svg>
  );
}

export default function Header({ isDark, onToggle, user, onLogout, page, onNavigate }: Props) {
  const navItem = (target: Page, label: string) => (
    <button
      onClick={() => onNavigate(target)}
      className={`text-xs font-medium transition-colors px-1 pb-0.5 border-b ${
        page === target
          ? "dark:border-cyan-400 dark:text-cyan-400 border-cyan-600 text-cyan-600"
          : "border-transparent dark:text-slate-400 dark:hover:text-slate-200 text-slate-500 hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white dark:bg-mri-800 border-b border-slate-200 dark:border-mri-border text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate("main")}
          className="w-10 h-10 relative group cursor-pointer select-none flex-shrink-0 focus:outline-none"
          aria-label="Go to home"
        >
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
        </button>

        <div>
          <h1
            className="text-lg font-extrabold leading-tight tracking-wide dark:text-slate-100 text-slate-900 cursor-pointer"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            onClick={() => onNavigate("main")}
          >
            Cortex — Brain Tumour Detection
          </h1>
          <p className="text-xs dark:text-slate-500 text-slate-400">
            EfficientNet-B0 &middot; Grad-CAM &middot; Cloud ML
          </p>
        </div>

        <nav className="hidden sm:flex items-center gap-5 ml-8">
          {navItem("about", "About Us")}
          {navItem("dataset", "Dataset")}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onToggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-500 dark:hover:text-cyan-400 border-slate-300 text-slate-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          <span className="text-xs dark:text-slate-500 text-slate-400 hidden sm:inline">
            {user.name} &middot;{" "}
          </span>
          <button
            onClick={onLogout}
            className="text-xs dark:text-slate-500 dark:hover:text-cyan-400 text-slate-400 hover:text-cyan-600 transition-colors hidden sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
