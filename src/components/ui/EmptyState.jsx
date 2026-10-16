import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  to,
  onClick,
}) {
  return (
    <div className="empty-state">
      {Icon ? (
        <span className="empty-state__icon">
          <Icon size={20} aria-hidden="true" />
        </span>
      ) : null}
      <p className="empty-state__title">{title}</p>
      {description ? <p className="empty-state__desc">{description}</p> : null}
      {action && to ? (
        <Link className="btn btn--secondary btn--sm" to={to}>
          {action}
        </Link>
      ) : null}
      {action && !to ? (
        <button type="button" className="btn btn--secondary btn--sm" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
