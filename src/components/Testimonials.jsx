import { Star, Quote, Heart } from "lucide-react";
import { TESTIMONIALS } from "../data/constants";

function TestimonialCard({ initials, name, loc, quote }) {
  return (
    <div className="noor-card p-6 space-y-4 group hover-elevate transition-all duration-300 relative">
      <Quote size={24} className="text-[var(--accent)] opacity-20 absolute top-5 right-5 pointer-events-none group-hover:opacity-40 transition-opacity" />
      
      {/* 5-star row with gold shimmer */}
      <div className="flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} className="drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
        ))}
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal italic">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-slate-950 shadow-md shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">{name}</p>
          <p className="text-xs text-[var(--text-muted)] font-mono">{loc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="label-badge gold-badge">
            <Heart size={12} className="text-amber-400" />
            Loved by the Ummah
          </span>
          <h2 className="section-title">
            Trusted by seekers of knowledge
            <br />
            <span className="text-[var(--accent)]">across 40+ nations</span>
          </h2>
          <p className="section-sub">
            Real stories from Muslims who transformed their daily Quran, Hadith, and Islamic study habits with NoorHub.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
