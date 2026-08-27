import React, { useEffect } from 'react';
import { Scale, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'audit' | 'ecommerce' | 'batch' | 'handbook') => void;
  onOpenAssistant: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenAssistant,
  theme,
  onToggleTheme
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
    { label: 'Packaging Playground', tab: 'audit', anchor: '#studio', color: 'var(--coral)' },
    { label: 'Rule 6 Cheat Sheet', tab: 'audit', anchor: '#checklist', color: 'var(--lime)' },
    { label: 'E-Commerce Verifier', tab: 'ecommerce', anchor: '#ecommerce', color: 'var(--sky)' },
    { label: 'Batch Catalogue Sweep', tab: 'batch', anchor: '#batch', color: 'var(--sunny)' },
    { label: 'The Rulebook', tab: 'handbook', anchor: '#rulebook', color: 'var(--bubble-pink)' }
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[var(--brand-deep)] text-white flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300 overflow-hidden">
      {/* Candy blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob blob-float w-96 h-96 bg-[var(--coral)]/15 -top-20 -left-20" />
        <div className="blob blob-float w-80 h-80 bg-[var(--sky)]/15 -bottom-24 -right-16" style={{ animationDelay: '1.8s' }} />
      </div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--brand-light)] flex items-center justify-center text-white">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-sm font-display font-semibold tracking-[0.2em] uppercase">
            Baseline Metrology
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleTheme();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all btn-tactile text-white"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-200" />}
          </button>

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
      </div>

      {/* Center Nav Links */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8 flex flex-col gap-3 sm:gap-4 relative z-10">
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
            className="group font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight transition-colors flex items-center justify-between border-b border-white/10 pb-3"
            style={{ transitionDelay: `${index * 40}ms` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = item.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}
          >
            <span>{item.label}</span>
            <ArrowUpRight
              className="w-6 h-6 sm:w-10 sm:h-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-12 transition-all"
              style={{ color: item.color }}
            />
          </a>
        ))}
      </div>

      {/* Bottom Footer Action Row */}
      <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenAssistant();
            }}
            className="px-6 py-3 rounded-full btn-candy font-bold uppercase tracking-wider text-xs shadow-lg"
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