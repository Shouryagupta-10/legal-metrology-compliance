import React, { useState } from 'react';
import { Sparkles, X, Download, CheckCircle2, XCircle, AlertTriangle, Layers, Play } from 'lucide-react';
import { SampleProduct, ComplianceReport } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { evaluateCompliance } from '../../services/ruleEngine';

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
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(SAMPLE_PRODUCTS.length);

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

  const exportCSV = () => {
    const headers = [
      'Product ID',
      'Product Name',
      'Brand',
      'Category',
      'Compliance Status',
      'Score (%)',
      'Passed Rules',
      'Violations Count',
      'Net Quantity',
      'Declared MRP',
      'Taxes Declared',
      'USP Rate',
      'Consumer Care Email',
      'PIN Code'
    ];

    const rows = batchResults.map(({ report, sample }) => [
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Bulk Legal Metrology Batch Auditor</h3>
              <p className="text-xs text-slate-400">Automated multi-SKU catalogue compliance sweep</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Audit Log
            </button>

            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Catalogue SKUs Audited</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">{total} Items</div>
            </div>

            <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-800/50">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Compliant Packages</div>
              <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                {compliant} ({Math.round((compliant / total) * 100)}%)
              </div>
            </div>

            <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-800/50">
              <div className="text-[10px] font-bold uppercase text-rose-400">Statutory Violations</div>
              <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
                {nonCompliant} ({Math.round((nonCompliant / total) * 100)}%)
              </div>
            </div>

            <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-800/50">
              <div className="text-[10px] font-bold uppercase text-amber-400">Potential Liability Risk</div>
              <div className="text-xl font-black text-amber-400 mt-1 font-mono">
                ₹ {(nonCompliant * 50000).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Batch Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Net Qty & MRP</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {batchResults.map(({ sample, report }) => {
                  const isPass = report.overallStatus === 'COMPLIANT';
                  return (
                    <tr key={sample.id} className="hover:bg-slate-850/50">
                      <td className="p-3">
                        <div className="font-bold text-white line-clamp-1">{sample.name}</div>
                        <div className="text-[10px] text-slate-400">{sample.brand}</div>
                      </td>
                      <td className="p-3 text-slate-300">{sample.category}</td>
                      <td className="p-3 font-mono text-slate-300">
                        {report.declarations.netQuantityValue} {report.declarations.netQuantityUnit} &bull; ₹ {report.declarations.mrpValue}
                      </td>
                      <td className="p-3 font-mono font-bold">
                        <span className={report.overallScore >= 80 ? 'text-emerald-400' : 'text-rose-400'}>
                          {report.overallScore}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isPass
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {report.overallStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            onSelectSingleReport(sample);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-[11px] font-semibold transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Batch audit completed for {SAMPLE_PRODUCTS.length} packaged commodities</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
