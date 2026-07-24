import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/catalog";
import ProductCard from "../components/ProductCard";

type Sort = "popular" | "priceLow" | "priceHigh" | "discount";

export default function Shop() {
  const { categories: CATEGORIES, products: PRODUCTS } = useCatalog();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = params.get("cat");
  const [sort, setSort] = useState<Sort>("popular");

  const setQ = (v: string) => {
    const next = new URLSearchParams(params);
    v ? next.set("q", v) : next.delete("q");
    setParams(next, { replace: true });
  };
  const setCat = (v: string | null) => {
    const next = new URLSearchParams(params);
    v ? next.set("cat", v) : next.delete("cat");
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = PRODUCTS.slice();
    if (cat) list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.local ?? "").toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(s))
      );
    }
    switch (sort) {
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        list.sort(
          (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        );
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [q, cat, sort, PRODUCTS]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-ink">
        {cat ? CATEGORIES.find((c) => c.key === cat)?.label : "All Seafood"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {results.length} products{q ? ` for “${q}”` : ""} · cleaned & cut to order
      </p>

      {/* Search + sort */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search within seafood…"
            className="w-full rounded-xl border border-brand-100 bg-navy-800 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-xl border border-brand-100 bg-navy-800 px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-brand-400"
        >
          <option value="popular">Most popular</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="discount">Biggest discount</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <Pill active={!cat} onClick={() => setCat(null)}>
          All
        </Pill>
        {CATEGORIES.map((c) => (
          <Pill key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
            {c.emoji} {c.label}
          </Pill>
        ))}
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="grid place-items-center gap-3 py-20 text-center">
          <div className="text-6xl">🐠</div>
          <p className="text-lg font-bold text-ink">No catch found</p>
          <p className="text-sm text-muted">
            Try another search or browse a category.
          </p>
          <button
            onClick={() => {
              setQ("");
              setCat(null);
            }}
            className="mt-2 rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
          : "border border-brand-100 bg-navy-800 text-ink hover:border-brand-300"
      }`}
    >
      {children}
    </button>
  );
}
