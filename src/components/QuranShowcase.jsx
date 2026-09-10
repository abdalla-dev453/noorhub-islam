import { CheckCircle2, Sparkles, Volume2, BookOpen } from "lucide-react";
import { QURAN_FEATURES } from "../data/constants";
import { GeometricPattern } from "./ui/Primitives";
import { useNavigate } from "react-router-dom";

function AyahCard() {
  const navigate = useNavigate();

  return (
    <div className="noor-card relative overflow-hidden p-6 sm:p-8 space-y-6 group border-teal-500/20 hover:border-teal-500/40 shadow-xl">
      {/* Background geometry pattern */}
      <GeometricPattern
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      {/* Subtle glowing radial gradient in the card */}
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <span className="label-badge gold-badge text-[11px] py-1">At-Talaq 65:2</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
              Madani
            </span>
          </div>
          <button
            onClick={() => navigate("/quran")}
            className="flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline"
          >
            <Volume2 size={13} />
            <span>Listen</span>
          </button>
        </div>

        {/* Arabic verse */}
        <p
          className="arabic text-2xl sm:text-3xl text-[var(--text-primary)] text-right leading-loose tracking-wide"
          lang="ar"
        >
          وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
        </p>

        {/* Translation */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] italic font-serif leading-relaxed">
          &ldquo;And whoever is mindful of Allah — He will make for them a way out.&rdquo;
        </p>

        {/* Tafsir excerpt */}
        <div className="p-4 rounded-xl bg-[var(--surface-glass)] border border-[var(--border)] space-y-1.5 backdrop-blur-sm">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
            <Sparkles size={12} />
            Classical Commentary (Tafsir)
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
            A timeless divine reassurance: sincere mindfulness (Taqwa) and complete reliance on Allah is consistently answered with relief from every hardship.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QuranShowcase() {
  const navigate = useNavigate();

  return (
    <section id="quran" className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="label-badge">Sacred Texts</span>
            <h2 className="section-title">
              The Noble Quran & Hadith,
              <br />
              <span className="text-[var(--accent)]">structured for understanding</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Every ayah is accompanied with clear English translations, world-class reciters, and contextual tafsir commentary. Explore Sahih Bukhari, Muslim, and core Sunnah collections with authenticated chains.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {QURAN_FEATURES.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 text-sm text-[var(--text-secondary)] group"
              >
                <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-teal-500/50 transition-colors">
                  <CheckCircle2
                    size={13}
                    className="text-[var(--accent)]"
                  />
                </div>
                <span className="group-hover:text-[var(--text-primary)] transition-colors">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate("/quran")}
              className="btn btn-primary text-xs py-2.5 px-5"
            >
              <BookOpen size={14} />
              Read & Listen to Quran
            </button>
          </div>
        </div>

        {/* Right: Ayah card */}
        <AyahCard />
      </div>
    </section>
  );
}
