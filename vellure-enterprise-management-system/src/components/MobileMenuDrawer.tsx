import React from 'react';
import {
  X,
  Shield,
  UserCheck,
  Search,
  Calculator,
  Phone,
  Database,
  ExternalLink,
  Lock,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  BarChart3,
  FlaskConical,
  DollarSign,
  FileText,
  Printer,
  Award,
  LogOut
} from 'lucide-react';
import { ModuleId, ModuleDefinition, UserPermission } from '../types';
import { BRAND_DETAILS } from '../data/initialData';
import { VELLURE_LOGO } from '../assets/logo';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  allowedModules: ModuleId[];
  modules: ModuleDefinition[];
  currentUser: UserPermission;
  allUsers: UserPermission[];
  onSwitchUser: (user: UserPermission) => void;
  onOpenSearch: () => void;
  onToggleCalculator: () => void;
  onOpenWhatsApp: () => void;
  onOpenBackup: () => void;
  onOpenGoogleSheet: () => void;
  unprintedCount: number;
  onLogout?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  allowedModules,
  modules,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenSearch,
  onToggleCalculator,
  onOpenWhatsApp,
  onOpenBackup,
  onOpenGoogleSheet,
  unprintedCount,
  onLogout,
}) => {
  if (!isOpen) return null;

  const getModuleIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Printer': return <Printer className={className} />;
      case 'Award': return <Award className={className} />;
      default: return <FileText className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Card */}
      <div className="bg-neutral-900 border-t border-amber-500/40 rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drawer Handle */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Drawer Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img
                src={VELLURE_LOGO}
                alt="VELLURE"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-neutral-100 tracking-wider">
                {BRAND_DETAILS.name}
              </div>
              <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                <span>{currentUser.fullName}</span>
                <span>•</span>
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Quick Super-Tools Grid */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5">
              ⚡ কুইক টুলস ও শর্টকাটস (Quick Tools)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">সুপার সার্চ</div>
                  <div className="text-[10px] text-neutral-500 font-mono">কমান্ড প্যালেট</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onToggleCalculator();
                }}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">ক্যালকুলেটর</div>
                  <div className="text-[10px] text-neutral-500 font-mono">COD ও পারফিউম</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsApp();
                }}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-emerald-500/40 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">হোয়াটসঅ্যাপ হাব</div>
                  <div className="text-[10px] text-neutral-500 font-mono">কাস্টমার মেসেজ</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenBackup();
                }}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">ডাটা ব্যাকআপ</div>
                  <div className="text-[10px] text-neutral-500 font-mono">JSON & CSV</div>
                </div>
              </button>
            </div>
          </div>

          {/* All 8 Modules List */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5 flex items-center justify-between">
              <span>সকল মডিউল (All 8 Modules)</span>
              <span className="text-amber-400 text-[10px] font-normal">Active: #{activeModule}</span>
            </div>

            <div className="space-y-1.5">
              {modules.map((m) => {
                const isActive = activeModule === m.id;
                const isAllowed = allowedModules.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModule(m.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-amber-500/15 border border-amber-500/50 text-amber-200'
                        : isAllowed
                        ? 'bg-neutral-950/60 border border-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                        : 'bg-neutral-950/30 border border-neutral-850 text-neutral-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-amber-400 text-neutral-950'
                            : isAllowed
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-900 text-neutral-600'
                        }`}
                      >
                        {m.id}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          <span>{m.shortName}</span>
                          {m.id === 7 && unprintedCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-neutral-950">
                              {unprintedCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {m.name}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {!isAllowed ? (
                        <Lock className="w-3.5 h-3.5 text-neutral-600" />
                      ) : isActive ? (
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Switch User Role */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              👤 দ্রুত রোল পরিবর্তন (Switch Session Role)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.map((u) => {
                const isSelected = u.userId === currentUser.userId;
                return (
                  <button
                    key={u.userId}
                    onClick={() => {
                      onSwitchUser(u);
                      onClose();
                    }}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-neutral-100'
                        : 'bg-neutral-950/60 border-neutral-850 hover:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSelected ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {u.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-neutral-200 truncate">
                        {u.fullName}
                      </div>
                      <div className="text-[9px] text-neutral-500 truncate">
                        {u.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Action */}
          {onLogout && (
            <div className="pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-red-200 text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>সিস্টেম থেকে লগআউট করুন (Log Out)</span>
              </button>
            </div>
          )}
        </div>

        {/* Safe Area padding for iOS notch */}
        <div className="h-6 bg-neutral-900 shrink-0" />
      </div>
    </div>
  );
};
