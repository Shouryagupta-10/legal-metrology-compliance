import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';
import { Reveal } from '../Effects/Reveal';

const TRUST_SLIDES = [
  {
    headline: ["TOTALLY", "LEGIT", "LOOKS", "GOOD"],
    sample: SAMPLE_PRODUCTS[0],
    inspectorRole: "Rule 6 & 11 Verified",
    statusBadge: "100% Compliant",
    statusColor: "text-emerald-400"
  },
  {
    headline: ["UH", "OH", "FIX", "THIS"],
    sample: SAMPLE_PRODUCTS[1],
    inspectorRole: "Defect Audit & Redline",
    statusBadge: "3 Violations",
    statusColor: "text-rose-400"
  },
  {
    headline: ["ALMOST", "THERE", "ONE", "GAP"],
    sample: SAMPLE_PRODUCTS[3],
    inspectorRole: "2021 USP Enforcement",
    statusBadge: "USP Missing",
    statusColor: "text-amber-400"
  }
];

export const BaselineTrustSection: React.FC<{
  onSelectSample: (sample: any) => void;
}> = ({ onSelectSample }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // 3D Parallax Tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 4,
    y: 0,
    glareX: 50,
    glareY: 50
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt range: -8deg to +8deg
    const rotX = (0.5 - y) * 14;
    const rotY = (x - 0.5) * 14;

    setTilt({
      x: rotX + 4,
      y: rotY,
      glareX: x * 100,
      glareY: y * 100
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    const rotX = (0.5 - y) * 14;
    const rotY = (x - 0.5) * 14;

    setTilt({
      x: rotX + 4,
      y: rotY,
      glareX: x * 100,
      glareY: y * 100
    });
  };

  const handleLeave = () => {
    setTilt({ x: 4, y: 0, glareX: 50, glareY: 50 });
  };

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
    <section className="relative isolate overflow-visible bg-[var(--background)] py-12 sm:py-20 px-3 sm:px-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Top Badges Row */}
      <Reveal variant="up" className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 relative z-20 w-full">
        {/* 100% Circular Assurance Badge */}
        <div
          onClick={() => {
            sounds.playSuccess();
          }}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[var(--lime)] to-[var(--sky)] border border-[var(--hairline)] flex flex-col items-center justify-center text-center p-2.5 sm:p-3 shadow-lg shrink-0 cursor-pointer hover:scale-110 hover:rotate-6 transition-transform wiggle-on-hover"
        >
          <span className="text-xl sm:text-3xl font-display font-semibold tracking-tight text-[var(--brand-deep)] leading-none">
            100%
          </span>
          <span className="text-[9px] sm:text-[10px] text-[var(--brand-deep)]/80 uppercase tracking-wider max-w-[8em] leading-tight mt-1 font-bold">
            Rules, Nailed
          </span>
        </div>

        {/* Informational Badge Card */}
        <article className="w-full sm:max-w-md bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--radius-card)] p-4 sm:p-5 flex items-start gap-3 sm:gap-4 shadow-sm">
          <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--hairline)] px-2.5 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base font-mono font-medium text-[var(--brand)] shadow-xs shrink-0">
            #0{activeSlide + 1}
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs sm:text-sm font-medium text-[var(--ink)] uppercase tracking-wide truncate">
                Legal Metrology Dept
              </h4>
              <span className={`text-[10px] font-mono font-bold shrink-0 ${current.statusColor}`}>
                {current.statusBadge}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--ink-soft)] leading-relaxed">
              Every SKU gets the full once-over: declarations, font-height tables, the works — before it ever hits shelves.
            </p>
          </div>
        </article>
      </Reveal>

      {/* Oversized PURPLE Ghost Heading Watermark with Complete Vertical Clearance */}
      <div className="mt-8 sm:mt-14 select-none pointer-events-none relative z-0 w-full overflow-visible px-1 sm:px-2">
        <h2 className="ghost-heading w-full space-y-8 sm:space-y-16">
          {/* Row 1 (Top Words) */}
          <div className="flex items-center justify-between w-full">
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[0]}
            </span>
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[1]}
            </span>
          </div>

          {/* Row 2 (Bottom Words) */}
          <div className="flex items-center justify-between w-full">
            <span className="ghost-word-ink transition-all duration-700">
              {current.headline[2]}
            </span>
            <span className="ghost-word-purple transition-all duration-700">
              {current.headline[3]}
            </span>
          </div>
        </h2>
      </div>

      {/* Center Interactive 3D Packaging Artwork Card */}
      <div className="relative z-10 flex justify-center -mt-20 sm:-mt-36 md:-mt-48 pb-4">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleLeave}
          onClick={() => {
            sounds.playClick();
            onSelectSample(current.sample);
            const el = document.getElementById('studio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer group relative w-44 sm:w-56 md:w-64 aspect-[3/4] rounded-[var(--radius-card)] bg-[var(--brand-deep)] overflow-hidden shadow-2xl transition-transform duration-200 ease-out ring-1 ring-purple-500/30 select-none touch-manipulation"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
          }}
        >
          {/* Specular Glare Reflection overlay following cursor/touch */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`
            }}
          />

          <img
            src={current.sample.thumbnail}
            alt={current.sample.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Floating Glass Caption */}
          <figcaption className="absolute inset-x-2 bottom-2 sm:inset-x-2.5 sm:bottom-2.5 rounded-xl bg-[#0f2f63]/85 backdrop-blur-md p-2 sm:p-2.5 text-white border border-white/20 z-30 space-y-0.5 shadow-lg">
            <div className="text-[11px] sm:text-xs font-medium truncate">{current.sample.name}</div>
            <div className="text-[9px] sm:text-[10px] text-purple-300 tracking-wider uppercase font-mono flex items-center justify-between">
              <span className="flex items-center gap-1 truncate">
                <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                <span className="truncate">{current.inspectorRole}</span>
              </span>
              <span className="text-[8px] sm:text-[9px] bg-white/15 px-1.5 py-0.5 rounded text-white/90 shrink-0">
                Inspect &rarr;
              </span>
            </div>
          </figcaption>
        </div>
      </div>

      {/* Carousel Controls Row */}
      <div className="flex items-center justify-between mt-6 sm:mt-10 relative z-20 px-2">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)] bg-[var(--surface-card)] flex items-center justify-center transition-colors btn-tactile shadow-xs"
          aria-label="Previous benchmark"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Interactive Dots */}
        <div className="flex items-center gap-2">
          {TRUST_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                setActiveSlide(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === activeSlide ? 'w-6 sm:w-8 bg-purple-500 shadow-sm shadow-purple-500/50' : 'w-2 bg-[var(--hairline)] hover:bg-purple-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--ink)] text-[var(--background)] hover:bg-[var(--brand-deep)] hover:text-white flex items-center justify-center transition-colors btn-tactile shadow-md"
          aria-label="Next benchmark"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
};