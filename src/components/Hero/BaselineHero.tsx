import React, { useState, useEffect } from 'react';
import { Scale, BookOpen, Layers, Sparkles, MessageSquare, Download, Sun, Moon, Volume2, VolumeX, PartyPopper } from 'lucide-react';
import { SampleProduct, ComplianceReport } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';
import { exportComplianceReportPDF } from '../../services/pdfExportService';
import AeroShards from '../AeroShards';

interface BaselineHeroProps {
  currentSample: SampleProduct;
  onSelectSample: (sample: SampleProduct) => void;
  report: ComplianceReport | null;
  onOpenMenu: () => void;
  onOpenAssistant: () => void;
  onOpenHandbook: () => void;
  onOpenBatchModal: () => void;
  isReady: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLogin: () => void;
}

export const BaselineHero: React.FC<BaselineHeroProps> = ({
  currentSample,
  onSelectSample,
  report,
  onOpenMenu,
  onOpenAssistant,
  onOpenHandbook,
  onOpenBatchModal,
  isReady,
  theme,
  onToggleTheme,
  onOpenLogin
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  // Auto-advance collection carousel every 3800ms
  useEffect(() => {
    if (!isReady) return;
    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % SAMPLE_PRODUCTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isReady]);

  const activeSample = SAMPLE_PRODUCTS[activeSlideIndex];

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#120F17] text-white rounded-[var(--radius-card-lg)] min-h-[38rem] h-[calc(100svh-1.5rem)] flex flex-col justify-between p-4 sm:p-8 lg:p-10 shadow-2xl">
      {/* Interactive 3D AeroShards Dynamic Particle Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <AeroShards
          backgroundColor="#120F17"
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={1}
          spin={1}
          interaction="repel"
          density={1.5}
          shardSize={1.1}
          stretch={1}
          turbulence={1}
          glow={1}
          edgeSoftness={2}
          bloom={0.5}
          grain={0.05}
          chromaticAberration={0.0075}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather
          paused={false}
        />
        {/* Subtle luminous atmosphere overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background:
              'radial-gradient(120% 90% at 8% 0%, rgba(255,93,115,0.3) 0%, transparent 55%), radial-gradient(110% 90% at 95% 8%, rgba(38,208,206,0.25) 0%, transparent 50%), linear-gradient(160deg, transparent 0%, rgba(18,15,23,0.7) 100%)'
          }}
        />
      </div>

      {/* Top Header Navbar */}
      <header className="flex items-center justify-between gap-4 text-xs">
        {/* Left Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-white/85 font-semibold">
          <a
            href="#studio"
            className="hover:text-[var(--lime)] transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--lime)]" />
            <span>Packaging Playground</span>
          </a>
          <a
            href="#checklist"
            className="hover:text-[var(--lime)] transition-colors"
          >
            Rule 6 Cheat Sheet
          </a>
          <button
            onClick={onOpenHandbook}
            className="hover:text-[var(--lime)] transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--sky)]" />
            <span>The Rulebook</span>
          </button>
          <button
            onClick={onOpenBatchModal}
            className="hover:text-white transition-colors flex items-center gap-1 text-[var(--sunny)] wiggle-on-hover"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--sunny)]" />
            <span>Batch Sweep</span>
          </button>
        </nav>

        {/* Center Brand Identity */}
        <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--brand-light)] flex items-center justify-center text-white shadow-lg shadow-black/20 float-idle">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-base font-display font-semibold tracking-[0.15em] uppercase">
            Baseline Metrology
          </span>
        </div>

        {/* Right Actions, Audio, Theme Toggle & Burger */}
        <div className="flex items-center gap-2">
          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleMute}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center transition-all btn-tactile text-white"
            title={isMuted ? "Enable Tactile Sounds" : "Mute Sound Effects"}
            aria-label="Toggle sound effects"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--lime)] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenAssistant();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 hover:text-[var(--lime)] transition-colors mr-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--sky)]" />
            <span>Ask Legal Officer</span>
          </button>

          {report && (
            <button
              onClick={() => {
                sounds.playSuccess();
                exportComplianceReportPDF(report);
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-candy text-xs font-bold transition-all shadow-lg"
            >
              <Download className="w-3 h-3" />
              <span>Export Notice</span>
            </button>
          )}
          {/* WhatsApp Sign In Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLogin();
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-white text-[#0f2f63] hover:bg-sky-50 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg ml-auto mr-2 sm:ml-2 sm:mr-1"
          >
            Sign In
          </button>
          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleTheme();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center transition-all btn-tactile text-white"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--sunny)] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--sky)] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Minimalist 2-Bar Burger Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMenu();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex flex-col items-center justify-center gap-1.5 transition-all btn-tactile"
            aria-label="Open navigation menu"
          >
            <span className="w-4 h-[1.5px] bg-white rounded-full" />
            <span className="w-4 h-[1.5px] bg-white rounded-full" />
          </button>
        </div>
      </header>

      {/* Center Giant Word Title */}
      <div className="my-auto py-6">
        <h1 className="font-display text-[11vw] font-semibold uppercase tracking-[-0.02em] leading-[0.88] select-none">
          <span className="clip-word-box mr-4 sm:mr-8">
            <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '100ms' }}>
              OWN
            </span>
          </span>
          <span className="clip-word-box mr-4 sm:mr-8">
            <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '240ms' }}>
              THE
            </span>
          </span>
          <span className="clip-word-box">
            <span className={`reveal-word text-gradient-candy ${isReady ? 'active' : ''}`} style={{ transitionDelay: '380ms' }}>
              BENCHMARK
            </span>
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-white/75 font-mono uppercase tracking-[0.25em] mt-4 flex items-center gap-2">
          <PartyPopper className="w-3.5 h-3.5 text-[var(--sunny)]" />
          Compliance shouldn't feel like homework &bull; Legal Metrology Rules, 2011
        </p>
      </div>

      {/* Bottom Row: Tagline & Benchmark Carousel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-white/15">
        {/* Tagline */}
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-display font-semibold uppercase tracking-tight leading-[0.95] text-white/95">
            <span className="clip-line-box block">
              <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '450ms' }}>
                SCAN. AUDIT.
              </span>
            </span>
            <span className="clip-line-box block text-[var(--lime)]">
              <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '560ms' }}>
                STAY UNSTOPPABLE.
              </span>
            </span>
          </p>
        </div>

        {/* Right Cluster: Auto-advancing Collection Slider & Health Card */}
        <div className="flex items-end gap-3 w-full sm:w-auto">
          {/* Collection Slider Card */}
          <div className="hidden md:flex flex-col gap-2 w-64 bg-white/10 border border-white/15 rounded-[var(--radius-card)] p-3 backdrop-blur shadow-2xl hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-3">
              <img
                src={activeSample.thumbnail}
                alt={activeSample.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sunny)] block truncate">
                  {activeSample.category}
                </span>
                <h5 className="text-xs font-semibold uppercase text-white truncate">
                  {activeSample.name}
                </h5>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectSample(activeSample);
                    const el = document.getElementById('studio');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] text-white/80 hover:text-[var(--lime)] underline tracking-wide mt-0.5 flex items-center gap-1"
                >
                  <span>Poke at this sample &rarr;</span>
                </button>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                {SAMPLE_PRODUCTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      sounds.playClick();
                      setActiveSlideIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeSlideIndex ? 'w-5 bg-[var(--lime)]' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-white/50">
                0{activeSlideIndex + 1} / 0{SAMPLE_PRODUCTS.length}
              </span>
            </div>
          </div>

          {/* Membership / Compliance Metric Card */}
          <article
            onClick={() => {
              sounds.playClick();
              const el = document.getElementById('studio');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-56 bg-white/10 hover:bg-white/15 cursor-pointer border border-white/15 rounded-[var(--radius-card)] p-3.5 backdrop-blur shadow-2xl flex items-center justify-between gap-3 transition-all hover:-translate-y-1"
          >
            <div className="space-y-1.5">
              <div className="text-2xl font-display font-semibold text-white tracking-tight leading-none">
                {report ? `${report.overallScore}%` : '100%'}
              </div>
              {/* Overlapping Dot Indicators */}
              <div className="flex -space-x-1.5 items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--sky)] border border-[var(--brand-deep)]" title="Rule 6 Declarations" />
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--lime)] border border-[var(--brand-deep)]" title="Rule 7 Font Sizing" />
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--coral)] border border-[var(--brand-deep)]" title="2021 USP Rate" />
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--sunny)] border border-[var(--brand-deep)]" title="Section 36 Compliance" />
              </div>
              <span className="text-[10px] text-white/80 block leading-tight">
                Statutory Clauses, Handled
              </span>
            </div>

            <img
              src={currentSample.thumbnail}
              alt="Active SKU"
              className="w-14 h-16 rounded-xl object-cover border border-white/20 shadow-md"
            />
          </article>
        </div>
      </div>
    </section>
  );
};
