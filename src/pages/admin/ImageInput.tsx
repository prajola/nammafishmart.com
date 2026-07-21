import { useState } from "react";
import { uploadImage } from "../../lib/catalog";
import { asset } from "../../lib/asset";

/**
 * Image field: shows a preview and lets the admin upload a new file (goes to
 * Supabase Storage in production, or is inlined as a data URL in local mode).
 * The resolved URL is returned via onChange.
 */
export default function ImageInput({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const preview = value
    ? value.startsWith("data:") || value.startsWith("http")
      ? value
      : asset(value)
    : "";

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase text-muted">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {preview ? (
            <img
              src={preview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl opacity-40">🖼️</span>
          )}
        </div>
        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-ink hover:bg-white/10">
            {busy ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              disabled={busy}
              className="hidden"
            />
          </label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL / path"
            className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-ink outline-none focus:border-brand-400"
          />
          {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
        </div>
      </div>
    </div>
  );
}
