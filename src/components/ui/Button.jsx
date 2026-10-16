import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  quiet: "btn--quiet",
  danger: "btn--danger",
};

const SIZES = {
  sm: "btn--sm",
  lg: "btn--lg",
};

/**
 * Button. Renders a react-router Link when `to` is provided, an anchor when
 * `href` is provided, otherwise a button.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  to,
  href,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = [
    "btn",
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? "",
    block ? "btn--block" : "",
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

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
