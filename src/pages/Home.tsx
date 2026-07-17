import { Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import { LogoMark } from "../components/Logo";

export default function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.tags?.includes("Bestseller"));
  const deals = [...PRODUCTS]
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    .slice(0, 8);

  return (
    <div>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Trust bar */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          {[
            ["🚚", "Same-day delivery"],
            ["🧊", "Never frozen"],
            ["🔪", "Cleaned & cut free"],
            ["✅", "Freshness guarantee"],
          ].map(([i, t]) => (
            <span key={t} className="flex items-center gap-2 font-semibold text-ink">
              <span className="text-lg">{i}</span>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Namma Prime membership strip */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white shadow-lg sm:flex-row sm:p-6">
          <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-md">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-extrabold tracking-tight text-brand-700">
              Namma<span className="text-brand-500">Prime</span> 👑
            </span>
          </div>
          <p className="flex-1 text-center font-semibold sm:text-left">
            Enjoy special member prices & unlimited free deliveries — always.
          </p>
          <Link
            to="/shop"
            className="shrink-0 rounded-xl bg-white px-5 py-2.5 font-bold text-brand-700 shadow-md transition hover:scale-105"
          >
            Know more
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-2xl font-extrabold text-ink">
          Shop by category
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:overflow-visible">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/shop?cat=${c.key}`}
              className="group flex min-w-[104px] flex-col items-center gap-2 rounded-2xl border border-brand-100 bg-white p-4 text-center shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-brand-300"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-3xl transition group-hover:scale-110">
                {c.emoji}
              </span>
              <span className="text-xs font-bold text-ink">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["🎣", "First order?", "Flat ₹50 off with NEW50"],
            ["🌊", "Over ₹999?", "Get 20% off with OCEAN20"],
            ["🚚", "Over ₹599?", "Free delivery, always"],
          ].map(([i, t, s]) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-4"
            >
              <span className="text-3xl">{i}</span>
              <div>
                <p className="font-extrabold text-ink">{t}</p>
                <p className="text-sm text-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <Section title="🔥 Bestsellers" to="/shop" products={bestsellers} />

      {/* Deals */}
      <Section title="💙 Today's best deals" to="/shop" products={deals} />
    </div>
  );
}

function Section({
  title,
  to,
  products,
}: {
  title: string;
  to: string;
  products: typeof PRODUCTS;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-ink">{title}</h2>
        <Link to={to} className="text-sm font-bold text-brand-600 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
