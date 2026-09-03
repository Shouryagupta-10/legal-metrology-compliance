import React from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, ScanEye, Tag, FileText, ArrowUpRight, Zap } from 'lucide-react';
import { TamperAnomalyReport, TamperAnomaly } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

interface TamperDetectionCardProps {
  report: TamperAnomalyReport;
  onFocusAnomaly?: (boundingBoxId?: string) => void;
}

export const TamperDetectionCard: React.FC<TamperDetectionCardProps> = ({
  report,
  onFocusAnomaly
}) => {
  const isHighRisk = report.tamperRiskScore >= 70;
  const isModerateRisk = report.tamperRiskScore >= 30 && report.tamperRiskScore < 70;

  const badgeColor = isHighRisk
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : isModerateRisk
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  const riskTitle = isHighRisk
    ? 'CRITICAL TAMPER ALERT'
    : isModerateRisk
    ? 'SUSPICIOUS ANOMALIES'
    : 'GENUINE PACKAGING';

  return (
    <div className="rounded-[2rem] border border-[var(--hairline)] bg-[#0c1222] p-5 sm:p-7 shadow-2xl text-white space-y-6 relative overflow-hidden transition-all">
      {/* Background Ambient Glow */}
      <div
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isHighRisk ? 'bg-rose-600/20' : isModerateRisk ? 'bg-amber-600/15' : 'bg-emerald-600/15'
        }`}
      />

      {/* Header Bar */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${
              isHighRisk
                ? 'bg-rose-500/20 border-rose-400/40 text-rose-400'
                : isModerateRisk
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
            }`}
          >
            {isHighRisk ? (
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            ) : isModerateRisk ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                AI Forensics &amp; Anomaly Engine
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-mono text-white/50">Rule 18(2) Anti-Tamper</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Label Tampering &amp; Sticker Detection</span>
            </h3>
          </div>
        </div>

        {/* Authenticity Rating Pill */}
        <span
          className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider shadow-sm flex items-center gap-1.5 shrink-0 ${badgeColor}`}
        >
          <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-rose-400 animate-ping' : isModerateRisk ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span>{riskTitle}</span>
        </span>
      </div>

      {/* Score Readout & Quick Diagnostic Pills */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Tamper Risk Index */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/50 font-bold block">
            Tamper Risk Index
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-mono font-bold ${
                isHighRisk ? 'text-rose-400' : isModerateRisk ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {report.tamperRiskScore}%
            </span>
            <span className="text-xs font-mono text-white/50">
              {isHighRisk ? 'Severe Breach' : isModerateRisk ? 'Moderate Risk' : 'Authentic'}
            </span>
          </div>
        </div>

        {/* Sticker Overlay Status */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/50 font-bold block">
            Pasted Sticker Contour
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Tag className={`w-4 h-4 ${report.stickerOverlayDetected ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span className="font-semibold text-sm text-white">
              {report.stickerOverlayDetected ? 'Over-labeling Found' : 'No Over-Stickering'}
            </span>
          </div>
        </div>

        {/* Dual Pricing Status */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/50 font-bold block">
            Dual MRP Alteration
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Zap className={`w-4 h-4 ${report.dualPricingDetected ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span className="font-semibold text-sm text-white">
              {report.dualPricingDetected ? 'Dual Price Prohibited' : 'Single Unified Price'}
            </span>
          </div>
        </div>

      </div>

      {/* Detected Anomalies Breakdown */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-white/60">
          <span>FORENSIC EVIDENCE LOG ({report.anomalies.length} Anomaly Records)</span>
          <span>CV Confidence Threshold &ge; 80%</span>
        </div>

        {report.anomalies.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold">Substrate &amp; Typeface Verified</div>
              <div className="text-[11px] text-emerald-300/70 mt-0.5">
                No adhesive patch lines, secondary dot-matrix font overprints, or multiple conflicting MRP markings detected.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {report.anomalies.map(anomaly => (
              <div
                key={anomaly.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ${
                        anomaly.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {anomaly.type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-white text-xs sm:text-sm">
                      {anomaly.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-white/50 shrink-0">
                    Confidence: {Math.round(anomaly.confidence * 100)}%
                  </span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {anomaly.description}
                </p>

                {/* Evidence Callout */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-rose-300/90 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-white/40 uppercase text-[10px] mr-2">Evidence:</span>
                    <span>{anomaly.evidenceSnippet}</span>
                  </div>

                  {anomaly.boundingBoxId && onFocusAnomaly && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onFocusAnomaly(anomaly.boundingBoxId);
                        const canvasEl = document.getElementById('studio');
                        if (canvasEl) canvasEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-mono font-semibold uppercase flex items-center gap-1 transition-all shrink-0"
                    >
                      <ScanEye className="w-3 h-3" />
                      <span>Focus Region</span>
                    </button>
                  )}
                </div>

                {/* Officer Recommendation */}
                <div className="text-[11px] text-amber-300/90 font-mono flex items-center gap-1.5 pt-0.5">
                  <span className="font-bold text-amber-400">Action:</span>
                  <span>{anomaly.recommendedOfficerAction}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
