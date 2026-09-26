import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  X,
  FileText,
  Truck,
  Printer,
  Calculator,
  User,
  FlaskConical,
  BarChart3,
  DollarSign,
  Download,
  Phone,
  Sparkles,
  ArrowRight,
  Mic,
  MicOff
} from 'lucide-react';
import { Invoice, FragranceFormula, ModuleId, UserPermission } from '../types';
import { formatBDT } from '../utils/formatters';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  formulas: FragranceFormula[];
  users: UserPermission[];
  onSelectModule: (moduleId: ModuleId) => void;
  onSelectInvoice: (invoiceId: string) => void;
  onToggleCalculator: () => void;
  onOpenBackup: () => void;
  onOpenWhatsApp: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  invoices,
  formulas,
  users,
  onSelectModule,
  onSelectInvoice,
  onToggleCalculator,
  onOpenBackup,
  onOpenWhatsApp,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setIsListening(false);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Voice speech search using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'bn-BD';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  const trimmedQuery = query.toLowerCase().trim();

  // Filter modules
  const modulesList: { id: ModuleId; name: string; desc: string; icon: any }[] = [
    { id: 1, name: 'Module 1: User & Access Management', desc: 'Manage staff, passwords, and page permissions', icon: User },
    { id: 2, name: 'Module 2: Customer History & Analytics', desc: 'Real-time sales, order timeline and metrics', icon: BarChart3 },
    { id: 3, name: 'Module 3: AI Insights & Inventory Integration', desc: 'AI master perfumer and Google Sheet sync', icon: Sparkles },
    { id: 4, name: 'Module 4: Fragrance Vault & Buying Invoices', desc: 'Perfume formulations, raw materials and oils', icon: FlaskConical },
    { id: 5, name: 'Module 5: Financial Operations & P&L', desc: 'Operating expenses, asset balance and profits', icon: DollarSign },
    { id: 6, name: 'Module 6: Invoice Generator & Courier Dispatch', desc: 'Create consignments, Steadfast/Pathao tracking', icon: Truck },
    { id: 7, name: 'Module 7: Courier Thermal Label Printer', desc: 'Batch 4x6 / 3x2 inch thermal sticker print queue', icon: Printer },
    { id: 8, name: 'Module 8: Luxury Thank You Packaging Card', desc: 'Gold filigree care instructions and QR card', icon: FileText },
  ];

  const matchedModules = modulesList.filter(
    (m) => m.name.toLowerCase().includes(trimmedQuery) || m.desc.toLowerCase().includes(trimmedQuery)
  );

  // Filter invoices
  const matchedInvoices = trimmedQuery
    ? invoices
        .filter(
          (inv) =>
            inv.id.toLowerCase().includes(trimmedQuery) ||
            inv.customerName.toLowerCase().includes(trimmedQuery) ||
            inv.customerPhone.includes(trimmedQuery) ||
            inv.trackingId.toLowerCase().includes(trimmedQuery) ||
            inv.district.toLowerCase().includes(trimmedQuery) ||
            inv.items.some((i) => i.productName.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 5)
    : invoices.slice(0, 3);

  // Filter formulas
  const matchedFormulas = trimmedQuery
    ? formulas
        .filter(
          (f) =>
            f.name.toLowerCase().includes(trimmedQuery) ||
            f.olfactoryFamily.toLowerCase().includes(trimmedQuery) ||
            f.ingredients.some((ing) => ing.name.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-800 bg-neutral-950">
          <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices, customers, formulas, modules, or shortcuts... (Type or Speak)"
            className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 text-sm focus:outline-none"
          />

          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                  : 'bg-neutral-800 text-neutral-400 hover:text-amber-400 border-neutral-700'
              }`}
              title="Voice Search (বাংলায় বলুন)"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Shortcuts Bar */}
        <div className="bg-neutral-950/70 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 overflow-x-auto gap-2">
          <span className="shrink-0 font-medium text-amber-400/90 flex items-center gap-1">
            <Command className="w-3 h-3" />
            Quick Actions:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleCalculator();
                onClose();
              }}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1 shrink-0"
            >
              <Calculator className="w-3 h-3 text-amber-400" />
              <span>Calculator</span>
            </button>

            <button
              onClick={() => {
                onOpenWhatsApp();
                onClose();
              }}
              className="px-2 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 transition-colors flex items-center gap-1 shrink-0"
            >
              <Phone className="w-3 h-3" />
              <span>WhatsApp Hub</span>
            </button>

            <button
              onClick={() => {
                onOpenBackup();
                onClose();
              }}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1 shrink-0"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>Backup & Export</span>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4">
          {/* Invoices Matches */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-neutral-400 px-2 mb-1.5 flex items-center justify-between">
                <span>Consignments & Invoices ({matchedInvoices.length})</span>
                <span className="text-[9px] text-neutral-500">Click to view on dispatch page</span>
              </div>
              <div className="space-y-1">
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onSelectInvoice(inv.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-amber-950/30 border border-neutral-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
                          <span>{inv.customerName}</span>
                          <span className="text-[10px] font-mono text-neutral-500 font-normal">
                            ({inv.customerPhone})
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {inv.id} • {inv.district} • COD: <strong className="text-amber-400">{formatBDT(inv.codAmount)}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {inv.courierPartner.split(' ')[0]}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas Matches */}
          {matchedFormulas.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-neutral-400 px-2 mb-1.5">
                Fragrance Formulas ({matchedFormulas.length})
              </div>
              <div className="space-y-1">
                {matchedFormulas.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => {
                      onSelectModule(4);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-amber-950/30 border border-neutral-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-100">{form.name}</div>
                        <div className="text-[11px] text-neutral-400">
                          {form.olfactoryFamily} • {form.type} • Base: {form.ingredients.length} raw materials
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Modules */}
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-400 px-2 mb-1.5">
              System Modules ({matchedModules.length})
            </div>
            <div className="space-y-1">
              {matchedModules.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectModule(m.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-amber-950/30 border border-neutral-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/30 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">{m.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-amber-400/80 transition-colors">
                      Jump →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-neutral-950 px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>Navigate with mouse or tap • Press ESC to close</span>
          <span>VELLURE Super-Search</span>
        </div>
      </div>
    </div>
  );
};
