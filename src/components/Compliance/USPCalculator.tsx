import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl glass-panel space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Unit Sale Price (USP) Statutory Auditor</h4>
            <p className="text-xs text-slate-400">2021/2022 LMPC Second Amendment Rule 6(1)(e)</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isMandatory
              ? 'bg-amber-950 text-amber-300 border border-amber-800'
              : 'bg-slate-950 text-slate-400 border border-slate-800'
          }`}
        >
          {isMandatory ? 'USP IS MANDATORY' : 'USP IS OPTIONAL'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Declared MRP (₹)</label>
          <input
            type="number"
            value={mrp}
            onChange={e => setMrp(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Net Quantity</label>
          <input
            type="number"
            step="any"
            value={netQty}
            onChange={e => setNetQty(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          >
            <option value="kg">kg (Kilogram)</option>
            <option value="g">g (Gram)</option>
            <option value="l">l (Litre)</option>
            <option value="ml">ml (Millilitre)</option>
            <option value="N">N / U (Number / Count)</option>
          </select>
        </div>
      </div>

      {/* Output Display */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Statutory Required Format</div>
          <div className="text-base font-black text-white font-mono flex items-center gap-2">
            <span>Unit Sale Price: ₹ {calculatedUsp.toFixed(2)} / {targetUnit}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isMandatory
              ? `Mandatory for packaging exceeding 1 kg / 1 L threshold under 2021 Rules.`
              : `Optional for smaller pack size under 1 kg / 1 L.`}
          </p>
        </div>

        <div className="bg-sky-950/60 p-3 rounded-lg border border-sky-800 text-right shrink-0">
          <span className="text-[10px] font-bold text-sky-400 uppercase">Statutory Rate</span>
          <div className="text-xl font-extrabold text-sky-300 font-mono">
            ₹{calculatedUsp.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400">per {targetUnit}</span>
        </div>
      </div>
    </div>
  );
};
