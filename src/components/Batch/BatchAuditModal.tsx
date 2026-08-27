import React from 'react';
import { Sparkles, X, Download, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { SampleProduct } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { evaluateCompliance } from '../../services/ruleEngine';
import { sounds } from '../../services/soundEffects';

interface BatchAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSingleReport: (sample: SampleProduct) => void;
}

export const BatchAuditModal: React.FC<BatchAuditModalProps> = ({
  isOpen,
  onClose,
  onSelectSingleReport
}) => {
  const batchResults = SAMPLE_PRODUCTS.map(sample => {
    const report = evaluateCompliance({
      productName: sample.name,
      brandName: sample.brand,
      categoryName: sample.category,
      declarations: sample.declarations,
      pdpInput: {
        packageShape: sample.pdpDefaults.shape,
        heightMm: sample.pdpDefaults.heightMm,
        widthMm: sample.pdpDefaults.widthMm,
        depthMm: sample.pdpDefaults.depthMm,
        measuredNumeralHeightMm: sample.pdpDefaults.measuredFontHeightMm
      },
      labelImages: sample.labelImages
    });
    return {
      sample,
      report
    };
  });

  const total = batchResults.length;
  const compliant = batchResults.filter(b => b.report.overallStatus === 'COMPLIANT').length;
  const nonCompliant = batchResults.filter(b => b.report.overallStatus === 'NON_COMPLIANT').length;
  const compliantPct = total > 0 ? Math.round((compliant / total) * 100) : 0;
  const nonCompliantPct = total > 0 ? Math.round((nonCompliant / total) * 100) : 0;

  const exportCSV = () => {
    sounds.playSuccess();
    const headers = [
      'Inspection ID',
      'Product Name',
      'Brand',
      'Category',
      'Compliance Status',
      'Score (%)',
      'Passed Rules',
      'Violations Count',
      'Net Quantity',
      'Declared MRP (INR)',
      'Taxes Declared',
      'USP Rate',
      'Consumer Care Email',
      'PIN Code'
    ];

    const rows = batchResults.map(({ report }) => [
      `"${report.inspectionId}"`,
      `"${report.productName}"`,
      `"${report.brandName}"`,
      `"${report.categoryName}"`,
      `"${report.overallStatus}"`,
      report.overallScore,
      report.passedRulesCount,
      report.failedRulesCount,
      `"${report.declarations.netQuantityValue || ''} ${report.declarations.netQuantityUnit || ''}"`,
      report.declarations.mrpValue || 0,
      report.declarations.isTaxesInclusiveDeclared ? 'YES' : 'NO',
      report.declarations.declaredUspValue || 'N/A',
      `"${report.declarations.consumerCareEmail || 'MISSING'}"`,
      `"${report.declarations.manufacturerPin || 'MISSING'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Legal_Metrology_Batch_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0d1222] border border-white/15 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-white">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 sm:px-8 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Automated Multi-SKU Sweep
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[10px] font-mono text-white/50">LMPC Rules, 2011</span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                Bulk Legal Metrology Batch Auditor
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all btn-tactile shadow-md"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV Audit</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors btn-tactile"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="relative z-10 p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Summary KPIs Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Audited SKUs */}
            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
                Catalogue Audited
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                {total} <span className="text-xs text-white/40 font-sans font-normal">SKUs</span>
              </div>
            </div>

            {/* Compliant Packages */}
            <div className="bg-emerald-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Fully Compliant
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {compliantPct}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                {compliant} <span className="text-xs text-emerald-300/60 font-sans font-normal">Items</span>
              </div>
            </div>

            {/* Statutory Violations */}
            <div className="bg-rose-950/40 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  Defect Notice
                </span>
                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/40">
                  {nonCompliantPct}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-400">
                {nonCompliant} <span className="text-xs text-rose-300/60 font-sans font-normal">Items</span>
              </div>
            </div>

            {/* Potential Liability Risk */}
            <div className="bg-amber-950/40 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-1 backdrop-blur-md">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Section 36 Exposure
              </span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
                ₹ {(nonCompliant * 50000).toLocaleString('en-IN')}
              </div>
            </div>

          </div>

          {/* Catalogue Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-black/40 text-[10px] text-white/50 uppercase font-mono border-b border-white/10 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Packaging Specimen</th>
                    <th className="py-3.5 px-4">Statutory Category</th>
                    <th className="py-3.5 px-4">Net Quantity &amp; MRP</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-center">Legal Status</th>
                    <th className="py-3.5 px-4 text-right">Workbench Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {batchResults.map(({ sample, report }, idx) => {
                    const isPass = report.overallStatus === 'COMPLIANT';
                    return (
                      <tr
                        key={sample.id}
                        className="hover:bg-white/10 transition-colors group"
                      >
                        {/* Specimen Info with Thumbnail */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/50 border border-white/15 shrink-0">
                              <img
                                src={sample.thumbnail}
                                alt={sample.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
                                {sample.name}
                              </div>
                              <div className="text-[10px] font-mono text-white/50 mt-0.5 flex items-center gap-1.5">
                                <span>{sample.brand}</span>
                                <span>•</span>
                                <span>SKU #0{idx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80">
                            {sample.category}
                          </span>
                        </td>

                        {/* Net Qty & MRP */}
                        <td className="py-3.5 px-4 font-mono text-white/90">
                          <div className="font-semibold">
                            {report.declarations.netQuantityValue} {report.declarations.netQuantityUnit}
                          </div>
                          <div className="text-[10px] text-white/50">
                            ₹{report.declarations.mrpValue}
                          </div>
                        </td>

                        {/* Score Gauge */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full border ${
                              report.overallScore >= 90
                                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                                : 'text-rose-300 bg-rose-950/60 border-rose-500/40'
                            }`}
                          >
                            {report.overallScore}%
                          </span>
                        </td>

                        {/* Legal Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-[9px] font-mono font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider ${
                              isPass
                                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-xs'
                                : 'bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-xs'
                            }`}
                          >
                            {isPass ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                            )}
                            <span>{isPass ? 'COMPLIANT' : 'DEFECTIVE'}</span>
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              onSelectSingleReport(sample);
                              onClose();
                              const el = document.getElementById('studio');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold uppercase tracking-wider transition-all btn-tactile shadow-sm flex items-center gap-1.5 ml-auto"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 px-6 sm:px-8 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Catalogue verification verified against Schedule II tables</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors btn-tactile"
          >
            Close Deck
          </button>
        </div>

      </div>
    </div>
  );
};