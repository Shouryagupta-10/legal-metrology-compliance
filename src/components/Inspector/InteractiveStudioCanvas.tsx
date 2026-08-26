import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Tag,
  Eye,
  EyeOff,
  Ruler,
  Search,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  RotateCw,
  Wand2,
  Scissors,
  Layers,
  Move,
  Info
} from 'lucide-react';
import { BoundingBox, LabelImageRecord } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

interface InteractiveStudioCanvasProps {
  imageRecord: LabelImageRecord;
  activeBoundingBoxId?: string;
  onSelectBoundingBox?: (boxId: string) => void;
  onOpenPDPTool: () => void;
  onOpenFieldEditor: () => void;
  isFixApplied?: boolean;
  onToggleAutoFix?: () => void;
}

export const InteractiveStudioCanvas: React.FC<InteractiveStudioCanvasProps> = ({
  imageRecord,
  activeBoundingBoxId,
  onSelectBoundingBox,
  onOpenPDPTool,
  onOpenFieldEditor,
  isFixApplied = false,
  onToggleAutoFix
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [enableLoupe, setEnableLoupe] = useState<boolean>(false);
  const [enableRuler, setEnableRuler] = useState<boolean>(false);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);

  // Loupe magnifier position
  const [mousePos, setMousePos] = useState<{ x: number; y: number; relX: number; relY: number }>({
    x: 0,
    y: 0,
    relX: 50,
    relY: 50
  });

  // Draggable Ruler state
  const [rulerPos, setRulerPos] = useState<{ x: number; y: number; rotation: number }>({
    x: 40,
    y: 40,
    rotation: 0
  });
  const [isDraggingRuler, setIsDraggingRuler] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    sounds.playClick();
    setZoom(prev => Math.min(2.5, prev + 0.25));
  };
  const handleZoomOut = () => {
    sounds.playClick();
    setZoom(prev => Math.max(0.75, prev - 0.25));
  };
  const handleResetZoom = () => {
    sounds.playClick();
    setZoom(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const relY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMousePos({ x, y, relX, relY });

    if (isDraggingRuler) {
      setRulerPos(prev => ({
        ...prev,
        x: prev.x + (e.clientX - dragStart.x) * 0.15,
        y: prev.y + (e.clientY - dragStart.y) * 0.15
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleRulerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingRuler(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDraggingRuler(false);
  };

  const getStatusBorder = (status: BoundingBox['status'], isActive: boolean, isHovered: boolean) => {
    if (isFixApplied) {
      return 'border-2 border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400/40 z-20';
    }
    if (isActive) return 'border-2 border-sky-400 bg-sky-500/25 ring-4 ring-sky-400/40 z-30 shadow-2xl scale-[1.01]';
    if (isHovered) return 'border-2 border-white bg-white/25 z-20 shadow-xl';
    if (status === 'valid') return 'border-2 border-emerald-500/90 bg-emerald-500/15 hover:bg-emerald-500/25';
    if (status === 'invalid') return 'border-2 border-rose-500 bg-rose-500/25 hover:bg-rose-500/35 animate-pulse';
    if (status === 'warning') return 'border-2 border-amber-500 bg-amber-500/20 hover:bg-amber-500/30';
    return 'border border-slate-400 bg-slate-400/10';
  };

  const getBadgeColor = (status: BoundingBox['status']) => {
    if (isFixApplied) {
      return 'bg-emerald-950/95 text-emerald-300 border-emerald-500 shadow-md';
    }
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

        {/* Interactive Tool Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 1-Click Auto-Fix Artwork Simulator */}
          {onToggleAutoFix && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onToggleAutoFix();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold btn-tactile flex items-center gap-1.5 shadow-md transition-all ${
                isFixApplied
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
              }`}
              title="Preview Auto-Corrected Packaging Artwork with 100% Legal Metrology Compliance"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isFixApplied ? '✓ Compliant Fix Active' : '1-Click Fix Artwork'}</span>
            </button>
          )}

          {/* Interactive Loupe Magnifier */}
          <button
            onClick={() => {
              sounds.playClick();
              setEnableLoupe(!enableLoupe);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1 border transition-colors ${
              enableLoupe
                ? 'bg-sky-950 text-sky-300 border-sky-500 shadow-sm shadow-sky-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle 2.5x Precision Optical Loupe"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">2.5x Loupe</span>
          </button>

          {/* Draggable Millimeter Ruler */}
          <button
            onClick={() => {
              sounds.playClick();
              setEnableRuler(!enableRuler);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1 border transition-colors ${
              enableRuler
                ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle Draggable Rule 7 Millimeter Ruler"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">mm Ruler</span>
          </button>

          {/* Action Modals */}
          <button
            onClick={onOpenPDPTool}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white btn-tactile transition-colors"
          >
            PDP Tool
          </button>

          <button
            onClick={onOpenFieldEditor}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white btn-tactile transition-colors"
          >
            Edit
          </button>

          {/* Toggle Annotations */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowBoxes(!showBoxes);
            }}
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
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1.5 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile"
              title="Fit to Artboard"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative flex-1 min-h-[500px] max-h-[660px] bg-[#060911] overflow-auto flex items-center justify-center p-6 select-none cursor-crosshair"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Floating Draggable & Rotatable Millimeter Ruler */}
        {enableRuler && (
          <div
            onMouseDown={handleRulerMouseDown}
            style={{
              left: `${rulerPos.x}%`,
              top: `${rulerPos.y}%`,
              transform: `rotate(${rulerPos.rotation}deg)`
            }}
            className="absolute z-40 bg-slate-900/95 border-2 border-amber-400 rounded-xl p-3 shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing max-w-xs space-y-2 select-none"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-amber-400" />
                Draggable Rule 7 Gauge
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setRulerPos(p => ({ ...p, rotation: (p.rotation + 45) % 360 }));
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  title="Rotate Ruler 45°"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setEnableRuler(false);
                  }}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-300">
              Drag over printed net quantity or MRP numerals:
            </p>

            {/* Visual mm scale bars */}
            <div className="bg-black/90 p-2.5 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[10px]">
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

        {/* Optical Loupe Magnifier following cursor */}
        {enableLoupe && (
          <div
            style={{
              left: `${mousePos.x + 30}px`,
              top: `${mousePos.y - 80}px`
            }}
            className="absolute z-50 pointer-events-none w-44 h-44 rounded-full border-4 border-sky-400 bg-slate-950 overflow-hidden shadow-2xl ring-4 ring-black/60 hidden md:block"
          >
            {/* Magnified Image */}
            <div
              className="absolute w-[600px] h-[820px] origin-top-left"
              style={{
                transform: `scale(2.5) translate(-${mousePos.relX}%, -${mousePos.relY}%)`
              }}
            >
              <img
                src={imageRecord.url}
                alt="Loupe Zoom"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Crosshair target overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-sky-400/40" />
              <div className="h-full w-[1px] bg-sky-400/40 absolute" />
              <div className="w-6 h-6 rounded-full border border-sky-400/80 absolute" />
            </div>
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="bg-black/80 text-sky-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-500/40">
                2.5x Optical Zoom
              </span>
            </div>
          </div>
        )}

        {/* Artboard Container */}
        <div
          className="relative transition-transform duration-150 ease-out origin-center inline-block rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Photorealistic Product Packaging Photograph */}
          <img
            ref={imageRef}
            src={imageRecord.url}
            alt={imageRecord.name}
            className="max-h-[580px] w-auto object-contain pointer-events-none rounded-2xl shadow-2xl"
            crossOrigin="anonymous"
          />

          {/* 1-Click Auto-Fix Artwork Overlay Simulation */}
          {isFixApplied && (
            <div className="absolute inset-0 pointer-events-none bg-emerald-950/10 backdrop-blur-[0.5px]">
              {/* Dynamic compliant overlay patches */}
              <div className="absolute top-[36%] left-[53%] bg-emerald-900/90 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400 animate-pulse">
                Net Qty: 75 g ✓ (Fixed)
              </div>
              <div className="absolute top-[40%] left-[53%] bg-emerald-900/90 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                (Inclusive of all taxes) ✓
              </div>
              <div className="absolute top-[48%] left-[70%] bg-emerald-900/90 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                USP: ₹ 190.00 / L ✓
              </div>
              <div className="absolute top-[65%] left-[53%] bg-emerald-900/90 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                care@brand.in | 1800-425-9900 ✓
              </div>
            </div>
          )}

          {/* Bounding Box Annotations */}
          {showBoxes &&
            imageRecord.boundingBoxes.map(box => {
              const isActive = box.id === activeBoundingBoxId;
              const isHovered = box.id === hoveredBoxId;

              return (
                <div
                  key={box.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectBoundingBox?.(box.id);
                  }}
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
                    {isFixApplied ? '✓ Compliant' : box.ruleCitation || box.field}
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
                            isFixApplied || box.status === 'valid'
                              ? 'bg-emerald-950 text-emerald-300'
                              : box.status === 'invalid'
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {isFixApplied ? 'COMPLIANT' : box.status.toUpperCase()}
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
            <span className="text-[11px] text-rose-300 font-medium">Statutory Defect</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          Move cursor for 2.5x optical zoom &bull; Drag mm ruler to measure font heights
        </span>
      </div>
    </div>
  );
};
