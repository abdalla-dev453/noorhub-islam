import { Info } from "lucide-react";

/**
 * Explanatory note. `tone="sand"` for source/assumption context,
 * `tone="danger"` for blocking messages.
 */
export default function Notice({
  children,
  tone = "default",
  icon: Icon = Info,
  className = "",
}) {
  const tones = {
    default: "",
    sand: "notice--sand",
    danger: "notice--danger",
  };

  return (
    <div className={`notice ${tones[tone] ?? ""} ${className}`.trim()}>
      <Icon size={17} className="notice__icon" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
