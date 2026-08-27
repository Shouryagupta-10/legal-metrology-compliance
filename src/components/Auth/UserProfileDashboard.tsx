import React from 'react';
import { X, User, FileText, Settings, LogOut, ShieldCheck, Clock, Download } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  // Mock data for the hackathon presentation
  const pastAudits = [
    { id: 'AUD-092', date: 'Today, 10:42 AM', brand: 'Heritage Foods', status: 'Compliant' },
    { id: 'AUD-091', date: 'Yesterday', brand: 'Apex Retail', status: 'Non-Compliant' },
    { id: 'AUD-090', date: 'Aug 24, 2026', brand: 'Bharat Marketplace', status: 'Compliant' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => { sounds.playClick(); onClose(); }}
      />

      {/* Sliding Drawer Panel */}
      <div className="relative w-full sm:w-[400px] h-full bg-slate-50 dark:bg-[#0c1427] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#111c36]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-sky-500" />
            Auditor Profile
          </h2>
          <button 
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* User Info Card */}
          <div className="bg-white dark:bg-[#111c36] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Verified via WhatsApp
              </div>
              <div className="font-mono text-lg font-black text-slate-900 dark:text-white">
                +91 98765 43210
              </div>
              <div className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                Authorized LMPC Auditor
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#111c36] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <div className="text-2xl font-black text-slate-900 dark:text-white">124</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Total Audits</div>
            </div>
            <div className="bg-white dark:bg-[#111c36] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <div className="text-2xl font-black text-rose-500">3</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Pending Notices</div>
            </div>
          </div>

          {/* Recent Reports Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Audit Reports
            </h3>
            <div className="space-y-3">
              {pastAudits.map((audit, i) => (
                <div key={i} className="group bg-white dark:bg-[#111c36] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{audit.brand}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{audit.id} • {audit.date}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${audit.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                      {audit.status}
                    </span>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
              View All Reports &rarr;
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111c36] grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={() => { sounds.playClick(); onLogout(); onClose(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};