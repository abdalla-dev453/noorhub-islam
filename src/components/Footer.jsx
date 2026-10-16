import { Link } from "react-router-dom";
import { NAV_GROUPS } from "../data/defaults";
import Wordmark from "./ui/Wordmark";

const LEGAL = [
  { label: "About this project", to: "/about" },
  { label: "Accessibility", to: "/about" },
  { label: "Contact", to: "/about" },
];

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="app-footer__top">
          <div>
            <Wordmark label="NoorHub — home" />
            <p className="app-footer__mission">
              NoorHub is a quiet workspace for reading the Quran, keeping prayer
              times, memorising, and learning — built for a steadier practice
              rather than more screen time.
            </p>
          </div>

          {NAV_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`}>
              <p className="app-footer__group-title">{group.title}</p>
              {group.items.map((item) => (
                <Link key={item.label} className="app-footer__link" to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}

          <nav aria-label="Account and legal links">
            <p className="app-footer__group-title">Account</p>
            <Link className="app-footer__link" to="/settings">
              Profile and privacy
            </Link>
            <Link className="app-footer__link" to="/login">
              Sign in
            </Link>
            {LEGAL.map((item) => (
              <Link key={item.label} className="app-footer__link" to={item.to}>
                {item.label}
              </Link>
            ))}
            <Link className="app-footer__link" to="/settings">
              Export or delete data
            </Link>
          </nav>
        </div>

        <div className="app-footer__bottom">
          <p>© {new Date().getFullYear()} NoorHub</p>
          <p className="app-footer__sources">
            Quran text: Uthmani edition · Translation: Sahih International · Text
            and audio via AlQuran Cloud. Hadith text from the fawazahmed0
            hadith-api editions; grading and narrator chains are not yet
            included. Prayer times are calculated on your device and can differ
            from your local mosque timetable.
          </p>
        </div>
      </div>
    </footer>
  );
}
