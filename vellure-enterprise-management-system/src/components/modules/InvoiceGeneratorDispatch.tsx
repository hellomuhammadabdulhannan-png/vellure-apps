import React, { useState } from 'react';
import {
  FileText,
  Truck,
  Send,
  Plus,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  Search,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  Pencil,
  Trash2,
  Eye,
  X,
  Check,
  ChevronDown,
  Calculator,
  Phone
} from 'lucide-react';
import { Invoice, OrderItem, CourierPartner } from '../../types';
import { formatBDT, buildWhatsAppLink, getCourierTrackingUrl, sanitizeBDPhone } from '../../utils/formatters';
import { BRAND_DETAILS } from '../../data/initialData';
import { SvgBarcode } from '../SvgBarcode';
import { VELLURE_LOGO } from '../../assets/logo';

interface InvoiceGeneratorDispatchProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onNavigateToThermal: (invoiceId: string) => void;
  onNavigateToCard: (invoice: Invoice) => void;
  onToggleCalculator?: () => void;
  isCalculatorOpen?: boolean;
  onOpenWhatsAppModal?: (invoiceId?: string) => void;
}

export const InvoiceGeneratorDispatch: React.FC<InvoiceGeneratorDispatchProps> = ({
  invoices,
  onAddInvoice,
  onUpdateInvoice,
  onNavigateToThermal,
  onNavigateToCard,
  onToggleCalculator,
  isCalculatorOpen = false,
  onOpenWhatsAppModal,
}) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'reminders'>('dispatch');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [filterCourier, setFilterCourier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Default initial date: today in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // New Invoice Form state
  const [invoiceDate, setInvoiceDate] = useState(getTodayDate());
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Gulshan');
  const [courierPartner, setCourierPartner] = useState<CourierPartner>('Steadfast Courier');
  const [deliveryFee, setDeliveryFee] = useState(120);
  const [discount, setDiscount] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('bKash Merchant');
  const [notes, setNotes] = useState('Handle with extreme care. Glass flacons & pure oils inside.');

  // Dynamic manually typed items for new invoice
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'itm-1',
      productName: 'Oud Royal De Sreemangal',
      type: 'Extrait de Parfum',
      size: '50ml',
      quantity: 1,
      unitPrice: 6200,
    },
  ]);

  // Edit Invoice Form state
  const [editDate, setEditDate] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editDeliveryAddress, setEditDeliveryAddress] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editThana, setEditThana] = useState('');
  const [editCourierPartner, setEditCourierPartner] = useState<CourierPartner>('Steadfast Courier');
  const [editDeliveryFee, setEditDeliveryFee] = useState(120);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editAdvancePaid, setEditAdvancePaid] = useState(0);
  const [editPaymentMethod, setEditPaymentMethod] = useState<Invoice['paymentMethod']>('bKash Merchant');
  const [editNotes, setEditNotes] = useState('');
  const [editItems, setEditItems] = useState<OrderItem[]>([]);

  // Item helpers for Create Modal
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `itm-${Date.now()}-${prev.length + 1}`,
        productName: '',
        type: 'Extrait de Parfum',
        size: '50ml',
        quantity: 1,
        unitPrice: 3500,
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof OrderItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Item helpers for Edit Modal
  const handleAddEditItem = () => {
    setEditItems((prev) => [
      ...prev,
      {
        id: `itm-${Date.now()}-${prev.length + 1}`,
        productName: '',
        type: 'Extrait de Parfum',
        size: '50ml',
        quantity: 1,
        unitPrice: 3000,
      },
    ]);
  };

  const handleUpdateEditItem = (index: number, field: keyof OrderItem, value: any) => {
    setEditItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveEditItem = (index: number) => {
    if (editItems.length <= 1) return;
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations for Create Modal
  const subtotal = items.reduce((acc, itm) => acc + (itm.quantity || 0) * (itm.unitPrice || 0), 0);
  const codAmount = Math.max(0, subtotal + deliveryFee - discount - advancePaid);
  const paymentStatus: Invoice['paymentStatus'] =
    codAmount === 0
      ? 'Full Paid'
      : advancePaid > 0
      ? 'Partial Paid'
      : 'Cash on Delivery (COD)';

  // Calculations for Edit Modal
  const editSubtotal = editItems.reduce((acc, itm) => acc + (itm.quantity || 0) * (itm.unitPrice || 0), 0);
  const editCodAmount = Math.max(0, editSubtotal + editDeliveryFee - editDiscount - editAdvancePaid);
  const editPaymentStatus: Invoice['paymentStatus'] =
    editCodAmount === 0
      ? 'Full Paid'
      : editAdvancePaid > 0
      ? 'Partial Paid'
      : 'Cash on Delivery (COD)';

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) return;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const trackingPrefix = courierPartner === 'Steadfast Courier' ? 'ST-BD-' : 'PTH-';
    const trackingId = `${trackingPrefix}${randomNum}`;
    const invoiceId = `VEL-INV-2026-0${invoices.length + 107}`;

    // Scheduled review date = 7 days from invoice date
    const reviewDate = new Date(invoiceDate || getTodayDate());
    reviewDate.setDate(reviewDate.getDate() + 7);
    const reviewDateStr = reviewDate.toISOString().split('T')[0];

    // Ensure item fields are clean
    const formattedItems: OrderItem[] = items.map((item, idx) => ({
      id: item.id || `ITM-${Date.now()}-${idx}`,
      productName: item.productName.trim() || 'VELLURE Bespoke Fragrance',
      type: item.type.trim() || 'Extrait de Parfum',
      size: item.size.trim() || '50ml',
      quantity: Math.max(1, Number(item.quantity) || 1),
      unitPrice: Math.max(0, Number(item.unitPrice) || 0),
    }));

    const newInv: Invoice = {
      id: invoiceId,
      trackingId,
      date: invoiceDate.trim() || getTodayDate(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      customerPhone: sanitizeBDPhone(customerPhone.trim()),
      customerEmail: customerEmail.trim() || undefined,
      deliveryAddress: deliveryAddress.trim(),
      district: district.trim(),
      thana: thana.trim(),
      courierPartner,
      courierConsignmentId: `${courierPartner === 'Steadfast Courier' ? 'ST-CONS-' : 'PTH-'}${randomNum}`,
      items: formattedItems,
      subtotal,
      deliveryFee,
      discount,
      advancePaid,
      codAmount,
      paymentStatus,
      orderStatus: 'Dispatched',
      paymentMethod,
      notes,
      reviewReminderDate: reviewDateStr,
      reviewStatus: 'Pending',
      thermalPrinted: false,
    };

    onAddInvoice(newInv);
    setShowCreateModal(false);

    // Reset fields
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setAdvancePaid(0);
    setDiscount(0);
    setInvoiceDate(getTodayDate());
    setItems([
      {
        id: 'itm-1',
        productName: 'Oud Royal De Sreemangal',
        type: 'Extrait de Parfum',
        size: '50ml',
        quantity: 1,
        unitPrice: 6200,
      },
    ]);
  };

  const startEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditDate(inv.date);
    setEditCustomerName(inv.customerName);
    setEditCustomerPhone(inv.customerPhone);
    setEditCustomerEmail(inv.customerEmail || '');
    setEditDeliveryAddress(inv.deliveryAddress);
    setEditDistrict(inv.district);
    setEditThana(inv.thana || '');
    setEditCourierPartner(inv.courierPartner);
    setEditDeliveryFee(inv.deliveryFee);
    setEditDiscount(inv.discount);
    setEditAdvancePaid(inv.advancePaid);
    setEditPaymentMethod(inv.paymentMethod);
    setEditNotes(inv.notes || '');
    setEditItems(
      inv.items.map((i) => ({
        ...i,
        quantity: i.quantity || 1,
        unitPrice: i.unitPrice || 0,
      }))
    );
  };

  const handleSaveEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const formattedItems: OrderItem[] = editItems.map((item, idx) => ({
      id: item.id || `ITM-${Date.now()}-${idx}`,
      productName: item.productName.trim() || 'VELLURE Fragrance',
      type: item.type.trim() || 'Extrait de Parfum',
      size: item.size.trim() || '50ml',
      quantity: Math.max(1, Number(item.quantity) || 1),
      unitPrice: Math.max(0, Number(item.unitPrice) || 0),
    }));

    const updatedInv: Invoice = {
      ...editingInvoice,
      date: editDate.trim() || editingInvoice.date,
      customerName: editCustomerName.trim(),
      customerPhone: sanitizeBDPhone(editCustomerPhone.trim()),
      customerEmail: editCustomerEmail.trim() || undefined,
      deliveryAddress: editDeliveryAddress.trim(),
      district: editDistrict.trim(),
      thana: editThana.trim(),
      courierPartner: editCourierPartner,
      items: formattedItems,
      subtotal: editSubtotal,
      deliveryFee: editDeliveryFee,
      discount: editDiscount,
      advancePaid: editAdvancePaid,
      codAmount: editCodAmount,
      paymentStatus: editPaymentStatus,
      paymentMethod: editPaymentMethod,
      notes: editNotes,
    };

    onUpdateInvoice(updatedInv);
    setEditingInvoice(null);
  };

  const handleMarkReviewSent = (inv: Invoice) => {
    onUpdateInvoice({
      ...inv,
      reviewStatus: inv.reviewStatus === 'Pending' ? 'Sent' : 'Completed',
    });
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesCourier =
      filterCourier === 'all' ||
      (filterCourier === 'steadfast' && inv.courierPartner === 'Steadfast Courier') ||
      (filterCourier === 'pathao' && inv.courierPartner === 'Pathao Courier');

    const matchesSearch =
      !searchQuery.trim() ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerPhone.includes(searchQuery) ||
      inv.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCourier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Suggestions datalists for rapid manual typing with autocompletion */}
      <datalist id="fragrance-names-list">
        <option value="Oud Royal De Sreemangal" />
        <option value="Sultana Rose Taifi" />
        <option value="Sylhet Rain & White Amber" />
        <option value="Kashmir White Musk Attar" />
        <option value="Smoky Cardamom Tea Attar" />
        <option value="Bakhoor Al-Mukhallat" />
        <option value="Dehn Al Oud Cambodi" />
        <option value="Ambergris Royale Extrait" />
        <option value="Mysore Sandalwood Pure Oil" />
        <option value="Bespoke Attar Blend" />
      </datalist>

      <datalist id="fragrance-sizes-list">
        <option value="3ml" />
        <option value="6ml" />
        <option value="12ml Tola" />
        <option value="30ml" />
        <option value="50ml" />
        <option value="100ml" />
        <option value="1 Tola (11.66g)" />
        <option value="2 Tola (23.32g)" />
        <option value="Discovery Set (5x3ml)" />
      </datalist>

      <datalist id="fragrance-types-list">
        <option value="Attar (Pure Oil)" />
        <option value="Extrait de Parfum" />
        <option value="Eau de Parfum" />
        <option value="Discovery Set" />
        <option value="Bakhoor / Incense" />
      </datalist>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 6
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Invoice Generator & Courier Dispatch</span>
                <Truck className="w-5 h-5 text-amber-400 inline" />
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Create and dispatch luxury fragrance consignments. Manually enter or customize product names, sizes, quantities, and dates with automated COD, Steadfast/Pathao tracking, and instant WhatsApp triggers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onToggleCalculator && (
              <button
                type="button"
                onClick={onToggleCalculator}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isCalculatorOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/40'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
                title="Open, close and drag the floating calculator anywhere"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>{isCalculatorOpen ? 'Hide Calculator' : 'Moveable Calculator (মুভ করুন)'}</span>
              </button>
            )}

            {onOpenWhatsAppModal && (
              <button
                type="button"
                onClick={() => onOpenWhatsAppModal()}
                className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-800/40 transition-all shadow-md shadow-emerald-950/20"
                title="Customer WhatsApp Message Templates"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Templates</span>
              </button>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-amber-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Consignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 bg-neutral-900/60 p-1.5 rounded-xl gap-2">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'dispatch'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Active Courier Dispatch Queue ({invoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'reminders'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>7-Day Scheduled Review Queue</span>
        </button>
      </div>

      {/* TAB 1: Dispatch Table */}
      {activeTab === 'dispatch' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Consignments & WhatsApp Tracking Dispatch</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoice, customer, item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-neutral-200 text-xs w-52 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Courier filter */}
              <select
                value={filterCourier}
                onChange={(e) => setFilterCourier(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-300 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Partners (Steadfast & Pathao)</option>
                <option value="steadfast">Steadfast Courier</option>
                <option value="pathao">Pathao Courier</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-medium uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Invoice & Date</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Products (Name, Size, Qty)</th>
                  <th className="py-3 px-4">Financials & COD</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">WhatsApp Trigger</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredInvoices.map((inv) => {
                  const trackingUrl = getCourierTrackingUrl(inv.courierPartner, inv.trackingId);
                  const itemsSummary = inv.items.map((i) => `${i.productName} (${i.size} × ${i.quantity})`).join(', ');
                  const whatsappMessage = `Assalamu Alaikum ${inv.customerName},\nGreetings from VELLURE Luxury Fragrances!\n\nYour order #${inv.id} (Date: ${inv.date}) has been dispatched via ${inv.courierPartner}.\nItems: ${itemsSummary}\nTracking ID: ${inv.trackingId}\nTrack live here: ${trackingUrl}\nTotal COD Payable: ${formatBDT(inv.codAmount)}\n\nFor any inquiries: ${BRAND_DETAILS.whatsapp}\nThank you for choosing pure luxury artisanal fragrances.`;

                  return (
                    <tr key={inv.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-amber-400">{inv.id}</div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          <span>{inv.date}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          Track: {inv.trackingId}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-200">{inv.courierPartner}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {inv.courierConsignmentId || 'Pending Consignment'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-100">{inv.customerName}</div>
                        <div className="text-[11px] font-mono text-neutral-400">{inv.customerPhone}</div>
                        <div className="text-[10px] text-neutral-500">{inv.district}{inv.thana ? `, ${inv.thana}` : ''}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="space-y-1">
                          {inv.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] bg-neutral-950/60 px-2 py-1 rounded border border-neutral-800/60">
                              <span className="font-medium text-neutral-200 truncate pr-2">
                                {item.productName}
                              </span>
                              <span className="text-[10px] font-mono text-amber-400/90 whitespace-nowrap">
                                {item.size} × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-neutral-300">Total: {formatBDT(inv.subtotal + inv.deliveryFee - inv.discount)}</div>
                        <div className="text-[11px] font-bold text-amber-400">
                          COD: {formatBDT(inv.codAmount)}
                        </div>
                        {inv.advancePaid > 0 && (
                          <div className="text-[10px] text-blue-400">
                            Advance: -{formatBDT(inv.advancePaid)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            inv.paymentStatus === 'Full Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : inv.paymentStatus === 'Partial Paid'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={buildWhatsAppLink(inv.customerPhone, whatsappMessage)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/40 text-xs font-semibold transition-all group shadow-sm"
                            title="Direct WhatsApp Send"
                          >
                            <Send className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            <span>Send</span>
                          </a>

                          {onOpenWhatsAppModal && (
                            <button
                              type="button"
                              onClick={() => onOpenWhatsAppModal(inv.id)}
                              className="p-1.5 rounded-xl bg-neutral-900 hover:bg-emerald-950 text-neutral-400 hover:text-emerald-300 border border-neutral-800 hover:border-emerald-700/50 transition-colors"
                              title="Choose Luxury Template (অর্ডার কনফার্ম, ট্র্যাকিং বা কেয়ার গাইড)"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="Quick View Invoice"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEditInvoice(inv)}
                            title="Edit Date, Products, Size, Quantity"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToThermal(inv.id)}
                            title="Thermal Sticker Label"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToCard(inv)}
                            title="Luxury Thank You Card"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 7-Day Scheduled Post-Purchase Review Reminder Queue */}
      {activeTab === 'reminders' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                7-Day Scheduled Post-Purchase Fragrance Review Reminder Queue
              </h3>
              <p className="text-xs text-neutral-400">
                Automated schedule triggers 7 days after bottle delivery to collect feedback on longevity, sillage, and customer satisfaction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => {
              const reviewMessage = `Assalamu Alaikum ${inv.customerName},\n\nWe hope you are thoroughly enjoying your VELLURE fragrance (${inv.items.map(i => `${i.productName} ${i.size}`).join(', ')}).\n\nIt has been 7 days since your delivery, allowing the delicate aromatics to settle after transit. How is the projection and longevity on your skin? We would deeply appreciate your feedback or fragrance review!\n\nWarm regards,\nMaster Perfumer Team\nVELLURE • Luxury Fragrances & Attar\n${BRAND_DETAILS.website}`;

              return (
                <div
                  key={inv.id}
                  className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                        Order #{inv.id} • Date: {inv.date} • Scheduled: {inv.reviewReminderDate || '7 Days Post-Delivery'}
                      </span>
                      <h4 className="font-semibold text-neutral-100 text-xs mt-0.5">
                        {inv.customerName}
                      </h4>
                      <div className="text-[11px] font-mono text-amber-400">{inv.customerPhone}</div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        inv.reviewStatus === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : inv.reviewStatus === 'Sent'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {inv.reviewStatus}
                    </span>
                  </div>

                  <div className="text-neutral-300 text-xs bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
                    <span className="text-neutral-400 block text-[10px]">Perfumes Purchased:</span>
                    {inv.items.map(i => `${i.productName} (${i.size} × ${i.quantity})`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <button
                      onClick={() => handleMarkReviewSent(inv)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-200"
                    >
                      Status: Toggle Sent/Completed
                    </button>

                    <a
                      href={buildWhatsAppLink(inv.customerPhone, reviewMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/40 text-xs font-medium"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send 7-Day Review Prompt</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Generate Consignment & Invoice (With full manual typing for Product, Size, Quantity, Date) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Generate Invoice & Courier Consignment
                </h3>
                <p className="text-xs text-neutral-400">
                  Manually type or customize product name, size, quantity, and date.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              {/* Row 1: Courier Partner Picker & Invoice Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Courier Integration Partner *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Steadfast Courier', 'Pathao Courier'] as CourierPartner[]).map((cp) => (
                      <label
                        key={cp}
                        className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          courierPartner === cp
                            ? 'bg-amber-500/15 border-amber-500/50 text-neutral-100 font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="courier"
                          checked={courierPartner === cp}
                          onChange={() => setCourierPartner(cp)}
                          className="text-amber-500"
                        />
                        <span>{cp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Manually type / choose Date */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Invoice Date (তারিখ) *
                    </span>
                    <button
                      type="button"
                      onClick={() => setInvoiceDate(getTodayDate())}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Today
                    </button>
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    You can manually type or select any custom date.
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barrister Rafiqul Islam"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Customer Phone (BD Mobile) *</label>
                  <input
                    type="text"
                    required
                    placeholder="01820032330 / 01711234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">District / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka / Sylhet / Moulvibazar"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Thana / Sub-district</label>
                  <input
                    type="text"
                    placeholder="e.g. Gulshan, Banani, Sreemangal"
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House #, Road #, Sector / Area"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* PRODUCTS SECTION (Manually type Product Name, Size, Quantity, Unit Price) */}
              <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fragrance Products (পণ্যের নাম, সাইজ ও পরিমাণ ম্যানুয়ালি লিখুন)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Product</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-12 gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800/80 items-end"
                    >
                      {/* Product Name (Manually typed) */}
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Product Name (পণ্যের নাম) *
                        </label>
                        <input
                          type="text"
                          required
                          list="fragrance-names-list"
                          placeholder="Type perfume / attar name..."
                          value={item.productName}
                          onChange={(e) => handleUpdateItem(idx, 'productName', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Size (Manually typed) */}
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Size (সাইজ) *
                        </label>
                        <input
                          type="text"
                          required
                          list="fragrance-sizes-list"
                          placeholder="e.g. 50ml, 12ml..."
                          value={item.size}
                          onChange={(e) => handleUpdateItem(idx, 'size', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Quantity (Manually typed) */}
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Qty (পরিমাণ) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-neutral-100 font-mono text-xs text-center focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Unit Price (Manually typed) */}
                      <div className="col-span-8 sm:col-span-3">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Unit Price ৳ (একক মূল্য) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(idx, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2">
                            = {formatBDT(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Delete action */}
                      <div className="col-span-4 sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          disabled={items.length <= 1}
                          onClick={() => handleRemoveItem(idx)}
                          className={`p-2 rounded-lg text-neutral-400 transition-colors ${
                            items.length <= 1
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:text-red-400 hover:bg-neutral-800'
                          }`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80 text-xs font-mono">
                  <span className="text-neutral-400">Total Items Subtotal:</span>
                  <span className="text-amber-400 font-bold">{formatBDT(subtotal)}</span>
                </div>
              </div>

              {/* Financial Calculation Fields with Moveable Calculator Trigger */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-neutral-300">
                  Financials, Discount & Advance (বিল ও ক্যাশ অন ডেলিভারি)
                </span>
                {onToggleCalculator && (
                  <button
                    type="button"
                    onClick={onToggleCalculator}
                    className="flex items-center space-x-1.5 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isCalculatorOpen ? 'ক্যালকুলেটর বন্ধ করুন' : '🧮 ক্যালকুলেটর ওপেন ও মুভ করুন'}</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Delivery Fee (৳)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">VIP Discount (৳)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Advance Received (৳)</label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Advance Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="bKash Merchant">bKash Merchant</option>
                    <option value="Nagad Personal">Nagad Personal</option>
                    <option value="City Bank BD">City Bank BD</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              {/* Calculated COD Display Box */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-amber-900/40 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    Net Cash on Delivery (COD) Payable by Customer:
                  </span>
                  <span className="text-xl font-bold text-amber-400">
                    {formatBDT(codAmount)}
                  </span>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-neutral-400 block">Payment Classification:</span>
                  <span className="font-semibold text-emerald-400">{paymentStatus}</span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 text-[11px]">Order & Packaging Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for courier and packaging..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-200 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Generate Invoice & Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Existing Invoice (Allows editing Date, Products, Size, Quantity, Price, Address) */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-400" />
                  Edit Invoice #{editingInvoice.id}
                </h3>
                <p className="text-xs text-neutral-400">
                  Modify date, product name, bottle size, quantity, unit price, and recipient information.
                </p>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="text-neutral-400 hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInvoice} className="space-y-4 text-xs">
              {/* Row 1: Courier Partner & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-neutral-300 font-semibold mb-1">Courier Partner</label>
                  <select
                    value={editCourierPartner}
                    onChange={(e) => setEditCourierPartner(e.target.value as CourierPartner)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                  </select>
                </div>

                {/* Edit Date */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Invoice Date (তারিখ) *
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditDate(getTodayDate())}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Today
                    </button>
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Customer Phone (BD Mobile) *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerPhone}
                    onChange={(e) => setEditCustomerPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">District / City *</label>
                  <input
                    type="text"
                    required
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Thana / Sub-district</label>
                  <input
                    type="text"
                    value={editThana}
                    onChange={(e) => setEditThana(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  value={editDeliveryAddress}
                  onChange={(e) => setEditDeliveryAddress(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* PRODUCTS SECTION (Edit Product Name, Size, Quantity, Price) */}
              <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fragrance Products (পণ্যের নাম, সাইজ ও পরিমাণ সম্পাদনা করুন)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddEditItem}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Product</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-12 gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800/80 items-end"
                    >
                      {/* Product Name */}
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Product Name (পণ্যের নাম) *
                        </label>
                        <input
                          type="text"
                          required
                          list="fragrance-names-list"
                          placeholder="Type perfume / attar name..."
                          value={item.productName}
                          onChange={(e) => handleUpdateEditItem(idx, 'productName', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Size */}
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Size (সাইজ) *
                        </label>
                        <input
                          type="text"
                          required
                          list="fragrance-sizes-list"
                          placeholder="e.g. 50ml, 12ml..."
                          value={item.size}
                          onChange={(e) => handleUpdateEditItem(idx, 'size', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Qty (পরিমাণ) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateEditItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-neutral-100 font-mono text-xs text-center focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-8 sm:col-span-3">
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">
                          Unit Price ৳ (একক মূল্য) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateEditItem(idx, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2">
                            = {formatBDT(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="col-span-4 sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          disabled={editItems.length <= 1}
                          onClick={() => handleRemoveEditItem(idx)}
                          className={`p-2 rounded-lg text-neutral-400 transition-colors ${
                            editItems.length <= 1
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:text-red-400 hover:bg-neutral-800'
                          }`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80 text-xs font-mono">
                  <span className="text-neutral-400">Total Items Subtotal:</span>
                  <span className="text-amber-400 font-bold">{formatBDT(editSubtotal)}</span>
                </div>
              </div>

              {/* Financials with Moveable Calculator Trigger */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-neutral-300">
                  Financials, Discount & Advance (বিল ও ক্যাশ অন ডেলিভারি)
                </span>
                {onToggleCalculator && (
                  <button
                    type="button"
                    onClick={onToggleCalculator}
                    className="flex items-center space-x-1.5 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isCalculatorOpen ? 'ক্যালকুলেটর বন্ধ করুন' : '🧮 ক্যালকুলেটর ওপেন ও মুভ করুন'}</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Delivery Fee (৳)</label>
                  <input
                    type="number"
                    value={editDeliveryFee}
                    onChange={(e) => setEditDeliveryFee(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">VIP Discount (৳)</label>
                  <input
                    type="number"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Advance Received (৳)</label>
                  <input
                    type="number"
                    value={editAdvancePaid}
                    onChange={(e) => setEditAdvancePaid(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Payment Method</label>
                  <select
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="bKash Merchant">bKash Merchant</option>
                    <option value="Nagad Personal">Nagad Personal</option>
                    <option value="City Bank BD">City Bank BD</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              {/* Calculated COD Display Box */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-amber-900/40 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    Recalculated COD Balance:
                  </span>
                  <span className="text-xl font-bold text-amber-400">
                    {formatBDT(editCodAmount)}
                  </span>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-neutral-400 block">Status:</span>
                  <span className="font-semibold text-emerald-400">{editPaymentStatus}</span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 text-[11px]">Order Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-200 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Save Invoice Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Invoice Bill & Print Preview */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-amber-900/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in">
            {/* Header with VELLURE Luxury Branding */}
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-amber-500/40 flex items-center justify-center shadow overflow-hidden shrink-0">
                    <img
                      src={VELLURE_LOGO}
                      alt="VELLURE Luxury Logo"
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif-luxury font-bold tracking-wider text-amber-300">
                      {BRAND_DETAILS.name}
                    </h2>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      {BRAND_DETAILS.tagline}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 mt-2 space-y-0.5">
                  <p>{BRAND_DETAILS.address}</p>
                  <p>WhatsApp: {BRAND_DETAILS.whatsapp} • {BRAND_DETAILS.website}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OFFICIAL INVOICE
                </span>
                <div className="text-sm font-bold font-mono text-neutral-100 mt-1.5">
                  #{viewingInvoice.id}
                </div>
                <div className="text-xs text-neutral-400 flex items-center justify-end gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Date: <strong className="text-neutral-200">{viewingInvoice.date}</strong></span>
                </div>
              </div>
            </div>

            {/* Recipient and Courier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Billed & Shipped To:
                </span>
                <div className="font-bold text-neutral-100 text-sm">{viewingInvoice.customerName}</div>
                <div className="font-mono text-amber-400 mt-0.5">{viewingInvoice.customerPhone}</div>
                <div className="text-neutral-300 mt-1 leading-relaxed">
                  {viewingInvoice.deliveryAddress}, {viewingInvoice.district}
                  {viewingInvoice.thana ? `, ${viewingInvoice.thana}` : ''}
                </div>
              </div>

              <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Courier Integration:
                </span>
                <div className="text-neutral-200 font-semibold">{viewingInvoice.courierPartner}</div>
                <div className="text-[11px] font-mono text-amber-400 mt-0.5">
                  Tracking ID: {viewingInvoice.trackingId}
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  Payment Method: {viewingInvoice.paymentMethod}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                  Payment Status: {viewingInvoice.paymentStatus}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Product Name</th>
                    <th className="py-2.5 px-3 text-center">Size & Type</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                  {viewingInvoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 px-3 font-semibold text-neutral-100">
                        {item.productName}
                      </td>
                      <td className="py-2.5 px-3 text-center text-neutral-400 font-mono text-[11px]">
                        {item.size} {item.type ? `• ${item.type}` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-100">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-neutral-300">
                        {formatBDT(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                        {formatBDT(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Barcode & Financial Calculation */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs pt-1">
              <div className="space-y-2 max-w-xs">
                <div className="text-[11px] text-neutral-400">
                  <strong className="text-neutral-300">Notes:</strong> {viewingInvoice.notes || 'Handle with extreme care. Glass flacons inside.'}
                </div>
                <div className="pt-2">
                  <SvgBarcode value={viewingInvoice.trackingId} height={38} showText={true} />
                </div>
              </div>

              <div className="w-full sm:w-64 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="text-neutral-200">{formatBDT(viewingInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Fee:</span>
                  <span className="text-neutral-200">+{formatBDT(viewingInvoice.deliveryFee)}</span>
                </div>
                {viewingInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Privilege Discount:</span>
                    <span>-{formatBDT(viewingInvoice.discount)}</span>
                  </div>
                )}
                {viewingInvoice.advancePaid > 0 && (
                  <div className="flex justify-between text-blue-400">
                    <span>Advance Received:</span>
                    <span>-{formatBDT(viewingInvoice.advancePaid)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-800 pt-1.5 flex justify-between font-bold text-sm">
                  <span className="text-neutral-200">COD Payable:</span>
                  <span className="text-amber-400">{formatBDT(viewingInvoice.codAmount)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
              <button
                onClick={() => {
                  const inv = viewingInvoice;
                  setViewingInvoice(null);
                  startEditInvoice(inv);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Invoice Details</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onNavigateToThermal(viewingInvoice.id);
                    setViewingInvoice(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs"
                >
                  Thermal Sticker
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
