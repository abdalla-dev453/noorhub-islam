import { STATS } from "../data/constants";
import { Sparkles } from "lucide-react";

export default function StatsStrip() {
  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle light streak */}
          <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] blur-2xl" />
          
          <div className="stats-grid divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className={`py-4 sm:py-0 sm:px-6 text-center space-y-1.5 transition-transform duration-300 hover:scale-[1.03] group ${
                  idx === 0 ? "sm:pl-0" : ""
                }`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent font-mono drop-shadow-sm group-hover:drop-shadow-[0_0_12px_rgba(20,184,166,0.4)] transition-all">
                  {stat.num}
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                  {stat.label}
                </div>
                <div className="text-xs text-[var(--text-muted)] font-mono">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
