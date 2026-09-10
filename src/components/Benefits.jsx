import { BookOpen, Target, Users, Sparkles } from "lucide-react";
import { BENEFITS } from "../data/constants";

const ICONS = [BookOpen, Target, Users];

function BenefitCard({ icon: Icon, title, desc }) {
  return (
    <div className="noor-card p-7 space-y-4 group hover-elevate transition-all duration-300 relative">
      {/* Subtle top corner gradient accent */}
      <div className="pointer-events-none absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/15 to-emerald-500/5 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-teal-500/40 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300">
        <Icon size={22} className="text-[var(--accent)] group-hover:text-teal-300 transition-colors" strokeWidth={1.75} />
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-[var(--text-primary)] text-lg leading-snug tracking-tight group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
          {desc}
        </p>
      </div>

      <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        <Sparkles size={12} />
        <span>Designed for mastery</span>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="learn" className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="label-badge">Why NoorHub</span>
          <h2 className="section-title">
            Built for Muslims who take
            <br />
            <span className="text-[var(--accent)]">their growth seriously</span>
          </h2>
          <p className="section-sub">
            Designed from the ground up to give you clarity, consistency, and depth in your Islamic learning journey.
          </p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.title} icon={ICONS[i]} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
