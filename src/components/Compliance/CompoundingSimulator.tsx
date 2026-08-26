import React, { useState } from 'react';
import { Gavel, AlertOctagon, Scale, ShieldAlert, FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const CompoundingSimulator: React.FC = () => {
  const [offenseLevel, setOffenseLevel] = useState<'first' | 'second' | 'repeat'>('first');
  const [defectsCount, setDefectsCount] = useState<number>(2);
  const [marketBatchUnits, setMarketBatchUnits] = useState<number>(5000);

  const baseFinePerDefect = offenseLevel === 'first' ? 25000 : offenseLevel === 'second' ? 50000 : 100000;
  const totalCompoundingFee = baseFinePerDefect * defectsCount;
  const isJailApplicable = offenseLevel === 'repeat';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl human-panel space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Section 36 Liability & Compounding Simulator</h4>
            <p className="text-xs text-slate-400">Legal Metrology Act, 2009 Statutory Risk Assessment</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
          Section 36 & 48
        </span>
      </div>

      {/* Interactive Offence Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Select Statutory Offence History
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'first', label: '1st Offence', desc: 'Up to ₹25k / defect' },
            { id: 'second', label: '2nd Offence', desc: 'Up to ₹50k / defect' },
            { id: 'repeat', label: 'Repeat / Subsequent', desc: '₹1 Lakh + Jail (1 yr)' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                sounds.playClick();
                setOffenseLevel(opt.id as any);
              }}
              className={`p-3 rounded-xl border text-left transition-all btn-tactile ${
                offenseLevel === opt.id
                  ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-white">{opt.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders for Defects & Batch Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Non-Compliant Parameters:</span>
            <span className="font-mono text-rose-400 font-bold">{defectsCount} clauses</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={defectsCount}
            onChange={e => {
              sounds.playClick();
              setDefectsCount(parseInt(e.target.value, 10));
            }}
            className="w-full accent-rose-500 bg-slate-800 rounded-lg h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Market Circulation Batch:</span>
            <span className="font-mono text-sky-400 font-bold">{marketBatchUnits.toLocaleString()} units</span>
          </div>
          <input
            type="range"
            min="500"
            max="50000"
            step="500"
            value={marketBatchUnits}
            onChange={e => setMarketBatchUnits(parseInt(e.target.value, 10))}
            className="w-full accent-sky-500 bg-slate-800 rounded-lg h-2"
          />
        </div>
      </div>

      {/* Dynamic Liability Output Box */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-rose-400">
            Estimated Statutory Compounding Liability
          </span>
          <div className="text-xl font-black text-white font-mono flex items-center gap-2">
            <span>₹ {totalCompoundingFee.toLocaleString('en-IN')}</span>
            {isJailApplicable && (
              <span className="text-xs text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                + Imprisonment up to 1 yr
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Under Section 48, compounding allows compounding of offences prior to court prosecution.
          </p>
        </div>

        <div className="bg-rose-950/80 p-3 rounded-xl border border-rose-800 text-center shrink-0 min-w-36">
          <div className="text-[10px] font-bold text-rose-300 uppercase">Statutory Notice</div>
          <div className="text-xs font-bold text-white mt-0.5">15-Day Show Cause</div>
          <span className="text-[10px] text-slate-400">Rule 6 Enforcement</span>
        </div>
      </div>
    </div>
  );
};
