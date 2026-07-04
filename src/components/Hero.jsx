import { useState, useEffect } from "react";
import { EmojiImage, GeometricPattern } from "./ui/Primitives";
import { AVATAR_COLORS, EMOJI_ASSET_URLS } from "../data/constants";

const COUNT_TARGET = 12847;

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export default function Hero({ scrollTo }) {
  const count = useCountUp(COUNT_TARGET);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <GeometricPattern
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
        color="#22d3a5"
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,165,0.06) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 780,
          margin: "0 auto",
        }}
      >
        {/* Badge */}
        <div className="hero-badge">
          <EmojiImage
            src={EMOJI_ASSET_URLS.sparkle}
            alt=""
            size={12}
            style={{ marginRight: 6 }}
          />
          Now open to all Muslims worldwide
        </div>

        {/* Bismillah */}
        <div
          className="amiri"
          style={{
            fontSize: 18,
            color: "#22d3a5",
            marginBottom: 16,
            letterSpacing: "0.04em",
            opacity: 0.9,
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            color: "#f0eeff",
          }}
        >
          The knowledge of your
          <br />
          <span className="glow-text">Deen, unified.</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.65,
            color: "#9896b0",
            maxWidth: 560,
            margin: "0 auto 40px",
            fontWeight: 400,
          }}
        >
          Quran, Hadith, and structured Islamic learning — brought together in
          one place designed for the Muslim living a busy, modern life.
        </p>

        {/* CTAs */}
        <div
          className="hero-ctas"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-primary"
            style={{ fontSize: 16, padding: "15px 36px" }}
            onClick={() => typeof scrollTo === "function" && scrollTo("join")}
          >
            Begin Your Journey →
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: 16, padding: "15px 36px" }}
            onClick={() => typeof scrollTo === "function" && scrollTo("learn")}
          >
            Explore Features
          </button>
        </div>

        {/* Social proof strip */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            color: "#9896b0",
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex" }}>
            {AVATAR_COLORS.map((color, i) => (
              <div
                key={color}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: color,
                  border: "2px solid #060810",
                  marginLeft: i > 0 ? -8 : 0,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <span>
            <strong style={{ color: "#e8e6f0" }}>
              {count.toLocaleString()}+
            </strong>{" "}
            Muslims learning today
          </span>
        </div>
      </div>
    </section>
  );
}
