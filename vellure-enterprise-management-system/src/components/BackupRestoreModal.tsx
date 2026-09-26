import React, { useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  RefreshCw
} from 'lucide-react';
import {
  Invoice,
  FragranceFormula,
  RawMaterialInvoice,
  OperatingExpense,
  AssetCategory,
  QuickNote,
  UserPermission
} from '../types';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  formulas: FragranceFormula[];
  buyingInvoices: RawMaterialInvoice[];
  operatingExpenses: OperatingExpense[];
  assetBreakdown: AssetCategory[];
  quickNotes: QuickNote[];
  users: UserPermission[];
  onRestoreData: (restoredData: {
    invoices?: Invoice[];
    formulas?: FragranceFormula[];
    buyingInvoices?: RawMaterialInvoice[];
    operatingExpenses?: OperatingExpense[];
    assetBreakdown?: AssetCategory[];
    quickNotes?: QuickNote[];
    users?: UserPermission[];
  }) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  invoices,
  formulas,
  buyingInvoices,
  operatingExpenses,
  assetBreakdown,
  quickNotes,
  users,
  onRestoreData,
}) => {
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // 1. Download full business backup as JSON
  const handleDownloadJsonBackup = () => {
    const backupData = {
      backupTimestamp: new Date().toISOString(),
      appName: 'VELLURE Enterprise Fragrance Operating System',
      version: '1.0.0',
      data: {
        invoices,
        formulas,
        buyingInvoices,
        operatingExpenses,
        assetBreakdown,
        quickNotes,
        users,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `VELLURE_Full_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. Export Invoices to Excel-compatible CSV format
  const handleExportInvoicesCsv = () => {
    const headers = [
      'Invoice ID',
      'Tracking ID',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Delivery Address',
      'Thana',
      'District',
      'Courier Partner',
      'Consignment Ref',
      'Items Count',
      'Order Subtotal (BDT)',
      'Delivery Fee (BDT)',
      'Discount (BDT)',
      'Advance Paid (BDT)',
      'Net Collectible COD (BDT)',
      'Payment Status',
      'Order Status',
      'Review Status',
    ];

    const rows = invoices.map((inv) => [
      `"${inv.id}"`,
      `"${inv.trackingId}"`,
      `"${inv.date}"`,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      `"${inv.customerPhone}"`,
      `"${inv.deliveryAddress.replace(/"/g, '""')}"`,
      `"${inv.thana}"`,
      `"${inv.district}"`,
      `"${inv.courierPartner}"`,
      `"${inv.courierConsignmentId || ''}"`,
      inv.items.reduce((acc, i) => acc + i.quantity, 0),
      inv.subtotal,
      inv.deliveryFee,
      inv.discount,
      inv.advancePaid,
      inv.codAmount,
      `"${inv.paymentStatus}"`,
      `"${inv.orderStatus}"`,
      `"${inv.reviewStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `VELLURE_Invoices_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // 3. Restore data from a selected JSON backup file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setRestoreSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.data) {
          throw new Error('Invalid backup file format: missing "data" key.');
        }

        onRestoreData(parsed.data);
        setRestoreSuccess(true);
        setTimeout(() => {
          setRestoreSuccess(false);
          onClose();
        }, 1500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to read backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-luxury font-bold text-neutral-100">
                Business Data Backup & Export Hub
              </h2>
              <p className="text-[11px] text-neutral-400">
                Secure your orders, formulas, expenses and customers
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

        {restoreSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center space-x-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সফলভাবে ডাটাবেজ রিস্টোর করা হয়েছে (Data Restored Successfully)!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-2 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action 1: Download full business backup JSON */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Full System Database Backup (JSON)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              Instant
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            সবগুলো ইনভয়েস, পারফিউম ফর্মুলা, স্টক ব্যালেন্স, খরচ এবং ইউজার পারমিশন সুরক্ষিত ফাইলে সেভ করুন।
          </p>
          <button
            onClick={handleDownloadJsonBackup}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Business Data (.JSON)</span>
          </button>
        </div>

        {/* Action 2: Export Invoices to Excel CSV */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Invoices to Excel Spreadsheet (CSV)</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {invoices.length} Consignments
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            অ্যাকাউন্টিং ও অডিটের জন্য সকল ইনভয়েস ও কাস্টমার ডেলিভারি এক্সেল বা স্প্রেডশিটে এক্সপোর্ট করুন।
          </p>
          <button
            onClick={handleExportInvoicesCsv}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-100 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-950/40"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Invoices to Excel (.CSV)</span>
          </button>
        </div>

        {/* Action 3: Restore Database from File */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-200">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Restore / Recover Data from Backup</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            পূর্বে ডাউনলোড করা ব্যাকআপ ফাইল নির্বাচন করে সমস্ত ডাটা রিস্টোর করুন।
          </p>
          <label className="w-full mt-2 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium flex items-center justify-center space-x-2 cursor-pointer transition-all">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Select .JSON Backup File to Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-[10px] text-neutral-500 text-center font-mono">
          VELLURE Enterprise Data Safe Protection • All changes save locally in real-time
        </div>
      </div>
    </div>
  );
};
