import React from "react";

const TEAM_BLOCKS = [
  { metric: "100%", text: "Ad-Free Design", desc: "Completely clear of corporate revenue nodes or distraction banners." },
  { metric: "Vetted", text: "Primary Datasets", desc: "Connecting directly to established academic reference vectors." },
  { metric: "Open", text: "Source Codebase", desc: "Built collaboratively for continuous utility optimizations." }
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Visual Hub Header Context */}
      <div className="text-center space-y-4">
        <span className="glow-badge">Our Mission</span>
        <h1 className="text-4xl md:text-5xl gradient-heading">About NoorHub</h1>
        <p className="sub-heading">An elegant platform connecting verified Islamic resources to digital workspaces.</p>
      </div>

      {/* Grid Panels Layout Elements Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEAM_BLOCKS.map((item, index) => (
          <div key={index} className="noor-card text-center flex flex-col justify-between py-8 group">
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
                {item.metric}
              </div>
              <h3 className="font-bold text-sm text-slate-200 tracking-wide uppercase font-sans pt-1">
                {item.text}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto pt-3">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Platform Manifesto Layer Detail Block */}
      <div className="noor-card p-8 md:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none geometric-overlay" />
        
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">The Vision Blueprint</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
        </div>

        <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed relative z-10">
          <p>
            NoorHub was established to solve a common digital problem: traditional resource websites 
            are frequently overloaded with ads, tracking scripts, and outdated user interfaces. We 
            provide access to classical source materials within a clean design framework.
          </p>
          <p>
            By leveraging client-side browser caching pools, local storage layers, and live API endpoints, 
            the application remains fast and secure across both desktop and mobile workspaces.
          </p>
        </div>
      </div>
    </div>
  );
}
