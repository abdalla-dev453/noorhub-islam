export default function LogoMark({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Two overlapping squares — a quiet reference to the rubʿ el-hizb */}
      <rect
        x="6.5"
        y="6.5"
        width="19"
        height="19"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="6.5"
        y="6.5"
        width="19"
        height="19"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(45 16 16)"
      />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  );
}
