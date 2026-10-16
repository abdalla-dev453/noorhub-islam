/**
 * Icon-only control. `label` is required and renders as the accessible name.
 */
export default function IconButton({
  icon: Icon,
  label,
  size = 20,
  variant = "plain",
  active = false,
  className = "",
  ...rest
}) {
  const classes = [
    "icon-btn",
    variant === "small" ? "icon-btn--sm" : "",
    variant === "bordered" ? "icon-btn--bordered" : "",
    active ? "is-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      title={label}
      aria-pressed={rest["aria-pressed"] ?? (active ? true : undefined)}
      {...rest}
    >
      <Icon size={size} aria-hidden="true" />
    </button>
  );
}
