import React, { useState } from 'react';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserPermission } from '../types';
import { BRAND_DETAILS } from '../data/initialData';
import { VELLURE_LOGO } from '../assets/logo';

interface LoginScreenProps {
  users: UserPermission[];
  onLoginSuccess: (user: UserPermission, remember: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccountsHelper, setShowAccountsHelper] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setErrorMessage('অনুগ্রহ করে ইউজারনেম এবং পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching user by username, email, or userId
      const matchedUser = users.find(
        (u) =>
          u.username.toLowerCase() === cleanIdentifier ||
          u.email.toLowerCase() === cleanIdentifier ||
          u.userId.toLowerCase() === cleanIdentifier
      );

      if (!matchedUser) {
        setErrorMessage('ভুল ইউজারনেম বা ইমেইল! কোনো নিবন্ধিত ব্যবহারকারী পাওয়া যায়নি।');
        setIsSubmitting(false);
        return;
      }

      // Check user status
      if (matchedUser.status === 'Suspended') {
        setErrorMessage('আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।');
        setIsSubmitting(false);
        return;
      }

      // Check password
      const userPass = matchedUser.password || 'Kr100300500';
      if (userPass !== cleanPassword) {
        setErrorMessage('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড প্রদান করে আবার চেষ্টা করুন।');
        setIsSubmitting(false);
        return;
      }

      // Successful login
      onLoginSuccess(matchedUser, rememberMe);
    }, 250);
  };

  const handleQuickFill = (user: UserPermission) => {
    setIdentifier(user.username);
    setPassword(user.password || 'Kr100300500');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0e12] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Ambience / Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-1 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-2xl shadow-amber-950/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center p-1 border border-amber-500/30">
              <img
                src={VELLURE_LOGO}
                alt="VELLURE Luxury Fragrances"
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold tracking-[0.2em] text-neutral-100 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              {BRAND_DETAILS.name}
            </h1>
            <p className="text-xs sm:text-sm text-amber-400/90 font-light tracking-wider mt-1">
              {BRAND_DETAILS.tagline}
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>সুরক্ষিত এন্টারপ্রাইজ সিস্টেম • Enterprise Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5">
          <div className="border-b border-neutral-800/80 pb-3">
            <h2 className="text-base sm:text-lg font-serif-luxury font-semibold text-neutral-100">
              লগইন করুন (Staff Sign In)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              অ্যাপটি ব্যবহার করতে আপনার ইউজার আইডি এবং পাসওয়ার্ড দিন
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>ইউজারনেম বা ইমেইল</span>
                <span className="text-[10px] text-neutral-500 font-mono">ID / Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. abdul.hannan"
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>পাসওয়ার্ড</span>
                <span className="text-[10px] text-neutral-500 font-mono">Secret Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড দিন..."
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/40 focus:ring-offset-neutral-900"
                />
                <span className="text-neutral-300 text-xs">এই ব্রাউজারে লগইন মনে রাখুন</span>
              </label>

              <button
                type="button"
                onClick={() => setShowAccountsHelper(!showAccountsHelper)}
                className="text-amber-400 hover:text-amber-300 text-[11px] underline underline-offset-2 flex items-center gap-1"
              >
                <span>স্টাফ একাউন্ট তথ্য</span>
                {showAccountsHelper ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-semibold text-sm shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>লগইন করুন (Enter System)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Credentials Helper Drawer */}
          {showAccountsHelper && (
            <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-semibold text-amber-400">নিবন্ধিত অনুমোদিত কর্মকর্তা তালিকা:</span>
                <span className="text-[10px] text-neutral-500">১-ক্লিকে ফিল করুন</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {users.map((u) => (
                  <div
                    key={u.userId}
                    className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-neutral-200 truncate flex items-center gap-1.5">
                        <span>{u.fullName}</span>
                        {u.role === 'Super Admin' && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-300 font-mono">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono truncate">
                        ID: <span className="text-amber-400">{u.username}</span> | Pass:{' '}
                        <span className="text-neutral-300">{u.password || 'Kr100300500'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickFill(u)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 font-mono text-[10px] transition-all shrink-0"
                    >
                      অটো ফিল
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-neutral-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Role-Based Access Control • 256-bit Session Security</span>
        </div>
      </div>
    </div>
  );
};
