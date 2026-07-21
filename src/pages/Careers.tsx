import { useStore } from "../context/store";

const ROLES = [
  ["Harbour Quality Lead", "Chennai", "Operations", "Full-time"],
  ["Delivery Fleet Partner", "Bengaluru", "Logistics", "Contract"],
  ["Seafood Processing Expert", "Kochi", "Operations", "Full-time"],
  ["Customer Care Associate", "Remote", "Support", "Full-time"],
  ["Frontend Engineer", "Remote", "Technology", "Full-time"],
  ["Growth Marketer", "Hyderabad", "Marketing", "Full-time"],
];

export default function Careers() {
  const { toast } = useStore();
  return (
    <div>
      <section className="sky-band">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-100">
            💼 Careers
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">
            Help us bring freshness{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              to every kitchen.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            We're a fast-growing team obsessed with quality, freshness and
            delight. Come build something that matters — one catch at a time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-5 text-2xl font-extrabold text-ink">Open positions</h2>
        <div className="space-y-3">
          {ROLES.map(([title, loc, dept, type]) => (
            <div
              key={title}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-navy-800 p-5 shadow-[var(--shadow-soft)] transition hover:border-brand-300"
            >
              <div>
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 font-semibold text-brand-700">
                    📍 {loc}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 font-semibold text-brand-700">
                    {dept}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 font-semibold text-brand-700">
                    {type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toast(`Application started for ${title}! 📧`, "success")}
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105"
              >
                Apply now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white/5 p-6 text-center">
          <p className="font-bold text-ink">Don't see your role?</p>
          <p className="text-sm text-muted">
            We're always keen to meet great people. Write to us at{" "}
            <span className="font-semibold text-brand-700">careers@nammafishmart.com</span>
          </p>
        </div>
      </section>
    </div>
  );
}
