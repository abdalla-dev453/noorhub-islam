import { useNavigate } from "react-router-dom";
import { LogoMark } from "./ui/Primitives";

const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Quran", to: "/quran" },
  { label: "Hadith", to: "/hadith" },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-[var(--border)] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6">
        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group focus:outline-none"
          aria-label="NoorHub home"
        >
          <LogoMark size={22} />
          <span className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            NoorHub
          </span>
        </button>

        {/* Links */}
        <nav className="flex flex-wrap gap-5" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) =>
            link.to ? (
              <button
                key={link.label}
                onClick={() => navigate(link.to)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-[var(--text-muted)]">
          © 2026 NoorHub. Built with love for the Ummah.
        </p>
      </div>
    </footer>
  );
}