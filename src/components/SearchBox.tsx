import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { discountPct, money } from "../data";
import { useCatalog } from "../context/catalog";
import ProductImage from "./ProductImage";

/**
 * Live search with a typeahead dropdown. Filters as you type, shows the
 * top matches (click to open a product), and submits to the shop page on
 * Enter or when the magnifier is clicked. Works from any page.
 */
export default function SearchBox({
  placeholder = "Search seer fish, prawns, crab…",
  autoFocusHint,
}: {
  placeholder?: string;
  autoFocusHint?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const { products: PRODUCTS } = useCatalog();

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.local ?? "").toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(s))
    ).slice(0, 6);
  }, [q, PRODUCTS]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const goToShop = (term: string) => {
    setOpen(false);
    nav(`/shop?q=${encodeURIComponent(term.trim())}`);
  };
  const goToProduct = (id: string) => {
    setOpen(false);
    setQ("");
    nav(`/product/${id}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, matches.length)); // last index = "see all"
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < matches.length) goToProduct(matches[active].id);
      else if (q.trim()) goToShop(q);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) goToShop(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => q && setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="w-full rounded-xl border border-brand-200 bg-brand-50 py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-muted outline-none transition focus:border-brand-400 focus:bg-brand-100 focus:ring-2 focus:ring-brand-400/30"
          aria-label="Search products"
        />
        {/* clickable magnifier — submits */}
        <button
          type="submit"
          aria-label="Search"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-brand-600"
        >
          🔍
        </button>
        {q && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full px-1 text-muted hover:text-ink"
          >
            ✕
          </button>
        )}
      </form>

      {/* Dropdown */}
      {open && q.trim() && (
        <div className="pop-in absolute left-0 right-0 top-12 z-[60] overflow-hidden rounded-2xl border border-brand-100 bg-navy-800 shadow-2xl">
          {matches.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted">
              No matches for “{q}”. Try “prawns”, “crab” or “seer”.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto py-1">
              {matches.map((p, i) => (
                <li key={p.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                      active === i ? "bg-brand-50" : "hover:bg-brand-50"
                    }`}
                  >
                    <ProductImage
                      product={p}
                      className="h-10 w-10 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {p.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {p.category}
                        {p.local ? ` · ${p.local}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-bold text-brand-700">
                        {money(p.price)}
                      </span>
                      {discountPct(p) > 0 && (
                        <span className="block text-[10px] font-bold text-green-600">
                          {discountPct(p)}% off
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => goToShop(q)}
            className={`block w-full border-t border-brand-100 px-3 py-2.5 text-center text-sm font-bold ${
              active === matches.length && matches.length
                ? "bg-brand-50 text-brand-700"
                : "text-brand-600 hover:bg-brand-50"
            }`}
          >
            See all results for “{q}” →
          </button>
        </div>
      )}
    </div>
  );
}
