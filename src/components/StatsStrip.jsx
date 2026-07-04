import { STATS } from "../data/constants";

export default function StatsStrip() {
  return (
    <section style={{ padding: "72px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "28px 24px",
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: i % 2 === 0 ? "#22d3a5" : "#a78bfa",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e8e6f0",
                  marginTop: 6,
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: "#5a5870", marginTop: 3 }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
