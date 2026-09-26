import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Search,
  FileText,
  Eye,
  Send,
  Printer,
  X,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  DollarSign,
  Package,
  BarChart3,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { Invoice } from '../../types';
import { formatBDT, buildWhatsAppLink, getCourierTrackingUrl } from '../../utils/formatters';
import { BRAND_DETAILS } from '../../data/initialData';
import { SvgBarcode } from '../SvgBarcode';
import { SvgQrCode } from '../SvgQrCode';
import { VELLURE_LOGO } from '../../assets/logo';

interface CustomerHistoryAnalyticsProps {
  invoices: Invoice[];
  onOpenThermalPrinter: (invoiceId: string) => void;
  onOpenThankYouCard: (invoice: Invoice) => void;
}

export interface DailyRevenueItem {
  dayNumber: number;
  dayLabel: string;
  formattedDate: string;
  date: string;
  revenue: number;
  orders: number;
  cod: number;
  advance: number;
}

export const CustomerHistoryAnalytics: React.FC<CustomerHistoryAnalyticsProps> = ({
  invoices,
  onOpenThermalPrinter,
  onOpenThankYouCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<'today' | '7days' | 'month' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'active_days' | 'full_month'>('active_days');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Current month daily revenue aggregation for Recharts bar chart
  const currentMonthAnalytics = useMemo<{
    monthName: string;
    year: number;
    monthKey: string;
    fullMonthData: DailyRevenueItem[];
    activeDaysData: DailyRevenueItem[];
    totalMonthRevenue: number;
    totalMonthOrders: number;
    activeDaysCount: number;
    avgDailyRevenue: number;
    peakDay: DailyRevenueItem | null;
  }>(() => {
    // Reference month key: e.g. "2026-09"
    const latestDate = invoices.length > 0
      ? invoices.map((i) => i.date).filter(Boolean).sort().reverse()[0] || '2026-09-25'
      : '2026-09-25';
    const monthKey = latestDate.slice(0, 7); // "2026-09"
    const [yearStr, monthNumStr] = monthKey.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthNumStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1] || 'September';

    // Daily breakdown map
    const dailyMap: {
      [dayNumber: number]: {
        revenue: number;
        orders: number;
        cod: number;
        advance: number;
        date: string;
      };
    } = {};

    invoices.forEach((inv) => {
      if (inv.date && inv.date.startsWith(monthKey)) {
        const parts = inv.date.split('-');
        const day = parseInt(parts[2], 10);
        if (!dailyMap[day]) {
          dailyMap[day] = { revenue: 0, orders: 0, cod: 0, advance: 0, date: inv.date };
        }
        dailyMap[day].revenue += inv.subtotal;
        dailyMap[day].orders += 1;
        dailyMap[day].cod += inv.codAmount;
        dailyMap[day].advance += inv.advancePaid;
      }
    });

    const fullMonthData: DailyRevenueItem[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayData = dailyMap[d] || {
        revenue: 0,
        orders: 0,
        cod: 0,
        advance: 0,
        date: `${monthKey}-${String(d).padStart(2, '0')}`,
      };
      fullMonthData.push({
        dayNumber: d,
        dayLabel: `${d} ${monthName.slice(0, 3)}`,
        formattedDate: `${monthName.slice(0, 3)} ${d}, ${year}`,
        date: dayData.date,
        revenue: dayData.revenue,
        orders: dayData.orders,
        cod: dayData.cod,
        advance: dayData.advance,
      });
    }

    const activeDaysData = fullMonthData.filter((d) => d.orders > 0);
    const totalMonthRevenue = fullMonthData.reduce((sum, d) => sum + d.revenue, 0);
    const totalMonthOrders = fullMonthData.reduce((sum, d) => sum + d.orders, 0);
    const activeDaysCount = activeDaysData.length;
    const avgDailyRevenue = activeDaysCount > 0 ? Math.round(totalMonthRevenue / activeDaysCount) : 0;

    let peakDay: DailyRevenueItem | null = null;
    activeDaysData.forEach((d) => {
      if (!peakDay || d.revenue > peakDay.revenue) {
        peakDay = d;
      }
    });

    return {
      monthName,
      year,
      monthKey,
      fullMonthData,
      activeDaysData,
      totalMonthRevenue,
      totalMonthOrders,
      activeDaysCount,
      avgDailyRevenue,
      peakDay,
    };
  }, [invoices]);

  // Filter invoices based on date range, search term, status, and chart day selection
  const filteredInvoices = useMemo(() => {
    const todayStr = '2026-09-25'; // Simulated reference date matching metadata
    
    return invoices.filter((inv) => {
      // Specific day clicked from Recharts bar
      if (selectedDayFilter && inv.date !== selectedDayFilter) {
        return false;
      }

      // Search match: Customer name, phone, tracking ID, invoice ID, district
      const matchesSearch =
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerPhone.includes(searchTerm) ||
        inv.district.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== 'all' && inv.orderStatus !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateRangeFilter === 'today') {
        return inv.date === todayStr;
      }
      if (dateRangeFilter === '7days') {
        const invDate = new Date(inv.date);
        const diffDays = (new Date(todayStr).getTime() - invDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (dateRangeFilter === 'month') {
        return inv.date.startsWith('2026-09');
      }

      return true;
    });
  }, [invoices, searchTerm, dateRangeFilter, statusFilter, selectedDayFilter]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const todayStr = '2026-09-25';
    const todayInvs = invoices.filter(i => i.date === todayStr);
    const weeklyInvs = invoices.filter(i => {
      const diff = (new Date(todayStr).getTime() - new Date(i.date).getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 7;
    });
    const monthlyInvs = invoices.filter(i => i.date.startsWith('2026-09'));

    const todaySales = todayInvs.reduce((acc, i) => acc + i.subtotal, 0);
    const weeklySales = weeklyInvs.reduce((acc, i) => acc + i.subtotal, 0);
    const monthlySales = monthlyInvs.reduce((acc, i) => acc + i.subtotal, 0);

    const totalCodPending = invoices
      .filter(i => i.orderStatus !== 'Delivered' && i.orderStatus !== 'Cancelled')
      .reduce((acc, i) => acc + i.codAmount, 0);

    return {
      todaySales,
      todayCount: todayInvs.length,
      weeklySales,
      weeklyCount: weeklyInvs.length,
      monthlySales,
      monthlyCount: monthlyInvs.length,
      totalCodPending,
      totalOrders: invoices.length,
    };
  }, [invoices]);

  const handlePrintModal = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 2
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100">
                Customer History & Sales Analytics
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Real-time perfumery revenue logs, sales timeline filters, instant customer & tracking ID lookup, and quick-view luxury invoice inspection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400/90 font-mono bg-neutral-950/70 border border-neutral-800 px-3 py-1.5 rounded-xl">
              Reference Date: Sep 25, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Sales Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Today Sales
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {formatBDT(metrics.todaySales)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            <span>{metrics.todayCount} Dispatched Orders</span>
            <span className="text-emerald-400 font-medium">Live sync</span>
          </div>
        </div>

        {/* Weekly Sales */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Weekly Sales (7D)
              </span>
              <div className="text-2xl font-bold font-mono text-neutral-100 mt-1">
                {formatBDT(metrics.weeklySales)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-300">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            <span>{metrics.weeklyCount} Consignments</span>
            <span className="text-amber-400 font-mono font-medium">Rolling 7 days</span>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Monthly Sales (Sep)
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatBDT(metrics.monthlySales)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            <span>{metrics.monthlyCount} Total Orders</span>
            <span className="text-emerald-400 font-medium">+18.4% MoM</span>
          </div>
        </div>

        {/* COD Pending Remittance */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                COD In-Transit Recovery
              </span>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                {formatBDT(metrics.totalCodPending)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            <span>Steadfast & Pathao</span>
            <span className="text-neutral-400">Dispatched balance</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart: Daily Revenue Trends for Current Month */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-950/40 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100">
                  দৈনিক বিক্রয় ও রাজস্ব ট্রেন্ড (Daily Revenue Trends)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {currentMonthAnalytics.monthName} {currentMonthAnalytics.year}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Current month revenue curve, daily order density & peak dispatch analysis
              </p>
            </div>
          </div>

          {/* Quick Filters / Toggles */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {selectedDayFilter && (
              <button
                onClick={() => setSelectedDayFilter(null)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono transition-all hover:bg-amber-500/30"
                title="Clear day filter"
              >
                <span>Filter: {selectedDayFilter}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 text-xs font-medium">
              <button
                onClick={() => setChartViewMode('active_days')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartViewMode === 'active_days'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Active Days ({currentMonthAnalytics.activeDaysCount})
              </button>
              <button
                onClick={() => setChartViewMode('full_month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartViewMode === 'full_month'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Full Month (1–30)
              </button>
            </div>
          </div>
        </div>

        {/* Top Mini-KPI Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Month-to-Date Revenue</span>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              {formatBDT(currentMonthAnalytics.totalMonthRevenue)}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {currentMonthAnalytics.totalMonthOrders} Consignments
            </div>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Daily Average (Active)</span>
            <div className="text-base font-bold font-mono text-neutral-200 mt-0.5">
              {formatBDT(currentMonthAnalytics.avgDailyRevenue)}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Across {currentMonthAnalytics.activeDaysCount} sales days
            </div>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Peak Revenue Day</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              {currentMonthAnalytics.peakDay ? formatBDT(currentMonthAnalytics.peakDay.revenue) : '৳0'}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
              {currentMonthAnalytics.peakDay ? currentMonthAnalytics.peakDay.formattedDate : 'None'}
            </div>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Interactive Selection</span>
            <div className="text-xs font-semibold text-amber-300 mt-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Click Any Bar</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Filters table by selected date
            </div>
          </div>
        </div>

        {/* Recharts Chart Canvas */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={
                chartViewMode === 'active_days'
                  ? currentMonthAnalytics.activeDaysData
                  : currentMonthAnalytics.fullMonthData
              }
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setActiveBarIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveBarIndex(null)}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clickedDay = state.activePayload[0].payload;
                  if (clickedDay && clickedDay.date) {
                    setSelectedDayFilter((prev) => (prev === clickedDay.date ? null : clickedDay.date));
                  }
                }
              }}
            >
              <defs>
                <linearGradient id="barGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#b45309" stopOpacity={0.65} />
                </linearGradient>
                <linearGradient id="barActiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde047" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="barSelectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                stroke="#737373"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#333333' }}
                interval={chartViewMode === 'full_month' ? 'preserveStartEnd' : 0}
              />
              <YAxis
                stroke="#737373"
                fontSize={10}
                width={44}
                tickLine={false}
                axisLine={{ stroke: '#333333' }}
                tickFormatter={(val) => `৳${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-neutral-900/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[210px]">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-1 font-mono text-[11px] text-amber-400 font-semibold">
                          <span>📅 {data.formattedDate}</span>
                          <span className="text-neutral-400">
                            {data.orders} {data.orders === 1 ? 'Order' : 'Orders'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-200">
                          <span className="text-neutral-400">Total Revenue:</span>
                          <span className="font-bold font-mono text-amber-300 text-sm">
                            {formatBDT(data.revenue)}
                          </span>
                        </div>
                        {data.cod > 0 && (
                          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                            <span>COD Receivable:</span>
                            <span className="font-mono text-neutral-300">{formatBDT(data.cod)}</span>
                          </div>
                        )}
                        {data.advance > 0 && (
                          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                            <span>Prepaid / Advance:</span>
                            <span className="font-mono text-emerald-400">{formatBDT(data.advance)}</span>
                          </div>
                        )}
                        {data.orders > 0 && (
                          <div className="flex items-center justify-between text-neutral-500 text-[10px] pt-1 border-t border-neutral-800">
                            <span>Avg Order Value (AOV):</span>
                            <span className="font-mono text-neutral-300">
                              {formatBDT(Math.round(data.revenue / data.orders))}
                            </span>
                          </div>
                        )}
                        <div className="text-[10px] text-amber-400/80 italic pt-0.5 text-center">
                          💡 Click bar to filter table below
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48} cursor="pointer">
                {(chartViewMode === 'active_days'
                  ? currentMonthAnalytics.activeDaysData
                  : currentMonthAnalytics.fullMonthData
                ).map((entry, idx) => {
                  const isSelected = selectedDayFilter === entry.date;
                  const isHovered = activeBarIndex === idx;
                  return (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        isSelected
                          ? 'url(#barSelectedGrad)'
                          : isHovered
                          ? 'url(#barActiveGrad)'
                          : 'url(#barGoldGrad)'
                      }
                      stroke={isSelected ? '#34d399' : isHovered ? '#fef08a' : '#d97706'}
                      strokeWidth={isSelected || isHovered ? 1.5 : 0.5}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters & Instant Search Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Instant Search input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Customer name, Tracking ID (e.g. ST-BD-), Phone, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick Date Range Filters */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setDateRangeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRangeFilter === 'all'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRangeFilter('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRangeFilter === 'today'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRangeFilter('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRangeFilter === '7days'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRangeFilter('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRangeFilter === 'month'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              September 2026
            </button>

            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Invoices & Ledger Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Customer Orders & Consignments ({filteredInvoices.length})</span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Click any Tracking ID or Customer for Invoice Quick-View
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-neutral-950 text-neutral-400 font-medium uppercase tracking-wider text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Tracking ID & Courier</th>
                <th className="py-3 px-4">Customer Name & Phone</th>
                <th className="py-3 px-4">Perfumes Ordered</th>
                <th className="py-3 px-4">District / City</th>
                <th className="py-3 px-4">Financials</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-amber-400 hover:underline flex items-center gap-1.5">
                      <span>{inv.trackingId}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-neutral-500" />
                      <span>{inv.courierPartner}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-200 group-hover:text-amber-300 transition-colors">
                      {inv.customerName}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {inv.customerPhone}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate text-neutral-200 font-medium">
                      {inv.items.map(i => `${i.productName} (${i.size})`).join(', ')}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {inv.items.reduce((acc, i) => acc + i.quantity, 0)} item(s) • Inv: {inv.id}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-200">{inv.district}</div>
                    <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">
                      {inv.deliveryAddress}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="text-neutral-100 font-bold">{formatBDT(inv.subtotal)}</div>
                    <div className="text-[10px] text-neutral-400">
                      COD: <span className="text-amber-400">{formatBDT(inv.codAmount)}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        inv.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : inv.orderStatus === 'In Transit'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : inv.orderStatus === 'Dispatched'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      {inv.orderStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        title="Invoice Quick-View Modal"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenThermalPrinter(inv.id)}
                        title="Thermal Sticker Label"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Quick-View Modal via Tracking ID */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 no-print">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                  {selectedInvoice.trackingId}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedInvoice.courierPartner}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={buildWhatsAppLink(
                    selectedInvoice.customerPhone,
                    `Assalamu Alaikum ${selectedInvoice.customerName}, VELLURE order #${selectedInvoice.id} tracking: ${getCourierTrackingUrl(selectedInvoice.courierPartner, selectedInvoice.trackingId)}. Total COD: ${formatBDT(selectedInvoice.codAmount)}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 text-xs font-medium"
                >
                  <Send className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handlePrintModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Luxury Invoice Container */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6 print-container">
              {/* Brand Top Header */}
              <div className="flex justify-between items-start border-b border-neutral-800/80 pb-5">
                <div className="flex items-start space-x-3.5">
                  <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-amber-500/50 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                    <img
                      src={VELLURE_LOGO}
                      alt="VELLURE Luxury Logo"
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-amber-300">
                      {BRAND_DETAILS.name}
                    </h2>
                    <p className="text-[11px] text-amber-400/80 tracking-widest uppercase">
                      {BRAND_DETAILS.tagline}
                    </p>
                    <div className="text-[10px] text-neutral-400 mt-2 space-y-0.5">
                      <div>{BRAND_DETAILS.address}</div>
                      <div>Email: {BRAND_DETAILS.email}</div>
                      <div>Hotline / WhatsApp: {BRAND_DETAILS.whatsapp}</div>
                      <div>Web: {BRAND_DETAILS.website}</div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-bold text-neutral-100">
                    INVOICE
                  </div>
                  <div className="text-xs font-mono text-amber-400 font-semibold mt-0.5">
                    {selectedInvoice.id}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-2">
                    Date: {selectedInvoice.date} • {selectedInvoice.time}
                  </div>
                  <div className="mt-2 inline-block">
                    <SvgQrCode value={getCourierTrackingUrl(selectedInvoice.courierPartner, selectedInvoice.trackingId)} size={52} />
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Customer Delivery Consignee:
                  </span>
                  <div className="font-bold text-neutral-100 text-sm">
                    {selectedInvoice.customerName}
                  </div>
                  <div className="font-mono text-amber-400 mt-0.5">
                    {selectedInvoice.customerPhone}
                  </div>
                  <div className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                    {selectedInvoice.deliveryAddress}, {selectedInvoice.district}
                  </div>
                </div>

                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Courier Dispatch Details:
                  </span>
                  <div className="text-neutral-200 font-semibold">
                    {selectedInvoice.courierPartner}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 mt-0.5">
                    Tracking: {selectedInvoice.trackingId}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Payment Method: {selectedInvoice.paymentMethod}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                    Status: {selectedInvoice.orderStatus}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Fragrance Item</th>
                      <th className="py-2.5 px-3 text-center">Type / Size</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-200 font-medium">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-neutral-100">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-3 text-center text-neutral-400 font-mono text-[11px]">
                          {item.size} • {item.type}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatBDT(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                          {formatBDT(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
                <div className="max-w-xs space-y-2">
                  <div className="text-[10px] text-neutral-400 italic">
                    Special Packaging Note: {selectedInvoice.notes || 'Handle with extreme care. Glass bottles & pure oils.'}
                  </div>
                  {/* Barcode representation */}
                  <div className="pt-2">
                    <SvgBarcode value={selectedInvoice.trackingId} height={40} showText={true} />
                  </div>
                </div>

                <div className="w-full sm:w-64 bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Products Subtotal:</span>
                    <span className="text-neutral-200">{formatBDT(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Fee:</span>
                    <span className="text-neutral-200">{formatBDT(selectedInvoice.deliveryFee)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>VIP Privilege Discount:</span>
                      <span>-{formatBDT(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  {selectedInvoice.advancePaid > 0 && (
                    <div className="flex justify-between text-blue-400">
                      <span>Advance Received:</span>
                      <span>-{formatBDT(selectedInvoice.advancePaid)}</span>
                    </div>
                  )}
                  <div className="border-t border-neutral-800 pt-1.5 flex justify-between font-bold text-sm">
                    <span className="text-neutral-200">COD Payable:</span>
                    <span className="text-amber-400">{formatBDT(selectedInvoice.codAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom buttons */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-800 no-print">
              <button
                onClick={() => {
                  onOpenThankYouCard(selectedInvoice);
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium"
              >
                Generate Luxury Thank You Card
              </button>
              <button
                onClick={() => {
                  onOpenThermalPrinter(selectedInvoice.id);
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold text-xs"
              >
                Print Thermal Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
