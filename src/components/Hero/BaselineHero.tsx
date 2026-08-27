import React, { useState, useEffect } from 'react';
import { Scale, ArrowRight, BookOpen, Layers, ShoppingBag, Sparkles, MessageSquare, Download, Sun, Moon, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { SampleProduct, ComplianceReport } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';
import { exportComplianceReportPDF } from '../../services/pdfExportService';

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
    <section className="relative isolate overflow-hidden bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] min-h-[38rem] h-[calc(100svh-1.5rem)] flex flex-col justify-between p-4 sm:p-8 lg:p-10 shadow-2xl">
      {/* Background Parallax Plate */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/samples/rice.jpg"
          alt="Packaging Backdrop"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2f63]/85 via-[#0f2f63]/50 to-[#0f2f63]/90" />
      </div>

      {/* Top Header Navbar */}
      <header className="flex items-center justify-between gap-4 text-xs">
        {/* Left Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-white/80 font-medium">
          <a
            href="#studio"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--brand-light)]" />
            <span>Packaging Studio</span>
          </a>
          <a
            href="#checklist"
            className="hover:text-white transition-colors"
          >
            Rule 6 Checklist
          </a>
          <button
            onClick={onOpenHandbook}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--brand-light)]" />
            <span>Statutory Rulebook</span>
          </button>
          <button
            onClick={onOpenBatchModal}
            className="hover:text-white transition-colors flex items-center gap-1 text-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Batch Sweep</span>
          </button>
        </nav>

        {/* Center Brand Identity */}
        <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[var(--brand-light)] shadow-inner">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-base font-medium tracking-[0.2em] uppercase font-sans">
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
              <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenAssistant();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/90 hover:text-white transition-colors mr-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--brand-light)]" />
            <span>Ask Legal Officer</span>
          </button>

          {report && (
            <button
              onClick={() => {
                sounds.playSuccess();
                exportComplianceReportPDF(report);
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white text-xs font-semibold transition-colors shadow-sm"
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
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-sky-200 transition-transform hover:-rotate-12" />
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
        <h1 className="text-[11vw] font-medium uppercase tracking-[-0.03em] leading-[0.88] select-none">
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
            <span className={`reveal-word text-[var(--brand-light)] ${isReady ? 'active' : ''}`} style={{ transitionDelay: '380ms' }}>
              BENCHMARK
            </span>
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-white/70 font-mono uppercase tracking-[0.25em] mt-4">
          Statutory Packaging Intelligence &bull; Legal Metrology Rules, 2011
        </p>
      </div>

      {/* Bottom Row: Tagline & Benchmark Carousel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-white/15">
        {/* Tagline */}
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-medium uppercase tracking-tight leading-[0.95] text-white/90">
            <span className="clip-line-box block">
              <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '450ms' }}>
                SCAN. AUDIT.
              </span>
            </span>
            <span className="clip-line-box block text-[var(--brand-light)]">
              <span className={`reveal-word ${isReady ? 'active' : ''}`} style={{ transitionDelay: '560ms' }}>
                STAY COMPLIANT.
              </span>
            </span>
          </p>
        </div>

        {/* Right Cluster: Auto-advancing Collection Slider & Health Card */}
        <div className="flex items-end gap-3 w-full sm:w-auto">
          {/* Collection Slider Card */}
          <div className="hidden md:flex flex-col gap-2 w-64 bg-white/10 border border-white/15 rounded-[var(--radius-card)] p-3 backdrop-blur shadow-2xl">
            <div className="flex items-center gap-3">
              <img
                src={activeSample.thumbnail}
                alt={activeSample.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--brand-light)] block truncate">
                  {activeSample.category}
                </span>
                <h5 className="text-xs font-medium uppercase text-white truncate">
                  {activeSample.name}
                </h5>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectSample(activeSample);
                    const el = document.getElementById('studio');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] text-white/80 hover:text-white underline tracking-wide mt-0.5 flex items-center gap-1"
                >
                  <span>Inspect sample &rarr;</span>
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
                      i === activeSlideIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
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
            className="w-full sm:w-56 bg-white/10 hover:bg-white/15 cursor-pointer border border-white/15 rounded-[var(--radius-card)] p-3.5 backdrop-blur shadow-2xl flex items-center justify-between gap-3 transition-all hover:scale-102"
          >
            <div className="space-y-1.5">
              <div className="text-2xl font-medium text-white tracking-tight leading-none font-mono">
                {report ? `${report.overallScore}%` : '100%'}
              </div>
              {/* Overlapping Dot Indicators */}
              <div className="flex -space-x-1.5 items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#5790e6] border border-[#0f2f63]" title="Rule 6 Declarations" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#c2e029] border border-[#0f2f63]" title="Rule 7 Font Sizing" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#0b6e97] border border-[#0f2f63]" title="2021 USP Rate" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffffff] border border-[#0f2f63]" title="Section 36 Compliance" />
              </div>
              <span className="text-[10px] text-white/80 block leading-tight">
                Statutory Clauses Active
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
