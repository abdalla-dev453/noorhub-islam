/**
 * Progress bar. Always accompanies a text value so progress is never
 * communicated by the bar alone.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  tone = "accent",
  className = "",
}) {
  const safeMax = max > 0 ? max : 100;
  const percent = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));

  return (
    <div className={`progress ${className}`.trim()}>
      {(label || showValue) && (
        <div className="progress__meta">
          {label ? <span>{label}</span> : <span />}
          {showValue ? <span className="progress__value">{percent}%</span> : null}
        </div>
      )}
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress__bar ${tone === "gold" ? "progress__bar--gold" : ""}`.trim()}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
