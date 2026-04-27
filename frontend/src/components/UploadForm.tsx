import { useCallback, useRef, useState } from "react";

interface Props {
  onSubmit: (file: File) => void;
  loading: boolean;
}

export default function UploadForm({ onSubmit, loading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) onSubmit(selectedFile);
  };

  const cornerClass = `absolute w-7 h-7 z-10 transition-colors duration-200 ${
    dragging
      ? "dark:border-cyan-400 border-cyan-500"
      : "dark:border-cyan-800 border-cyan-400"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between px-0.5 mb-1">
        <span className="text-xs font-mono dark:text-cyan-600 text-cyan-700 tracking-widest uppercase">
          Scan Input
        </span>
        <span className="text-xs font-mono dark:text-slate-700 text-slate-400">
          JPEG &middot; PNG &middot; BMP &middot; WebP
        </span>
      </div>

      <div className="relative">
        <div className={`${cornerClass} top-0 left-0 border-t-2 border-l-2`} />
        <div className={`${cornerClass} top-0 right-0 border-t-2 border-r-2`} />
        <div className={`${cornerClass} bottom-0 left-0 border-b-2 border-l-2`} />
        <div className={`${cornerClass} bottom-0 right-0 border-b-2 border-r-2`} />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`p-10 text-center cursor-pointer transition-all duration-200 dark:bg-mri-900/60 bg-slate-50 ${
            dragging ? "dark:bg-cyan-950/30 bg-cyan-50" : ""
          }`}
        >
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="MRI preview"
                className="max-h-60 mx-auto object-contain"
              />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-px dark:bg-gradient-to-r dark:from-transparent dark:via-cyan-400/60 dark:to-transparent bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-scandown" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                  dragging
                    ? "dark:border-cyan-500 border-cyan-400"
                    : "dark:border-mri-border border-slate-200"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className={`w-6 h-6 transition-colors ${dragging ? "dark:text-cyan-400 text-cyan-500" : "dark:text-slate-600 text-slate-300"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-mono font-semibold dark:text-slate-200 text-slate-700 uppercase tracking-widest">
                  {dragging ? "Drop to Load" : "Drop MRI Scan"}
                </p>
                <p className="text-xs font-mono dark:text-slate-600 text-slate-400 mt-2">
                  or click to browse &mdash; max 10 MB
                </p>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      </div>

      {selectedFile && (
        <p className="text-xs font-mono dark:text-slate-600 text-slate-400 text-center truncate px-1">
          {selectedFile.name} &mdash; {(selectedFile.size / 1024).toFixed(1)} KB
        </p>
      )}

      <button
        type="submit"
        disabled={!selectedFile || loading}
        className="w-full py-3 rounded-none bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-mono font-semibold text-sm tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Analysing..." : "Execute Analysis"}
      </button>
    </form>
  );
}
