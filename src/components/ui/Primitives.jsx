import { useId, useState } from "react";

export function EmojiImage({ src, alt = "", size = 16, style = {}, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        objectFit: "contain",
        ...style,
      }}
      {...props}
    />
  );
}

// ── Islamic geometric SVG tile ──────────────────────────────────────────────
export function GeometricPattern({
  style = {},
  color = "#22d3a5",
  opacity = 1,
}) {
  const id = useId();
  const pid = `star-pattern-${id}`;

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ ...style, color }}
    >
      <defs>
        <pattern
          id={pid}
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={opacity * 0.15}
          >
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            <circle cx="50" cy="50" r="30" />
            <polygon points="50,20 80,80 20,80" />
            <polygon points="50,80 80,20 20,20" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
            <circle cx="50" cy="50" r="48" />
          </g>
        </pattern>
      </defs>
      <rect width="400" height="400" fill={`url(#${pid})`} />
    </svg>
  );
}

// ── Octagonal icon badge (Islamic geometry inspired) ────────────────────────
export function OctagonBadge({ children, color }) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 64,
        height: 64,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        aria-hidden="true"
      >
        <polygon
          points="20,4 44,4 60,20 60,44 44,60 20,60 4,44 4,20"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          opacity="0.6"
        />
        <polygon
          points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22"
          fill={color}
          opacity="0.08"
        />
      </svg>
      <span style={{ fontSize: 24, position: "relative", zIndex: 1 }}>
        {children}
      </span>
    </div>
  );
}

// ── Ambient star field (fixed, behind everything) ───────────────────────────
export function StarField() {
  const [stars] = useState(() => {
    if (typeof window === "undefined") return [];
    return Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Horizontal gradient rule ─────────────────────────────────────────────────
export function Divider() {
  return <div className="divider" />;
}

// ── NoorHub star logo mark ───────────────────────────────────────────────────
export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <polygon
        points="16,2 20,10 29,10 22,16 25,25 16,20 7,25 10,16 3,10 12,10"
        fill="none"
        stroke="#22d3a5"
        strokeWidth="1.2"
      />
      <circle cx="16" cy="16" r="4" fill="#22d3a5" opacity="0.6" />
    </svg>
  );
}
