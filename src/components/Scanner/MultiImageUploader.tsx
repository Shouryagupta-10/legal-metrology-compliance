import React, { useRef, useState } from 'react';
import { Upload, Camera, ShoppingBag, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { SampleProduct } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';

interface MultiImageUploaderProps {
  onImageSelected: (imageDataUrl: string, fileName: string) => void;
  onSelectSample: (sample: SampleProduct) => void;
  onOpenLiveCamera: () => void;
  onOpenEcommerceModal: () => void;
  isScanning: boolean;
  scanProgress: number;
  scanStatusText: string;
  activeSampleId?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  onImageSelected,
  onSelectSample,
  onOpenLiveCamera,
  onOpenEcommerceModal,
  isScanning,
  scanProgress,
  scanStatusText,
  activeSampleId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'compliant' | 'violations'>('all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredSamples = SAMPLE_PRODUCTS.filter(s => {
    if (selectedFilter === 'compliant') return s.expectedCompliance === 'COMPLIANT';
    if (selectedFilter === 'violations') return s.expectedCompliance === 'NON_COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar & Dropzone */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 human-panel flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Scan progress animation if active */}
        {isScanning && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400 border-t-transparent animate-spin mb-3 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Auditing Package Declarations</h4>
            <p className="text-xs text-sky-300 font-mono mb-3">{scanStatusText}</p>
            <div className="w-60 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Select a Product Packaging Label to Inspect</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose from commercial benchmark test samples below or upload your custom packaging artwork.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 btn-tactile"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload Custom Label
          </button>

          <button
            onClick={onOpenLiveCamera}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 btn-tactile"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            Camera
          </button>

          <button
            onClick={onOpenEcommerceModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 btn-tactile"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            E-Com Listing
          </button>
        </div>
      </div>

      {/* Realistic Product Packaging Shelf Gallery */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Commercial Packaging Samples & Test Scenarios
            </span>
          </div>

          <div className="flex items-center gap-1">
            {(['all', 'compliant', 'violations'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                  selectedFilter === f
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {f === 'all' ? 'All Samples' : f === 'compliant' ? '100% Compliant' : 'Defect Cases'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredSamples.map(sample => {
            const isCompliant = sample.expectedCompliance === 'COMPLIANT';
            const isActive = activeSampleId === sample.id;

            return (
              <div
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className={`group cursor-pointer rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                  isActive
                    ? 'border-sky-500 bg-sky-950/50 shadow-sky-500/20 ring-2 ring-sky-400/60'
                    : 'border-slate-800/90 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative w-full h-36 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                  <img
                    src={sample.thumbnail}
                    alt={sample.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  <span
                    className={`absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-md ${
                      isCompliant
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
                    }`}
                  >
                    {isCompliant ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                    {isCompliant ? 'COMPLIANT' : 'DEFECTIVE'}
                  </span>

                  <span className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {sample.declarations.netQuantityValue} {sample.declarations.netQuantityUnit} &bull; ₹{sample.declarations.mrpValue}
                  </span>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {sample.category}
                    </span>
                    <h5 className="font-bold text-white text-xs group-hover:text-sky-300 transition-colors line-clamp-1 mt-0.5">
                      {sample.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-1">
                      {sample.scenarioDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {sample.tags[0]}
                    </span>
                    <span className="font-bold text-sky-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Inspect Label &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
