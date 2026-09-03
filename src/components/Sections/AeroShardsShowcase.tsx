import React, { useState } from 'react';
import AeroShards from '../AeroShards';
import AnimatedList from '../AnimatedList';
import { Sparkles, ListChecks, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const AeroShardsShowcase: React.FC = () => {
  const [selectedInfo, setSelectedInfo] = useState<string>('Item 1');

  const items = [
    'Item 1 • Rule 6(1)(a) Manufacturer & Packer Full Address',
    'Item 2 • Rule 6(1)(b) Generic / Common Commodity Name',
    'Item 3 • Rule 6(1)(c) Net Quantity in Standard SI Units (g/kg/ml)',
    'Item 4 • Rule 6(1)(d) Month & Year of Packaging / Manufacture',
    'Item 5 • Rule 6(1)(e) MRP inclusive of all taxes',
    'Item 6 • Rule 6(1)(e) Unit Sale Price (USP) Calculation',
    'Item 7 • Rule 6(1)(n) Consumer Grievance Care Cell & Email',
    'Item 8 • Rule 7 Principal Display Panel (PDP) Surface Area',
    'Item 9 • Schedule II Table 1 Minimum Numeral Height Check',
    'Item 10 • Rule 18(2) Anti-Tampering & Dual MRP Enforcement'
  ];

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }} className="rounded-[2.5rem] overflow-hidden my-6 border border-white/15 shadow-2xl bg-[#120F17]">
      {/* 3D WebGPU AeroShards Background */}
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

      {/* Floating HUD & Interactive AnimatedList Layout */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span className="text-purple-300 font-bold uppercase tracking-wider">AeroShards + AnimatedList</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">React Bits</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-mono text-white/70">
            <span>Hover to Repel Shards</span>
            <span>•</span>
            <span className="text-purple-300">Arrow Keys to Navigate List</span>
          </div>
        </div>

        {/* Content Row: Editorial info on left, AnimatedList on right */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
          
          <div className="max-w-md bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400">
              Interactive 3D Dynamics
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Crystalline Fluid Motion
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-mono">
              Hover to repel pearl shards or hold to gather them into a gravitational vortex. Select any clause in the animated list using mouse or arrow keys.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="truncate">Active Selection: {selectedInfo}</span>
            </div>
          </div>

          {/* Interactive AnimatedList Component */}
          <div className="pointer-events-auto w-full lg:w-[460px] bg-black/70 backdrop-blur-xl rounded-3xl border border-white/15 p-2 shadow-2xl">
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
              <span className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px]">
                <ListChecks className="w-3.5 h-3.5 text-purple-400" />
                Statutory Protocol Queue
              </span>
              <span className="text-[10px] text-purple-300 font-mono">↑ / ↓ Nav</span>
            </div>

            <AnimatedList
              items={items}
              onItemSelect={(item, index) => {
                sounds.playClick();
                setSelectedInfo(item);
                console.log(item, index);
              }}
              showGradients
              enableArrowNavigation
              displayScrollbar
              className="w-full max-w-full"
              itemClassName="hover:border-purple-500/50"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
