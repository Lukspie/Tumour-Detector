import { useEffect, useState } from "react";

type Page = "main" | "about" | "dataset" | "profile";

interface Props {
  isDark: boolean;
  onToggle: () => void;
  user: { name: string } | null;
  onLogout: () => void;
  onShowAuth: (mode: "login" | "register") => void;
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

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  );
}

export default function Header({ isDark, onToggle, user, onLogout, onShowAuth, page, onNavigate }: Props) {
  const [logoFlipped, setLogoFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoFlipped(true);
      setTimeout(() => setLogoFlipped(false), 900);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItem = (target: Page, label: string) => (
    <button
      onClick={() => onNavigate(target)}
      className={`text-xs font-mono font-medium transition-colors px-1 pb-0.5 border-b tracking-wider ${
        page === target
          ? "dark:border-cyan-400 dark:text-cyan-400 border-cyan-600 text-cyan-600"
          : "border-transparent dark:text-slate-500 dark:hover:text-slate-200 text-slate-500 hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white dark:bg-mri-800 border-b border-slate-200 dark:border-mri-border text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="relative w-full px-6 py-2 flex items-center min-h-[60px]">

        {/* Left — nav */}
        <nav className="hidden sm:flex items-center gap-5 z-10">
          {navItem("about", "About")}
          {navItem("dataset", "Dataset")}
        </nav>

        {/* Center — logo (absolutely centred) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <button
            onClick={() => onNavigate("main")}
            aria-label="Go to home"
            className="relative w-12 h-12 focus:outline-none"
          >
            <img
              src="/base.png"
              alt="Logo"
              className={`w-12 h-12 absolute inset-0 transition-opacity duration-500 ${logoFlipped ? "opacity-0" : "opacity-100"}`}
            />
            <img
              src="/mrisprite.png"
              alt="Logo MRI"
              className={`w-12 h-12 absolute inset-0 transition-opacity duration-500 ${logoFlipped ? "opacity-100" : "opacity-0"}`}
            />
          </button>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest dark:text-slate-500 text-slate-400 mt-0.5 select-none"
          >
          </span>
        </div>

        {/* Right — controls */}
        <div className="ml-auto flex items-center gap-2 z-10">
          <button
            onClick={onToggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border dark:border-mri-border dark:text-slate-500 dark:hover:border-cyan-700 dark:hover:text-cyan-400 border-slate-300 text-slate-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate("profile")}
                title="View profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded border transition-colors ${
                  page === "profile"
                    ? "dark:border-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-300 border-cyan-500 bg-cyan-50 text-cyan-700"
                    : "dark:border-mri-border dark:bg-mri-700 dark:hover:border-cyan-700 dark:text-slate-300 border-slate-200 bg-white hover:border-cyan-400 text-slate-700"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-cyan-600 dark:bg-cyan-700 flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0">
                  {user.name[0]}
                </span>
                <span className="hidden sm:block text-xs font-mono max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              <button
                onClick={onLogout}
                title="Logout"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border dark:border-mri-border dark:text-slate-600 dark:hover:border-red-900 dark:hover:text-red-400 border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <LogoutIcon />
                <span className="hidden sm:inline text-xs font-mono">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onShowAuth("login")}
                className="text-xs font-mono px-3 py-1.5 rounded border dark:border-mri-border dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400 border-slate-300 text-slate-600 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onShowAuth("register")}
                className="text-xs font-mono px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-semibold transition-colors"
              >
                Create account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
