import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';

interface ComplianceScoreCardProps {
  report: ComplianceReport;
}

export const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({ report }) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';
  const isWarning = report.overallStatus === 'WARNING';

  const categories = [
    { key: 'mandatory_declarations', label: 'Mandatory Declarations (Rule 6)', total: 0, passed: 0 },
    { key: 'weights_and_measures', label: 'Weights & Metric Units', total: 0, passed: 0 },
    { key: 'pricing_and_usp', label: 'Pricing & Unit Sale Price', total: 0, passed: 0 },
    { key: 'consumer_grievance', label: 'Consumer Redressal', total: 0, passed: 0 },
    { key: 'pdp_and_typography', label: 'PDP & Font Size (Rule 7)', total: 0, passed: 0 }
  ];

  categories.forEach(cat => {
    const rules = report.ruleResults.filter(r => r.category === cat.key && r.status !== 'NOT_APPLICABLE');
    cat.total = rules.length;
    cat.passed = rules.filter(r => r.status === 'PASS').length;
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm space-y-5 transition-colors duration-300">
      
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
              isCompliant ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' :
              isWarning ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800' :
              'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800'
            }`}
          >
            {isCompliant ? <ShieldCheck className="w-6 h-6" /> : 
             isWarning ? <AlertTriangle className="w-6 h-6" /> : 
             <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isCompliant ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-transparent dark:border-emerald-800' :
                  isWarning ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-transparent dark:border-amber-800' :
                  'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-transparent dark:border-rose-800'
                }`}
              >
                {report.overallStatus.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-400 font-mono tracking-tight">Audit #{report.inspectionId}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight transition-colors">
              {report.productName}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mt-0.5 transition-colors">
              {report.brandName} &bull; {report.categoryName}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#0b0f19] px-5 py-3 rounded-xl border border-slate-200 dark:border-gray-800 self-start sm:self-auto transition-colors duration-300">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400">Compliance Index</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-gray-300 mt-0.5">
              {report.overallScore >= 90 ? 'Fully Compliant' :
               report.overallScore >= 75 ? 'Minor Deficiencies' : 'Notice Required'}
            </div>
          </div>
          <div
            className={`text-3xl font-black tracking-tighter ${
              report.overallScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
              report.overallScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {report.overallScore}%
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-[#0b0f19] p-4 rounded-xl border border-slate-100 dark:border-gray-800 transition-colors duration-300">
          <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Rules Verified</div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{report.totalRulesChecked}</div>
        </div>
        <div className="bg-emerald-50/50 dark:bg-[#0b0f19] p-4 rounded-xl border border-emerald-100 dark:border-gray-800 transition-colors duration-300">
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Passed</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{report.passedRulesCount}</div>
        </div>
        <div className="bg-rose-50/50 dark:bg-[#0b0f19] p-4 rounded-xl border border-rose-100 dark:border-gray-800 transition-colors duration-300">
          <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Violations</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{report.failedRulesCount}</div>
        </div>
        <div className="bg-amber-50/50 dark:bg-[#0b0f19] p-4 rounded-xl border border-amber-100 dark:border-gray-800 transition-colors duration-300">
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Warnings</div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{report.warningRulesCount}</div>
        </div>
      </div>

      {/* Category Health Bars */}
      <div className="pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-300 mb-3 transition-colors">
          Category Health Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat, idx) => {
            const pct = cat.total > 0 ? Math.round((cat.passed / cat.total) * 100) : 100;
            const isFull = pct === 100;
            return (
              <div key={idx} className="bg-white dark:bg-[#0b0f19] p-3 rounded-lg border border-slate-200 dark:border-gray-800/80 transition-colors duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700 dark:text-gray-300 text-xs truncate pr-2">{cat.label}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-gray-400 shrink-0">
                    {cat.passed}/{cat.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
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