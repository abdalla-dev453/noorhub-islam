import { GeometricPattern } from "./ui/Primitives";
import { QURAN_FEATURES } from "../data/constants";

function AyahCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background geometry */}
      <GeometricPattern
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
        color="#a78bfa"
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Arabic text */}
        <div
          style={{
            fontFamily: "'Amiri', serif",
            fontSize: 28,
            color: "#e8e6f0",
            lineHeight: 1.8,
            marginBottom: 16,
            textAlign: "right",
            direction: "rtl",
          }}
        >
          وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
        </div>

        {/* Translation */}
        <div
          style={{
            fontSize: 14,
            color: "#7a7894",
            fontStyle: "italic",
            marginBottom: 16,
          }}
        >
          "And whoever fears Allah — He will make for him a way out."
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <span
            style={{
              background: "rgba(34,211,165,0.1)",
              border: "1px solid rgba(34,211,165,0.2)",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              color: "#22d3a5",
            }}
          >
            At-Talaq 65:2
          </span>
          <span
            style={{
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              color: "#a78bfa",
            }}
          >
            Meccan
          </span>
        </div>

        {/* Tafsir excerpt */}
        <div
          style={{
            padding: 16,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#5a5870",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Tafsir Ibn Kathir
          </div>
          <p style={{ fontSize: 13, color: "#7a7894", lineHeight: 1.65 }}>
            This ayah was revealed as a direct comfort to 'Awf ibn Malik
            al-Ansari, and carries a universal promise: taqwa is never without
            its divine exit...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QuranShowcase() {
  return (
    <section
      id="quran"
      style={{ padding: "96px 24px", position: "relative", zIndex: 1 }}
    >
      <div
        className="feature-grid"
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left: copy */}
        <div>
          <div className="section-eyebrow">Quran & Hadith</div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#f0eeff",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            The sacred texts, the way they were meant to be experienced
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.75,
              color: "#7a7894",
              marginBottom: 28,
            }}
          >
            Every ayah comes with its transliteration, multiple translations,
            and contextual tafsir from classical scholars. Every hadith carries
            its full chain, grading, and a plain-language explanation of what it
            means for your life today.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QURAN_FEATURES.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 14,
                  color: "#9896b0",
                }}
              >
                <span style={{ color: "#22d3a5", marginTop: 2, flexShrink: 0 }}>
                  ✓
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ayah card */}
        <AyahCard />
      </div>
    </section>
  );
}
