import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Scale, Sparkles, ArrowUpRight } from 'lucide-react';
import { RuleResult } from '../../types/compliance';

interface RuleChecklistProps {
  ruleResults: RuleResult[];
  activeRuleId?: string;
  onSelectRule: (ruleId: string) => void;
}

export const RuleChecklist: React.FC<RuleChecklistProps> = ({
  ruleResults,
  activeRuleId,
  onSelectRule
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Clauses' },
    { id: 'failed', label: 'Violations Only' },
    { id: 'mandatory_declarations', label: 'Mandatory (Rule 6)' },
    { id: 'weights_and_measures', label: 'Weights & Units' },
    { id: 'pricing_and_usp', label: 'Pricing & USP' },
    { id: 'consumer_grievance', label: 'Consumer Care' },
    { id: 'pdp_and_typography', label: 'PDP & Fonts' }
  ];

  const filteredRules = ruleResults.filter(r => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'failed') return r.status === 'FAIL';
    return r.category === selectedCategory;
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRuleId(prev => (prev === id ? null : id));
  };

  const getStatusIcon = (status: RuleResult['status']) => {
    if (status === 'PASS') return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    if (status === 'FAIL') return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
    if (status === 'WARNING') return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
    return <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />;
  };

  const getStatusBadge = (status: RuleResult['status']) => {
    if (status === 'PASS')
      return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-800">PASS</span>;
    if (status === 'FAIL')
      return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800">VIOLATION</span>;
    if (status === 'WARNING')
      return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-800">WARNING</span>;
    return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">N/A</span>;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl human-panel space-y-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            Statutory Rule-by-Rule Compliance Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 Clause Verification Matrix
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold btn-tactile transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
        {filteredRules.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No rules matching the selected filter criteria.
          </div>
        ) : (
          filteredRules.map(rule => {
            const isExpanded = expandedRuleId === rule.ruleId || activeRuleId === rule.ruleId;
            const isSelected = activeRuleId === rule.ruleId;

            return (
              <div
                key={rule.ruleId}
                onClick={() => onSelectRule(rule.ruleId)}
                className={`rounded-xl border transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-sky-500 bg-sky-950/40 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                    : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Rule Header Row */}
                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(rule.status)}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/60">
                          {rule.ruleCode}
                        </span>
                        <h5 className="font-bold text-white text-xs">{rule.ruleTitle}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {rule.extractedValue ? (
                          <span>
                            <span className="text-slate-500 font-semibold">Detected: </span>
                            <span className="font-mono text-slate-200 font-medium">{rule.extractedValue}</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 font-medium">Declaration Missing from Packaging</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(rule.status)}
                    <button
                      onClick={e => toggleExpand(rule.ruleId, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/90 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Statutory Requirement</span>
                        <p className="text-slate-200 mt-0.5 text-[11px] leading-relaxed">
                          {rule.expectedFormat}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Legal Citation & Clause</span>
                        <p className="text-sky-300 font-mono mt-0.5 text-[11px]">
                          {rule.legalCitation}
                        </p>
                      </div>
                    </div>

                    {rule.status === 'FAIL' && (
                      <div className="bg-rose-950/40 p-3 rounded-lg border border-rose-800/60 space-y-1.5">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Deficiency Reason:</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {rule.deficiencyReason || rule.description}
                        </p>
                        {rule.recommendation && (
                          <div className="pt-1 text-emerald-300 text-[11px]">
                            <span className="font-semibold text-slate-300">How to Fix in Artwork: </span>
                            {rule.recommendation}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Penalty Reference: {rule.penaltyClause}</span>
                      <span className="text-sky-400 font-semibold cursor-pointer hover:underline flex items-center gap-0.5">
                        Focus Region on Packaging <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
