import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Plus,
  Landmark,
  ShieldCheck,
  Building,
  CreditCard,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Invoice, RawMaterialInvoice, OperatingExpense, AssetCategory } from '../../types';
import { formatBDT } from '../../utils/formatters';

interface FinancialOverviewProps {
  invoices: Invoice[];
  buyingInvoices: RawMaterialInvoice[];
  operatingExpenses: OperatingExpense[];
  assetBreakdown: AssetCategory[];
  onAddOperatingExpense: (expense: OperatingExpense) => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  invoices,
  buyingInvoices,
  operatingExpenses,
  assetBreakdown,
  onAddOperatingExpense,
}) => {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // New expense form state
  const [expCategory, setExpCategory] = useState<OperatingExpense['category']>('Packaging & Boxes');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState(15000);
  const [expDate, setExpDate] = useState('2026-09-25');
  const [expPaidVia, setExpPaidVia] = useState('bKash Merchant');
  const [expApprovedBy, setExpApprovedBy] = useState('Md. Abdul Hannan');

  // Aggregated totals
  const totalSalesRevenue = invoices.reduce((acc, i) => acc + (i.subtotal - i.discount), 0);
  const totalSourcingExpenses = buyingInvoices.reduce((acc, b) => acc + b.netPayable, 0);
  const totalOperatingCosts = operatingExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalExpenses = totalSourcingExpenses + totalOperatingCosts;
  const netProfit = totalSalesRevenue - totalExpenses;
  const grossProfit = totalSalesRevenue - totalSourcingExpenses;
  const isProfitable = netProfit >= 0;

  // Assets total
  const totalAssetsValue = assetBreakdown.reduce((acc, a) => acc + a.estimatedValue, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) return;

    const newExpense: OperatingExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date: expDate,
      category: expCategory,
      description: expDescription,
      amount: expAmount,
      paidVia: expPaidVia,
      approvedBy: expApprovedBy,
    };

    onAddOperatingExpense(newExpense);
    setShowAddExpenseModal(false);
    setExpDescription('');
    setExpAmount(15000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 5
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Financial Overview (P&L & Assets)</span>
                <DollarSign className="w-5 h-5 text-amber-400 inline" />
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Enterprise financial accounting health check. Real-time Profit & Loss balance indicator, total sales revenue, raw material sourcing costs, operating expenses, and asset valuation.
            </p>
          </div>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Log Operating Expense</span>
          </button>
        </div>
      </div>

      {/* Real-Time P&L Balance Indicator Card */}
      <div className="bg-neutral-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                Net Profit & Loss Real-Time Balance
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                  isProfitable
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-400 border-red-500/30'
                }`}
              >
                {isProfitable ? 'Healthy Operating Margin' : 'Capital Sourcing Phase'}
              </span>
            </div>

            <div className="flex items-baseline space-x-3 mt-2">
              <div
                className={`text-3xl sm:text-4xl font-bold font-mono ${
                  isProfitable ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {formatBDT(netProfit)}
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Net Balance (BDT)
              </span>
            </div>
          </div>

          {/* Quick Metrics Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">Total Sales</span>
              <span className="text-base font-bold text-neutral-100 mt-0.5 block">
                {formatBDT(totalSalesRevenue)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">Sourcing Costs</span>
              <span className="text-base font-bold text-red-400 mt-0.5 block">
                -{formatBDT(totalSourcingExpenses)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">Operating Opex</span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">
                -{formatBDT(totalOperatingCosts)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">Total Assets</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                {formatBDT(totalAssetsValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Revenue & Expense Bar */}
        <div className="mt-6 pt-5 border-t border-neutral-800 space-y-2">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>
              Revenue Generated: <strong className="text-neutral-100">{formatBDT(totalSalesRevenue)}</strong>
            </span>
            <span>
              Total Capital Invested & Opex: <strong className="text-amber-400">{formatBDT(totalExpenses)}</strong>
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-neutral-950 overflow-hidden flex">
            <div style={{ width: '42%' }} className="bg-emerald-500" title="Sales Inflow" />
            <div style={{ width: '40%' }} className="bg-amber-600" title="Raw Material Sourcing" />
            <div style={{ width: '18%' }} className="bg-neutral-600" title="Operating Overhead" />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Sales Inflow
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" /> Sourcing Materials (Oud, Rose, Bottles)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neutral-600 inline-block" /> Operating Costs & Payroll
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Total Assets Breakdown & Operating Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Total Assets Breakdown */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-neutral-200">
                Total Assets Valuation Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {formatBDT(totalAssetsValue)}
            </span>
          </div>

          <div className="space-y-3">
            {assetBreakdown.map((asset, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-neutral-200 text-xs">
                      {asset.categoryName}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {asset.description}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-neutral-100 text-sm">
                    {formatBDT(asset.estimatedValue)}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 italic border-t border-neutral-800/60 pt-1.5">
                  {asset.details}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Operating Cost Logs */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-neutral-200">
                Operating Cost Logs ({operatingExpenses.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">
              {formatBDT(totalOperatingCosts)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category & Details</th>
                  <th className="py-2.5 px-3">Approved By</th>
                  <th className="py-2.5 px-3 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {operatingExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-800/30">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-400">
                      {exp.date}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-200">{exp.category}</div>
                      <div className="text-[11px] text-neutral-400">{exp.description}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-neutral-400">
                      {exp.approvedBy}
                      <span className="block text-[10px] text-neutral-500 font-mono">
                        via {exp.paidVia}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-100">
                      {formatBDT(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Operating Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Log Operating Expense
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Expense Category *</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  >
                    <option value="Rent & Distillation Lab">Rent & Distillation Lab</option>
                    <option value="Packaging & Boxes">Packaging & Boxes</option>
                    <option value="Thermal Paper Rolls">Thermal Paper Rolls (Rongta)</option>
                    <option value="Courier Shipping Charges">Courier Shipping Charges</option>
                    <option value="Staff Salaries">Staff Salaries & Labor</option>
                    <option value="Digital Ads & Marketing">Digital Ads & Marketing</option>
                    <option value="Utilities & Glass Cleaning">Utilities & Glass Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description / Bill Memo *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 rolls Rongta 3x2 direct thermal labels for courier dispatch"
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={expPaidVia}
                    onChange={(e) => setExpPaidVia(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Approved By</label>
                <input
                  type="text"
                  value={expApprovedBy}
                  onChange={(e) => setExpApprovedBy(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Save Operating Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
