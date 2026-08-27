import React, { useState } from 'react';
import { ShoppingBag, Globe, CheckCircle2, AlertCircle, X, ExternalLink, ArrowRight } from 'lucide-react';
import { ExtractedDeclarations, EcommerceListingData } from '../../types/compliance';

interface EcommerceScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuditListing: (
    declarations: ExtractedDeclarations,
    ecomData: EcommerceListingData,
    productName: string,
    brandName: string,
    categoryName: string
  ) => void;
}

export const EcommerceScraperModal: React.FC<EcommerceScraperModalProps> = ({
  isOpen,
  onClose,
  onAuditListing
}) => {
  const [marketplace, setMarketplace] = useState<'Amazon.in' | 'Flipkart' | 'Blinkit' | 'Zepto' | 'Custom'>('Amazon.in');
  const [productUrl, setProductUrl] = useState('https://www.amazon.in/dp/B08N5WRWNW');
  const [productTitle, setProductTitle] = useState('Organic Cold Pressed Virgin Coconut Oil (1000 ml Glass Bottle)');
  const [brand, setBrand] = useState('PureRoots Organics');
  const [category, setCategory] = useState('Grocery & Gourmet Foods');
  const [mrp, setMrp] = useState('599');
  const [netQty, setNetQty] = useState('1000');
  const [unit, setUnit] = useState('ml');
  const [countryOfOrigin, setCountryOfOrigin] = useState('India');
  const [mfgDetails, setMfgDetails] = useState('PureRoots Plantations, Pollachi, Tamil Nadu - 642001');
  const [usp, setUsp] = useState('0.60');
  const [consumerCareEmail, setConsumerCareEmail] = useState('support@pureroots.in');
  const [consumerCarePhone, setConsumerCarePhone] = useState('1800-425-9900');
  const [hasTaxesIncluded, setHasTaxesIncluded] = useState(true);

  // Compliance checklist toggles for digital marketplace
  const [missingDeclarations, setMissingDeclarations] = useState<string[]>([]);

  const handleAudit = () => {
    const missing: string[] = [];
    if (!mfgDetails || mfgDetails.trim().length < 5) missing.push('Manufacturer Physical Address');
    if (!countryOfOrigin || countryOfOrigin.trim().length < 2) missing.push('Country of Origin');
    if (!consumerCareEmail && !consumerCarePhone) missing.push('Consumer Grievance Redressal Contact');
    if (!hasTaxesIncluded) missing.push('Inclusive of all taxes declaration');
    if (parseFloat(netQty) >= 1000 && !usp) missing.push('Unit Sale Price (USP)');

    const declarations: ExtractedDeclarations = {
      commodityName: productTitle,
      commonOrGenericName: 'Coconut Oil',
      manufacturerName: mfgDetails.split(',')[0],
      manufacturerAddress: mfgDetails,
      manufacturerPin: mfgDetails.match(/\b([1-9][0-9]{5})\b/)?.[1] || '642001',
      manufacturerState: 'Tamil Nadu',
      countryOfOrigin: countryOfOrigin || undefined,
      netQuantityValue: parseFloat(netQty) || 1000,
      netQuantityUnit: unit,
      netQuantitySymbolValid: ['g', 'kg', 'ml', 'l', 'm', 'N', 'U'].includes(unit),
      mrpValue: parseFloat(mrp) || 599,
      isTaxesInclusiveDeclared: hasTaxesIncluded,
      declaredUspValue: parseFloat(usp) || 0.60,
      declaredUspUnit: unit,
      calculatedUspValue: parseFloat((parseFloat(mrp) / parseFloat(netQty)).toFixed(2)),
      consumerCareEmail: consumerCareEmail || undefined,
      consumerCarePhone: consumerCarePhone || undefined,
      mfgMonth: 8,
      mfgYear: 2026
    };

    const ecomData: EcommerceListingData = {
      marketplaceName: marketplace,
      productUrl,
      listingTitle: productTitle,
      isAllMandatoryInfoOnPDP: missing.length === 0,
      missingOnlineDeclarations: missing,
      ruleCitation: 'Rule 6(10) of Legal Metrology (Packaged Commodities) Amendment Rules, 2017'
    };

    onAuditListing(declarations, ecomData, productTitle, brand, category);
    onClose();
  };

  const loadPreset = (preset: 'compliant' | 'missing_origin' | 'missing_mfg') => {
    if (preset === 'compliant') {
      setProductTitle('Organic Cold Pressed Virgin Coconut Oil (1000 ml Glass Bottle)');
      setBrand('PureRoots Organics');
      setMrp('599');
      setNetQty('1000');
      setUnit('ml');
      setCountryOfOrigin('India');
      setMfgDetails('PureRoots Plantations, Pollachi, Tamil Nadu - 642001');
      setUsp('0.60');
      setConsumerCareEmail('support@pureroots.in');
      setConsumerCarePhone('1800-425-9900');
      setHasTaxesIncluded(true);
    } else if (preset === 'missing_origin') {
      setProductTitle('Wireless Active Noise Cancelling Headphones Over-Ear');
      setBrand('SonicWave Audio');
      setCategory('Electronics');
      setMrp('4999');
      setNetQty('1');
      setUnit('U');
      setCountryOfOrigin(''); // VIOLATION
      setMfgDetails('SonicWave Technologies, Shenzhen (Importer address missing)');
      setUsp('');
      setConsumerCareEmail('help@sonicwave.com');
      setConsumerCarePhone('');
      setHasTaxesIncluded(true);
    } else if (preset === 'missing_mfg') {
      setProductTitle('Almond California Roasted & Salted (500 g)');
      setBrand('NutriKing Dry Fruits');
      setCategory('Dry Fruits & Nuts');
      setMrp('650');
      setNetQty('500');
      setUnit('g');
      setCountryOfOrigin('USA');
      setMfgDetails(''); // VIOLATION
      setUsp('');
      setConsumerCareEmail('');
      setConsumerCarePhone('1800-222-3333');
      setHasTaxesIncluded(false); // VIOLATION
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">E-Commerce Listing Compliance Auditor</h3>
              <p className="text-xs text-slate-400">Enforces Rule 6(10) on digital marketplace product pages</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-2.5 bg-slate-950/30 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400">Quick Test Scenarios:</span>
          <button
            onClick={() => loadPreset('compliant')}
            className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs hover:bg-emerald-900/60 transition-colors"
          >
            Compliant E-Com Listing
          </button>
          <button
            onClick={() => loadPreset('missing_origin')}
            className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs hover:bg-rose-900/60 transition-colors"
          >
            Missing Country of Origin (Violation)
          </button>
          <button
            onClick={() => loadPreset('missing_mfg')}
            className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs hover:bg-amber-900/60 transition-colors"
          >
            Missing Mfr & Tax Note (Violation)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Marketplace Platform</label>
              <select
                value={marketplace}
                onChange={(e: any) => setMarketplace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Amazon.in">Amazon India (Amazon.in)</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Blinkit">Blinkit (Quick Commerce)</option>
                <option value="Zepto">Zepto</option>
                <option value="Custom">Custom Direct-to-Consumer (D2C) Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Listing URL</label>
              <input
                type="text"
                value={productUrl}
                onChange={e => setProductUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                placeholder="https://www.amazon.in/dp/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title on Digital Listing</label>
            <input
              type="text"
              value={productTitle}
              onChange={e => setProductTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">MRP (₹)</label>
              <input
                type="number"
                value={mrp}
                onChange={e => setMrp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Net Qty & Unit</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={netQty}
                  onChange={e => setNetQty(e.target.value)}
                  className="w-2/3 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-1/3 bg-slate-950 border border-slate-700 rounded-lg px-1 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="U">U</option>
                  <option value="gms">gms (Illegal)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country of Origin [Mandatory]</label>
              <input
                type="text"
                value={countryOfOrigin}
                onChange={e => setCountryOfOrigin(e.target.value)}
                placeholder="India / USA / China (Leave blank to test violation)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Sale Price (USP ₹/unit)</label>
              <input
                type="text"
                value={usp}
                onChange={e => setUsp(e.target.value)}
                placeholder="e.g. 0.60 / ml"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturer / Importer Physical Address [Rule 6(10)]</label>
            <input
              type="text"
              value={mfgDetails}
              onChange={e => setMfgDetails(e.target.value)}
              placeholder="Full address with PIN code (Leave blank to test violation)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Consumer Care Email</label>
              <input
                type="email"
                value={consumerCareEmail}
                onChange={e => setConsumerCareEmail(e.target.value)}
                placeholder="care@company.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Consumer Care Phone</label>
              <input
                type="text"
                value={consumerCarePhone}
                onChange={e => setConsumerCarePhone(e.target.value)}
                placeholder="1800-XXX-XXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="taxInc"
              checked={hasTaxesIncluded}
              onChange={e => setHasTaxesIncluded(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 bg-slate-950"
            />
            <label htmlFor="taxInc" className="text-xs text-slate-300 font-medium">
              Digital listing displays "Inclusive of all taxes" next to MRP
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Automated legal metrology verification against Rule 6(10)
          </span>
          <button
            onClick={handleAudit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all"
          >
            <span>Run E-Commerce Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};