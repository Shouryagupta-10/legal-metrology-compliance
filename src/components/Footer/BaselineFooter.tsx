import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const BaselineFooter: React.FC<{
  onOpenAssistant: () => void;
  onOpenHandbook: () => void;
}> = ({ onOpenAssistant, onOpenHandbook }) => {
  return (
    <footer className="bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-3 py-14 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto shadow-2xl space-y-12">
      {/* Top CTA Band */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12 border-b border-white/15">
        <div>
          <div className="baseline-eyebrow tone-light mb-3">
            <span className="eyebrow-dot" />
            <span>Get Started</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-medium uppercase tracking-tight leading-[0.92]">
            Ready to audit your packaging?
          </h2>
        </div>

        {/* Light Pill Button */}
        <button
          onClick={() => {
            sounds.playClick();
            const el = document.getElementById('studio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group px-7 py-3.5 rounded-full bg-white text-[var(--brand-deep)] hover:bg-[var(--brand-light)] hover:text-white text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg btn-tactile"
        >
          <span>Start Inspection</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4-Column Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 py-4">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[var(--brand-light)]">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase font-sans">
              Baseline Metrology
            </span>
          </div>
          <p className="text-xs text-white/65 leading-relaxed">
            Statutory AI audit platform for pre-packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
          <address className="not-italic text-xs text-white/70 space-y-1 pt-2 font-mono">
            <div>compliance@metrologyguard.ai</div>
            <div>Department of Consumer Affairs, New Delhi</div>
          </address>
        </div>

        {/* Column 1: Statutory Clauses */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Statutory Clauses
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><a href="#checklist" className="hover:text-white">Rule 6(1)(a) Mfr / Importer</a></li>
            <li><a href="#checklist" className="hover:text-white">Rule 6(1)(c) Standard Metric Units</a></li>
            <li><a href="#checklist" className="hover:text-white">Rule 6(1)(e) MRP &amp; Taxes</a></li>
            <li><a href="#checklist" className="hover:text-white">Rule 6(1)(n) 2021 USP Rate</a></li>
            <li><a href="#checklist" className="hover:text-white">Rule 6(1)(f) Consumer Grievance</a></li>
          </ul>
        </div>

        {/* Column 2: Studio Tools */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Inspector Tools
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><a href="#studio" className="hover:text-white">2.5x Precision Loupe</a></li>
            <li><a href="#studio" className="hover:text-white">Rule 7 Millimeter Gauge</a></li>
            <li><a href="#studio" className="hover:text-white">1-Click Artwork Redline</a></li>
            <li><a href="#pdp-calc" className="hover:text-white">PDP Geometry Tool</a></li>
            <li><button onClick={onOpenAssistant} className="hover:text-white text-left">AI Legal Assistant</button></li>
          </ul>
        </div>

        {/* Column 3: Legal Acts */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Statutory Acts
          </h5>
          <ul className="space-y-2 text-xs text-white/80">
            <li><button onClick={onOpenHandbook} className="hover:text-white text-left">LMPC Rules, 2011</button></li>
            <li><a href="#analytics" className="hover:text-white">Legal Metrology Act, 2009</a></li>
            <li><a href="#analytics" className="hover:text-white">Section 36 &amp; 48 Penalties</a></li>
            <li><a href="#pdp-calc" className="hover:text-white">Schedule II Font Tables</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
            {/* Bottom Bar & Legal Disclaimers */}
            {/* Bottom Bar & Legal Disclaimers */}
      <div className="border-t border-white/15 pt-8 flex flex-col gap-6 text-xs text-white/50 font-mono">
        
        {/* Hackathon Disclaimer */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-[10px] sm:text-xs leading-relaxed text-white/60">
          <strong className="text-white">LEGAL DISCLAIMER:</strong> This software is a prototype developed for the <strong className="text-white">Smart India Hackathon (SIH) 2026</strong>. It is designed to assist with packaging compliance audits but is not an official government utility. The calculated Section 36 penalty liabilities and generated Inspection Certificates are simulations. Always consult a registered Legal Metrology Officer before commercial printing.
        </div>

        {/* Copyright & Team Credits */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-4">
          <div className="shrink-0">
            &copy; 2026 Baseline MetrologyGuard AI. Standard: LMPC Rules 2011 / 2024.
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-white/40">PS ID: SIH26034</span>
            <span className="text-[var(--brand-light)] font-bold">Team ComplianceX</span>
            
            {/* Team LinkedIn Links */}
            <div className="flex flex-wrap items-center gap-2 xl:border-l xl:border-white/20 xl:pl-4 text-[11px]">
              <a href="https://www.linkedin.com/in/pulkit-sachdev-980809367" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Pulkit Sachdev</a>
              <span className="text-white/20 hidden sm:inline">•</span>
              
              <a href="https://www.linkedin.com/in/sameer-aryan-6a699b377" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Sameer Aryan</a>
              <span className="text-white/20 hidden sm:inline">•</span>
              
              <a href="https://www.linkedin.com/in/shourya-gupta-b83905374" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Shourya Gupta</a>
              <span className="text-white/20 hidden md:inline">•</span>
              
              <a href="https://www.linkedin.com/in/kirti-gupta-6518533ba" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Kirti Gupta</a>
              <span className="text-white/20 hidden sm:inline">•</span>
              
              <a href="https://www.linkedin.com/in/aman-sharma-2b9608380" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Aman Sharma</a>
              <span className="text-white/20 hidden sm:inline">•</span>
              
              <a href="https://www.linkedin.com/in/akshita-agarwal-1ba358380" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Akshita Aggarwal</a>
            </div>

            <a href="https://github.com/Shouryagupta-10/legal-metrology-compliance" target="_blank" rel="noreferrer" className="hover:text-[var(--brand-light)] text-white transition-colors font-bold underline underline-offset-4 ml-0 xl:ml-2 shrink-0">
              GitHub Repo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 