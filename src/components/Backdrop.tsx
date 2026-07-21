/**
 * Ambient warm coral "splash" backdrop — soft blurred blobs + a few cute
 * bubbles drifting gently behind the page. Fixed, non-interactive and
 * low-opacity so content stays perfectly readable.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft splash blobs */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl [animation:drift_16s_ease-in-out_infinite]" />
      <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-brand-200/35 blur-3xl [animation:drift-slow_20s_ease-in-out_infinite]" />
      <div className="absolute left-8 top-[45%] h-64 w-64 rounded-full bg-brand-300/26 blur-3xl [animation:drift_18s_ease-in-out_infinite]" />
      <div className="absolute bottom-28 right-12 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl [animation:drift-slow_22s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-brand-100/55 blur-3xl [animation:drift_19s_ease-in-out_infinite]" />

      {/* Cute little bubbles */}
      <span className="absolute left-[12%] top-[22%] h-5 w-5 rounded-full bg-brand-300/40 [animation:bob_7s_ease-in-out_infinite]" />
      <span className="absolute left-[9%] top-[28%] h-2.5 w-2.5 rounded-full bg-brand-400/40 [animation:bob_5s_ease-in-out_infinite]" />
      <span className="absolute right-[14%] top-[38%] h-6 w-6 rounded-full border-2 border-brand-300/40 [animation:bob_9s_ease-in-out_infinite]" />
      <span className="absolute right-[20%] top-[30%] h-3 w-3 rounded-full bg-brand-300/45 [animation:bob_6s_ease-in-out_infinite]" />
      <span className="absolute left-[46%] bottom-[16%] h-4 w-4 rounded-full border-2 border-brand-300/40 [animation:bob_8s_ease-in-out_infinite]" />
      <span className="absolute right-[8%] bottom-[24%] h-3.5 w-3.5 rounded-full bg-brand-300/35 [animation:bob_7.5s_ease-in-out_infinite]" />
    </div>
  );
}
