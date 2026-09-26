import React from 'react';
import { ShieldAlert, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { ModuleDefinition, UserPermission } from '../types';

interface AccessDeniedProps {
  module: ModuleDefinition;
  currentUser: UserPermission;
  allUsers: UserPermission[];
  onSwitchToAdmin: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  module,
  currentUser,
  onSwitchToAdmin,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-neutral-900/90 border border-amber-900/40 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase font-mono tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Page {module.id} • Restricted Access
        </span>

        <h2 className="text-xl font-serif-luxury font-bold text-neutral-100 mb-2">
          {module.name}
        </h2>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Your current staff role (<span className="text-amber-300 font-semibold">{currentUser.role}</span>) does not have access privileges assigned for this enterprise module.
        </p>

        <div className="bg-neutral-950/70 rounded-xl p-4 border border-neutral-800 text-left mb-6 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Staff Member:</span>
            <span className="text-neutral-200 font-medium">{currentUser.fullName}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Department:</span>
            <span className="text-neutral-200 font-medium">{currentUser.department}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Privilege Status:</span>
            <span className="text-red-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Module {module.id} Denied
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSwitchToAdmin}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-amber-950/50"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch to Super Admin (Instant Preview)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
          
          <p className="text-[11px] text-neutral-500">
            To assign permanent permissions, contact Md. Abdul Hannan in Module 1.
          </p>
        </div>
      </div>
    </div>
  );
};
