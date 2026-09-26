import React, { useState, useMemo } from 'react';
import {
  Printer,
  Settings,
  CheckCircle2,
  Package,
  Layers,
  Sliders,
  Sparkles,
  Truck,
  RotateCcw,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Invoice } from '../../types';
import { BRAND_DETAILS } from '../../data/initialData';
import { formatBDT, getCourierTrackingUrl } from '../../utils/formatters';
import { SvgBarcode } from '../SvgBarcode';
import { SvgQrCode } from '../SvgQrCode';

interface CourierThermalPrinterProps {
  invoices: Invoice[];
  initialSelectedId?: string;
  onMarkPrinted: (invoiceId: string) => void;
}

export const CourierThermalPrinter: React.FC<CourierThermalPrinterProps> = ({
  invoices,
  initialSelectedId,
  onMarkPrinted,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'3x2' | '4x6' | '80mm'>('3x2');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialSelectedId || (invoices[0]?.id ?? '')
  );
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [selectedForBatch, setSelectedForBatch] = useState<string[]>(
    invoices.filter(i => !i.thermalPrinted).map(i => i.id)
  );

  // Selected single invoice
  const currentInvoice = useMemo(() => {
    return invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];
  }, [invoices, selectedInvoiceId]);

  // Batch invoices list
  const batchInvoices = useMemo(() => {
    return invoices.filter((i) => selectedForBatch.includes(i.id));
  }, [invoices, selectedForBatch]);

  const handlePrint = () => {
    if (batchMode) {
      batchInvoices.forEach(i => onMarkPrinted(i.id));
    } else if (currentInvoice) {
      onMarkPrinted(currentInvoice.id);
    }
    window.print();
  };

  const handleToggleBatchItem = (id: string) => {
    setSelectedForBatch((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Render a single high-contrast thermal sticker label
  const renderThermalLabel = (inv: Invoice, format: '3x2' | '4x6' | '80mm') => {
    const isPrepaid = inv.codAmount === 0;

    if (format === '3x2') {
      // 3" x 2" (approx 76mm x 50mm) compact Rongta standard sticker
      return (
        <div
          key={inv.id}
          className="w-[320px] h-[210px] bg-white text-black p-3 font-sans border-2 border-black flex flex-col justify-between select-none mx-auto my-2 rounded-sm shadow-sm print:shadow-none print:m-0 print:border-black"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {/* Top Bar: Merchant + Courier */}
          <div className="flex justify-between items-center border-b-2 border-black pb-1">
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase">
                {BRAND_DETAILS.name}
              </span>
              <span className="text-[9px] font-semibold text-gray-700 block">
                {BRAND_DETAILS.mobile} • Sreemangal
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase bg-black text-white px-1.5 py-0.5 rounded-xs">
                {inv.courierPartner.replace(' Courier', '')}
              </span>
            </div>
          </div>

          {/* Barcode section */}
          <div className="py-0.5 flex flex-col items-center">
            <SvgBarcode value={inv.trackingId} height={36} showText={true} />
          </div>

          {/* Consignee Address */}
          <div className="border-t border-b border-black py-1 leading-tight">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black truncate max-w-[190px]">
                {inv.customerName}
              </span>
              <span className="text-xs font-mono font-black tracking-tight">
                {inv.customerPhone}
              </span>
            </div>
            <div className="text-[10px] font-medium leading-snug line-clamp-2 mt-0.5">
              {inv.deliveryAddress}, <strong className="uppercase">{inv.district}</strong>
            </div>
          </div>

          {/* Bottom Bar: COD / PREPAID & Warning */}
          <div className="flex justify-between items-center pt-0.5">
            <div className="text-[8px] font-extrabold uppercase tracking-tight text-gray-800">
              FRAGILE GLASS • HANDLE WITH CARE
            </div>
            <div
              className={`px-2 py-0.5 text-xs font-black font-mono border-2 border-black ${
                isPrepaid ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              {isPrepaid ? 'PREPAID ৳0' : `COD: ${formatBDT(inv.codAmount)}`}
            </div>
          </div>
        </div>
      );
    }

    if (format === '4x6') {
      // 4" x 6" (100mm x 150mm) Standard Full Courier Consignment Label
      return (
        <div
          key={inv.id}
          className="w-[360px] h-[520px] bg-white text-black p-4 font-sans border-4 border-black flex flex-col justify-between select-none mx-auto my-3 rounded-sm shadow-md print:shadow-none print:m-0 print:border-black"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {/* Header */}
          <div className="border-b-4 border-black pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-widest uppercase">
                  {BRAND_DETAILS.name}
                </h2>
                <div className="text-[11px] font-bold text-gray-800">
                  Luxury Fragrances & Attar Distillers
                </div>
                <div className="text-[10px] font-medium text-gray-700">
                  {BRAND_DETAILS.address} • Tel: {BRAND_DETAILS.mobile}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black uppercase bg-black text-white px-2 py-1 inline-block">
                  {inv.courierPartner}
                </span>
                <div className="text-[10px] font-mono mt-1 font-bold">
                  Date: {inv.date}
                </div>
              </div>
            </div>
          </div>

          {/* Large Tracking Barcode */}
          <div className="py-2 text-center flex flex-col items-center">
            <SvgBarcode value={inv.trackingId} height={60} showText={true} />
            <div className="text-[11px] font-mono font-black mt-1">
              CONSIGNMENT: {inv.courierConsignmentId || inv.trackingId}
            </div>
          </div>

          {/* Recipient Box */}
          <div className="border-2 border-black p-2.5 my-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-600 block mb-0.5">
              DELIVER TO CUSTOMER:
            </span>
            <div className="text-base font-black uppercase">{inv.customerName}</div>
            <div className="text-lg font-mono font-black tracking-wider my-0.5">
              📞 {inv.customerPhone}
            </div>
            <div className="text-xs font-semibold mt-1 leading-snug">
              {inv.deliveryAddress}
            </div>
            <div className="text-sm font-black uppercase mt-1">
              Thana: {inv.thana || 'N/A'} • District: {inv.district}
            </div>
          </div>

          {/* Prominent COD Amount Box */}
          <div className="border-4 border-black p-3 text-center my-1 bg-gray-50">
            <span className="text-xs font-black uppercase tracking-wider block">
              {isPrepaid ? 'PAYMENT STATUS: FULLY PREPAID' : 'CASH ON DELIVERY (COD) COLLECTION'}
            </span>
            <div className="text-3xl font-mono font-black tracking-tight mt-0.5">
              {isPrepaid ? '৳ 0.00 (DO NOT COLLECT)' : formatBDT(inv.codAmount)}
            </div>
          </div>

          {/* Contents & QR */}
          <div className="flex justify-between items-center border-t-2 border-black pt-2">
            <div className="max-w-[240px]">
              <div className="text-[10px] font-bold uppercase">Package Contents:</div>
              <div className="text-[10px] truncate font-medium">
                {inv.items.map(i => `${i.productName} (${i.size})`).join(', ')}
              </div>
              <div className="text-[9px] font-bold text-red-600 uppercase mt-0.5">
                ⚠ FRAGILE ARTISANAL GLASS FLACONS • KEEP UPRIGHT
              </div>
            </div>
            <div>
              <SvgQrCode value={getCourierTrackingUrl(inv.courierPartner, inv.trackingId)} size={54} />
            </div>
          </div>
        </div>
      );
    }

    // 80mm POS Roll Format
    return (
      <div
        key={inv.id}
        className="w-[280px] bg-white text-black p-3 font-mono border border-black flex flex-col justify-between select-none mx-auto my-2 text-[11px] shadow-sm print:shadow-none print:m-0"
      >
        <div className="text-center border-b border-black pb-1 mb-2">
          <div className="font-black text-sm uppercase">{BRAND_DETAILS.name}</div>
          <div className="text-[9px]">{BRAND_DETAILS.mobile}</div>
          <div className="text-[9px] uppercase font-bold mt-1 bg-black text-white px-1">
            {inv.courierPartner}
          </div>
        </div>

        <div className="flex flex-col items-center my-1">
          <SvgBarcode value={inv.trackingId} height={36} showText={true} />
        </div>

        <div className="border-t border-b border-black py-1 my-1">
          <div className="font-bold text-xs">{inv.customerName}</div>
          <div className="font-bold text-sm">{inv.customerPhone}</div>
          <div className="text-[10px] leading-tight mt-0.5">{inv.deliveryAddress}, {inv.district}</div>
        </div>

        <div className="text-center font-bold text-base my-1 border border-black p-1">
          {isPrepaid ? 'PREPAID - ৳0' : `COD: ${formatBDT(inv.codAmount)}`}
        </div>

        <div className="text-[8px] text-center uppercase tracking-tight mt-1">
          *** FRAGILE GLASS PERFUME ***
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="no-print bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 7
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Courier Sticker Thermal Printer Engine</span>
                <Printer className="w-5 h-5 text-amber-400 inline" />
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Engineered for Rongta Thermal POS & Universal thermal label printers (3"x2", 4"x6", 80mm). Pure vector barcode and customer address auto-formatting for crisp 203/300 DPI adhesive roll output.
            </p>
          </div>

          {/* Print Trigger Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-xl shadow-amber-950/50"
            >
              <Printer className="w-4 h-4" />
              <span>
                {batchMode ? `Batch Print (${selectedForBatch.length} Stickers)` : 'Print Thermal Sticker'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Printer Configuration Ribbon */}
      <div className="no-print bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Label Format Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-neutral-400 font-medium">Sticky Roll Format:</span>
          {(['3x2', '4x6', '80mm'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                selectedFormat === fmt
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {fmt === '3x2' ? '3" x 2" (Rongta Standard)' : fmt === '4x6' ? '4" x 6" (Courier A6)' : '80mm POS Roll'}
            </button>
          ))}
        </div>

        {/* Mode Toggle: Single vs Batch */}
        <div className="flex items-center space-x-2">
          <span className="text-neutral-400 font-medium">Print Mode:</span>
          <button
            onClick={() => setBatchMode(false)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              !batchMode
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            Single Label
          </button>
          <button
            onClick={() => setBatchMode(true)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              batchMode
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            Batch Stream Queue ({selectedForBatch.length})
          </button>
        </div>
      </div>

      {/* Main Thermal Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Order Picker or Batch Selection (Hidden in Print) */}
        <div className="no-print space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
            <span>{batchMode ? 'Select Invoices for Batch Print' : 'Select Invoice to Print'}</span>
            {batchMode && (
              <button
                onClick={() => {
                  if (selectedForBatch.length === invoices.length) {
                    setSelectedForBatch([]);
                  } else {
                    setSelectedForBatch(invoices.map((i) => i.id));
                  }
                }}
                className="text-[10px] text-amber-400 hover:underline"
              >
                {selectedForBatch.length === invoices.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {invoices.map((inv) => {
              const isSelected = batchMode
                ? selectedForBatch.includes(inv.id)
                : selectedInvoiceId === inv.id;

              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    if (batchMode) {
                      handleToggleBatchItem(inv.id);
                    } else {
                      setSelectedInvoiceId(inv.id);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50'
                      : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {batchMode && (
                        <input
                          type="checkbox"
                          checked={selectedForBatch.includes(inv.id)}
                          onChange={() => {}}
                          className="rounded text-amber-500 focus:ring-0"
                        />
                      )}
                      <div>
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {inv.trackingId}
                        </span>
                        <h4 className="font-semibold text-neutral-100 text-xs mt-0.5">
                          {inv.customerName}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        inv.thermalPrinted
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-amber-500/20 text-amber-300 font-bold'
                      }`}
                    >
                      {inv.thermalPrinted ? 'Printed' : 'Unprinted'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>{inv.courierPartner.replace(' Courier', '')}</span>
                    <span className="text-neutral-200 font-bold">
                      COD: {formatBDT(inv.codAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Live Thermal Sticker Preview / Print Container */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="no-print flex justify-between items-center border-b border-neutral-800 pb-3 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="font-semibold text-neutral-200">
                  {batchMode
                    ? `Live Continuous Thermal Batch Preview (${selectedForBatch.length} Stickers)`
                    : `Live Thermal Label Preview: ${currentInvoice?.trackingId || ''}`}
                </span>
              </div>
              <span className="text-neutral-500 font-mono text-[10px]">
                203/300 DPI Monochrome Ready
              </span>
            </div>

            {/* Printable Container */}
            <div className="print-container bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 flex flex-col items-center overflow-auto max-h-[620px]">
              {batchMode ? (
                batchInvoices.length > 0 ? (
                  batchInvoices.map((inv) => renderThermalLabel(inv, selectedFormat))
                ) : (
                  <div className="text-neutral-500 text-xs py-10">
                    No orders selected for batch thermal printing.
                  </div>
                )
              ) : currentInvoice ? (
                renderThermalLabel(currentInvoice, selectedFormat)
              ) : (
                <div className="text-neutral-500 text-xs py-10">
                  No invoice selected.
                </div>
              )}
            </div>

            {/* Print Help Note */}
            <div className="no-print mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>
                💡 Printer Settings: Select paper size corresponding to <strong>{selectedFormat}</strong> and Margins: <strong>None</strong> for 100% margin alignment.
              </span>
              <button
                onClick={handlePrint}
                className="text-amber-400 hover:underline font-bold"
              >
                Send to Printer Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
