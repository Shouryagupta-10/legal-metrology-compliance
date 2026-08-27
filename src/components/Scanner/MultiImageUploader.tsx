import React, { useRef, useState } from 'react';
import { Upload, Camera, ShoppingBag, Sparkles, Image as ImageIcon, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { SampleProduct } from '../../types/compliance';
import { SAMPLE_PRODUCTS } from '../../services/sampleData';
import { sounds } from '../../services/soundEffects';

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
        sounds.playSuccess();
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
    <div className="space-y-6">
      {/* Top Action Ribbon / Dropzone */}
      <div className="rounded-[1.5rem] border border-[var(--hairline)] bg-[var(--surface-card)] p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-300">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Scan Progress Overlay if active */}
        {isScanning && (
          <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 rounded-[1.5rem] text-white">
            <div className="w-14 h-14 rounded-full bg-[#5790e6]/20 border-2 border-[#5790e6] border-t-transparent animate-spin mb-3 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-[#5790e6] animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider font-mono mb-1">
              Optical Vision OCR &bull; Rule 6 Evaluation
            </h4>
            <p className="text-xs text-sky-300 font-mono mb-3">{scanStatusText}</p>
            <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2563c9] to-[#5790e6] transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Left Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--hairline)] flex items-center justify-center text-[var(--brand)] shrink-0 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="baseline-eyebrow tone-dark text-[10px] mb-0.5">
              <span className="eyebrow-dot" />
              <span>Inspection Specimens</span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">
              Select a Packaging Specimen or Upload Custom Artwork
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              fileInputRef.current?.click();
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-full bg-[var(--brand)] hover:bg-[var(--brand-deep)] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 btn-tactile transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Artwork</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenLiveCamera();
            }}
            className="px-3.5 py-2.5 rounded-full bg-[var(--surface)] hover:bg-[var(--hairline)] text-[var(--ink)] border border-[var(--hairline)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 btn-tactile transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span className="hidden sm:inline">Camera</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenEcommerceModal();
            }}
            className="px-3.5 py-2.5 rounded-full bg-[var(--surface)] hover:bg-[var(--hairline)] text-[var(--ink)] border border-[var(--hairline)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 btn-tactile transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">E-Commerce</span>
          </button>
        </div>
      </div>

      {/* Specimen Cards Shelf Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] font-mono">
              Commercial Benchmarks ({filteredSamples.length} SKUs)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[var(--surface)] p-1 rounded-full border border-[var(--hairline)]">
            {(['all', 'compliant', 'violations'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  sounds.playClick();
                  setSelectedFilter(f);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all btn-tactile ${
                  selectedFilter === f
                    ? 'bg-[var(--ink)] text-[var(--background)] shadow-sm'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {f === 'all' ? 'All' : f === 'compliant' ? '100% Pass' : 'Defect Samples'}
              </button>
            ))}
          </div>
        </div>

        {/* Specimen Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSamples.map((sample, index) => {
            const isCompliant = sample.expectedCompliance === 'COMPLIANT';
            const isActive = activeSampleId === sample.id;

            return (
              <article
                key={sample.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectSample(sample);
                }}
                className={`group cursor-pointer rounded-[1.5rem] border transition-all flex flex-col justify-between overflow-hidden relative select-none ${
                  isActive
                    ? 'border-[var(--brand)] bg-[var(--surface-card)] shadow-xl ring-2 ring-[var(--brand)]/30 scale-[1.01]'
                    : 'border-[var(--hairline)] bg-[var(--surface-card)] hover:border-[var(--brand-light)] hover:shadow-md'
                }`}
              >
                {/* Artwork Thumbnail with Gloss Overlay */}
                <div className="relative w-full h-44 bg-[var(--brand-deep)] overflow-hidden border-b border-[var(--hairline)] flex items-center justify-center">
                  <img
                    src={sample.thumbnail}
                    alt={sample.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Specimen Stamp */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white/90 border border-white/15">
                    SPECIMEN // 0{index + 1}
                  </div>

                  {/* Status Stamp */}
                  <div
                    className={`absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-md uppercase tracking-wider ${
                      isCompliant
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-500/50 animate-pulse'
                    }`}
                  >
                    {isCompliant ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                    <span>{isCompliant ? 'PASS' : 'DEFECT'}</span>
                  </div>

                  {/* Net Quantity & MRP Ribbon */}
                  <div className="absolute bottom-2.5 left-3 text-[10px] font-mono font-semibold text-white/95 bg-black/75 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                    {sample.declarations.netQuantityValue} {sample.declarations.netQuantityUnit} &bull; ₹{sample.declarations.mrpValue}
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand)]">
                      {sample.category}
                    </span>
                    <h4 className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors leading-snug line-clamp-1">
                      {sample.name}
                    </h4>
                    <p className="text-[11px] text-[var(--ink-soft)] line-clamp-2 leading-relaxed">
                      {sample.scenarioDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[var(--ink-soft)] font-mono uppercase">
                      {sample.tags[0]}
                    </span>
                    <span className="text-xs font-semibold text-[var(--brand)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Audit &rarr;
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
