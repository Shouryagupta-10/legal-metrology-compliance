import React, { useState } from 'react';
import { Edit3, X, Save, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ExtractedDeclarations } from '../../types/compliance';

interface FieldEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  declarations: ExtractedDeclarations;
  onSaveDeclarations: (updated: ExtractedDeclarations) => void;
}

export const FieldEditorModal: React.FC<FieldEditorModalProps> = ({
  isOpen,
  onClose,
  declarations,
  onSaveDeclarations
}) => {
  const [formData, setFormData] = useState<ExtractedDeclarations>({ ...declarations });

  if (!isOpen) return null;

  const handleChange = (key: keyof ExtractedDeclarations, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSaveDeclarations(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Human-in-the-Loop Declaration Editor</h3>
              <p className="text-xs text-slate-400">Review, override or calibrate OCR extracted parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Section 1: Identity & Generic Name */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              1. Generic Name & Commodity [Rule 6(1)(b)]
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Declared Product Name</label>
                <input
                  type="text"
                  value={formData.commodityName || ''}
                  onChange={e => handleChange('commodityName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Common / Generic Name</label>
                <input
                  type="text"
                  value={formData.commonOrGenericName || ''}
                  onChange={e => handleChange('commonOrGenericName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Net Quantity & Standard Unit */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              2. Net Quantity & Metric Units [Rule 6(1)(c) & Rule 11/12]
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Numeric Quantity</label>
                <input
                  type="number"
                  step="any"
                  value={formData.netQuantityValue || ''}
                  onChange={e => handleChange('netQuantityValue', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Symbol</label>
                <input
                  type="text"
                  value={formData.netQuantityUnit || ''}
                  onChange={e => handleChange('netQuantityUnit', e.target.value)}
                  placeholder="g, kg, ml, l, m, N, U"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Piece Count (if multi-pack)</label>
                <input
                  type="number"
                  value={formData.pieceCount || ''}
                  onChange={e => handleChange('pieceCount', parseInt(e.target.value, 10) || undefined)}
                  placeholder="e.g. 3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: MRP & Unit Sale Price (USP) */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              3. Maximum Retail Price (MRP) & Unit Sale Price [Rule 6(1)(e)]
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">MRP Value (₹)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.mrpValue || ''}
                  onChange={e => handleChange('mrpValue', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Declared USP (₹ / unit)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.declaredUspValue || ''}
                  onChange={e => handleChange('declaredUspValue', parseFloat(e.target.value) || undefined)}
                  placeholder="e.g. 130.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">USP Unit</label>
                <input
                  type="text"
                  value={formData.declaredUspUnit || ''}
                  onChange={e => handleChange('declaredUspUnit', e.target.value)}
                  placeholder="kg / g / ml / l / piece"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editTaxInc"
                checked={Boolean(formData.isTaxesInclusiveDeclared)}
                onChange={e => handleChange('isTaxesInclusiveDeclared', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 bg-slate-900"
              />
              <label htmlFor="editTaxInc" className="text-xs text-slate-300 font-medium">
                Mandatory "Inclusive of all taxes" is declared on packaging
              </label>
            </div>
          </div>

          {/* Section 4: Manufacturer / Packer / Importer */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              4. Manufacturer / Packer / Importer [Rule 6(1)(a)]
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturer / Packer Name</label>
              <input
                type="text"
                value={formData.manufacturerName || ''}
                onChange={e => handleChange('manufacturerName', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Complete Postal Address</label>
              <textarea
                rows={2}
                value={formData.manufacturerAddress || ''}
                onChange={e => handleChange('manufacturerAddress', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Indian PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.manufacturerPin || ''}
                  onChange={e => handleChange('manufacturerPin', e.target.value)}
                  placeholder="e.g. 110020"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  value={formData.manufacturerState || ''}
                  onChange={e => handleChange('manufacturerState', e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Date of Mfg & Origin & Consumer Care */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              5. Dates, Origin & Consumer Grievance [Rule 6(1)(d) & 6(1)(n)]
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mfg Month (1-12)</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={formData.mfgMonth || ''}
                  onChange={e => handleChange('mfgMonth', parseInt(e.target.value, 10) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mfg Year</label>
                <input
                  type="number"
                  value={formData.mfgYear || ''}
                  onChange={e => handleChange('mfgYear', parseInt(e.target.value, 10) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={formData.countryOfOrigin || ''}
                  onChange={e => handleChange('countryOfOrigin', e.target.value)}
                  placeholder="India"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dimensions (if applicable)</label>
                <input
                  type="text"
                  value={formData.dimensions || ''}
                  onChange={e => handleChange('dimensions', e.target.value)}
                  placeholder="e.g. 228 cm x 254 cm"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Consumer Care Email</label>
                <input
                  type="email"
                  value={formData.consumerCareEmail || ''}
                  onChange={e => handleChange('consumerCareEmail', e.target.value)}
                  placeholder="care@brand.in"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Consumer Care Phone</label>
                <input
                  type="text"
                  value={formData.consumerCarePhone || ''}
                  onChange={e => handleChange('consumerCarePhone', e.target.value)}
                  placeholder="1800-XXX-XXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Save & Re-evaluate Compliance
          </button>
        </div>
      </div>
    </div>
  );
};