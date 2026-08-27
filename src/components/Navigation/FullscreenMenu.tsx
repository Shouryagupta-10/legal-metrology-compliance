import React, { useEffect } from 'react';
import { Scale, X, ArrowUpRight } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'audit' | 'ecommerce' | 'batch' | 'handbook') => void;
  onOpenAssistant: () => void;
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenAssistant
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Packaging Studio', tab: 'audit', anchor: '#studio' },
    { label: 'Rule 6 Checklist', tab: 'audit', anchor: '#checklist' },
    { label: 'E-Commerce Verifier', tab: 'ecommerce', anchor: '#ecommerce' },
    { label: 'Batch Catalogue Audit', tab: 'batch', anchor: '#batch' },
    { label: 'LMPC Statutory Rulebook', tab: 'handbook', anchor: '#rulebook' }
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[var(--brand-deep)] text-white flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[var(--brand-light)]">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium tracking-[0.2em] uppercase font-sans">
            Baseline Metrology
          </span>
        </div>

        {/* Rotating X Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all group btn-tactile"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 text-white" />
        </button>
      </div>

      {/* Center Nav Links */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8 flex flex-col gap-3 sm:gap-4">
        {navLinks.map((item, index) => (
          <a
            key={index}
            href={item.anchor}
            onClick={e => {
              e.preventDefault();
              sounds.playClick();
              onSelectTab(item.tab as any);
              onClose();
              const el = document.querySelector(item.anchor);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight hover:text-[var(--brand-light)] transition-colors flex items-center justify-between border-b border-white/10 pb-3"
          >
            <span>{item.label}</span>
            <ArrowUpRight className="w-6 h-6 sm:w-10 sm:h-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-[var(--brand-light)]" />
          </a>
        ))}
      </div>

      {/* Bottom Footer Action Row */}
      <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenAssistant();
            }}
            className="px-6 py-3 rounded-full bg-white text-[var(--brand-deep)] hover:bg-[var(--brand-light)] hover:text-white font-medium uppercase tracking-wider text-xs transition-colors shadow-lg"
          >
            Ask Legal Officer AI
          </button>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-white/50">
          <span>Schedule II &bull; Section 36</span>
          <span>LMPC Rules 2011</span>
        </div>
      </div>
    </div>
  );
};
