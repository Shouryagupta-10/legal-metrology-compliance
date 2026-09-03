import React, { useState } from 'react';
import GooeyNav from '../GooeyNav';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const GooeyNavShowcase: React.FC = () => {
  const [activeTabName, setActiveTabName] = useState('Studio');

  const items = [
    { label: "Studio", href: "#studio" },
    { label: "Checklist", href: "#checklist" },
    { label: "Benchmarks", href: "#benchmarks" },
    { label: "Triage", href: "#triage" },
    { label: "Rulebook", href: "#" }
  ];

  return (
    <section className="rounded-[var(--radius-card)] bg-gradient-to-b from-[#120F17] to-[#0A0710] border border-white/10 p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[18rem] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
          <span>Interactive Liquid Navigation</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-white">
          Gooey Navigation Physics Engine
        </h2>

        <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed">
          Switch between compliance verification sectors with liquid gooey pill physics, multi-particle radial trajectory dispersion, and variable time-velocity curves.
        </p>

        {/* GooeyNav Container */}
        <div className="py-6 w-full flex items-center justify-center">
          <GooeyNav
            items={items}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            onItemSelect={(item) => {
              sounds.playClick();
              setActiveTabName(item.label);
            }}
          />
        </div>

        {/* Active Tab Feedback Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/90">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Viewport Destination:</span>
          <strong className="text-purple-300 uppercase">{activeTabName}</strong>
        </div>
      </div>
    </section>
  );
};

export default GooeyNavShowcase;
