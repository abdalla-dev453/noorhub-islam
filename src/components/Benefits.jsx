import { BENEFITS } from "../data/constants";
import { OctagonBadge } from "./ui/Primitives";

function BenefitCard({ icon, title, desc, accent }) {
  return (
    <div className="benefit-card">
      <OctagonBadge color={accent}>{icon}</OctagonBadge>

      <h3
        style={{
          fontSize: 19,
          fontWeight: 600,
          color: "#f0eeff",
          marginTop: 20,
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#7a7894" }}>
        {desc}
      </p>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: accent,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Learn more <span>→</span>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section
      id="learn"
      style={{ padding: "96px 24px", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-eyebrow">Why NoorHub</div>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#f0eeff",
              lineHeight: 1.15,
            }}
          >
            Built for Muslims who take
            <br />
            their growth seriously
          </h2>
        </div>

        {/* Cards */}
        <div
          className="benefits-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
