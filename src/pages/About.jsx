import { BookOpen, Code, ShieldCheck } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Free & Ad-Free",
    desc: "Built with zero monetization or commercial distraction.",
  },
  {
    icon: BookOpen,
    title: "Verified Sources",
    desc: "Directly referenced from authentic classical compilations and scholars.",
  },
  {
    icon: Code,
    title: "Open Source",
    desc: "Built collaboratively for continuous utility and community benefit.",
  },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="label-badge">Our Mission</span>
        <h1 className="section-title">About NoorHub</h1>
        <p className="section-sub">
          A modern, distraction-free platform connecting authentic Islamic
          knowledge to everyday digital lives.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {VALUES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="noor-card text-center space-y-3 p-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--accent)]">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Narrative Card */}
      <div className="noor-card p-6 sm:p-10 space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Our Vision
        </h2>
        <div className="w-12 h-1 bg-[var(--accent)] rounded-full" />

        <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pt-2">
          <p>
            NoorHub was created to solve a widespread problem in Islamic digital
            resources: authentic source material is often trapped behind
            outdated user interfaces, intrusive advertisements, or disconnected
            apps.
          </p>
          <p>
            Our goal is to provide a clean, high-performance workspace where
            students of all backgrounds can study the Quran, read authenticated
            Hadith, and follow structured curricula at their own pace.
          </p>
        </div>
      </div>
    </div>
  );
}
