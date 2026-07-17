/**
 * Namma Fish Mart brand mark — a sleek, modern fish inside a gradient
 * badge with futuristic "motion" trails. Self-contained SVG; scales
 * crisply from favicon to hero size.
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Namma Fish Mart"
    >
      <defs>
        <linearGradient id="nfm-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.55" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="nfm-fish" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dff1fe" />
        </linearGradient>
        <radialGradient id="nfm-sheen" cx="0.3" cy="0.15" r="0.9">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Badge */}
      <rect width="48" height="48" rx="13" fill="url(#nfm-badge)" />
      <rect width="48" height="48" rx="13" fill="url(#nfm-sheen)" />

      {/* Futuristic motion trails */}
      <g stroke="#bae6fd" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
        <line x1="4.5" y1="19" x2="9" y2="19" />
        <line x1="3" y1="24.5" x2="8.5" y2="24.5" />
        <line x1="4.5" y1="30" x2="9" y2="30" />
      </g>

      {/* Dorsal fin */}
      <path d="M20 14.5 Q 24 8 28.5 14 Q 24 15 20 14.5 Z" fill="url(#nfm-fish)" />
      {/* Body */}
      <path
        d="M11 24.5 C 16 15 29 15 33.5 24.5 C 29 34 16 34 11 24.5 Z"
        fill="url(#nfm-fish)"
      />
      {/* Tail */}
      <path
        d="M32 24.5 L 42 18 C 39.5 24.5 39.5 24.5 42 31 Z"
        fill="url(#nfm-fish)"
      />
      {/* Eye */}
      <circle cx="18" cy="22.5" r="2.1" fill="#0c4a6e" />
      {/* Spark node — the "smart" accent */}
      <circle cx="35" cy="15" r="2" fill="#7dd3fc" />
      <circle cx="35" cy="15" r="3.4" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
    </svg>
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
      <LogoMark className="h-10 w-10 shadow-md" />
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
