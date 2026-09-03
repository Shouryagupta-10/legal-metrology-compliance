import React from 'react';
import AeroShards from '../AeroShards';
import { Sparkles, Compass } from 'lucide-react';

export const AeroShardsShowcase: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }} className="rounded-[2.5rem] overflow-hidden my-6 border border-white/15 shadow-2xl bg-[#120F17]">
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
      {/* Editorial floating HUD overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span className="text-purple-300 font-bold uppercase tracking-wider">AeroShards 3D Particle Engine</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">React Bits</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-mono text-white/70">
            <span>Hover to Repel</span>
            <span>•</span>
            <span className="text-purple-300">Click &amp; Hold to Gather</span>
          </div>
        </div>

        <div className="max-w-xl bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400">
            Interactive Aerodynamic Shards
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Fluid Crystalline Dynamics in Real-time
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-mono">
            Move your cursor across the canvas to observe fluid repulsion dynamics, or press and hold to condense pearl shards into a central gravitational vortex.
          </p>
        </div>
      </div>
    </div>
  );
};
