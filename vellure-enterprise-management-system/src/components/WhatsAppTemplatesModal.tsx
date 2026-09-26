import React, { useState } from 'react';
import {
  Phone,
  Send,
  X,
  Copy,
  Check,
  Sparkles,
  Truck,
  HeartHandshake,
  MessageCircle,
  Clock
} from 'lucide-react';
import { Invoice } from '../types';
import { BRAND_DETAILS } from '../data/initialData';
import { formatBDT, sanitizeBDPhone } from '../utils/formatters';

interface WhatsAppTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  initialInvoiceId?: string;
}

export const WhatsAppTemplatesModal: React.FC<WhatsAppTemplatesModalProps> = ({
  isOpen,
  onClose,
  invoices,
  initialInvoiceId,
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialInvoiceId || (invoices[0]?.id ?? '')
  );
  const [customPhone, setCustomPhone] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<
    'order_confirmation' | 'dispatch_tracking' | 'cod_reminder' | 'ritual_review'
  >('dispatch_tracking');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];
  const targetPhone = customPhone.trim() || (currentInvoice ? currentInvoice.customerPhone : '');
  const sanitizedPhone = sanitizeBDPhone(targetPhone);

  const customerName = currentInvoice ? currentInvoice.customerName : 'Valued Patron';
  const consignmentId = currentInvoice ? currentInvoice.trackingId : 'VLR-TRACK';
  const courier = currentInvoice ? currentInvoice.courierPartner : 'Steadfast Courier';
  const codAmount = currentInvoice ? formatBDT(currentInvoice.codAmount) : '৳0';
  const itemsList = currentInvoice
    ? currentInvoice.items.map((i) => `${i.productName} (${i.size}) × ${i.quantity}`).join(', ')
    : 'Luxury Fragrance Flacon';

  // 4 Luxury Pre-Formatted Message Templates in Bengali & English
  const templates: Record<
    'order_confirmation' | 'dispatch_tracking' | 'cod_reminder' | 'ritual_review',
    { title: string; subtitle: string; icon: any; body: string }
  > = {
    order_confirmation: {
      title: '1. Order Confirmation (অর্ডার নিশ্চিতকরণ)',
      subtitle: 'Send right after receiving customer consignment',
      icon: Sparkles,
      body: `আসসালামু আলাইকুম ${customerName} ভাই/ম্যাম,

ভেল্যুর (VELLURE Fragrances & Attar) থেকে আপনার অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে। 

📦 পণ্যের বিবরণ: ${itemsList}
💰 মোট প্রদেয়: ${codAmount}
📍 ডেলিভারি ঠিকানা: ${currentInvoice?.deliveryAddress || ''}

আপনার পার্সেলটি অতি যত্নসহকারে ব্লেন্ড ও প্যাকিং করা হচ্ছে। ধন্যবাদ ভেল্যুর সাথে থাকার জন্য।

—
VELLURE Luxury Fragrances
হটলাইন: ${BRAND_DETAILS.whatsapp}
ওয়েবসাইট: ${BRAND_DETAILS.website}`,
    },
    dispatch_tracking: {
      title: '2. Courier Dispatch & Tracking (কুরিয়ার ট্র্যাকিং)',
      subtitle: 'Send when consignment is handed over to courier',
      icon: Truck,
      body: `প্রিয় ${customerName} ভাই/ম্যাম,

আপনার কাঙ্ক্ষিত সুগন্ধি পার্সেলটি ${courier}-এ হ্যান্ডওভার করা হয়েছে।

🔖 ইনভয়েস নম্বর: ${currentInvoice?.id || ''}
🚚 ট্র্যাকিং আইডি: ${consignmentId}
💵 ক্যাশ অন ডেলিভারি (COD): ${codAmount}

ডেলিভারি রাইডারের সাথে দেখা করে পার্সেলটি রিসিভ করুন। ট্র্যাকিং সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের জানাতে পারেন।

—
VELLURE Luxury Fragrances
সুনাম ও আভিজাত্যের সুবাস`,
    },
    cod_reminder: {
      title: '3. Out for Delivery & COD Reminder (ডেলিভারি নোটিশ)',
      subtitle: 'Send when courier rider is en route to customer',
      icon: Clock,
      body: `আসসালামু আলাইকুম ${customerName} ভাই,

আপনার VELLURE পার্সেলটি আজ আপনার ঠিকানায় ডেলিভারির জন্য প্রস্তুত রয়েছে।

কুরিয়ার রাইডারকে পরিশোধযোগ্য নেট অ্যামাউন্ট: ${codAmount} (ক্যাশ বা বিকাশ)। অনুগ্রহ করে ফোনটি সচল রাখবেন।

ধন্যবাদান্তে,
VELLURE Customer Support Team`,
    },
    ritual_review: {
      title: '4. Olfactory Care Ritual & Review (ব্যবহার বিধি ও রিভিউ)',
      subtitle: 'Send after delivery to request feedback & guide usage',
      icon: HeartHandshake,
      body: `প্রিয় ${customerName},

আশা করি আপনার কাঙ্ক্ষিত VELLURE পারফিউমটি হাতে পেয়েছেন। 

✨ পারফিউম ব্যবহারে বিশেষ নির্দেশনা:
কুরিয়ার জার্নির পর সুগন্ধির মলিকিউলগুলো স্থিতিশীল হতে অন্তত ২৪ ঘণ্টা সাধারণ তাপমাত্রায় রেখে দিন। এরপর কব্জি ও গলার পালস পয়েন্টে প্রয়োগ করে উপভোগ করুন ১৪+ ঘণ্টার আভিজাত্যময় স্থায়ীত্ব।

আমাদের পণ্যটি আপনার কেমন লেগেছে তা জানিয়ে আমাদের রিভিউ দিলে আমরা অত্যন্ত অনুপ্রাণিত হব।

—
VELLURE Luxury Fragrances
${BRAND_DETAILS.website}`,
    },
  };

  const activeMessage = templates[activeTemplate].body;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (!sanitizedPhone) {
      alert('অনুগ্রহ করে কাস্টমারের সঠিক মোবাইল নম্বর নির্বাচন করুন।');
      return;
    }
    const cleanNum = sanitizedPhone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanNum}&text=${encodeURIComponent(
      activeMessage
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Customer WhatsApp Concierge Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Instant BD Triggers
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Send official pre-formatted order updates, COD reminders & care rituals
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

        {/* Customer / Invoice Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-neutral-300 font-medium mb-1">
              Select Consignment / Customer:
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-neutral-200 text-xs focus:border-emerald-500 focus:outline-none"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - {inv.customerName} ({inv.customerPhone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-300 font-medium mb-1">
              Recipient WhatsApp Mobile:
            </label>
            <input
              type="text"
              placeholder="+8801..."
              value={customPhone || targetPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-neutral-200 font-mono text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
          {(['dispatch_tracking', 'order_confirmation', 'cod_reminder', 'ritual_review'] as const).map(
            (tKey) => {
              const item = templates[tKey];
              const Icon = item.icon;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setActiveTemplate(tKey)}
                  className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    activeTemplate === tKey
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 ring-1 ring-emerald-500/30'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                    {item.title.split('(')[0]}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Message Preview Box */}
        <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800/80 pb-1.5">
            <span className="font-semibold text-neutral-200">
              {templates[activeTemplate].title}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              Target: {sanitizedPhone || 'None'}
            </span>
          </div>
          <pre className="text-xs text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {activeMessage}
          </pre>
        </div>

        {/* Actions: Copy & Direct Send */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <span className="text-[10px] text-neutral-500 font-mono">
            Opens directly in WhatsApp Web or Mobile App
          </span>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
