import React, { useState } from 'react';
import {
  Award,
  Printer,
  Sparkles,
  Sliders,
  Send,
  Crown,
  Heart,
  ExternalLink,
  RotateCcw,
  Check
} from 'lucide-react';
import { Invoice } from '../../types';
import { BRAND_DETAILS } from '../../data/initialData';
import { SvgQrCode } from '../SvgQrCode';
import { VELLURE_LOGO } from '../../assets/logo';

interface PremiumThankYouCardProps {
  invoices: Invoice[];
  initialSelectedInvoice?: Invoice | null;
}

export const PremiumThankYouCard: React.FC<PremiumThankYouCardProps> = ({
  invoices,
  initialSelectedInvoice,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(
    initialSelectedInvoice || invoices[0]
  );
  const [recipientName, setRecipientName] = useState(
    initialSelectedInvoice?.customerName || invoices[0]?.customerName || 'Esteemed Patron'
  );
  const [fragrancePurchased, setFragrancePurchased] = useState(
    initialSelectedInvoice?.items.map(i => i.productName).join(' & ') || 'Oud Royal De Sreemangal'
  );
  const [cardTheme, setCardTheme] = useState<'obsidian-gold' | 'royal-emerald' | 'cream-parchment'>('obsidian-gold');
  const [cardLayout, setCardLayout] = useState<'single' | '4-up-a4'>('single');
  const [customBespokeMessage, setCustomBespokeMessage] = useState(
    'We invite you to experience the transcendent depth of pure artisanal distillation. May this bespoke flacon bring distinction and serenity to your days.'
  );

  const handleSelectInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setRecipientName(inv.customerName);
    setFragrancePurchased(inv.items.map(i => i.productName).join(' & '));
  };

  const handlePrint = () => {
    window.print();
  };

  // Render a single luxury card
  const renderCardContent = (key?: number) => {
    const isObsidian = cardTheme === 'obsidian-gold';
    const isEmerald = cardTheme === 'royal-emerald';
    const isCream = cardTheme === 'cream-parchment';

    const bgClass = isObsidian
      ? 'bg-neutral-950 text-neutral-100 border-amber-500/60'
      : isEmerald
      ? 'bg-[#061e14] text-emerald-50 border-amber-400/80'
      : 'bg-[#faf8f5] text-neutral-900 border-amber-800/60';

    const textGold = isCream ? 'text-amber-900' : 'text-amber-400';
    const subText = isCream ? 'text-neutral-600' : 'text-neutral-400';

    return (
      <div
        key={key}
        className={`w-[480px] h-[330px] rounded-xl border-2 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl select-none mx-auto print:shadow-none print:m-0 ${bgClass}`}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {/* Ornate corner filigree accents */}
        <div className="absolute top-2 left-2 text-amber-500/40 text-xs select-none">❖</div>
        <div className="absolute top-2 right-2 text-amber-500/40 text-xs select-none">❖</div>
        <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs select-none">❖</div>
        <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs select-none">❖</div>

        {/* Top Header: Brand Crest */}
        <div className="text-center border-b border-amber-500/30 pb-2">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-500/40 shadow-sm mb-1 bg-black">
              <img
                src={VELLURE_LOGO}
                alt="VELLURE Luxury Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-serif-luxury text-xl font-bold tracking-[0.3em] uppercase ${textGold}`}>
                {BRAND_DETAILS.name}
              </span>
            </div>
          </div>
          <p className="text-[9px] tracking-[0.25em] uppercase font-light text-neutral-400 mt-0.5">
            {BRAND_DETAILS.tagline} • Sreemangal
          </p>
        </div>

        {/* Card Body: Personalized Luxury Note */}
        <div className="my-2 space-y-2 text-center px-4">
          <div className={`font-serif-luxury text-base font-semibold ${isCream ? 'text-neutral-900' : 'text-neutral-100'}`}>
            For the Distinguished Patron, <span className={`${textGold} italic`}>{recipientName}</span>
          </div>

          <p className={`text-[11px] leading-relaxed italic ${subText}`}>
            "{customBespokeMessage}"
          </p>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium font-mono text-amber-300">
            Flacon: {fragrancePurchased}
          </div>
        </div>

        {/* Olfactory Care Ritual Note */}
        <div className="bg-black/30 rounded-lg p-2 text-[9px] leading-tight text-neutral-400 border border-amber-500/20 text-center">
          <strong className="text-amber-400 block uppercase font-mono tracking-wider mb-0.5">
            Olfactory Care & Wearing Ritual
          </strong>
          Allow flacon 24 hours to settle after transit. Apply pure attar via glass rod to warm pulse points (wrists, neck base) for 14+ hours of opulent sillage.
        </div>

        {/* Bottom Footer: Official Details & QR Concierge */}
        <div className="border-t border-amber-500/30 pt-2 flex justify-between items-center text-[9px]">
          <div className="text-left space-y-0.5">
            <div className={`font-semibold ${textGold}`}>{BRAND_DETAILS.website}</div>
            <div className={subText}>{BRAND_DETAILS.address}</div>
            <div className={subText}>VIP Concierge: {BRAND_DETAILS.whatsapp}</div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-wider text-neutral-500">Scan for VIP Care</span>
              <span className={`font-mono font-bold ${textGold}`}>VELLURE VIP</span>
            </div>
            <SvgQrCode value={`https://${BRAND_DETAILS.website}/vip?customer=${encodeURIComponent(recipientName)}`} size={38} />
          </div>
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
                Module 8
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Premium Thank You Card Generator</span>
                <Award className="w-5 h-5 text-amber-400 inline" />
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              High-end luxury packaging insert card. Features royal VELLURE gold calligraphy, personalized recipient names, fragrance maceration care tips, and complete brand contact coordinates.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-xl shadow-amber-950/50"
          >
            <Printer className="w-4 h-4" />
            <span>Print Luxury Packaging Card</span>
          </button>
        </div>
      </div>

      {/* Customization Toolbar */}
      <div className="no-print bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Theme Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-neutral-400 font-medium">Card Aesthetic:</span>
          <button
            onClick={() => setCardTheme('obsidian-gold')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
              cardTheme === 'obsidian-gold'
                ? 'bg-neutral-950 text-amber-400 border-amber-500 font-bold'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            Obsidian & Burnished Gold
          </button>
          <button
            onClick={() => setCardTheme('royal-emerald')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
              cardTheme === 'royal-emerald'
                ? 'bg-[#061e14] text-emerald-300 border-emerald-500 font-bold'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            Sreemangal Velvet Emerald
          </button>
          <button
            onClick={() => setCardTheme('cream-parchment')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
              cardTheme === 'cream-parchment'
                ? 'bg-[#faf8f5] text-amber-900 border-amber-700 font-bold'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            Royal Ivory Parchment
          </button>
        </div>

        {/* Layout Picker: Single vs 4-Up A4 */}
        <div className="flex items-center space-x-2">
          <span className="text-neutral-400 font-medium">Print Paper Layout:</span>
          <button
            onClick={() => setCardLayout('single')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              cardLayout === 'single'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            Single Card (A6 Postcard)
          </button>
          <button
            onClick={() => setCardLayout('4-up-a4')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              cardLayout === '4-up-a4'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            4 Cards / A4 Sheet (Batch Cut)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Personalization & Invoices Picker */}
        <div className="no-print space-y-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4 backdrop-blur-md text-xs">
            <h3 className="font-semibold text-neutral-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Card Personalization Details</span>
            </h3>

            {/* Quick Populate from Customer Invoice */}
            <div>
              <label className="block text-neutral-400 mb-1">Populate from Dispatched Order</label>
              <select
                value={selectedInvoice?.id}
                onChange={(e) => {
                  const inv = invoices.find(i => i.id === e.target.value);
                  if (inv) handleSelectInvoice(inv);
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:border-amber-500 focus:outline-none"
              >
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.customerName} • {inv.id} ({inv.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Customer / Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Fragrance Name on Card</label>
              <input
                type="text"
                value={fragrancePurchased}
                onChange={(e) => setFragrancePurchased(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Bespoke Greeting Note</label>
              <textarea
                rows={3}
                value={customBespokeMessage}
                onChange={(e) => setCustomBespokeMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-100 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Brand Coordinates Display Box */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[10px] space-y-1 text-neutral-400">
              <span className="text-amber-400 font-semibold block uppercase font-mono">
                Brand Details Displayed on Insert:
              </span>
              <div>Email: {BRAND_DETAILS.email}</div>
              <div>Hotline / WhatsApp: {BRAND_DETAILS.whatsapp}</div>
              <div>Address: {BRAND_DETAILS.address}</div>
              <div>Web: {BRAND_DETAILS.website}</div>
            </div>
          </div>
        </div>

        {/* Right Side: High-Resolution Live Card Preview / Printable View */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="no-print flex justify-between items-center border-b border-neutral-800 pb-3 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-neutral-200">
                  Luxury Packaging Insert Live Preview ({cardLayout === 'single' ? '1 Card' : '4-Up Grid'})
                </span>
              </div>
              <span className="text-neutral-500 font-mono text-[10px]">
                Ready for Heavy Linen Cardstock 300 GSM
              </span>
            </div>

            {/* Print Container */}
            <div className="print-container bg-neutral-950/70 p-6 rounded-xl border border-neutral-800/80 flex items-center justify-center overflow-auto min-h-[420px]">
              {cardLayout === 'single' ? (
                renderCardContent(1)
              ) : (
                <div className="grid grid-cols-2 gap-4 max-w-[1000px]">
                  {renderCardContent(1)}
                  {renderCardContent(2)}
                  {renderCardContent(3)}
                  {renderCardContent(4)}
                </div>
              )}
            </div>

            <div className="no-print mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>
                🖨️ For best luxury presentation: print on <strong>300 GSM Textured Linen or Cotton Cardstock</strong> and insert inside the VELLURE rigid drawer box.
              </span>
              <button
                onClick={handlePrint}
                className="text-amber-400 hover:underline font-bold"
              >
                Print Insert Cards →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
