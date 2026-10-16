export function Badge({ children, tone = "default", className = "" }) {
  const tones = {
    default: "",
    accent: "badge--accent",
    gold: "badge--gold",
    outline: "badge--outline",
    live: "badge--live",
  };
  return (
    <span
      className={`badge ${tones[tone] ?? ""} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/**
 * Compact filter control. `active` is expressed with aria-pressed so state is
 * never communicated by colour alone.
 */
export function Tag({ children, active = false, onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`tag ${className}`.trim()}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Rule({ gold = false, className = "" }) {
  return <hr className={`${gold ? "rule--gold" : "rule"} ${className}`.trim()} />;
}
