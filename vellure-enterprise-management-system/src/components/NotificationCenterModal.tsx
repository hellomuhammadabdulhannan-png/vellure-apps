import React from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  Clock,
  Printer,
  DollarSign,
  Truck,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Invoice, RawMaterialInvoice, ModuleId } from '../types';
import { formatBDT } from '../utils/formatters';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  buyingInvoices: RawMaterialInvoice[];
  onNavigateToModule: (moduleId: ModuleId) => void;
  onSelectThermalInvoice: (invoiceId: string) => void;
  onOpenWhatsApp: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  invoices,
  buyingInvoices,
  onNavigateToModule,
  onSelectThermalInvoice,
  onOpenWhatsApp,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Follow-up reviews pending today
  const pendingReviews = invoices.filter(
    (inv) => inv.reviewReminderDate && inv.reviewReminderDate <= todayStr && inv.reviewStatus === 'Pending'
  );

  // 2. Unprinted thermal labels
  const unprintedInvoices = invoices.filter((inv) => !inv.thermalPrinted);

  // 3. Pending COD amount in transit
  const pendingCodInvoices = invoices.filter(
    (inv) => inv.paymentStatus === 'Cash on Delivery (COD)' || inv.paymentStatus === 'Partial Paid'
  );
  const totalPendingCod = pendingCodInvoices.reduce((acc, inv) => acc + inv.codAmount, 0);

  // 4. Low stock raw materials check
  const lowMaterials = buyingInvoices.filter((bi) =>
    bi.items.some((it) => it.quantity <= 2)
  );

  const totalAlerts =
    pendingReviews.length +
    unprintedInvoices.length +
    (lowMaterials.length > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Operational Alerts & Dispatch Radar</span>
                {totalAlerts > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-neutral-950 font-bold">
                    {totalAlerts} Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-neutral-400">
                Daily dispatch tasks, collection queues and review triggers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metric Overview Row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Pending COD in Courier</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {formatBDT(totalPendingCod)}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {pendingCodInvoices.length} active consignments
            </div>
          </div>
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Unprinted Stickers</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {unprintedInvoices.length} Labels
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Thermal sticker queue
            </div>
          </div>
        </div>

        {/* Alert 1: Unprinted Thermal Stickers */}
        {unprintedInvoices.length > 0 && (
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{unprintedInvoices.length} Consignments Awaiting Thermal Print</span>
              </div>
              <button
                onClick={() => {
                  onNavigateToModule(7);
                  onClose();
                }}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Print All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              কুরিয়ার হ্যান্ডওভার করার আগে পার্সেলের গায়ে ৪×৬ ইঞ্চি লেবেল প্রিন্ট ও পেস্ট করুন।
            </p>
          </div>
        )}

        {/* Alert 2: Follow-up Reviews Due */}
        {pendingReviews.length > 0 && (
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{pendingReviews.length} Customer Reviews Due for Follow-up</span>
              </div>
              <button
                onClick={() => {
                  onOpenWhatsApp();
                  onClose();
                }}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Send WhatsApp</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              ডেলিভারি সম্পন্ন হওয়া কাস্টমারদের পারফিউম রেটিং ও ফিডব্যাক নেওয়ার সময় হয়েছে।
            </p>
            <div className="space-y-1 pt-1">
              {pendingReviews.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="text-[11px] flex justify-between items-center text-neutral-300 bg-neutral-900 px-2 py-1 rounded"
                >
                  <span>{r.customerName} ({r.customerPhone})</span>
                  <span className="text-[10px] font-mono text-emerald-400">{r.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert 3: Low Raw Material Stocks */}
        {lowMaterials.length > 0 && (
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-red-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{lowMaterials.length} Raw Materials Low on Stock</span>
              </div>
              <button
                onClick={() => {
                  onNavigateToModule(4);
                  onClose();
                }}
                className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Check Vault</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              কিছু সুগন্ধি কাঁচামালের ইনভেন্টরি কমে এসেছে। নতুন পারফিউম ব্যাচ তৈরির আগে রিস্টক নিশ্চিত করুন।
            </p>
          </div>
        )}

        {totalAlerts === 0 && (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-xs font-semibold text-neutral-200">All Operations Clear!</div>
            <p className="text-[11px] text-neutral-500">
              No pending delivery alerts or overdue reminders at this moment.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
