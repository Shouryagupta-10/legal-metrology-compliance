import React from 'react';
import { Download, FileText, CheckCircle2, AlertOctagon, Scale, ShieldCheck, Printer } from 'lucide-react';
import { ComplianceReport } from '../../types/compliance';
import { exportComplianceReportPDF } from '../../services/pdfExportService';

interface AuditReportViewProps {
  report: ComplianceReport;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({ report }) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6 glass-panel max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              OFFICIAL STATUTORY INSPECTION NOTICE
            </span>
            <span className="text-xs text-slate-400 font-mono">Ref: {report.inspectionId}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Legal Metrology Packaging Audit Certificate
          </h2>
          <p className="text-xs text-slate-400">
            Formulated under Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportComplianceReportPDF(report)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Commodity Details Block */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Product / Commodity</span>
            <div className="font-bold text-white text-sm">{report.productName}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Brand & Category</span>
            <div className="text-slate-300 font-medium">{report.brandName} &bull; {report.categoryName}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Net Quantity & Declared MRP</span>
            <div className="text-slate-300 font-mono">
              {report.declarations.netQuantityValue} {report.declarations.netQuantityUnit} | ₹ {report.declarations.mrpValue?.toFixed(2)} ({report.declarations.isTaxesInclusiveDeclared ? 'inclusive of all taxes' : 'MISSING TAX PHRASE'})
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Manufacturer / Packer / Importer</span>
            <div className="font-bold text-slate-200">{report.declarations.manufacturerName || 'NOT DECLARED'}</div>
            <div className="text-slate-400 text-[11px] leading-tight">{report.declarations.manufacturerAddress || 'Address missing'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">PIN Code</span>
              <div className="font-mono text-slate-300">{report.declarations.manufacturerPin || 'MISSING'}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Country of Origin</span>
              <div className="font-mono text-slate-300">{report.declarations.countryOfOrigin || 'MISSING'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Matrix Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Statutory Verification Matrix
        </h4>
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Rule</th>
                <th className="p-3">Clause Description</th>
                <th className="p-3">Detected Value</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {report.ruleResults.map(r => (
                <tr key={r.ruleId} className="hover:bg-slate-850/50">
                  <td className="p-3 font-mono font-bold text-sky-400 whitespace-nowrap">{r.ruleCode}</td>
                  <td className="p-3 text-slate-200">{r.ruleTitle}</td>
                  <td className="p-3 font-mono text-slate-400">{r.extractedValue || 'None'}</td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'PASS'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : r.status === 'FAIL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Sign-off & Seal Block */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <div className="font-semibold text-slate-200">Legal Metrology Compliance Enforcement Directorate</div>
          <div className="text-[11px] text-slate-500">Certified by Automated Vision & Rule Engine Audit v2.4</div>
        </div>

        <div className="border border-dashed border-slate-700 p-3 rounded-lg text-center min-w-44 bg-slate-950/40">
          <div className="text-[10px] font-mono text-slate-500">DIGITAL SEAL & TIMESTAMP</div>
          <div className="font-mono text-sky-400 font-bold text-xs mt-1">{report.inspectionDate}</div>
        </div>
      </div>
    </div>
  );
};
