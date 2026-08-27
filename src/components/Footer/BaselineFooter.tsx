import React from 'react';
import { Scale, ArrowRight, Heart } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { Reveal } from '../Effects/Reveal';

export const BaselineFooter: React.FC<{
  onOpenAssistant: () => void;
  onOpenHandbook: () => void;
}> = ({ onOpenAssistant, onOpenHandbook }) => {
  return (
    <footer className="relative overflow-hidden bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-3 py-14 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto shadow-2xl space-y-12">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-16 w-72 h-72 blob blob-float bg-[var(--coral)]/20 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 blob blob-float bg-[var(--lime)]/15 pointer-events-none" style={{ animationDelay: '2.2s' }} />

      {/* Top CTA Band */}
      <Reveal variant="up" className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12 border-b border-white/15">
        <div>
          <div className="baseline-eyebrow tone-light mb-3">
            <span className="eyebrow-dot" />
            <span>Let's do this</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-semibold uppercase tracking-tight leading-[0.92]">
            Ready to make your <span className="text-gradient-candy">packaging bulletproof?</span>
          </h2>
        </div>

        {/* Candy Pill Button */}
        <button
          onClick={() => {
            sounds.playClick();
            const el = document.getElementById('studio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group px-7 py-3.5 rounded-full btn-candy text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
        >
          <span>Start Inspection</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </Reveal>

      {/* 4-Column Navigation Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 py-4">
        {/* Brand Column */}
        <Reveal variant="up" delay={1} className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--sky)] flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-sm font-display font-semibold tracking-[0.2em] uppercase">
              Baseline Metrology
            </span>
          </div>
          <p className="text-xs text-white/65 leading-relaxed">
            Your friendly AI sidekick for pre-packaged commodity rules under the Legal Metrology (Packaged Commodities) Rules, 2011 — minus the headache.
          </p>
          <address className="not-italic text-xs text-white/70 space-y-1 pt-2 font-mono">
            <div>compliance@metrologyguard.ai</div>
            <div>Department of Consumer Affairs, New Delhi</div>
          </address>
        </Reveal>

        {/* Column 1: Statutory Clauses */}
        <Reveal variant="up" delay={2} className="space-y-3">
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--sunny)]">
            The Fine Print
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><a href="#checklist" className="hover:text-[var(--lime)] transition-colors">Rule 6(1)(a) Mfr / Importer</a></li>
            <li><a href="#checklist" className="hover:text-[var(--lime)] transition-colors">Rule 6(1)(c) Standard Metric Units</a></li>
            <li><a href="#checklist" className="hover:text-[var(--lime)] transition-colors">Rule 6(1)(e) MRP &amp; Taxes</a></li>
            <li><a href="#checklist" className="hover:text-[var(--lime)] transition-colors">Rule 6(1)(n) 2021 USP Rate</a></li>
            <li><a href="#checklist" className="hover:text-[var(--lime)] transition-colors">Rule 6(1)(f) Consumer Grievance</a></li>
          </ul>
        </Reveal>

        {/* Column 2: Studio Tools */}
        <Reveal variant="up" delay={3} className="space-y-3">
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--sky)]">
            Your Toolkit
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><a href="#studio" className="hover:text-[var(--lime)] transition-colors">2.5x Precision Loupe</a></li>
            <li><a href="#studio" className="hover:text-[var(--lime)] transition-colors">Rule 7 Millimeter Gauge</a></li>
            <li><a href="#studio" className="hover:text-[var(--lime)] transition-colors">1-Click Artwork Fix</a></li>
            <li><a href="#pdp-calc" className="hover:text-[var(--lime)] transition-colors">PDP Geometry Tool</a></li>
            <li><button onClick={onOpenAssistant} className="hover:text-[var(--lime)] transition-colors text-left">Ask the Legal Officer</button></li>
          </ul>
        </Reveal>

        {/* Column 3: Legal Acts */}
        <Reveal variant="up" delay={4} className="space-y-3">
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--coral)]">
            The Rulebooks
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><button onClick={onOpenHandbook} className="hover:text-[var(--lime)] transition-colors text-left">LMPC Rules, 2011</button></li>
            <li><a href="#analytics" className="hover:text-[var(--lime)] transition-colors">Legal Metrology Act, 2009</a></li>
            <li><a href="#analytics" className="hover:text-[var(--lime)] transition-colors">Section 36 &amp; 48 Penalties</a></li>
            <li><a href="#pdp-calc" className="hover:text-[var(--lime)] transition-colors">Schedule II Font Tables</a></li>
          </ul>
        </Reveal>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-mono">
        <div className="flex items-center gap-1.5">
          &copy; 2026 Baseline MetrologyGuard AI. Made with
          <Heart className="w-3 h-3 fill-[var(--coral)] text-[var(--coral)]" />
          for compliance nerds. Standard: LMPC Rules 2011 / 2024.
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onOpenHandbook} className="hover:text-white transition-colors">Statutory Rulebook</button>
          <a href="#studio" className="hover:text-white transition-colors">Packaging Studio</a>
        </div>
      </div>
    </footer>
  );
};
