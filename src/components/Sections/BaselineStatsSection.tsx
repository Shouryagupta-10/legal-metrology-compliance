import React from 'react';
import { CompoundingSimulator } from '../Compliance/CompoundingSimulator';

export const BaselineStatsSection: React.FC = () => {
  const stats = [
    { value: "10/10", label: "Mandatory Declarations Verified" },
    { value: "Table 1", label: "Schedule II Font Height Minimums" },
    { value: "₹25K–1L", label: "Section 36 Compounding Fine Scale" },
    { value: "2021/22", label: "Mandatory Unit Sale Price (USP) Law" }
  ];

  return (
    <section className="bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-3 py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto shadow-2xl space-y-12">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="baseline-eyebrow tone-light mb-3">
          <span className="eyebrow-dot" />
          <span>By the numbers</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-medium uppercase tracking-tight leading-[0.95]">
          A statutory engine that keeps score
        </h2>
        <p className="text-xs sm:text-sm text-white/70 mt-3 font-mono">
          Rigorous enforcement across all legal clauses of the Legal Metrology (Packaged Commodities) Rules, 2011 and Legal Metrology Act, 2009.
        </p>
      </div>

      {/* 4-Up Stats Grid */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-white/20 pt-8">
        {stats.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <dt className="sr-only">{item.label}</dt>
            <dd className="text-4xl sm:text-6xl font-medium tracking-tight font-mono text-white">
              {item.value}
            </dd>
            <p className="text-xs text-white/65 font-medium leading-snug">
              {item.label}
            </p>
          </div>
        ))}
      </dl>

      {/* Embedded Interactive Compounding Sandbox */}
      <div className="pt-6 border-t border-white/15">
        <CompoundingSimulator />
      </div>
    </section>
  );
};
