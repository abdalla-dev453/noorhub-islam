// ── Horizontal rule ──────────────────────────────────────────────────────────
export function Divider({ className = "" }) {
  return <div className={`divider ${className}`} />;
}

// ── NoorHub star logo mark ────────────────────────────────────────────────────
export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <polygon
        points="16,2 20,10 29,10 22,16 25,25 16,20 7,25 10,16 3,10 12,10"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
      />
      <circle cx="16" cy="16" r="4" fill="var(--accent)" opacity="0.7" />
    </svg>
  );
}

// ── Islamic geometric SVG tile (tastefully used only in Quran page) ───────────
export function GeometricPattern({ style = {}, color = "var(--accent)", opacity = 1 }) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ ...style, color }}
    >
      <defs>
        <pattern id="geo-tile" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.5" opacity={opacity * 0.12}>
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            <circle cx="50" cy="50" r="30" />
            <polygon points="50,20 80,80 20,80" />
            <polygon points="50,80 80,20 20,20" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <circle cx="50" cy="50" r="48" />
          </g>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#geo-tile)" />
    </svg>
  );
}
