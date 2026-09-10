import { ArrowRight, Sparkles, BookOpen, ShieldCheck, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection({ scrollTo }) {
  const navigate = useNavigate();

  return (
    <section
      id="join"
      className="relative py-28 px-6 text-center overflow-hidden"
    >
      {/* Dynamic Ambient Luxury Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15)_0%,rgba(234,179,8,0.05)_40%,transparent_70%)] blur-3xl opacity-80 animate-pulseGlow" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-7 glass-panel p-8 sm:p-12 rounded-3xl border border-teal-500/20 shadow-2xl">
        <div className="inline-block px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
          <p className="arabic text-xl sm:text-2xl text-[var(--accent)] font-medium" lang="ar">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
        </div>

        <h2 className="section-title text-3xl sm:text-4xl">
          Begin your journey in
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
            sacred Islamic knowledge.
          </span>
        </h2>

        <p className="section-sub text-sm sm:text-base font-normal">
          100% free and open to everyone. No paywalls, no distracting ads. Access structured courses, live halaqat, and comprehensive Tafsir whenever you are ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => {
              if (typeof scrollTo === "function") scrollTo("join");
              navigate("/register");
            }}
            className="btn btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-semibold group shadow-[0_4px_20px_rgba(20,184,166,0.4)]"
          >
            <span>Create Free Account</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate("/learn")}
            className="btn btn-secondary w-full sm:w-auto px-7 py-3.5 text-sm font-semibold"
          >
            <BookOpen size={15} className="text-[var(--accent)]" />
            <span>Browse Academy</span>
          </button>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-4 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={12} className="text-[var(--accent)]" />
            Free Core Access
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-[var(--accent)]" />
            Authentic Scholarly Sources
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Heart size={12} className="text-amber-400" />
            Ad-Free Experience
          </span>
        </div>
      </div>
    </section>
  );
}
