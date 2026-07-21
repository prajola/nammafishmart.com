export default function Sourcing() {
  const steps = [
    ["🌅", "Dawn at the harbour", "Our buyers are at the docks by 5 AM, inspecting each boat's landing for freshness, size and quality."],
    ["🔍", "Quality check", "Only fish that pass our freshness checks — clear eyes, firm flesh, clean smell — make the cut."],
    ["🧊", "Cold chain begins", "Within minutes the catch is iced and moved into temperature-controlled crates. It never breaks 4°C."],
    ["🔪", "Cleaned to order", "At our processing centre, each order is scaled, cut and portioned fresh — never in advance."],
    ["📦", "Sealed & packed", "Vacuum-sealed, leak-proof and packed with ice gel to stay fresh right up to your door."],
    ["🚚", "Delivered same-day", "Our chilled delivery fleet gets it to you within hours of the catch being landed."],
  ];

  return (
    <div>
      <section className="sky-band">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-100">
            🌊 Our sourcing
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">
            From boat to box in{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              one unbroken cold chain.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Freshness isn't luck — it's a process. Here's exactly how your seafood
            travels from the harbour to your kitchen.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <ol className="relative space-y-6 before:absolute before:left-6 before:top-3 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-brand-100">
          {steps.map(([icon, title, desc], i) => (
            <li key={title} className="relative flex gap-4">
              <div className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-2xl text-white shadow-md">
                {icon}
              </div>
              <div className="rounded-2xl border border-white/10 bg-navy-800 p-5 shadow-[var(--shadow-soft)]">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["🐟", "Sustainably sourced", "We favour responsibly-caught species and avoid over-fished stock."],
            ["🧪", "Lab-tested", "Regular water and sample testing keeps every batch safe and clean."],
            ["♻️", "Zero-waste packing", "Recyclable, insulated packaging that keeps cold in and waste out."],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl bg-white/5 p-5">
              <div className="text-3xl">{i}</div>
              <h3 className="mt-2 font-bold text-ink">{t}</h3>
              <p className="text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
