import React from 'react';
import { CompoundingSimulator } from '../Compliance/CompoundingSimulator';
import { Reveal } from '../Effects/Reveal';

export const BaselineStatsSection: React.FC = () => {
  const stats = [
    { value: "10/10", label: "Mandatory declarations, double-checked", color: "var(--lime)", emoji: "✅" },
    { value: "Table 1", label: "Font-height rules, made bite-sized", color: "var(--sky)", emoji: "🔍" },
    { value: "₹25K–1L", label: "Fines you'll never have to pay", color: "var(--coral)", emoji: "🛡️" },
    { value: "2021/22", label: "The USP law, finally in your corner", color: "var(--sunny)", emoji: "⚡" }
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-3 py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto shadow-2xl space-y-12">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 blob blob-float bg-[var(--sky)]/20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-56 h-56 blob blob-float bg-[var(--coral)]/20 pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <Reveal variant="up" className="max-w-2xl relative z-10">
        <div className="baseline-eyebrow tone-light mb-3">
          <span className="eyebrow-dot" />
          <span>By the numbers, no boring stuff</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-semibold uppercase tracking-tight leading-[0.95]">
          A compliance engine that <span className="text-gradient-candy">keeps score</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/70 mt-3 font-mono">
          Every clause of the Legal Metrology (Packaged Commodities) Rules, 2011 — checked, colour-coded and ready to ship.
        </p>
      </Reveal>

      {/* 4-Up Stats Grid — playful cards */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        {stats.map((item, idx) => (
          <Reveal key={idx} variant="scale" delay={(idx + 1) as 1 | 2 | 3 | 4}>
            <div
              className="pop-card group h-full rounded-[var(--radius-card)] p-5 sm:p-6 bg-white/10 border border-white/15 backdrop-blur cursor-default"
              style={{ boxShadow: `0 0 0 1px transparent` }}
            >
              <span className="text-2xl float-idle inline-block" style={{ animationDelay: `${idx * 0.3}s` }}>
                {item.emoji}
              </span>
              <dt className="sr-only">{item.label}</dt>
              <dd
                className="text-3xl sm:text-5xl font-display font-semibold tracking-tight mt-2"
                style={{ color: item.color }}
              >
                {item.value}
              </dd>
              <p className="text-xs text-white/70 font-medium leading-snug mt-2">
                {item.label}
              </p>
            </div>
          </Reveal>
        ))}
      </dl>

      {/* Embedded Interactive Compounding Sandbox */}
      <Reveal variant="up" className="pt-6 border-t border-white/15 relative z-10">
        <CompoundingSimulator />
      </Reveal>
    </section>
  );
};
