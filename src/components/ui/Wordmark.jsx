import { Link } from "react-router-dom";
import LogoMark from "./LogoMark";

export default function Wordmark({ to = "/", label = "NoorHub — home" }) {
  return (
    <Link to={to} className="wordmark" aria-label={label}>
      <LogoMark className="wordmark__mark" />
      <span className="wordmark__text">NoorHub</span>
    </Link>
  );
}
