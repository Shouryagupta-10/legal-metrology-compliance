import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';

interface ComplianceScoreCardProps {
  report: ComplianceReport;
}

export const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({ report }) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';
  const isWarning = report.overallStatus === 'WARNING';

  // Category counts
  const categories = [
    { key: 'mandatory_declarations', label: 'Mandatory Declarations (Rule 6)', total: 0, passed: 0 },
    { key: 'weights_and_measures', label: 'Weights & Metric Units (Rule 11-13)', total: 0, passed: 0 },
    { key: 'pricing_and_usp', label: 'Pricing & Unit Sale Price (Rule 6(1)(e))', total: 0, passed: 0 },
    { key: 'consumer_grievance', label: 'Consumer Redressal (Rule 6(1)(n))', total: 0, passed: 0 },
    { key: 'pdp_and_typography', label: 'PDP & Font Size (Rule 7)', total: 0, passed: 0 }
  ];

  categories.forEach(cat => {
    const rules = report.ruleResults.filter(r => r.category === cat.key && r.status !== 'NOT_APPLICABLE');
    cat.total = rules.length;
    cat.passed = rules.filter(r => r.status === 'PASS').length;
  });

  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 shadow-sm space-y-4">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isCompliant
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : isWarning
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {isCompliant ? (
              <ShieldCheck className="w-6 h-6" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                  isCompliant
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : isWarning
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {report.overallStatus.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-400 font-mono">Audit #{report.inspectionId}</span>
            </div>
            <h3 className="text-base font-semibold text-white mt-1">
              {report.productName}
            </h3>
            <p className="text-xs text-gray-400">
              {report.brandName} &bull; {report.categoryName}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3 bg-[#0b0f19] px-4 py-2 rounded-xl border border-gray-800 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-gray-400">Compliance Index</div>
            <div className="text-xs font-medium text-gray-300">
              {report.overallScore >= 90
                ? 'Fully Compliant'
                : report.overallScore >= 75
                ? 'Minor Deficiencies'
                : 'Notice Required'}
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono px-3 py-1 rounded-lg ${
              report.overallScore >= 80
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : report.overallScore >= 60
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {report.overallScore}%
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#0b0f19] p-3 rounded-lg border border-gray-800">
          <div className="text-[10px] font-medium text-gray-400 uppercase">Rules Verified</div>
          <div className="text-lg font-bold text-white mt-0.5 font-mono">{report.totalRulesChecked}</div>
          <div className="text-[10px] text-gray-500">Statutory clauses</div>
        </div>

        <div className="bg-[#0b0f19] p-3 rounded-lg border border-gray-800">
          <div className="text-[10px] font-medium text-emerald-400 uppercase">Passed</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5 font-mono">{report.passedRulesCount}</div>
          <div className="text-[10px] text-gray-500">Compliant parameters</div>
        </div>

        <div className="bg-[#0b0f19] p-3 rounded-lg border border-gray-800">
          <div className="text-[10px] font-medium text-rose-400 uppercase">Violations</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5 font-mono">{report.failedRulesCount}</div>
          <div className="text-[10px] text-gray-500">Legal defects</div>
        </div>

        <div className="bg-[#0b0f19] p-3 rounded-lg border border-gray-800">
          <div className="text-[10px] font-medium text-amber-400 uppercase">Warnings</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5 font-mono">{report.warningRulesCount}</div>
          <div className="text-[10px] text-gray-500">Advisories</div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-semibold text-gray-300">
          Category Health Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categories.map((cat, idx) => {
            const pct = cat.total > 0 ? Math.round((cat.passed / cat.total) * 100) : 100;
            const isFull = pct === 100;
            return (
              <div key={idx} className="bg-[#0b0f19] p-2.5 rounded-lg border border-gray-800/80 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-300 text-[11px] truncate pr-2">{cat.label}</span>
                  <span className="font-mono text-[10px] text-gray-400 shrink-0">
                    {cat.passed}/{cat.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-emerald-500' : pct > 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
