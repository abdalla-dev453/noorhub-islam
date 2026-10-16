import { Link } from "react-router-dom";

/**
 * Section header with an optional eyebrow, description and inline action.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <header className={`section-header ${className}`}>
      <div>
        {eyebrow ? (
          <span className="section-header__eyebrow label">{eyebrow}</span>
        ) : null}
        <h2 className="section-header__title">{title}</h2>
        {description ? (
          <p className="section-header__desc">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link className="section-header__action" to={action.to}>
          {action.label}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </header>
  );
}
