import { Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.tags?.includes("Bestseller"));
  const deals = [...PRODUCTS]
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    .slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="sky-band relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-100">
              🐟 Cleaned · Cut · Delivered in hours
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Ocean-fresh seafood,
              <span className="block bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                delivered to your door.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Hand-picked at the harbour every morning, cleaned and cut just the
              way you like. From vanjaram steaks to jumbo prawns — freshness you
              can taste.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:scale-105"
              >
                Shop the catch →
              </Link>
              <Link
                to="/shop?cat=Combo"
                className="rounded-xl border border-brand-200 bg-white px-6 py-3 font-bold text-brand-700 hover:bg-brand-50"
              >
                View combos
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              {[
                ["🚚", "Same-day delivery"],
                ["🧊", "Never frozen"],
                ["✅", "Freshness guarantee"],
              ].map(([i, t]) => (
                <span key={t} className="flex items-center gap-2 font-medium text-ink">
                  <span className="text-lg">{i}</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="animate-[float_6s_ease-in-out_infinite] mx-auto grid aspect-square max-w-sm place-items-center rounded-[2.5rem] bg-gradient-to-br from-brand-400 to-brand-600 text-[10rem] shadow-2xl">
              🎣
            </div>
            <div className="absolute -left-2 top-6 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-xs text-muted">Today's catch</p>
              <p className="font-extrabold text-ink">Seer · Prawns · Crab</p>
            </div>
            <div className="absolute -right-2 bottom-8 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-xs text-muted">Rated by 12,000+</p>
              <p className="font-extrabold text-amber-500">★ 4.8 / 5</p>
            </div>
          </div>
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
