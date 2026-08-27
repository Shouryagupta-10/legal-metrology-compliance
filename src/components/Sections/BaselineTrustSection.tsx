import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';

const TRUST_SLIDES = [
  {
    headline: ["STATUTORY", "ASSURANCE", "LEGAL", "METROLOGY"],
    sample: SAMPLE_PRODUCTS[0],
    inspectorRole: "Rule 6 & 11 Verified"
  },
  {
    headline: ["PACKAGED", "COMMODITIES", "RULES", "2011"],
    sample: SAMPLE_PRODUCTS[1],
    inspectorRole: "Defect Audit & Redline"
  },
  {
    headline: ["SCHEDULE", "TABLE 1", "SECTION", "36 PENALTY"],
    sample: SAMPLE_PRODUCTS[3],
    inspectorRole: "2021 USP Enforcement"
  }
];

export const BaselineTrustSection: React.FC<{
  onSelectSample: (sample: any) => void;
}> = ({ onSelectSample }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrev = () => {
    sounds.playClick();
    setActiveSlide(prev => (prev === 0 ? TRUST_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sounds.playClick();
    setActiveSlide(prev => (prev + 1) % TRUST_SLIDES.length);
  };

  const current = TRUST_SLIDES[activeSlide];

  return (
    <section className="relative isolate overflow-hidden bg-[var(--background)] py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Top Badges Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-20">
        {/* 100% Circular Assurance Badge */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[var(--surface)] border border-[var(--hairline)] flex flex-col items-center justify-center text-center p-3 shadow-sm shrink-0">
          <span className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--ink)] font-mono">
            100%
          </span>
          <span className="text-[10px] text-[var(--ink-soft)] uppercase tracking-wider max-w-[8em] leading-tight mt-1">
            Statutory Rule Adherence
          </span>
        </div>

        {/* Informational Badge Card */}
        <article className="max-w-md bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--radius-card)] p-4 sm:p-5 flex items-start gap-4 shadow-sm">
          <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--hairline)] px-3 py-1.5 text-base font-mono font-medium text-[var(--ink)] shadow-xs">
            #01
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--ink)] uppercase tracking-wide">
              Enforced by Legal Metrology Department
            </h4>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed mt-1">
              From FMCG retail staples to imported cosmetics, every commercial packaging SKU is evaluated against mandatory statutory declarations and Schedule II font height tables.
            </p>
          </div>
        </article>
      </div>

      {/* Oversized PURPLE Ghost Heading Watermark */}
      <div className="mt-12 sm:mt-16 text-center select-none pointer-events-none relative z-0">
        <h2 className="ghost-heading">
          <div className="flex justify-between items-center">
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[0]}
            </span>
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[1]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="ghost-word-ink transition-all duration-700">
              {current.headline[2]}
            </span>
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[3]}
            </span>
          </div>
        </h2>
      </div>

      {/* Center Tilted Packaging Artwork Card */}
      <div className="relative z-10 flex justify-center -mt-16 sm:-mt-24">
        <figure
          onClick={() => {
            sounds.playClick();
            onSelectSample(current.sample);
            const el = document.getElementById('studio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer group relative w-48 sm:w-60 aspect-[3/4] rounded-[var(--radius-card)] bg-[var(--brand-deep)] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 ring-1 ring-purple-500/30"
          style={{ transform: 'rotate(6deg)' }}
        >
          <img
            src={current.sample.thumbnail}
            alt={current.sample.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Glass Caption at Bottom */}
          <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0f2f63]/75 backdrop-blur-md p-2.5 text-white border border-white/20">
            <div className="text-xs font-medium truncate">{current.sample.name}</div>
            <div className="text-[10px] text-purple-300 tracking-wider uppercase font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
              <span>{current.inspectorRole}</span>
            </div>
          </figcaption>
        </figure>
      </div>

      {/* Carousel Controls Row */}
      <div className="flex items-center justify-between mt-12 sm:mt-16 relative z-20">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)] bg-[var(--surface-card)] flex items-center justify-center transition-colors btn-tactile shadow-xs"
          aria-label="Previous benchmark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center gap-2">
          {TRUST_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                setActiveSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeSlide ? 'w-6 bg-purple-500' : 'w-2 bg-[var(--hairline)]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-[var(--ink)] text-[var(--background)] hover:bg-[var(--brand-deep)] hover:text-white flex items-center justify-center transition-colors btn-tactile shadow-md"
          aria-label="Next benchmark"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
