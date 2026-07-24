import { useState } from "react";
import {
  saveProduct,
  slugify,
  type CatalogCategory,
  type CatalogProduct,
} from "../../lib/catalog";
import ImageInput from "./ImageInput";

const BLANK: CatalogProduct = {
  id: "",
  name: "",
  category: "",
  price: 0,
  mrp: 0,
  unit: "",
  pieces: "",
  serves: "",
  tags: [],
  description: "",
  rating: 4.5,
  reviews: 0,
  img: "",
  soldOut: false,
  startFrom: false,
};

export default function ProductEditor({
  initial,
  categories,
  onClose,
}: {
  initial: CatalogProduct | null;
  categories: CatalogCategory[];
  onClose: () => void;
}) {
  const isNew = !initial;
  const [p, setP] = useState<CatalogProduct>(
    initial ?? { ...BLANK, category: categories[0]?.key ?? "" }
  );
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof CatalogProduct>(k: K, v: CatalogProduct[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  async function onSave() {
    setErr(null);
    if (!p.name.trim()) return setErr("Name is required");
    if (!p.category) return setErr("Pick a category");
    const id = p.id || slugify(p.name);
    setSaving(true);
    try {
      await saveProduct({
        ...p,
        id,
        price: Number(p.price) || 0,
        mrp: Number(p.mrp) || Number(p.price) || 0,
        rating: Number(p.rating) || 0,
        reviews: Number(p.reviews) || 0,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="pop-in relative my-6 w-full max-w-2xl rounded-2xl border border-brand-100 bg-navy-800 p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-ink">
          {isNew ? "New product" : "Edit product"}
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageInput value={p.img ?? ""} onChange={(u) => set("img", u)} />
          </div>

          <div className="sm:col-span-2">
            <L label="Name">
              <input
                className={field}
                value={p.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jumbo Tiger Prawns"
              />
            </L>
          </div>

          <L label="Category">
            <select
              className={field}
              value={p.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </L>
          <L label="Local / regional name">
            <input
              className={field}
              value={p.local ?? ""}
              onChange={(e) => set("local", e.target.value)}
              placeholder="Eral"
            />
          </L>

          <L label="Price (₹)">
            <input
              type="number"
              className={field}
              value={p.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </L>
          <L label="MRP (₹)">
            <input
              type="number"
              className={field}
              value={p.mrp}
              onChange={(e) => set("mrp", Number(e.target.value))}
            />
          </L>

          <L label="Net weight / unit">
            <input
              className={field}
              value={p.unit}
              onChange={(e) => set("unit", e.target.value)}
              placeholder="500 g (Net 380 g)"
            />
          </L>
          <L label="Pieces">
            <input
              className={field}
              value={p.pieces ?? ""}
              onChange={(e) => set("pieces", e.target.value)}
              placeholder="12–15 prawns"
            />
          </L>

          <L label="Serves">
            <input
              className={field}
              value={p.serves ?? ""}
              onChange={(e) => set("serves", e.target.value)}
              placeholder="Serves 3"
            />
          </L>
          <L label="Tags (comma-separated)">
            <input
              className={field}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Bestseller, Cleaned"
            />
          </L>

          <L label="Rating (0–5)">
            <input
              type="number"
              step="0.1"
              className={field}
              value={p.rating}
              onChange={(e) => set("rating", Number(e.target.value))}
            />
          </L>
          <L label="Reviews">
            <input
              type="number"
              className={field}
              value={p.reviews}
              onChange={(e) => set("reviews", Number(e.target.value))}
            />
          </L>

          <div className="sm:col-span-2">
            <L label="Description">
              <textarea
                className={`${field} resize-none`}
                rows={3}
                value={p.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </L>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={!!p.soldOut}
              onChange={(e) => set("soldOut", e.target.checked)}
            />
            Out of stock
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={!!p.startFrom}
              onChange={(e) => set("startFrom", e.target.checked)}
            />
            Show “Start from ₹…”
          </label>
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-bold text-ink hover:bg-brand-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
