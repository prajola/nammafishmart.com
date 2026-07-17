import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How fresh is the seafood?",
    a: "We source the day's catch from harbour fishermen every morning and deliver it the same day. It's kept in an unbroken cold chain (never above 4°C) from the dock to your door — so it reaches you as fresh as it gets.",
  },
  {
    q: "Do you clean and cut the fish for me?",
    a: "Yes — free of charge. Every order is scaled, gutted, filleted or curry-cut exactly how you like, then vacuum-sealed and packed with ice gel. Just tell us your preference at checkout.",
  },
  {
    q: "Is anything ever frozen?",
    a: "No. Everything is fresh, never frozen. Dried and cured items (like Nethili karuvadu) are sun-dried by design, but all our fish, prawns, crab and squid are delivered fresh.",
  },
  {
    q: "What are your delivery timings and areas?",
    a: "We deliver same-day across Chennai, Bengaluru, Hyderabad, Coimbatore, Madurai and Kochi, daily from 6 AM to 10 PM. Pick a convenient slot at checkout — most orders arrive within a few hours.",
  },
  {
    q: "Is there a delivery charge or minimum order?",
    a: "Delivery is a flat ₹39, and it's completely FREE on orders over ₹599. There's no minimum order value — buy as little or as much as you like.",
  },
  {
    q: "How can I pay?",
    a: "We accept UPI (GPay/PhonePe), all major credit & debit cards (Visa, Mastercard, RuPay) and Cash on Delivery. Payments are 100% secure.",
  },
  {
    q: "What if I'm not happy with my order?",
    a: "Freshness is guaranteed. If anything isn't up to the mark, contact us within 24 hours and we'll replace it or refund you — no questions asked.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 ring-1 ring-brand-100">
          💬 Got questions?
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-muted">
          Everything you need to know about fresh-catch delivery.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                isOpen ? "border-brand-300 shadow-[var(--shadow-soft)]" : "border-brand-100"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-bold text-ink">{item.q}</span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-lg transition ${
                    isOpen
                      ? "rotate-45 bg-brand-600 text-white"
                      : "bg-brand-50 text-brand-600"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Still have questions?{" "}
        <a href="/contact" className="font-bold text-brand-600 hover:underline">
          Get in touch →
        </a>
      </p>
    </section>
  );
}
