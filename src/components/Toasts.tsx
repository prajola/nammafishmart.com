import { useStore } from "../context/store";

const ICONS = {
  success: "✅",
  info: "ℹ️",
  error: "⚠️",
  cart: "🛒",
} as const;

export default function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,340px)] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="toast-in pointer-events-auto flex items-center gap-3 rounded-xl border border-white/10 bg-navy-800/95 px-4 py-3 text-left shadow-[var(--shadow-card)] backdrop-blur"
        >
          <span className="text-lg">{ICONS[t.type]}</span>
          <span className="text-sm font-medium text-ink">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
