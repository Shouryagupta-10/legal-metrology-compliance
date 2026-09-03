import React, { useState } from 'react';
import {
  MapPin,
  TrendingDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ShieldAlert,
  Search,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { NATIONAL_HOTSPOTS_DATA, MANUFACTURER_REGISTRY_DATA } from '../../services/inspectorIntelligence';
import { GeospatialHotspotData, ManufacturerTrendData } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

export const InspectorIntelligenceDashboard: React.FC = () => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL');
  const [mfrSearch, setMfrSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hotspots' | 'manufacturers' | 'predictive'>('hotspots');

  const currentState = NATIONAL_HOTSPOTS_DATA.find(s => s.stateCode === selectedStateCode) || NATIONAL_HOTSPOTS_DATA[0];

  const filteredMfrs = MANUFACTURER_REGISTRY_DATA.filter(m =>
    m.brandName.toLowerCase().includes(mfrSearch.toLowerCase()) ||
    m.manufacturerName.toLowerCase().includes(mfrSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(mfrSearch.toLowerCase())
  );

  return (
    <section id="hotspots" className="bg-[#0b1021] text-white rounded-[var(--radius-card-lg)] p-5 sm:p-8 lg:p-12 border border-white/15 shadow-2xl space-y-8 relative overflow-hidden transition-all">
      {/* Ambient background glows */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="baseline-eyebrow tone-light mb-2">
            <span className="eyebrow-dot" />
            <span>Advanced Analytics Layer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Inspector Intelligence &amp; Hotspot Mapping</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-mono mt-1 max-w-2xl">
            Real-time geospatial non-compliance patterns, sticker tampering alerts, and longitudinal manufacturer recidivism records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-full border border-white/15 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('hotspots');
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile ${
              activeTab === 'hotspots' ? 'bg-sky-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Geospatial Hotspots</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('manufacturers');
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile ${
              activeTab === 'manufacturers' ? 'bg-purple-600 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Manufacturer Registry</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Geospatial Hotspots */}
      {activeTab === 'hotspots' && (
        <div className="relative z-10 space-y-6">
          {/* State Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {NATIONAL_HOTSPOTS_DATA.map(state => {
              const isSelected = state.stateCode === selectedStateCode;
              return (
                <button
                  key={state.stateCode}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedStateCode(state.stateCode);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-all border btn-tactile flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      state.riskIndex === 'HIGH'
                        ? 'bg-rose-500'
                        : state.riskIndex === 'MEDIUM'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>{state.stateName}</span>
                </button>
              );
            })}
          </div>

          {/* Active State Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Non-compliance Rate */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50">
                Non-Compliance Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-rose-400">
                  {currentState.nonComplianceRate}%
                </span>
                <span className="text-xs font-mono text-white/40">State Average</span>
              </div>
            </div>

            {/* Inspections Count */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50">
                Total Inspections
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white">
                {currentState.totalInspections.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Critical Tampering Cases */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Tampering / Sticker Seizures
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-300">
                {currentState.tamperingCasesCount} <span className="text-xs text-white/40 font-normal">Cases</span>
              </div>
            </div>

            {/* Top Violated Clause */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                Top Infraction Clause
              </span>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {currentState.topViolatedRule}
              </div>
              <div className="text-[10px] font-mono text-white/50">Highest recidivism in zone</div>
            </div>

          </div>

          {/* District Breakdown Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-white/60">
                {currentState.stateName} &bull; District Enforcement Hotspots
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Sorted by Non-Compliance Risk
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="text-[10px] text-white/50 uppercase font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3 px-5">Enforcement District</th>
                    <th className="py-3 px-5 text-center">Audited Packages</th>
                    <th className="py-3 px-5 text-center">Defect Rate</th>
                    <th className="py-3 px-5">Risk Heat Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentState.districts.map(dist => (
                    <tr key={dist.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{dist.name}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-center text-white/70">
                        {dist.inspections.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full border ${
                            dist.rate >= 35
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                              : dist.rate >= 25
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {dist.rate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden max-w-[140px]">
                          <div
                            className={`h-full rounded-full ${
                              dist.rate >= 35 ? 'bg-rose-500' : dist.rate >= 25 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${dist.rate * 2}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manufacturer Registry */}
      {activeTab === 'manufacturers' && (
        <div className="relative z-10 space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-2xl border border-white/10">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search manufacturer, brand, or FMCG category..."
              value={mfrSearch}
              onChange={e => setMfrSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-white/40 w-full font-mono"
            />
          </div>

          {/* Manufacturers Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-black/40 text-[10px] text-white/50 uppercase font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Brand / Manufacturer</th>
                    <th className="py-3.5 px-4">Commodity Category</th>
                    <th className="py-3.5 px-4 text-center">Audited SKUs</th>
                    <th className="py-3.5 px-4 text-center">Avg Score</th>
                    <th className="py-3.5 px-4 text-center">Tamper Incidents</th>
                    <th className="py-3.5 px-4 text-center">Recidivism Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredMfrs.map(mfr => (
                    <tr key={mfr.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white sm:text-sm">{mfr.brandName}</div>
                        <div className="text-[10px] font-mono text-white/50 mt-0.5">{mfr.manufacturerName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-white/80">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px]">
                          {mfr.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-white/90">
                        {mfr.totalAudited}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border ${
                            mfr.complianceScoreAvg >= 90
                              ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                              : mfr.complianceScoreAvg >= 70
                              ? 'text-amber-300 bg-amber-950/60 border-amber-500/40'
                              : 'text-rose-300 bg-rose-950/60 border-rose-500/40'
                          }`}
                        >
                          {mfr.complianceScoreAvg}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {mfr.tamperedCount > 0 ? (
                          <span className="text-rose-400 font-bold px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-[10px]">
                            {mfr.tamperedCount} Seizures
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-[10px]">0 Clean</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {mfr.repeatOffender ? (
                          <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center justify-center gap-1 max-w-[140px] mx-auto">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Repeat Offender</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center justify-center gap-1 max-w-[140px] mx-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Grade {mfr.riskGrade} Clean</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
