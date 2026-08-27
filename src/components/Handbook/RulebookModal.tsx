import React, { useState } from 'react';
import { BookOpen, Search, X, Scale, FileText, AlertOctagon, CheckCircle2, Bookmark } from 'lucide-react';
import { LEGAL_METROLOGY_RULES } from '../../services/legalMetrologyRules';

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredRules = LEGAL_METROLOGY_RULES.filter(r => {
    const matchesSearch =
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Legal Metrology (Packaged Commodities) Rules, 2011 Handbook
              </h3>
              <p className="text-xs text-slate-400">
                Statutory Reference, Standard Metric Units & Penalty Matrix
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search clauses, e.g. 'Unit Sale Price', 'Rule 6', 'Font height', 'Address'..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: 'all', label: 'All Rules' },
              { id: 'mandatory_declarations', label: 'Rule 6' },
              { id: 'weights_and_measures', label: 'Units & Symbols' },
              { id: 'pricing_and_usp', label: 'MRP & USP' },
              { id: 'pdp_and_typography', label: 'Rule 7 (PDP)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredRules.map(rule => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {rule.code}
                  </span>
                  <h4 className="font-bold text-white text-sm">{rule.title}</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {rule.statutoryReference}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>

              {/* Guidelines */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Statutory Guidelines & Enforcement Criteria
                </span>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  {rule.guidelines.map((g, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Penalty Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-rose-300/90 pt-1 border-t border-slate-800/60 gap-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  Liability: {rule.penaltySection}
                </span>
                <span className="text-slate-400">{rule.penaltySummary}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Legal Metrology (Packaged Commodities) Rules, 2011 (as amended 2021/2022/2023)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close Handbook
          </button>
        </div>
      </div>
    </div>
  );
};