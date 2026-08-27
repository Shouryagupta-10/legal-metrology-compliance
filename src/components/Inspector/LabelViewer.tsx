import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Tag, Eye, EyeOff, Ruler, Edit3, CheckCircle2, AlertCircle, Sparkles, Move } from 'lucide-react';
import { BoundingBox, LabelImageRecord } from '../../types/compliance';

interface LabelViewerProps {
  imageRecord: LabelImageRecord;
  activeBoundingBoxId?: string;
  onSelectBoundingBox?: (boxId: string) => void;
  onOpenPDPTool: () => void;
  onOpenFieldEditor: () => void;
}

export const LabelViewer: React.FC<LabelViewerProps> = ({
  imageRecord,
  activeBoundingBoxId,
  onSelectBoundingBox,
  onOpenPDPTool,
  onOpenFieldEditor
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoom(1);

  const getStatusBorder = (status: BoundingBox['status'], isActive: boolean, isHovered: boolean) => {
    if (isActive) return 'border-2 border-sky-400 bg-sky-500/25 ring-4 ring-sky-400/40 z-30 shadow-2xl scale-[1.01]';
    if (isHovered) return 'border-2 border-white bg-white/20 z-20 shadow-xl';
    if (status === 'valid') return 'border-2 border-emerald-500/90 bg-emerald-500/15 hover:bg-emerald-500/25';
    if (status === 'invalid') return 'border-2 border-rose-500 bg-rose-500/25 hover:bg-rose-500/35 animate-pulse';
    if (status === 'warning') return 'border-2 border-amber-500 bg-amber-500/20 hover:bg-amber-500/30';
    return 'border border-slate-400 bg-slate-400/10';
  };

  const getBadgeColor = (status: BoundingBox['status']) => {
    if (status === 'valid') return 'bg-emerald-950/95 text-emerald-300 border-emerald-600 shadow-md';
    if (status === 'invalid') return 'bg-rose-950/95 text-rose-300 border-rose-600 shadow-md animate-bounce';
    if (status === 'warning') return 'bg-amber-950/95 text-amber-300 border-amber-600 shadow-md';
    return 'bg-slate-900/95 text-slate-300 border-slate-700';
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl human-panel">
      {/* Studio Header Toolbar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">
              {imageRecord.name || 'Commercial Packaging Proofing Studio'}
            </span>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1 border transition-colors ${
              showRuler
                ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle On-Canvas Millimeter Ruler for Rule 7 Font Height"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rule 7 mm Ruler</span>
          </button>

          <button
            onClick={onOpenPDPTool}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-800 hover:bg-sky-900 btn-tactile transition-colors"
          >
            PDP Area Tool
          </button>

          <button
            onClick={onOpenFieldEditor}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 btn-tactile transition-colors flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3 text-slate-400" />
            <span>Edit Fields</span>
          </button>

          {/* Toggle Annotations */}
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`p-1.5 rounded-lg border btn-tactile transition-colors ${
              showBoxes
                ? 'bg-sky-600/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={showBoxes ? 'Hide Bounding Annotations' : 'Show Bounding Annotations'}
          >
            {showBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1.5 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Fit"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[500px] max-h-[660px] bg-[#060911] overflow-auto flex items-center justify-center p-6 select-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Interactive Virtual Millimeter Ruler Overlay */}
        {showRuler && (
          <div className="absolute top-6 left-6 z-40 bg-slate-900/95 border-2 border-amber-400/90 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-400" />
                Rule 7 Font Calibrator Gauge
              </span>
              <button
                onClick={() => setShowRuler(false)}
                className="text-slate-400 hover:text-white text-xs p-0.5"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Compare on-canvas printed numeral height against statutory minimums:
            </p>
            {/* Visual mm scale bars */}
            <div className="bg-black/90 p-2.5 rounded-lg border border-slate-800 space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-8 bg-sky-400 rounded-sm" />
                  <span className="text-slate-200 font-semibold">1.5 mm</span>
                </div>
                <span className="text-slate-400">&le; 50g / 50ml</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 bg-sky-400 rounded-sm" />
                  <span className="text-slate-200 font-semibold">2.0 mm</span>
                </div>
                <span className="text-slate-400">50g &ndash; 200g</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-sky-400 rounded-sm" />
                  <span className="text-slate-200 font-semibold">4.0 mm</span>
                </div>
                <span className="text-slate-400">200g &ndash; 1kg</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 bg-sky-400 rounded-sm" />
                  <span className="text-slate-200 font-semibold">6.0 mm</span>
                </div>
                <span className="text-slate-400">&gt; 1kg / 1L</span>
              </div>
            </div>
          </div>
        )}

        <div
          className="relative transition-transform duration-150 ease-out origin-center inline-block rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Photorealistic Product Packaging Photograph */}
          <img
            src={imageRecord.url}
            alt={imageRecord.name}
            className="max-h-[580px] w-auto object-contain pointer-events-none rounded-2xl shadow-2xl"
            crossOrigin="anonymous"
          />

          {/* Bounding Box Annotations */}
          {showBoxes &&
            imageRecord.boundingBoxes.map(box => {
              const isActive = box.id === activeBoundingBoxId;
              const isHovered = box.id === hoveredBoxId;

              return (
                <div
                  key={box.id}
                  onClick={() => onSelectBoundingBox?.(box.id)}
                  onMouseEnter={() => setHoveredBoxId(box.id)}
                  onMouseLeave={() => setHoveredBoxId(null)}
                  className={`absolute cursor-pointer rounded transition-all group ${getStatusBorder(
                    box.status,
                    isActive,
                    isHovered
                  )}`}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                >
                  {/* Badge Label */}
                  <div
                    className={`absolute -top-5 left-0 text-[9px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap pointer-events-none ${getBadgeColor(
                      box.status
                    )}`}
                  >
                    {box.ruleCitation || box.field}
                  </div>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900/95 text-slate-100 p-2.5 rounded-lg border border-slate-700 shadow-2xl text-left pointer-events-none backdrop-blur-md">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                          {box.field}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            box.status === 'valid'
                              ? 'bg-emerald-950 text-emerald-300'
                              : box.status === 'invalid'
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {box.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-medium text-white mb-1">"{box.text}"</p>
                      {box.ruleCitation && (
                        <p className="text-[10px] text-slate-400 font-semibold border-t border-slate-800 pt-1">
                          Ref: {box.ruleCitation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400" />
            <span className="text-[11px] text-slate-300">Compliant Declaration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400" />
            <span className="text-[11px] text-rose-300 font-medium">Statutory Defect (Action Required)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          Click any region on packaging photo to focus clause
        </span>
      </div>
    </div>
  );
};