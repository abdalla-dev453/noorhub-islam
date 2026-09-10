import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Play, BookOpen, Compass } from "lucide-react";

const COUNT_TARGET = 14280;

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    let animId;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, duration]);
  return count;
}

export default function Hero({ scrollTo }) {
  const navigate = useNavigate();
  const count = useCountUp(COUNT_TARGET);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center text-center px-6 py-24 sm:py-32 overflow-hidden"
    >
      {/* Dynamic Ambient Luxury Lighting Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,rgba(13,148,136,0.06)_45%,transparent_70%)] blur-3xl opacity-80 animate-pulseGlow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-20 w-[420px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12)_0%,transparent_65%)] blur-3xl opacity-60 animate-floatSlow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -right-20 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_65%)] blur-3xl opacity-50 animate-floatSlowReverse"
      />

      {/* Decorative Islamic Geometric Pattern Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 geometric-overlay opacity-40"
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-fadeUp">
        {/* Bismillah Header with subtle luxury aura */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--surface-glass)] border border-[var(--border)] backdrop-blur-md shadow-sm">
          <p
            className="arabic text-lg sm:text-xl text-[var(--accent)] font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]"
            lang="ar"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>

        {/* Floating pill badge */}
        <div className="flex justify-center">
          <span className="label-badge flex items-center gap-2 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
            </span>
            <Sparkles size={13} className="text-[var(--accent)]" />
            <span>Islamic Knowledge Platform for the Modern Ummah</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[var(--text-primary)] leading-[1.08] tracking-tight">
          The timeless wisdom of your
          <br />
          <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-200 bg-clip-text text-transparent drop-shadow-sm">
            Deen, elevated.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed font-normal">
          Immerse yourself in authentic Quranic recitations, verified Hadiths, and live & structured video curricula curated by reputable Islamic scholars.
        </p>

        {/* CTAs with luxury button effects */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            className="btn btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-semibold group"
            onClick={() => navigate("/learn")}
          >
            <BookOpen size={16} className="text-slate-950" />
            <span>Explore Islamic Academy</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            className="btn btn-secondary w-full sm:w-auto px-7 py-3.5 text-sm font-semibold group backdrop-blur-md"
            onClick={() => navigate("/quran")}
          >
            <Compass size={16} className="text-[var(--accent)]" />
            <span>Open Noble Quran</span>
          </button>
        </div>

        {/* Live Active Students Counter */}
        <div className="pt-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[var(--text-muted)]">
          <div className="flex -space-x-2 overflow-hidden items-center mr-2">
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg)] bg-teal-600/80 text-[10px] text-white font-bold flex items-center justify-center">ن</span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg)] bg-emerald-600/80 text-[10px] text-white font-bold flex items-center justify-center">ح</span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg)] bg-amber-600/80 text-[10px] text-white font-bold flex items-center justify-center">م</span>
          </div>
          <p>
            <span className="font-bold text-[var(--text-primary)]">
              {count.toLocaleString()}+
            </span>{" "}
            Muslims studying worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
