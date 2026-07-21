import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <section className="sky-band">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-100">
            🐟 Our story
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">
            Fresh from the coast,
            <span className="block bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              straight to your kitchen.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Namma Fish Mart started with a simple idea — buying quality seafood
            shouldn't mean a 6 AM trip to a crowded market. We bring the harbour
            to your doorstep: hand-picked, cleaned, cut and delivered the same day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["12,000+", "Happy customers"],
            ["6", "Cities served"],
            ["100%", "Never frozen"],
            ["4.8★", "Average rating"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="rounded-2xl border border-white/10 bg-navy-800 p-5 text-center shadow-[var(--shadow-soft)]"
            >
              <p className="text-3xl font-extrabold text-brand-700">{n}</p>
              <p className="text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["🎣", "Caught fresh daily", "We partner with harbour fishermen and pick the day's best catch — no cold-storage leftovers."],
            ["🔪", "Cleaned & cut for you", "Scaled, gutted, filleted or curry-cut exactly how you like — free, and hygienically packed."],
            ["🚚", "Same-day delivery", "Temperature-controlled delivery in hours, so it reaches you as fresh as the moment it was picked."],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-navy-800 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-4xl">{i}</div>
              <h3 className="mt-3 text-lg font-bold text-ink">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Taste the difference freshness makes
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-50">
            Join thousands of home cooks who've made the switch to truly fresh seafood.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block rounded-xl bg-navy-800 px-6 py-3 font-bold text-brand-700 shadow-md transition hover:scale-105"
          >
            Shop the catch →
          </Link>
        </div>
      </section>
    </div>
  );
}
