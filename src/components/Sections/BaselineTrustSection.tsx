import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Sliders, CheckCircle2, AlertTriangle, LayoutGrid, Layers } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';
import { Reveal } from '../Effects/Reveal';
import ChromaGrid, { ChromaItem } from '../ChromaGrid';

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

const CHROMA_SKU_ITEMS: ChromaItem[] = [
  {
    image: SAMPLE_PRODUCTS[0].thumbnail,
    title: SAMPLE_PRODUCTS[0].name,
    subtitle: 'Heritage Basmati Rice • Rule 6(1) & 11 Verified',
    handle: '100% PASS',
    location: 'Schedule II Table 1 Cleared',
    borderColor: '#10B981',
    gradient: 'linear-gradient(145deg, #10B981 0%, #064e3b 45%, #051410 100%)',
    sample: SAMPLE_PRODUCTS[0]
  },
  {
    image: SAMPLE_PRODUCTS[1].thumbnail,
    title: SAMPLE_PRODUCTS[1].name,
    subtitle: 'Crispo Potato Chips • Illegal Unit "gms" Flagged',
    handle: '3 VIOLATIONS',
    location: 'Rule 6(1)(c) Non-Compliant',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(145deg, #EF4444 0%, #7f1d1d 45%, #180505 100%)',
    sample: SAMPLE_PRODUCTS[1]
  },
  {
    image: SAMPLE_PRODUCTS[2].thumbnail,
    title: SAMPLE_PRODUCTS[2].name,
    subtitle: 'GlowCare Cold Cream • Missing Tax Inclusivity Clause',
    handle: 'TAX OMITTED',
    location: 'Rule 6(1)(e) Deficiency',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(145deg, #F59E0B 0%, #78350f 45%, #1c0e03 100%)',
    sample: SAMPLE_PRODUCTS[2]
  },
  {
    image: SAMPLE_PRODUCTS[3].thumbnail,
    title: SAMPLE_PRODUCTS[3].name,
    subtitle: 'SunGold Sunflower Oil • Missing 2021 Mandated USP',
    handle: 'USP DEFICIT',
    location: 'Section 36(1) Notice',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(145deg, #3B82F6 0%, #1e3a8a 45%, #050d21 100%)',
    sample: SAMPLE_PRODUCTS[3]
  },
  {
    image: SAMPLE_PRODUCTS[4].thumbnail,
    title: SAMPLE_PRODUCTS[4].name,
    subtitle: 'Shree Pure Desi Ghee • Adhesive Sticker Overprint & Dual MRP',
    handle: 'TAMPER SEIZURE',
    location: 'Priority 1 Stock Seizure',
    borderColor: '#A855F7',
    gradient: 'linear-gradient(145deg, #A855F7 0%, #581c87 45%, #180326 100%)',
    sample: SAMPLE_PRODUCTS[4]
  }
];

export const BaselineTrustSection: React.FC<{
  onSelectSample: (sample: any) => void;
}> = ({ onSelectSample }) => {
  const [viewMode, setViewMode] = useState<'chroma' | 'parallax'>('chroma');
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

          {/* Mode Switcher */}
          <div className="flex flex-col gap-1.5 shrink-0 pl-2 border-l border-[var(--hairline)]">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('chroma');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all btn-tactile ${
                viewMode === 'chroma'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[var(--surface-card)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>ChromaGrid</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('parallax');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all btn-tactile ${
                viewMode === 'parallax'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-[var(--surface-card)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Tilt</span>
            </button>
          </div>
        </article>
      </Reveal>

      {/* Conditional: ChromaGrid Spotlight Matrix vs Parallax Carousel */}
      {viewMode === 'chroma' ? (
        <div className="mt-8 relative z-20 w-full">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)]">
                Commercial Benchmark SKU Matrix • GSAP Chroma Spotlight
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--ink-soft)] bg-[var(--surface-card)] px-3 py-1 rounded-full border border-[var(--hairline)]">
              Hover cursor within 300px radius to reveal full color • Click SKU to inspect
            </div>
          </div>

          <div
            style={{ minHeight: '620px', position: 'relative' }}
            className="w-full rounded-[2rem] overflow-hidden border border-purple-500/20 bg-[#120F17] shadow-2xl p-2 sm:p-4"
          >
            <ChromaGrid
              items={CHROMA_SKU_ITEMS}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              onItemSelect={item => {
                sounds.playClick();
                if (item.sample) {
                  onSelectSample(item.sample);
                  const el = document.getElementById('studio');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      ) : (
        <>
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
                    idx === activeSlide
                      ? 'w-6 sm:w-8 bg-purple-500 shadow-sm shadow-purple-500/50'
                      : 'w-2 bg-[var(--hairline)] hover:bg-purple-300'
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
        </>
      )}
    </section>
  );
};