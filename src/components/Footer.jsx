import { LogoMark } from "./ui/Primitives";

const FOOTER_LINKS = ["Privacy", "Terms", "Contact", "Quran", "Hadith"];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 24px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={24} />
          <span
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: 18,
              color: "#e8e6f0",
            }}
          >
            NoorHub
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link) => (
            <span
              key={link}
              style={{ fontSize: 13, color: "#44425a", cursor: "pointer" }}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: 12, color: "#44425a" }}>
          © 2026 NoorHub. Built with love for the Ummah.
        </div>
      </div>
    </footer>
  );
}