import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

/**
 * Continue card: the single primary "resume where you left off" action.
 * Always shows real current state — never a generic call to action.
 */
export default function ContinueCard({
  eyebrow = "Continue reading",
  title,
  detail,
  to,
  progress,
  progressLabel,
  cta = "Continue",
  onNavigate,
}) {
  return (
    <article className="continue-action">
      <p className="continue-action__label">{eyebrow}</p>
      <h2 className="continue-action__title">{title}</h2>
      {detail ? <p className="continue-action__verse">{detail}</p> : null}
      {typeof progress === "number" ? (
        <div className="continue-action__progress">
          <ProgressBar value={progress} label={progressLabel} />
        </div>
      ) : null}
      <div className="continue-action__row">
        <Link className="btn btn--primary" to={to} onClick={onNavigate}>
          {cta}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
