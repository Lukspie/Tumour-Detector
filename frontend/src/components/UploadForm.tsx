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
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${dragging ? "border-cyan-400 bg-cyan-50" : "border-slate-300 hover:border-cyan-400 hover:bg-slate-50"}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="MRI preview"
            className="max-h-56 mx-auto rounded-lg object-contain shadow"
          />
        ) : (
          <div className="space-y-2 text-slate-500">
            <div className="text-5xl select-none">🧠</div>
            <p className="font-medium">Drop an MRI image here, or click to browse</p>
            <p className="text-sm">JPEG · PNG · BMP · WebP &mdash; max 10 MB</p>
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
        <p className="text-sm text-slate-500 text-center truncate">
          {selectedFile.name} &mdash; {(selectedFile.size / 1024).toFixed(1)} KB
        </p>
      )}

      <button
        type="submit"
        disabled={!selectedFile || loading}
        className="w-full py-3 rounded-xl bg-cyan-600 text-white font-semibold
          hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors text-sm tracking-wide"
      >
        {loading ? "Analysing…" : "Analyse MRI"}
      </button>
    </form>
  );
}
