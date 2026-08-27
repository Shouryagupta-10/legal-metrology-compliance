import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Info,
  SlidersHorizontal,
  SplitSquareVertical,
  Crosshair,
  Keyboard
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
  const [loupePower, setLoupePower] = useState<number>(2.5); // 1.5, 2.5, 4.0
  const [enableRuler, setEnableRuler] = useState<boolean>(false);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitPos, setSplitPos] = useState<number>(50); // 0 to 100%
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  // Loupe magnifier position
  const [mousePos, setMousePos] = useState<{ x: number; y: number; relX: number; relY: number }>({
    x: 0,
    y: 0,
    relX: 50,
    relY: 50
  });

  // Draggable Ruler state
  const [rulerPos, setRulerPos] = useState<{ x: number; y: number; rotation: number }>({
    x: 35,
    y: 35,
    rotation: 0
  });
  const [isDraggingRuler, setIsDraggingRuler] = useState<boolean>(false);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        sounds.playClick();
        setEnableLoupe(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        sounds.playClick();
        setEnableRuler(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        if (onToggleAutoFix) {
          sounds.playSuccess();
          onToggleAutoFix();
        }
      } else if (e.key === 's' || e.key === 'S') {
        sounds.playClick();
        setIsSplitMode(prev => !prev);
      } else if (e.key === '=' || e.key === '+') {
        sounds.playClick();
        setZoom(prev => Math.min(2.5, prev + 0.25));
      } else if (e.key === '-' || e.key === '_') {
        sounds.playClick();
        setZoom(prev => Math.max(0.75, prev - 0.25));
      } else if (e.key === '0') {
        sounds.playClick();
        setZoom(1);
      } else if (e.key === '?') {
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleAutoFix]);

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

    if (isDraggingSplit && containerRef.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(5, Math.min(95, ((e.clientX - cRect.left) / cRect.width) * 100));
      setSplitPos(pct);
    }
  };

  const handleRulerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingRuler(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingSplit(true);
  };

  const handleMouseUp = () => {
    setIsDraggingRuler(false);
    setIsDraggingSplit(false);
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
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/95 overflow-hidden shadow-2xl relative">
      {/* Studio Header Toolbar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2">
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
              title="Preview Auto-Corrected Packaging Artwork with 100% Legal Metrology Compliance [Key: F]"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isFixApplied ? '✓ Auto-Fix Active' : '1-Click Fix'}</span>
              <kbd className="hidden md:inline-block px-1 py-0.2 bg-black/40 text-[9px] font-mono rounded">F</kbd>
            </button>
          )}

          {/* Interactive Split Comparison Slider */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsSplitMode(!isSplitMode);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1 border transition-colors ${
              isSplitMode
                ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle Split-Screen Comparison Slider [Key: S]"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Split View</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 bg-black/40 text-[9px] font-mono rounded">S</kbd>
          </button>

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
            title="Toggle 2.5x Precision Optical Loupe [Key: M]"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{loupePower}x Loupe</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 bg-black/40 text-[9px] font-mono rounded">M</kbd>
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
            title="Toggle Draggable Rule 7 Millimeter Ruler [Key: R]"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">mm Ruler</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 bg-black/40 text-[9px] font-mono rounded">R</kbd>
          </button>

          {/* Action Modals */}
          <button
            onClick={onOpenPDPTool}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white btn-tactile transition-colors"
          >
            PDP Tool
          </button>

          {/* Keyboard Shortcuts Help modal */}
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 btn-tactile"
            title="Keyboard Shortcuts [?]"
          >
            <Keyboard className="w-4 h-4" />
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
              title="Zoom Out [-]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1.5 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile"
              title="Zoom In [+]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile"
              title="Fit to Artboard [0]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay Card */}
      {showKeyboardHelp && (
        <div className="absolute top-14 right-4 z-50 bg-slate-950/95 border border-sky-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-2 text-slate-300 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between text-white font-semibold pb-1 border-b border-slate-800">
            <span>Interactive Shortcuts</span>
            <button onClick={() => setShowKeyboardHelp(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between"><span>[M]</span><span className="text-sky-300">Toggle Loupe Magnifier</span></div>
            <div className="flex justify-between"><span>[R]</span><span className="text-amber-300">Toggle mm Ruler</span></div>
            <div className="flex justify-between"><span>[F]</span><span className="text-emerald-300">1-Click Auto-Fix Artwork</span></div>
            <div className="flex justify-between"><span>[S]</span><span className="text-purple-300">Split Comparison View</span></div>
            <div className="flex justify-between"><span>[+] / [-]</span><span className="text-slate-400">Zoom In / Out</span></div>
            <div className="flex justify-between"><span>[0]</span><span className="text-slate-400">Reset 100% Zoom</span></div>
          </div>
        </div>
      )}

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
                    sounds.playTick();
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
            className="absolute z-50 pointer-events-none w-48 h-48 rounded-full border-4 border-sky-400 bg-slate-950 overflow-hidden shadow-2xl ring-4 ring-black/60 hidden md:block"
          >
            {/* Magnified Image */}
            <div
              className="absolute w-[600px] h-[820px] origin-top-left"
              style={{
                transform: `scale(${loupePower}) translate(-${mousePos.relX}%, -${mousePos.relY}%)`
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
            <div className="absolute bottom-2 inset-x-0 text-center flex items-center justify-center gap-1">
              <span className="bg-black/85 text-sky-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-500/40">
                {loupePower}x Zoom ({Math.round(mousePos.relX)}%, {Math.round(mousePos.relY)}%)
              </span>
            </div>
          </div>
        )}

        {/* Artboard Container with optional Split View */}
        <div
          className="relative transition-transform duration-150 ease-out origin-center inline-block rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Base Product Packaging Photograph */}
          <img
            ref={imageRef}
            src={imageRecord.url}
            alt={imageRecord.name}
            className="max-h-[580px] w-auto object-contain pointer-events-none rounded-2xl shadow-2xl"
            crossOrigin="anonymous"
          />

          {/* Interactive Split Comparison View */}
          {isSplitMode && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }}
            >
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[0.5px]">
                {/* Compliant Badges on Left of Split */}
                <div className="absolute top-[36%] left-[53%] bg-emerald-900 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                  Net Qty: 75 g ✓ (Fixed)
                </div>
                <div className="absolute top-[40%] left-[53%] bg-emerald-900 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                  (Inclusive of all taxes) ✓
                </div>
                <div className="absolute top-[48%] left-[70%] bg-emerald-900 text-white font-mono font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-400">
                  USP: ₹ 190.00 / L ✓
                </div>
              </div>
            </div>
          )}

          {/* Split View Divider Bar */}
          {isSplitMode && (
            <div
              onMouseDown={handleSplitMouseDown}
              style={{ left: `${splitPos}%` }}
              className="absolute inset-y-0 w-1 bg-purple-400 cursor-ew-resize z-40 shadow-2xl flex items-center justify-center -translate-x-1/2"
            >
              <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-bold">
                ⇄
              </div>
            </div>
          )}

          {/* 1-Click Auto-Fix Artwork Overlay Simulation (when active without split) */}
          {!isSplitMode && isFixApplied && (
            <div className="absolute inset-0 pointer-events-none bg-emerald-950/10 backdrop-blur-[0.5px]">
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
                    className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide border whitespace-nowrap z-30 transition-all ${getBadgeColor(
                      box.status
                    )} ${isActive || isHovered ? 'scale-110' : 'opacity-85'}`}
                  >
                    <span className="flex items-center gap-1">
                      {isFixApplied ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      ) : box.status === 'valid' ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      ) : box.status === 'invalid' ? (
                        <AlertOctagon className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                      ) : (
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      )}
                      <span>{box.field}</span>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Bottom Status Information Bar */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>
            Position: {Math.round(mousePos.relX)}%, {Math.round(mousePos.relY)}%
          </span>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <span className="hidden sm:inline">
            Active Layer: {isFixApplied ? '✓ Auto-Fixed Artwork' : isSplitMode ? '⇄ Split Comparison' : 'Scanned Original'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Press &apos;?&apos; for shortcuts</span>
        </div>
      </div>
    </div>
  );
};