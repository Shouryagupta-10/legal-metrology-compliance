import React, { useState } from 'react';
import { Scale, BookOpen, Layers, ShoppingBag, Download, RefreshCw, Sparkles, MessageSquare, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
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
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  report, activeTab, setActiveTab, onOpenHandbook, onReset, onOpenBatchModal, onOpenAssistant, isDark, toggleTheme
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('audit')}>
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">MetrologyGuard AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300">
                LMPC 2011
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Statutory Compliance & Vision Verification Studio
            </p>
          </div>
        </div>

        {/* Center Nav Modes */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button onClick={() => setActiveTab('audit')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-white dark:bg-sky-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}>
            <Layers className="w-4 h-4" /> Audit Studio
          </button>
          <button onClick={() => setActiveTab('ecommerce')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ecommerce' ? 'bg-white dark:bg-sky-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}>
            <ShoppingBag className="w-4 h-4" /> E-Commerce
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={onOpenAssistant} className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-sky-950/80 text-slate-700 dark:text-sky-300 border border-transparent dark:border-sky-800 hover:bg-slate-200 dark:hover:bg-sky-900 flex items-center gap-1.5 transition-colors">
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" /> <span className="hidden sm:inline">Ask Officer</span>
          </button>

          {report && (
            <button onClick={() => exportComplianceReportPDF(report)} className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 dark:bg-emerald-950/70 text-white dark:text-emerald-300 border border-transparent dark:border-emerald-700/80 hover:bg-emerald-700 dark:hover:bg-emerald-600 flex items-center gap-1.5 shadow-sm transition-colors">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Light/Dark Mode">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={onOpenHandbook} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <BookOpen className="w-4 h-4" />
          </button>
          <button onClick={() => { const m = sounds.toggleMute(); setIsMuted(m); }} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={onReset} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};