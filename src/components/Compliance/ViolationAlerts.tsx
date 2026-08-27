import React from 'react';
import { AlertOctagon, Gavel, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

interface ViolationAlertsProps {
  report: ComplianceReport;
  onFocusRule: (ruleId: string) => void;
}

export const ViolationAlerts: React.FC<ViolationAlertsProps> = ({ report, onFocusRule }) => {
  const failedRules = report.ruleResults.filter(r => r.status === 'FAIL');

  if (failedRules.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-500/40 bg-emerald-950/20 p-6 flex flex-col justify-between h-full space-y-4 shadow-sm text-emerald-300">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Official Statutory Clearance
            </div>
            <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
              Zero Non-Compliance Violations
            </h4>
          </div>
        </div>

        <p className="text-xs text-emerald-200/80 leading-relaxed">
          This packaging artwork strictly adheres to mandatory declarations under Rule 6, metric symbols under Rule 11, and minimum Schedule II Principal Display Panel font heights.
        </p>

        <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-400">
          <span>Standard: LMPC Rules, 2011</span>
          <span>Verified &bull; 100% Pass</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-rose-500/50 bg-rose-950/25 p-6 shadow-xl space-y-5 flex flex-col justify-between h-full">
      {/* Title Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                Statutory Notice
              </span>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Section 36 Liability Exposure
              </h4>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">
            {failedRules.length} DEFECTS
          </span>
        </div>

        <p className="text-xs text-rose-200/80 leading-relaxed">
          Packaging fails mandatory legal metrology clauses. Subject to compounding proceedings or prosecution under Section 36 of Legal Metrology Act, 2009.
        </p>
      </div>

      {/* Financial Liability Box */}
      <div className="bg-[#0a0a0a]/90 rounded-2xl p-4 border border-rose-900/60 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase text-white/50">First Offence Exposure</span>
          <span className="text-sm font-bold text-rose-400">
            ₹{report.penaltyEstimate.firstOffenseMaxFine.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/60">
          <span>Second Offence Cap</span>
          <span className="text-amber-400 font-semibold">₹50,000 / SKU</span>
        </div>
      </div>

      {/* Defect Quick Action Links */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 block">
          Click Defect to Focus Canvas
        </span>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {failedRules.map(rule => (
            <button
              key={rule.ruleId}
              onClick={() => {
                sounds.playClick();
                onFocusRule(rule.ruleId);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-black/40 hover:bg-rose-900/30 border border-rose-900/40 hover:border-rose-500 transition-all flex items-center justify-between gap-2 text-xs group"
            >
              <div className="truncate">
                <span className="font-mono text-rose-400 font-bold text-[11px] mr-1.5">
                  {rule.ruleCode}
                </span>
                <span className="text-white/90 truncate">{rule.ruleTitle}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
