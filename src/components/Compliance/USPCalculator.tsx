import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sliders, Scale } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const USPCalculator: React.FC = () => {
  const [mrp, setMrp] = useState<number>(450);
  const [netQty, setNetQty] = useState<number>(2.5);
  const [unit, setUnit] = useState<string>('kg');

  let calculatedUsp = 0;
  let targetUnit = 'kg';
  let isMandatory = false;

  if (unit === 'kg') {
    calculatedUsp = netQty > 0 ? mrp / netQty : 0;
    targetUnit = 'kg';
    isMandatory = netQty >= 1;
  } else if (unit === 'g') {
    if (netQty > 1000) {
      calculatedUsp = mrp / (netQty / 1000);
      targetUnit = 'kg';
    } else {
      calculatedUsp = netQty > 0 ? mrp / netQty : 0;
      targetUnit = 'g';
    }
    isMandatory = netQty > 1000;
  } else if (unit === 'l') {
    calculatedUsp = netQty > 0 ? mrp / netQty : 0;
    targetUnit = 'l';
    isMandatory = netQty >= 1;
  } else if (unit === 'ml') {
    if (netQty > 1000) {
      calculatedUsp = mrp / (netQty / 1000);
      targetUnit = 'l';
    } else {
      calculatedUsp = netQty > 0 ? mrp / netQty : 0;
      targetUnit = 'ml';
    }
    isMandatory = netQty > 1000;
  } else if (unit === 'N' || unit === 'U') {
    calculatedUsp = netQty > 0 ? mrp / netQty : 0;
    targetUnit = 'piece / item';
    isMandatory = netQty > 1;
  }

  return (
    <div className="rounded-[1.75rem] border border-[var(--hairline)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] flex items-center justify-center shrink-0 shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="baseline-eyebrow tone-dark text-[10px] mb-0.5">
              <span className="eyebrow-dot" />
              <span>Statutory Rule 6(1)(e)</span>
            </div>
            <h4 className="text-base font-bold text-[var(--ink)] tracking-tight">
              2021 Unit Sale Price (USP) Statutory Engine
            </h4>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            isMandatory
              ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
              : 'bg-[var(--surface)] text-[var(--ink-soft)] border border-[var(--hairline)]'
          }`}
        >
          {isMandatory ? 'Mandatory Declaration' : 'Exempt / Optional'}
        </span>
      </div>

      {/* Interactive Inputs & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Declared MRP */}
        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)] space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[var(--ink)]">
            <span>Declared MRP</span>
            <span className="font-mono text-sm text-[var(--brand)]">₹{mrp}</span>
          </div>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={mrp}
            onChange={e => {
              sounds.playTick();
              setMrp(parseFloat(e.target.value) || 0);
            }}
            className="w-full accent-[var(--brand)] cursor-pointer"
          />
        </div>

        {/* Net Quantity */}
        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)] space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[var(--ink)]">
            <span>Net Quantity</span>
            <span className="font-mono text-sm text-[var(--brand)]">{netQty}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={netQty}
            onChange={e => {
              sounds.playTick();
              setNetQty(parseFloat(e.target.value) || 0);
            }}
            className="w-full accent-[var(--brand)] cursor-pointer"
          />
        </div>

        {/* Unit Selector */}
        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)] space-y-2">
          <label className="text-xs font-semibold text-[var(--ink)] block">
            Measure Unit
          </label>
          <select
            value={unit}
            onChange={e => {
              sounds.playClick();
              setUnit(e.target.value);
            }}
            className="w-full bg-[var(--surface-card)] border border-[var(--hairline)] rounded-xl px-3 py-1.5 text-xs text-[var(--ink)] font-mono outline-none focus:border-[var(--brand)]"
          >
            <option value="kg">kg (Kilogram)</option>
            <option value="g">g (Gram)</option>
            <option value="l">l (Litre)</option>
            <option value="ml">ml (Millilitre)</option>
            <option value="N">N (Number / Pieces)</option>
          </select>
        </div>
      </div>

      {/* Result Stat Banner */}
      <div className="p-5 rounded-[1.5rem] bg-[var(--brand-deep)] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--brand-light)] font-semibold block">
            Statutory Computed USP
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
            ₹ {calculatedUsp.toFixed(2)} / {targetUnit}
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-white/70 space-y-1">
          <div className="flex items-center gap-1.5 justify-start sm:justify-end text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Format Complies with 2021 Rules</span>
          </div>
          <span className="text-[11px] text-white/50 block font-mono">
            Must be printed in font size equivalent to MRP numeral height
          </span>
        </div>
      </div>
    </div>
  );
};