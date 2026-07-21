import { useState } from "react";
import {
  saveCategory,
  slugify,
  type CatalogCategory,
} from "../../lib/catalog";
import ImageInput from "./ImageInput";

export default function CategoryEditor({
  initial,
  onClose,
}: {
  initial: CatalogCategory | null;
  onClose: () => void;
}) {
  const isNew = !initial;
  const originalKey = initial?.key;
  const [c, setC] = useState<CatalogCategory>(
    initial ?? { key: "", label: "", emoji: "🐟", img: "" }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof CatalogCategory>(
    k: K,
    v: CatalogCategory[K]
  ) => setC((prev) => ({ ...prev, [k]: v }));

  async function onSave() {
    setErr(null);
    if (!c.label.trim()) return setErr("Label is required");
    const key = c.key || slugify(c.label);
    setSaving(true);
    try {
      await saveCategory({ ...c, key }, originalKey);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="pop-in relative my-6 w-full max-w-lg rounded-2xl border border-white/10 bg-navy-800 p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-ink">
          {isNew ? "New category" : "Edit category"}
        </h3>

        <div className="mt-4 space-y-4">
          <ImageInput
            label="Category image"
            value={c.img}
            onChange={(u) => set("img", u)}
          />

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-muted">
              Label
            </span>
            <input
              className={field}
              value={c.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="Sea Fish"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted">
                Emoji
              </span>
              <input
                className={field}
                value={c.emoji}
                onChange={(e) => set("emoji", e.target.value)}
                placeholder="🌊"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted">
                Key (URL) {isNew ? "" : "— changing re-tags products"}
              </span>
              <input
                className={field}
                value={c.key}
                onChange={(e) => set("key", slugify(e.target.value))}
                placeholder="auto from label"
              />
            </label>
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-ink hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save category"}
          </button>
        </div>
      </div>
    </div>
  );
}
