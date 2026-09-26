import React, { useRef, useState, useEffect } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Sparkles,
  FlaskConical,
  DollarSign,
  FileText,
  Printer,
  Award,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ModuleId, ModuleDefinition } from '../types';

interface NavigationProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  allowedModules: ModuleId[];
  modules: ModuleDefinition[];
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  allowedModules,
  modules,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [modules]);

  // Smooth scroll to active module on change
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector(`[data-module-id="${activeModule}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    checkScroll();
  }, [activeModule]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 240;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 300);
  };

  const getIcon = (iconName: string, className: string) => {
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
    <nav className="no-print bg-neutral-900/90 border-b border-amber-900/30 sticky top-16 sm:top-20 z-30 backdrop-blur-md shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-1.5 gap-1 sm:gap-2">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              title="Scroll left"
              className="p-1.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-amber-400 border border-neutral-700 shrink-0 shadow-md transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Main 8-Module Ribbon */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 no-scrollbar scroll-smooth flex-1 min-w-0"
          >
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              const isAllowed = allowedModules.includes(m.id);
              const isHighlighted = m.id === 7 || m.id === 8;

              return (
                <button
                  key={m.id}
                  data-module-id={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`relative flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-200 border border-amber-500/60 shadow-md shadow-amber-950/50'
                      : isHighlighted
                      ? 'bg-neutral-900 text-amber-300/90 hover:text-amber-200 hover:bg-neutral-850 border border-amber-500/30'
                      : isAllowed
                      ? 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/80 border border-transparent'
                      : 'text-neutral-500 hover:text-neutral-400 bg-neutral-900/40 border border-neutral-800/40 opacity-75'
                  }`}
                >
                  {/* Page number badge */}
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-colors shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950 shadow-sm'
                        : isHighlighted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isAllowed
                        ? 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                        : 'bg-neutral-900 text-neutral-600'
                    }`}
                  >
                    {m.id}
                  </span>

                  {/* Icon */}
                  {getIcon(
                    m.icon,
                    `w-3.5 h-3.5 transition-colors shrink-0 ${
                      isActive
                        ? 'text-amber-400'
                        : isHighlighted
                        ? 'text-amber-400'
                        : isAllowed
                        ? 'text-neutral-400 group-hover:text-amber-300'
                        : 'text-neutral-600'
                    }`
                  )}

                  {/* Module title */}
                  <span className="font-medium tracking-wide">
                    {m.id === 7 ? '৭. থার্মাল স্টিকার (Labels)' : m.id === 8 ? '৮. থ্যাঙ্ক ইউ কার্ড (Cards)' : m.shortName}
                  </span>

                  {/* Lock icon if not allowed */}
                  {!isAllowed && (
                    <span title="Access privilege required" className="text-amber-500/50 ml-0.5">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              title="Scroll right to see Pages 7 & 8"
              className="p-1.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-amber-400 border border-neutral-700 shrink-0 shadow-md transition-all active:scale-95 animate-pulse"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Quick Direct Jump Pills for 7 & 8 */}
          <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-neutral-800 shrink-0">
            <button
              onClick={() => onSelectModule(7)}
              title="সরাসরি ৭ নং পেজে যান (Courier Thermal Sticker)"
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeModule === 7
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/90 text-amber-300 hover:bg-neutral-800 border border-amber-500/30'
              }`}
            >
              <Printer className="w-3 h-3" />
              <span>পেজ ৭</span>
            </button>

            <button
              onClick={() => onSelectModule(8)}
              title="সরাসরি ৮ নং পেজে যান (Thank You Insert Card)"
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeModule === 8
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/90 text-amber-300 hover:bg-neutral-800 border border-amber-500/30'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>পেজ ৮</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

