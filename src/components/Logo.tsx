import { asset } from "../lib/asset";

/**
 * Namma Fish Mart brand mark — the actual logo artwork (fish + coral curve)
 * with a transparent background, so it sits cleanly on any surface.
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={asset("/logo.png")}
      alt="Namma Fish Mart"
      className={`object-contain ${className}`}
    />
  );
}

export function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="h-10 w-10" />
      <span className="leading-tight">
        <span
          className={`block text-lg font-extrabold tracking-tight ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          Namma<span className="text-brand-500">Fish</span>Mart
        </span>
        <span
          className={`hidden text-[10px] font-semibold uppercase tracking-[0.2em] sm:block ${
            dark ? "text-brand-200" : "text-muted"
          }`}
        >
          Fresh from the coast
        </span>
      </span>
    </span>
  );
}
