import React, { useState } from 'react';
import { Scale, BookOpen, Layers, ShoppingBag, Download, RefreshCw, Sparkles, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { ComplianceReport } from '../types/compliance';
import { exportComplianceReportPDF } from '../services/pdfExportService';
import { sounds } from '../services/soundEffects';

interface NavbarProps {
  report: ComplianceReport | null;
  activeTab: 'audit' | 'ecommerce' | 'batch' | 'handbook';
  setActiveTab: (tab: 'audit' | 'ecommerce' | 'batch' | 'handbook') => void;
  onOpenHandbook: () => void;
  onReset: () => void;
  onOpenBatchModal: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  report,
  activeTab,
  setActiveTab,
  onOpenHandbook,
  onReset,
  onOpenBatchModal,
  onOpenAssistant
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => {
            sounds.playClick();
            setActiveTab('audit');
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                MetrologyGuard AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/80">
                LMPC 2011 Rules
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Packaged Commodities Statutory Compliance & Vision Verification Studio
            </p>
          </div>
        </div>

        {/* Center Nav Modes */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('audit');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Packaging Studio & Audit
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('ecommerce');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-tactile flex items-center gap-1.5 ${
              activeTab === 'ecommerce'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            E-Commerce Listing (Rule 6(10))
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenBatchModal();
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 btn-tactile flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Bulk Batch Audit
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Legal Assistant Drawer Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAssistant();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-800 hover:bg-sky-900 btn-tactile flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Ask Legal Officer</span>
          </button>

          {report && (
            <button
              onClick={() => {
                sounds.playSuccess();
                exportComplianceReportPDF(report);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-600 hover:text-white btn-tactile flex items-center gap-1.5 shadow-sm"
              title="Download Official Legal Metrology Audit PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Audit PDF</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onOpenHandbook();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white btn-tactile flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">LMPC Rulebook</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile transition-colors"
            title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onReset();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 btn-tactile transition-colors"
            title="Reset to Benchmark"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
