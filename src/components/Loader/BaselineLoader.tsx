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
      {/* Brand Wordmark with Scale Icon */}
      <div className="flex items-center gap-3 animate-word-slide">
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[var(--brand-light)]">
          <Scale className="w-5 h-5" />
        </div>
        <span className="text-2xl font-medium tracking-[0.2em] uppercase font-sans">
          Baseline Metrology
        </span>
      </div>

      {/* 1px Minimalist Progress Track */}
      <div className="w-40 h-[1px] rounded-full bg-white/20 overflow-hidden relative">
        <div className="h-full bg-white origin-left animate-progress" />
      </div>

      <div className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-mono">
        LMPC Rules 2011 &bull; Statutory Intelligence
      </div>
    </div>
  );
};
