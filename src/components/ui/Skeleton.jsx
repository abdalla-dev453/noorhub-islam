export function Skeleton({ variant = "text", className = "", style }) {
  const variants = {
    text: "skeleton--text",
    title: "skeleton--title",
    block: "skeleton--block",
  };
  return (
    <div
      className={`skeleton ${variants[variant] ?? "skeleton--text"} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Layered skeleton for verse lists and article lists. */
export function SkeletonList({ rows = 3, className = "" }) {
  return (
    <div className={`stack ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="card card--tight">
          <Skeleton variant="title" />
          <Skeleton />
          <Skeleton style={{ width: "70%" }} />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ label = "Loading" }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <span className="spinner" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}
