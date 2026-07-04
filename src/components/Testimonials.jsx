import { EMOJI_ASSET_URLS, TESTIMONIALS } from "../data/constants";
import { EmojiImage } from "./ui/Primitives";

function TestimonialCard({ initials, name, loc, quote }) {
  return (
    <div className="testimonial-card">
      {/* Stars */}
      <div
        style={{
          display: "flex",
          color: "#f59e0b",
          fontSize: 14,
          gap: 2,
          marginBottom: 16,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <EmojiImage key={i} src={EMOJI_ASSET_URLS.star} alt="" size={14} />
        ))}
      </div>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "#9896b0",
          marginBottom: 20,
        }}
      >
        "{quote}"
      </p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22d3a5, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#060810",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e6f0" }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: "#5a5870" }}>{loc}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="about"
      style={{ padding: "96px 24px", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-eyebrow">Community</div>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#f0eeff",
            }}
          >
            The Ummah is already here
          </h2>
        </div>

        {/* Cards */}
        <div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
