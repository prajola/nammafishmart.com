import { useEffect, useState } from "react";
import { useStore } from "../context/store";

export default function WelcomePopup() {
  const { seenWelcome, markWelcomeSeen, toast } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (seenWelcome) return;
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [seenWelcome]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    markWelcomeSeen();
  };
  const grab = () => {
    navigator.clipboard?.writeText("NEW50").catch(() => {});
    toast("Coupon NEW50 copied — apply at checkout!", "success");
    close();
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={close} />
      <div className="pop-in relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-center shadow-2xl">
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink hover:bg-white"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="sky-band px-8 pt-10 pb-8">
          <div className="animate-[float_6s_ease-in-out_infinite] text-6xl">🎣</div>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-brand-600">
            Fresh-Catch Welcome Offer
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-ink">Flat ₹50 OFF</h2>
          <p className="mt-1 text-sm text-muted">on your first order over ₹299</p>
        </div>
        <div className="px-8 pb-8 pt-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="rounded-lg border-2 border-dashed border-brand-400 bg-brand-50 px-4 py-2 text-lg font-extrabold tracking-widest text-brand-700">
              NEW50
            </span>
          </div>
          <button
            onClick={grab}
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105"
          >
            Grab the offer
          </button>
          <button onClick={close} className="mt-2 text-sm text-muted hover:underline">
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
