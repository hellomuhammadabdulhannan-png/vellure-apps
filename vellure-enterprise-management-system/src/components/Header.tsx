import React from 'react';
import {
  Sparkles,
  Calculator,
  ExternalLink,
  Printer,
  Award,
  Shield,
  UserCheck,
  ChevronDown,
  Building2,
  Phone,
  Crown,
  Search,
  Bell,
  Database,
  Menu,
  LogOut
} from 'lucide-react';
import { UserPermission } from '../types';
import { BRAND_DETAILS } from '../data/initialData';
import { VELLURE_LOGO } from '../assets/logo';

interface HeaderProps {
  currentUser: UserPermission;
  allUsers: UserPermission[];
  onSwitchUser: (user: UserPermission) => void;
  onToggleCalculator: () => void;
  isCalculatorOpen: boolean;
  onOpenGoogleSheet: () => void;
  unprintedCount: number;
  onNavigateToThermalPrinter: () => void;
  onNavigateToCards?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenBackup: () => void;
  onOpenWhatsApp: () => void;
  notificationCount: number;
  onOpenMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onToggleCalculator,
  isCalculatorOpen,
  onOpenGoogleSheet,
  unprintedCount,
  onNavigateToThermalPrinter,
  onNavigateToCards,
  onOpenSearch,
  onOpenNotifications,
  onOpenBackup,
  onOpenWhatsApp,
  notificationCount,
  onOpenMobileMenu,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="no-print bg-neutral-950 border-b border-amber-900/30 sticky top-0 z-40 backdrop-blur-md bg-neutral-950/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
          <div className="relative group cursor-pointer shrink-0">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl bg-neutral-900 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/40 group-hover:border-amber-400 overflow-hidden transition-all">
              <img
                src={VELLURE_LOGO}
                alt="VELLURE Luxury Fragrances Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-950" title="System Operational" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif-luxury text-lg sm:text-2xl font-bold tracking-[0.15em] sm:tracking-[0.25em] text-neutral-100 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 truncate">
                {BRAND_DETAILS.name}
              </span>
              <span className="hidden xs:inline text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                Enterprise
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-3 text-xs text-neutral-400 font-light truncate">
              <span className="tracking-wider text-amber-300/80 truncate">{BRAND_DETAILS.tagline}</span>
              <span className="text-neutral-600">•</span>
              <span className="hidden md:inline flex items-center gap-1 text-neutral-400 truncate">
                <Building2 className="w-3 h-3 text-amber-500/60 inline shrink-0" /> {BRAND_DETAILS.address}
              </span>
            </div>
          </div>
        </div>

        {/* Global Toolbar & Role Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* 1. Global Fast Search & Command Palette (Ctrl+K) */}
          <button
            onClick={onOpenSearch}
            title="Global Search & Quick Actions (Ctrl + K)"
            className="flex items-center space-x-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 text-xs transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline text-neutral-400">Search...</span>
            <kbd className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-700 text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* 2. Customer WhatsApp Concierge (Hidden on mobile, available in bottom nav & menu) */}
          <button
            onClick={onOpenWhatsApp}
            title="Customer WhatsApp Message Hub"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-800/40 text-xs font-medium transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">WhatsApp</span>
          </button>

          {/* 3. Operational Notifications / Alerts Center */}
          <button
            onClick={onOpenNotifications}
            title="Operational Alerts & Dispatch Radar"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 text-xs transition-all relative"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-neutral-950 animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {/* 4. Full Business Backup & CSV Export */}
          <button
            onClick={onOpenBackup}
            title="1-Click Backup & Excel Export"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 text-xs transition-all"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Backup</span>
          </button>

          {/* 5. External Google Sheet Quick-Launch */}
          <button
            onClick={onOpenGoogleSheet}
            title="Open External Inventory Google Sheet"
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-2 rounded-xl bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400/90 border border-emerald-800/30 text-xs transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline">Sheet</span>
          </button>

          {/* 6. Quick Floating Calculator Toggle */}
          <button
            onClick={onToggleCalculator}
            title="Toggle Moveable Calculator"
            className={`hidden xs:flex items-center space-x-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-all ${
              isCalculatorOpen
                ? 'bg-amber-500 text-neutral-950 border-amber-400 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-amber-500/30'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* 7. Unprinted Thermal Stickers Badge Button (Page 7) */}
          <button
            onClick={onNavigateToThermalPrinter}
            title="৭ নং পেজ: Courier Thermal Stickers Queue"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/30 text-xs font-medium transition-all relative"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">৭. স্টিকার</span>
            {unprintedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950">
                {unprintedCount}
              </span>
            )}
          </button>

          {/* 7.5 Luxury Thank You Card (Page 8) */}
          {onNavigateToCards && (
            <button
              onClick={onNavigateToCards}
              title="৮ নং পেজ: Luxury Thank You Insert Card"
              className="hidden lg:flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/30 text-xs font-medium transition-all"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">৮. কার্ড</span>
            </button>
          )}

          {/* 8. Active User & Fast Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-1.5 sm:space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900/90 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center shadow-inner">
                {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <span>{currentUser.fullName}</span>
                  {currentUser.role === 'Super Admin' && (
                    <Shield className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                <div className="text-[10px] text-amber-400/90 font-mono tracking-tight">
                  {currentUser.role} • {currentUser.allowedModules.length} Modules
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors hidden sm:inline" />
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 max-w-[90vw] rounded-xl bg-neutral-900 border border-amber-900/40 shadow-2xl z-40 p-2 overflow-hidden backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-neutral-800 text-[11px] text-neutral-400 font-medium">
                    <span className="text-amber-400 font-semibold uppercase tracking-wider block text-[10px]">
                      Switch Session Role
                    </span>
                    Test permission restrictions live across modules:
                  </div>

                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                    {allUsers.map((user) => {
                      const isActive = user.userId === currentUser.userId;
                      return (
                        <button
                          key={user.userId}
                          onClick={() => {
                            onSwitchUser(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-amber-500/20 border border-amber-500/40 text-neutral-100'
                              : 'hover:bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            user.role === 'Super Admin'
                              ? 'bg-amber-500 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate flex items-center justify-between">
                              <span>{user.fullName}</span>
                              {isActive && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate">
                              {user.role} ({user.department})
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {onLogout && (
                    <div className="mt-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-red-200 text-xs font-medium transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>লগআউট করুন (Log Out)</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 9. Mobile Menu Button (Hamburger) */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              title="Open Navigation Menu"
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 transition-all"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

