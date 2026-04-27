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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragging
            ? "border-cyan-400 dark:bg-cyan-950/20 bg-cyan-50"
            : "dark:border-mri-border dark:hover:border-cyan-600 dark:hover:bg-mri-700/30 border-slate-300 hover:border-cyan-400 hover:bg-slate-50"
          }
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="MRI preview"
            className="max-h-64 mx-auto rounded-xl object-contain shadow-lg"
          />
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-12 h-12 dark:text-mri-border text-slate-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="font-medium dark:text-slate-300 text-slate-600">
              Drop an MRI image here, or click to browse
            </p>
            <p className="text-sm dark:text-slate-600 text-slate-400">
              JPEG &middot; PNG &middot; BMP &middot; WebP &mdash; max 10 MB
            </p>
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

      {selectedFile && (
        <p className="text-xs dark:text-slate-500 text-slate-400 text-center truncate">
          {selectedFile.name} &mdash; {(selectedFile.size / 1024).toFixed(1)} KB
        </p>
      )}

      <button
        type="submit"
        disabled={!selectedFile || loading}
        className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-semibold
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm tracking-wide"
      >
        {loading ? "Analysing..." : "Analyse MRI"}
      </button>
    </form>
  );
}
