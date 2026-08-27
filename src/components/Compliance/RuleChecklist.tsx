import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Scale, Sparkles, ArrowUpRight, Search, Filter } from 'lucide-react';
import { RuleResult } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const failCount = ruleResults.filter(r => r.status === 'FAIL').length;
  const passCount = ruleResults.filter(r => r.status === 'PASS').length;

  const categories: { id: string; label: string; count?: number }[] = [
    { id: 'all', label: `All Clauses (${ruleResults.length})` },
    { id: 'failed', label: `Violations (${failCount})` },
    { id: 'passed', label: `Passed (${passCount})` },
    { id: 'mandatory_declarations', label: 'Rule 6 Declarations' },
    { id: 'weights_and_measures', label: 'Weights & Units' },
    { id: 'pricing_and_usp', label: 'Pricing & USP' },
    { id: 'consumer_grievance', label: 'Consumer Care' },
    { id: 'pdp_and_typography', label: 'PDP & Typography' }
  ];

  const filteredRules = ruleResults.filter(r => {
    // Category filter
    let matchCat = true;
    if (selectedCategory === 'failed') matchCat = r.status === 'FAIL';
    else if (selectedCategory === 'passed') matchCat = r.status === 'PASS';
    else if (selectedCategory !== 'all') matchCat = r.category === selectedCategory;

    // Search query
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchSearch =
        r.ruleTitle.toLowerCase().includes(q) ||
        r.ruleClause.toLowerCase().includes(q) ||
        r.legalCitation.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.extractedValue && r.extractedValue.toLowerCase().includes(q));
    }

    return matchCat && matchSearch;
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
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
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            Statutory Rule-by-Rule Compliance Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 Clause Verification
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clause or penalty..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Badges Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => {
              sounds.playClick();
              setSelectedCategory(c.id);
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold btn-tactile transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
        {filteredRules.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No rules matching &ldquo;{searchQuery || selectedCategory}&rdquo;.
          </div>
        ) : (
          filteredRules.map(rule => {
            const isExpanded = expandedRuleId === rule.ruleId || activeRuleId === rule.ruleId;
            const isSelected = activeRuleId === rule.ruleId;

            return (
              <div
                key={rule.ruleId}
                onClick={() => onSelectRule(rule.ruleId)}
                className={`rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-slate-850/95 ring-2 ring-sky-500/30 shadow-lg'
                    : 'border-slate-800/80 bg-slate-950/50 hover:bg-slate-850/60 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">{getStatusIcon(rule.status)}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white tracking-tight truncate">
                          {rule.ruleTitle}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {rule.ruleClause}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(rule.status)}
                    <button
                      onClick={e => toggleExpand(rule.ruleId, e)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 space-y-3 bg-slate-950/40 text-xs">
                    {/* Extracted vs Required Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Extracted Value</span>
                        <span className={`font-semibold ${rule.extractedValue ? 'text-slate-200' : 'text-rose-400 italic'}`}>
                          {rule.extractedValue || 'Declaration Missing on Packaging'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Statutory Requirement</span>
                        <span className="text-sky-300 font-semibold">{rule.expectedFormat}</span>
                      </div>
                    </div>

                    {/* Legal Citation & Deficiency Reason */}
                    <div className="space-y-1 text-slate-300">
                      <div className="text-sky-400 font-medium">Citation: {rule.legalCitation}</div>
                      {rule.deficiencyReason && (
                        <div className="text-rose-300 font-medium bg-rose-950/30 p-2 rounded border border-rose-900/40">
                          Deficiency: {rule.deficiencyReason}
                        </div>
                      )}
                      {rule.recommendation && (
                        <div className="text-emerald-300 font-medium bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                          Statutory Remedy: {rule.recommendation}
                        </div>
                      )}
                    </div>

                    {/* Section 36 Penalty Notice */}
                    <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/40">
                      <span>Penalty Schedule: {rule.penaltyClause}</span>
                      <span className="text-amber-300 font-semibold">
                        Fine: ₹{rule.penaltyAmountMin.toLocaleString('en-IN')} &ndash; ₹{rule.penaltyAmountMax.toLocaleString('en-IN')}
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
