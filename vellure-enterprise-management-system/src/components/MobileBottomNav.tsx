import React from 'react';
import {
  FileText,
  BarChart3,
  Sparkles,
  Printer,
  Award,
  Menu,
  Bell
} from 'lucide-react';
import { ModuleId } from '../types';

interface MobileBottomNavProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenMobileMenu: () => void;
  unprintedCount: number;
  notificationCount: number;
  onOpenNotifications: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMobileMenu,
  unprintedCount,
  notificationCount,
  onOpenNotifications,
}) => {
  return (
    <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-amber-900/30 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* 1. Dispatch & Invoices (Module 6) */}
      <button
        onClick={() => onSelectModule(6)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
          activeModule === 6
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeModule === 6 ? 'bg-amber-500/20' : ''}`}>
          <FileText className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">ইনভয়েস</span>
      </button>

      {/* 2. Customer Analytics (Module 2) */}
      <button
        onClick={() => onSelectModule(2)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
          activeModule === 2
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeModule === 2 ? 'bg-amber-500/20' : ''}`}>
          <BarChart3 className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">হিসাব-নিকাশ</span>
      </button>

      {/* 3. Gemini 3.8 Flash AI Advisor (Module 3) */}
      <button
        onClick={() => onSelectModule(3)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] relative ${
          activeModule === 3
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeModule === 3 ? 'bg-amber-500/20' : ''}`}>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">জেমিনাই AI</span>
      </button>

      {/* 4. Thermal Printer (Module 7) */}
      <button
        onClick={() => onSelectModule(7)}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] relative ${
          activeModule === 7
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeModule === 7 ? 'bg-amber-500/20' : ''}`}>
          <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {unprintedCount > 0 && (
          <span className="absolute top-0.5 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-neutral-950">
            {unprintedCount}
          </span>
        )}
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">৭. স্টিকার</span>
      </button>

      {/* 5. Luxury Thank You Card (Module 8) */}
      <button
        onClick={() => onSelectModule(8)}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] relative ${
          activeModule === 8
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeModule === 8 ? 'bg-amber-500/20' : ''}`}>
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">৮. কার্ড</span>
      </button>

      {/* 6. Mobile Menu (All 8 Modules & Super Tools) */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-neutral-300 hover:text-amber-300 transition-all min-w-[50px] relative"
      >
        <div className="p-1 rounded-lg bg-neutral-900 border border-neutral-800">
          <Menu className="w-5 h-5" />
        </div>
        {notificationCount > 0 && (
          <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500" />
        )}
        <span className="text-[10px] tracking-tight mt-0.5 font-medium">মেনু</span>
      </button>
    </div>
  );
};
