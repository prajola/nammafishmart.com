import type { Category } from "../data";

/**
 * Self-contained SVG artwork per category — sky-blue palette, no external
 * images so the catalogue always renders (swap for photos later if wanted).
 */
export default function ProductArt({
  category,
  seed = 0,
  className = "",
}: {
  category: Category;
  seed?: number;
  className?: string;
}) {
  const gid = `${category}-${seed}`;
  const tones: Record<Category, [string, string]> = {
    Fish: ["#e0f2fe", "#bae6fd"],
    Prawns: ["#e0f7fb", "#c7ecf7"],
    Crab: ["#e6f4ff", "#c3e4fb"],
    Squid: ["#eef6ff", "#d5e9fb"],
    Shellfish: ["#e0f2fe", "#c9e9f5"],
    Dried: ["#eaf5fb", "#cfe8f3"],
    Combo: ["#e3f2fd", "#bfe4fb"],
  };
  const [c1, c2] = tones[category];

  return (
    <svg
      viewBox="0 0 200 150"
      className={className}
      role="img"
      aria-label={`${category} illustration`}
    >
      <defs>
        <linearGradient id={`bg-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`fin-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill={`url(#bg-${gid})`} />
      {/* soft bubbles */}
      <circle cx="30" cy="26" r="7" fill="#ffffff" opacity="0.5" />
      <circle cx="46" cy="16" r="4" fill="#ffffff" opacity="0.4" />
      <circle cx="172" cy="120" r="9" fill="#ffffff" opacity="0.45" />

      {category === "Fish" && <Fish gid={gid} />}
      {category === "Prawns" && <Prawn gid={gid} />}
      {category === "Crab" && <Crab gid={gid} />}
      {category === "Squid" && <Squid gid={gid} />}
      {category === "Shellfish" && <Shell gid={gid} />}
      {category === "Dried" && <Dried gid={gid} />}
      {category === "Combo" && <Combo gid={gid} />}
    </svg>
  );
}

const Fish = ({ gid }: { gid: string }) => (
  <g transform="translate(38,45)">
    <path d="M0 30C22 -2 78 -2 100 30 78 62 22 62 0 30Z" fill={`url(#fin-${gid})`} />
    <path d="M100 30 122 12v36L100 30Z" fill={`url(#fin-${gid})`} />
    <path d="M40 4c-6-10-2-16-2-16 8 2 12 10 12 14" fill="#7dd3fc" />
    <circle cx="26" cy="26" r="5.5" fill="#fff" />
    <circle cx="27" cy="26" r="2.6" fill="#0c4a6e" />
    <path d="M52 18c10 6 10 18 0 24" stroke="#e0f2fe" strokeWidth="3" fill="none" opacity="0.8" />
  </g>
);

const Prawn = ({ gid }: { gid: string }) => (
  <g transform="translate(48,40)">
    <path
      d="M14 8c30-6 66 4 78 30 8 18-6 34-26 30-4 20-30 22-38 6 16 6 28-2 26-14-22 6-46-6-52-24-4-14 2-30 12-34Z"
      fill={`url(#fin-${gid})`}
    />
    <path d="M14 8C4 4-4 8-6 16" stroke="#0369a1" strokeWidth="3" fill="none" />
    <path d="M14 8C6 0 0 0 -6 4" stroke="#0369a1" strokeWidth="3" fill="none" />
    <circle cx="20" cy="18" r="3.5" fill="#fff" />
    <circle cx="20" cy="18" r="1.8" fill="#0c4a6e" />
    <path d="M40 22c6 8 22 12 34 8M46 34c8 6 22 6 30 0" stroke="#e0f2fe" strokeWidth="3" fill="none" opacity="0.8" />
  </g>
);

const Crab = ({ gid }: { gid: string }) => (
  <g transform="translate(50,44)">
    <ellipse cx="50" cy="40" rx="40" ry="26" fill={`url(#fin-${gid})`} />
    <path d="M18 30C2 22-6 30-8 40M82 30c16-8 24 0 26 10" stroke="#0369a1" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M6 38c-8 0-12 6-12 12M94 38c8 0 12 6 12 12" stroke="#0369a1" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M20 58l-8 12M40 64l-4 12M60 64l4 12M80 58l8 12" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
    <circle cx="40" cy="30" r="4.5" fill="#fff" />
    <circle cx="60" cy="30" r="4.5" fill="#fff" />
    <circle cx="40" cy="30" r="2.2" fill="#0c4a6e" />
    <circle cx="60" cy="30" r="2.2" fill="#0c4a6e" />
  </g>
);

const Squid = ({ gid }: { gid: string }) => (
  <g transform="translate(72,32)">
    <path d="M28 0C46 0 54 16 52 34l-6 30c-2 8-14 8-16 0l-4-22-4 22c-2 8-14 8-16 0L4 34C2 16 10 0 28 0Z" fill={`url(#fin-${gid})`} />
    <path d="M18 60c-2 14-8 20-14 22M38 60c2 14 8 20 14 22M28 62v24" stroke="#0369a1" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="24" r="4" fill="#fff" />
    <circle cx="36" cy="24" r="4" fill="#fff" />
    <circle cx="20" cy="24" r="2" fill="#0c4a6e" />
    <circle cx="36" cy="24" r="2" fill="#0c4a6e" />
  </g>
);

const Shell = ({ gid }: { gid: string }) => (
  <g transform="translate(58,40)">
    <path d="M42 66C6 66-6 26 22 6c14-10 26-6 20 10-6-16 22-20 30 2 10 26-2 48-30 48Z" fill={`url(#fin-${gid})`} />
    <path d="M42 64C40 40 34 22 22 8M42 64c2-24 8-42 20-56M42 64C42 44 42 26 42 8" stroke="#e0f2fe" strokeWidth="3" fill="none" opacity="0.85" />
  </g>
);

const Dried = ({ gid }: { gid: string }) => (
  <g transform="translate(40,52)">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 40}, ${i % 2 ? 10 : 0})`}>
        <path d="M0 16C14 2 40 2 54 16 40 30 14 30 0 16Z" fill={`url(#fin-${gid})`} />
        <path d="M54 16 68 6v20L54 16Z" fill={`url(#fin-${gid})`} />
        <circle cx="16" cy="14" r="2.6" fill="#fff" />
      </g>
    ))}
  </g>
);

const Combo = ({ gid }: { gid: string }) => (
  <g transform="translate(44,40)">
    <rect x="6" y="20" width="100" height="52" rx="10" fill={`url(#fin-${gid})`} />
    <rect x="6" y="20" width="100" height="16" rx="8" fill="#0369a1" opacity="0.35" />
    <path d="M56 8c-8-8-22-4-18 8 4 10 18 8 18 8s14 2 18-8c4-12-10-16-18-8Z" fill="#7dd3fc" />
    <path d="M56 16v56M18 36v36M94 36v36" stroke="#e0f2fe" strokeWidth="3" opacity="0.7" />
  </g>
);
