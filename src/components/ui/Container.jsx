import { Link } from "react-router-dom";

/**
 * Constrains content to the shell measure. Renders a Link when `to` is set.
 */
export default function Container({
  children,
  to,
  variant = "default",
  className = "",
  ...rest
}) {
  const classes = [
    "container",
    variant === "narrow" && "container--narrow",
    variant === "reading" && "container--reading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
