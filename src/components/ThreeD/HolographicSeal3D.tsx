import React, { useRef, useState } from 'react';
import { Scale, Sparkles, ShieldCheck } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const HolographicSeal3D: React.FC = () => {
  const sealRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sealRef.current) return;
    const rect = sealRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt angle between -22deg and +22deg
    const rotX = (0.5 - y) * 36;
    const rotY = (x - 0.5) * 36;

    setTilt({
      x: rotX,
      y: rotY,
      glareX: x * 100,
      glareY: y * 100
    });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={sealRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onClick={() => sounds.playSuccess()}
      className="relative cursor-pointer select-none group w-28 h-28 sm:w-36 sm:h-36 shrink-0"
      style={{ perspective: '1000px' }}
    >
      {/* 3D Transform Layer */}
      <div
        className="w-full h-full rounded-full transition-transform duration-200 ease-out relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-2xl border-2 border-white/30"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`,
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(37, 99, 201, 0.9) 50%, rgba(38, 208, 206, 0.9) 100%)',
          boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.4)'
        }}
      >
        {/* Specular Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full opacity-60 group-hover:opacity-90 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`
          }}
        />

        {/* Rotating Outer Ring */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-white/40 animate-spin-slow pointer-events-none" />

        {/* Core Insignia */}
        <div className="relative z-10 flex flex-col items-center text-center text-white space-y-0.5">
          <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 drop-shadow-md transition-transform group-hover:scale-110" />
          <span className="text-xs sm:text-sm font-mono font-black tracking-tight leading-none">
            100%
          </span>
          <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/90 font-mono font-bold leading-tight">
            LMPC Statutory Seal
          </span>
        </div>
      </div>
    </div>
  );
};
