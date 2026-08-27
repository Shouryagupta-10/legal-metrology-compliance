import React, { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';

interface BaselineLoaderProps {
  onReady: () => void;
}

export const BaselineLoader: React.FC<BaselineLoaderProps> = ({ onReady }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setIsExiting(true);
      onReady();
      setTimeout(() => {
        setIsMounted(false);
      }, 850); // EXIT_MS
    }, 1400); // MIN_VISIBLE_MS

    return () => clearTimeout(minTimer);
  }, [onReady]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[var(--brand-deep)] text-white flex flex-col items-center justify-center gap-8 transition-transform duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        isExiting ? '-translate-y-[105%]' : 'translate-y-0'
      }`}
    >
      {/* Candy blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob blob-float w-72 h-72 bg-[var(--coral)]/25 -top-10 -left-10" />
        <div className="blob blob-float w-64 h-64 bg-[var(--sky)]/20 -bottom-16 -right-10" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Brand Wordmark with Scale Icon */}
      <div className="flex items-center gap-3 animate-word-slide">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--brand-light)] flex items-center justify-center text-white shadow-lg">
          <Scale className="w-5 h-5" />
        </div>
        <span className="text-2xl font-display font-semibold tracking-[0.2em] uppercase">
          Baseline Metrology
        </span>
      </div>

      {/* 1px Minimalist Progress Track */}
      <div className="w-40 h-[3px] rounded-full bg-white/20 overflow-hidden relative">
        <div className="h-full origin-left animate-progress" style={{ background: 'linear-gradient(90deg, var(--coral), var(--lime))' }} />
      </div>

      <div className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-mono">
        LMPC Rules 2011 &bull; Loading the good stuff
      </div>
    </div>
  );
};