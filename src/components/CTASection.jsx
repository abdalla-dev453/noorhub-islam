import { Link } from "react-router-dom";
import { EmojiImage, GeometricPattern } from "./ui/Primitives";
import Register from "../pages/Register";
import { EMOJI_ASSET_URLS } from "../data/constants";

export default function CTASection({ scrollTo }) {
  return (
    <section
      id="join"
      style={{
        padding: "112px 24px",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
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
          opacity: 0.6,
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
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(34,211,165,0.07) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        {/* Arabic heading */}
        <div
          style={{
            fontFamily: "'Amiri', serif",
            fontSize: 22,
            color: "#22d3a5",
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          اقْرَأْ بِاسْمِ رَبِّكَ
        </div>

        <h2
          style={{
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#f0eeff",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Start learning before
          <br />
          <span className="glow-text">Maghrib tonight.</span>
        </h2>

        <p
          style={{
            fontSize: 17,
            color: "#7a7894",
            lineHeight: 1.65,
            marginBottom: 40,
          }}
        >
          Free to start. No credit card. No barriers between you and your Deen.
          Join over 12,000 Muslims who chose to take their knowledge seriously.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <Link
            to={Register}
            className="btn-primary"
            style={{ fontSize: 16, padding: "16px 40px" }}
            onClick={() => typeof scrollTo === "function" && scrollTo("join")}
          >
            Create Free Account →
          </Link>
          <button
            className="btn-secondary"
            style={{ fontSize: 16, padding: "16px 32px" }}
          >
            Watch Demo
          </button>
        </div>

        {/* Trust badges */}
        <p
          style={{
            fontSize: 13,
            color: "#44425a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <EmojiImage src={EMOJI_ASSET_URLS.sparkle} alt="" size={12} />
            Free forever for core features
          </span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <EmojiImage src={EMOJI_ASSET_URLS.sparkle} alt="" size={12} />
            No ads, ever
          </span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <EmojiImage src={EMOJI_ASSET_URLS.sparkle} alt="" size={12} />
            Built by Muslims, for Muslims
          </span>
        </p>
      </div>
    </section>
  );
}
