import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck,
  Gavel,
  Clock,
  Shield,
  FileText,
  Copy,
  Printer,
  X,
  CheckCircle2,
  Send
} from 'lucide-react';
import { InspectorPriorityTriage, ComplianceReport } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

interface InspectorTriagePanelProps {
  triage: InspectorPriorityTriage;
  report: ComplianceReport;
}

export const InspectorTriagePanel: React.FC<InspectorTriagePanelProps> = ({
  triage,
  report
}) => {
  const [activeModal, setActiveModal] = useState<'notice' | 'compounding' | 'seizure' | null>(null);
  const [copied, setCopied] = useState(false);

  const isTier1 = triage.tier === 'CRITICAL_SEIZURE';
  const isTier2 = triage.tier === 'SHOW_CAUSE_NOTICE';
  const isTier3 = triage.tier === 'TECHNICAL_RECTIFICATION';

  const tierAccent = isTier1
    ? 'border-rose-500/50 bg-rose-950/40 text-rose-300'
    : isTier2
    ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
    : isTier3
    ? 'border-sky-500/50 bg-sky-950/40 text-sky-300'
    : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';

  const generateNoticeText = () => {
    return `FORMAL NOTICE UNDER SECTION 36(1) OF LEGAL METROLOGY ACT, 2009
Ref No: LM-ENF/${report.inspectionId}/${new Date().getFullYear()}
Date: ${report.inspectionDate}

To,
The Managing Director / Authorized Signatory
${report.brandName} (${report.declarations.manufacturerName || 'Manufacturer/Packer'})
Address: ${report.declarations.manufacturerAddress || 'Address on record'}

SUBJECT: NOTICE OF STATUTORY VIOLATION & SHOW-CAUSE UNDER LMPC RULES, 2011

Whereas during an official inspection of the packaged commodity "${report.productName}", the following statutory contraventions have been recorded:
${report.ruleResults.filter(r => r.status === 'FAIL').map((r, i) => `${i + 1}. [${r.ruleCode}] ${r.ruleTitle}: ${r.deficiencyReason}`).join('\n')}
${report.tamperReport.isTampered ? `\nCRITICAL ANOMALY: ${report.tamperReport.summary}` : ''}

You are hereby summoned to show cause in writing within ${triage.urgencyHours > 0 ? `${triage.urgencyHours} hours` : '7 working days'} as to why penal proceedings under Section 36(1) and compounding penalties under Section 48 should not be initiated against you.

Issued by:
OFFICE OF THE CONTROLLER OF LEGAL METROLOGY
Enforcement & Compliance Division`;
  };

  const handleCopyNotice = () => {
    sounds.playClick();
    navigator.clipboard.writeText(generateNoticeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[2rem] border border-[var(--hairline)] bg-[#090e1c] p-5 sm:p-7 shadow-2xl text-white space-y-6 relative overflow-hidden transition-all">
      {/* Background Accent */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isTier1 ? 'bg-rose-600/15' : isTier2 ? 'bg-amber-600/15' : 'bg-blue-600/15'
        }`}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shadow-lg shrink-0">
            <Gavel className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Enforcement Intelligence Deck
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-mono text-white/50">Investigating Officer Triage</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Regulatory Case Prioritization &amp; Summons Protocol
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <div className={`px-4 py-2 rounded-full border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md ${tierAccent}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
          <span>Priority Tier 0{triage.priorityRank}: {triage.tier.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Triage Overview Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Recommended Action */}
        <div className="md:col-span-2 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase font-bold">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Recommended Enforcement Protocol</span>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {triage.recommendedAction}
          </p>
          <div className="text-[11px] font-mono text-white/50 pt-1">
            Statutory Basis: <span className="text-amber-300">{triage.statutorySection}</span>
          </div>
        </div>

        {/* Urgency Window */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase font-bold">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Action Urgency Window</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {triage.urgencyHours > 0 ? `${triage.urgencyHours}h` : 'Immediate'}
            </div>
            <div className="text-[11px] text-white/60 font-mono mt-0.5">
              {triage.urgencyHours > 0 ? 'Mandatory officer response timeframe' : 'Statutory Clearance Achieved'}
            </div>
          </div>
        </div>

      </div>

      {/* Officer Action Checklist */}
      <div className="relative z-10 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="text-xs font-mono text-white/50 uppercase font-bold flex items-center justify-between">
          <span>STATUTORY PROCEDURE CHECKLIST (ENFORCEMENT MANUAL)</span>
          <span className="text-[10px] text-white/40">{triage.actionChecklist.length} Mandated Steps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {triage.actionChecklist.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2.5 text-xs text-white/80"
            >
              <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono font-bold flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Action Toolbar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs font-mono text-white/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Case Linked to Inspection ID: #{report.inspectionId}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Draft Show-Cause Notice */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('notice');
            }}
            className="px-4 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all btn-tactile shadow-md"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Draft Show-Cause Notice</span>
          </button>

          {/* Action 2: Seizure Order if Tier 1 */}
          {isTier1 && (
            <button
              onClick={() => {
                sounds.playAlert();
                setActiveModal('seizure');
              }}
              className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all btn-tactile shadow-lg shadow-rose-500/20"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Issue Form V Seizure Order</span>
            </button>
          )}

          {/* Action 3: Compounding Calculator */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('compounding');
            }}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all btn-tactile"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Compounding Calc (Sec 48)</span>
          </button>
        </div>
      </div>

      {/* Modal Dialog for Summons / Show-Cause Notice */}
      {activeModal === 'notice' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0d1326] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <div>
                  <h4 className="font-bold text-lg">Section 36(1) Statutory Show-Cause Notice</h4>
                  <p className="text-xs font-mono text-white/50">Ready to dispatch to registered manufacturer</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-white/80 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
              {generateNoticeText()}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-white/50">
                Official legal format conforming to Legal Metrology Rules, 2011
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotice}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold uppercase flex items-center gap-1.5 transition-all btn-tactile"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    setActiveModal(null);
                  }}
                  className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase transition-all btn-tactile shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Seizure Order */}
      {activeModal === 'seizure' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-[#140b15] border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
                <div>
                  <h4 className="font-bold text-lg text-rose-300">Form V Stock Seizure Memo</h4>
                  <p className="text-xs font-mono text-white/50">Section 15(1) Legal Metrology Act, 2009</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/20 text-xs font-mono space-y-2 text-white/80">
              <div className="text-rose-400 font-bold uppercase text-[11px]">
                Grounds for Seizure:
              </div>
              <div>• Illicit Price Tampering / Pasted MRP Sticker detected</div>
              <div>• Violation of Rule 18(2) &amp; Section 36(1)</div>
              <div>• Specimen: {report.productName}</div>
              <div>• Est. Illicit Commercial Gain: ₹140.00 per unit</div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Upon issuance, an investigating officer must attach official sealing tape around retail cartons and impound inventory under Form V custody receipt.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold uppercase transition-all btn-tactile shadow-lg"
              >
                Confirm Seizure Order Generation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Compounding Assessment */}
      {activeModal === 'compounding' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-[#0d1326] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Gavel className="w-6 h-6 text-sky-400" />
                <div>
                  <h4 className="font-bold text-lg">Section 48 Compounding Assessment</h4>
                  <p className="text-xs font-mono text-white/50">Voluntary settlement fee schedule</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/60">First Offence Baseline Fine:</span>
                <span className="font-bold text-white">₹ 25,000</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/60">Contravened Parameters:</span>
                <span className="font-bold text-white">{report.failedRulesCount} Sections</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/60">Estimated Total Compounding Fee:</span>
                <span className="font-bold text-amber-400 text-sm">
                  ₹ {(Math.max(1, report.failedRulesCount) * 25000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[11px] text-white/50 pt-1">
                Note: Compounding under Section 48 is available only for first offences prior to court prosecution.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase transition-all btn-tactile"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
