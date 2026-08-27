import React, { useState } from 'react';
import { Ruler, Box, Cylinder, FileText, CheckCircle2, AlertTriangle, X, HelpCircle, Layers } from 'lucide-react';
import { PackageShape, PrincipalDisplayPanelCalculation } from '../../types/compliance';
import { calculatePDP } from '../../services/pdpCalculator';

interface PDPMeasurementToolProps {
  isOpen: boolean;
  onClose: () => void;
  initialShape?: PackageShape;
  netQtyValue: number;
  netQtyUnit: string;
  onSavePDP: (pdp: PrincipalDisplayPanelCalculation) => void;
}

export const PDPMeasurementTool: React.FC<PDPMeasurementToolProps> = ({
  isOpen,
  onClose,
  initialShape = 'rectangular',
  netQtyValue,
  netQtyUnit,
  onSavePDP
}) => {
  const [shape, setShape] = useState<PackageShape>(initialShape);
  const [heightMm, setHeightMm] = useState<number>(200);
  const [widthMm, setWidthMm] = useState<number>(140);
  const [depthMm, setDepthMm] = useState<number>(60);
  const [diameterMm, setDiameterMm] = useState<number>(75);
  const [measuredFontHeightMm, setMeasuredFontHeightMm] = useState<number>(4.0);

  const pdpResult = calculatePDP({
    packageShape: shape,
    heightMm,
    widthMm,
    depthMm,
    diameterMm,
    netQuantityValue: netQtyValue,
    netQuantityUnit: netQtyUnit,
    measuredNumeralHeightMm: measuredFontHeightMm
  });

  const handleApply = () => {
    onSavePDP(pdpResult);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Principal Display Panel (PDP) & Font Height Tool</h3>
              <p className="text-xs text-slate-400">Rule 7 & Table 1 Compliance Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Shape Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Package Geometry
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'rectangular', label: 'Rectangular Box', icon: Box, desc: '40% of (H × W) face' },
                { id: 'cylindrical', label: 'Cylindrical Bottle', icon: Cylinder, desc: '20% of total surface area' },
                { id: 'packet_pouch', label: 'Pouch / Packet', icon: FileText, desc: '40% of one side' },
                { id: 'irregular', label: 'Irregular / Other', icon: Layers, desc: '20% of surface area' }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = shape === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setShape(item.id as PackageShape)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-950/60 shadow-lg shadow-sky-500/10'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Height (mm)</label>
              <input
                type="number"
                value={heightMm}
                onChange={e => setHeightMm(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {shape === 'cylindrical' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Diameter (mm)</label>
                <input
                  type="number"
                  value={diameterMm}
                  onChange={e => setDiameterMm(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Width (mm)</label>
                  <input
                    type="number"
                    value={widthMm}
                    onChange={e => setWidthMm(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                {shape === 'rectangular' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Depth (mm)</label>
                    <input
                      type="number"
                      value={depthMm}
                      onChange={e => setDepthMm(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Font Height Calibration */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Measured Numeral Font Height on Package (mm)</span>
              </label>
              <span className="font-mono text-sm font-bold text-sky-400">{measuredFontHeightMm} mm</span>
            </div>

            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.1"
              value={measuredFontHeightMm}
              onChange={e => setMeasuredFontHeightMm(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg h-2"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 mm</span>
              <span>Required Min: {pdpResult.requiredMinNumeralHeightMm} mm</span>
              <span>10.0 mm</span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div
            className={`p-4 rounded-xl border ${
              pdpResult.isNumeralHeightCompliant
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {pdpResult.isNumeralHeightCompliant ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  {pdpResult.isNumeralHeightCompliant
                    ? 'Numeral Height Compliant with Rule 7'
                    : 'Font Height Violation Detected under Rule 7'}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Total Surface Area: <span className="font-mono font-semibold">{pdpResult.totalSurfaceAreaSqCm} cm²</span> |
                  PDP Minimum Area: <span className="font-mono font-semibold">{pdpResult.pdpAreaSqCm} cm²</span> ({pdpResult.pdpPercentage}% of surface)
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Package Net Qty: <span className="font-mono font-semibold">{pdpResult.netQuantityGramsOrMl} g/ml</span> &rarr;
                  Statutory Min Numeral Height: <span className="font-mono font-semibold text-sky-300">{pdpResult.requiredMinNumeralHeightMm} mm</span>,
                  Min Letter Height: <span className="font-mono font-semibold text-sky-300">{pdpResult.requiredMinLetterHeightMm} mm</span>.
                </p>
                {!pdpResult.isNumeralHeightCompliant && (
                  <p className="text-rose-400 font-semibold pt-1">
                    ⚠ Action Required: Increase printed numeral height from {measuredFontHeightMm} mm to at least {pdpResult.requiredMinNumeralHeightMm} mm.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rule 7 Statutory Reference Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-950 px-4 py-2 font-bold text-slate-300 border-b border-slate-800 flex items-center justify-between">
              <span>Rule 7 Table 1: Minimum Height of Numerals & Letters</span>
              <span className="text-[10px] text-slate-500 font-mono">Statutory Standard</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="px-3 py-2">Net Quantity Range</th>
                  <th className="px-3 py-2">Min Numeral Height (Normal)</th>
                  <th className="px-3 py-2">Min Letter Height</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                <tr className={pdpResult.netQuantityGramsOrMl <= 50 ? 'bg-sky-950/40 text-sky-300 font-bold' : ''}>
                  <td className="px-3 py-1.5">Up to 50 g / 50 ml</td>
                  <td className="px-3 py-1.5">1.5 mm</td>
                  <td className="px-3 py-1.5">1.0 mm</td>
                </tr>
                <tr className={pdpResult.netQuantityGramsOrMl > 50 && pdpResult.netQuantityGramsOrMl <= 200 ? 'bg-sky-950/40 text-sky-300 font-bold' : ''}>
                  <td className="px-3 py-1.5">50 g to 200 g / 50 ml to 200 ml</td>
                  <td className="px-3 py-1.5">2.0 mm</td>
                  <td className="px-3 py-1.5">1.0 mm</td>
                </tr>
                <tr className={pdpResult.netQuantityGramsOrMl > 200 && pdpResult.netQuantityGramsOrMl <= 1000 ? 'bg-sky-950/40 text-sky-300 font-bold' : ''}>
                  <td className="px-3 py-1.5">200 g to 1 kg / 200 ml to 1 L</td>
                  <td className="px-3 py-1.5">4.0 mm</td>
                  <td className="px-3 py-1.5">2.0 mm</td>
                </tr>
                <tr className={pdpResult.netQuantityGramsOrMl > 1000 ? 'bg-sky-950/40 text-sky-300 font-bold' : ''}>
                  <td className="px-3 py-1.5">Above 1 kg / 1 L</td>
                  <td className="px-3 py-1.5">6.0 mm</td>
                  <td className="px-3 py-1.5">3.0 mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
          >
            Apply PDP Calculation
          </button>
        </div>
      </div>
    </div>
  );
};