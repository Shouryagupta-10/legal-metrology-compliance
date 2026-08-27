import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Scale, CheckCircle2, XCircle, Award } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';

interface ComplianceScoreCardProps {
  report: ComplianceReport;
}

export const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({ report }) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';
  const isWarning = report.overallStatus === 'WARNING';

  const categories = [
    { key: 'mandatory_declarations', label: 'Rule 6 Mandatory Declarations', total: 0, passed: 0, code: 'R6' },
    { key: 'weights_and_measures', label: 'Weights & Metric Units', total: 0, passed: 0, code: 'R11' },
    { key: 'pricing_and_usp', label: 'Pricing & 2021 Unit Sale Price', total: 0, passed: 0, code: 'USP' },
    { key: 'consumer_grievance', label: 'Consumer Redressal Details', total: 0, passed: 0, code: 'R6(1)(n)' },
    { key: 'pdp_and_typography', label: 'PDP & Schedule II Font Heights', total: 0, passed: 0, code: 'Table 1' }
  ];

  categories.forEach(cat => {
    const rules = report.ruleResults.filter(r => r.category === cat.key && r.status !== 'NOT_APPLICABLE');
    cat.total = rules.length;
    cat.passed = rules.filter(r => r.status === 'PASS').length;
  });

  // Calculate circumference for circular gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

  return (
    <div className="rounded-[1.75rem] border border-[var(--hairline)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
      {/* Top Banner Status with Radial Score Ring */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        {/* Left SKU Details */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isCompliant
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                  : isWarning
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                  : 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
              }`}
            >
              {report.overallStatus.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-[var(--ink-soft)]">
              Protocol #{report.inspectionId} &bull; Standard: LMPC 2011
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              {report.productName}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium mt-0.5">
              Brand: <span className="text-[var(--ink)] font-semibold">{report.brandName}</span> &bull; Category: {report.categoryName}
            </p>
          </div>
        </div>

        {/* Right Radial Compliance Meter */}
        <div className="flex items-center gap-4 bg-[var(--surface)] p-3.5 pr-6 rounded-[1.25rem] border border-[var(--hairline)] self-start sm:self-auto shrink-0 shadow-xs">
          {/* Circular SVG Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[var(--hairline)] fill-none"
                strokeWidth="8"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`fill-none transition-all duration-1000 ease-out ${
                  report.overallScore >= 90
                    ? 'stroke-emerald-500'
                    : report.overallScore >= 70
                    ? 'stroke-amber-500'
                    : 'stroke-rose-500'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-[var(--ink)] leading-none">
                {report.overallScore}%
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ink-soft)]">
              Statutory Index
            </div>
            <div className="text-xs font-semibold text-[var(--ink)] mt-0.5">
              {report.overallScore >= 90
                ? 'Full Statutory Clearance'
                : report.overallScore >= 70
                ? 'Minor Discrepancies'
                : 'Defect Notice Required'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Clauses Verified
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--ink)] mt-1">
            {report.totalRulesChecked}
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Passed Rules
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {report.passedRulesCount}
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Violations
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">
            {report.failedRulesCount}
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-[1.25rem] border border-[var(--hairline)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Warnings
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
            {report.warningRulesCount}
          </div>
        </div>
      </div>

      {/* Category Health Breakdown Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Statutory Category Verification Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, idx) => {
            const pct = cat.total > 0 ? Math.round((cat.passed / cat.total) * 100) : 100;
            const isFull = pct === 100;

            return (
              <div
                key={idx}
                className="bg-[var(--surface)] p-3.5 rounded-[1.25rem] border border-[var(--hairline)] space-y-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--surface-card)] text-[var(--brand)] border border-[var(--hairline)]">
                      {cat.code}
                    </span>
                    <h5 className="font-semibold text-xs text-[var(--ink)] mt-1 line-clamp-1">
                      {cat.label}
                    </h5>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--ink)] shrink-0">
                    {cat.passed}/{cat.total}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[var(--hairline)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
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