import React from 'react';
import { AlertOctagon, Gavel, ArrowRight, ShieldAlert, AlertTriangle, FileWarning } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';

interface ViolationAlertsProps {
  report: ComplianceReport;
  onFocusRule: (ruleId: string) => void;
}

export const ViolationAlerts: React.FC<ViolationAlertsProps> = ({ report, onFocusRule }) => {
  const failedRules = report.ruleResults.filter(r => r.status === 'FAIL');

  if (failedRules.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/20 p-4 flex items-center gap-3 text-emerald-300">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Gavel className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-white text-sm">No Statutory Violations Detected</div>
          <p className="text-slate-300 mt-0.5">
            This packaging design strictly meets all mandatory declaration clauses under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-800/80 bg-rose-950/25 p-5 shadow-xl glass-panel space-y-4 glow-red">
      {/* Title Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              Statutory Violations & Section 36 Liability Notice
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                {failedRules.length} DEFECTS FOUND
              </span>
            </h4>
            <p className="text-xs text-rose-300/90 mt-0.5">
              Subject to compounding proceedings or prosecution under Section 36 of Legal Metrology Act, 2009.
            </p>
          </div>
        </div>
      </div>

      {/* Compounding & Penalty Card */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-rose-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">First Offence Liability</span>
          <div className="text-base font-black text-rose-400 font-mono mt-0.5">
            ₹ 25,000 / parameter
          </div>
          <span className="text-[10px] text-slate-500">Est. Total: ₹ {report.penaltyEstimate.firstOffenseMaxFine.toLocaleString('en-IN')}</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Second Offence Penalty</span>
          <div className="text-base font-black text-amber-400 font-mono mt-0.5">
            Up to ₹ 50,000
          </div>
          <span className="text-[10px] text-slate-500">Compounding fee limit</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Subsequent Offences</span>
          <div className="text-base font-black text-white font-mono mt-0.5">
            ₹ 1,00,000 + Jail
          </div>
          <span className="text-[10px] text-slate-500">Imprisonment up to 1 yr</span>
        </div>
      </div>

      {/* Defect Cards List */}
      <div className="space-y-2.5">
        {failedRules.map(rule => (
          <div
            key={rule.ruleId}
            onClick={() => onFocusRule(rule.ruleId)}
            className="p-3 bg-slate-950/90 rounded-xl border border-rose-900/50 hover:border-rose-500 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-rose-400 text-xs">{rule.ruleCode}</span>
                <span className="font-bold text-slate-200">{rule.ruleTitle}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <span className="text-rose-300 font-semibold">Defect: </span>
                {rule.deficiencyReason || rule.description}
              </p>
              {rule.recommendation && (
                <p className="text-sky-300 text-[11px]">
                  <span className="font-semibold text-slate-400">Action: </span>
                  {rule.recommendation}
                </p>
              )}
            </div>

            <button className="px-3 py-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 text-[11px] font-bold border border-rose-800 shrink-0 self-start sm:self-auto flex items-center gap-1">
              Inspect &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
