import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from "../lib/asset";

type Slide = {
  eyebrow: string;
  title: string;
  offer: string;
  cta: string;
  to: string;
  img: string;
  grad: string; // background gradient classes
  accent: string; // offer text color
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Sun-dried & cured",
    title: "Dry Fish Delicacies",
    offer: "Up to 22% OFF",
    cta: "Shop dried",
    to: "/shop?cat=Dried",
    img: "/images/dried-anchovy.jpg",
    grad: "from-amber-100 via-brand-50 to-white",
    accent: "text-amber-600",
  },
  {
    eyebrow: "Fresh catch of the day",
    title: "Jumbo Tiger Prawns",
    offer: "Flat 24% OFF",
    cta: "Order now",
    to: "/product/tiger-prawns",
    img: "/images/tiger-prawns.jpg",
    grad: "from-brand-100 via-brand-50 to-white",
    accent: "text-brand-600",
  },
  {
    eyebrow: "Best-value combo",
    title: "Family Feast Box",
    offer: "Save ₹491",
    cta: "Grab combo",
    to: "/product/family-feast",
    img: "/images/family-feast.jpg",
    grad: "from-cyan-100 via-brand-50 to-white",
    accent: "text-cyan-600",
  },
  {
    eyebrow: "Always on us",
    title: "Free Delivery over ₹599",
    offer: "Same-day delivery",
    cta: "Start shopping",
    to: "/shop",
    img: "/images/seer-steaks.jpg",
    grad: "from-brand-200 via-brand-50 to-white",
    accent: "text-brand-700",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;

  // Auto-advance; resets whenever the slide changes (incl. manual nav).
  useEffect(() => {
    const t = setTimeout(() => setI((x) => (x + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, n]);

  const go = (d: number) => setI((x) => (x + d + n) % n);

  // Touch swipe (mobile)
  const [touchX, setTouchX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    setTouchX(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-brand-100 shadow-[var(--shadow-card)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {SLIDES.map((s, idx) => (
            <div
              key={idx}
              className={`grid w-full shrink-0 grid-cols-1 items-center gap-4 bg-gradient-to-br ${s.grad} p-6 sm:grid-cols-2 sm:p-10 md:min-h-[340px]`}
            >
              {/* Text */}
              <div className="order-2 sm:order-1">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 shadow-sm ring-1 ring-brand-100">
                  🐟 {s.eyebrow}
                </span>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-5xl">
                  {s.title}
                </h2>
                <p className={`mt-2 text-2xl font-extrabold md:text-3xl ${s.accent}`}>
                  {s.offer}
                </p>
                <Link
                  to={s.to}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:scale-105"
                >
                  {s.cta} →
                </Link>
              </div>

              {/* Image */}
              <div className="order-1 flex justify-center sm:order-2">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-white/50 blur-2xl" />
                  <img
                    src={asset(s.img)}
                    alt={s.title}
                    className="relative h-40 w-40 rounded-full border-4 border-white object-cover shadow-xl sm:h-56 sm:w-56 md:h-64 md:w-64"
                  />
                  <span className="absolute -right-1 top-2 rotate-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                    {s.offer.replace("Up to ", "").replace("Flat ", "")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-md transition hover:bg-white sm:grid"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-md transition hover:bg-white sm:grid"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand-600" : "w-2 bg-brand-300 hover:bg-brand-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
