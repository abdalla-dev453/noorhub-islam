import { Link } from "react-router-dom";

const TONES = {
  default: "",
  quiet: "card--quiet",
  accent: "card--accent",
  sand: "card--sand",
};

/**
 * Surface card. Use `interactive` for a whole-card control and always give it
 * an accessible name via `label` or the content itself.
 */
export default function Card({
  children,
  title,
  aside,
  footer,
  tone = "default",
  tight = false,
  roomy = false,
  to,
  onClick,
  selected = false,
  className = "",
  ...rest
}) {
  const classes = [
    "card",
    TONES[tone] ?? "",
    tight ? "card--tight" : "",
    roomy ? "card--roomy" : "",
    to || onClick ? "card--interactive" : "",
    selected ? "card--selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {(title || aside) && (
        <div className="card__header">
          {title ? <h3 className="card__title">{title}</h3> : null}
          {aside ? <div className="cluster">{aside}</div> : null}
        </div>
      )}
      {children}
      {footer ? <div className="card__footer">{footer}</div> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} {...rest}>
        {body}
      </button>
    );
  }

  return (
    <section className={classes} {...rest}>
      {body}
    </section>
  );
}
