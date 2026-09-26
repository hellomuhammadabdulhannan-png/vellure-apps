import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  Table,
  RefreshCw,
  Edit3,
  Lightbulb,
  FlaskConical,
  BookOpen,
  Plus,
  Trash2,
  Check,
  Send,
  Loader2,
  TrendingUp,
  Sliders,
  Save,
  Bot,
  Copy,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';
import { QuickNote } from '../../types';
import {
  fetchStrategicAdvisor,
  fetchTrendingNames,
  fetchFormulaRatio,
  askGeminiHelp,
  ChatMessage
} from '../../utils/aiService';

interface AIInsightsInventoryProps {
  sheetUrl: string;
  onUpdateSheetUrl: (url: string) => void;
  quickNotes: QuickNote[];
  onAddQuickNote: (note: QuickNote) => void;
  onDeleteQuickNote: (id: string) => void;
}

export const AIInsightsInventory: React.FC<AIInsightsInventoryProps> = ({
  sheetUrl,
  onUpdateSheetUrl,
  quickNotes,
  onAddQuickNote,
  onDeleteQuickNote,
}) => {
  const [activeTab, setActiveTab] = useState<'gemini_help' | 'advisor' | 'names' | 'ratios' | 'notepad'>('gemini_help');

  // Sheet URL editing state
  const [isEditingSheetUrl, setIsEditingSheetUrl] = useState(false);
  const [tempSheetUrl, setTempSheetUrl] = useState(sheetUrl);
  const [lastSyncTime, setLastSyncTime] = useState('আজ, দুপুর ১:১৫');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showEmbedPreview, setShowEmbedPreview] = useState(false);

  // Gemini 3.8 Flash Helpdesk State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `আসসালামু আলাইকুম! আমি ভেল্যুর (VELLURE) ব্র্যান্ডের জন্য ডেডিকেটেড **Gemini 3.8 Flash** পারফিউম ও বিজনেস অ্যাডভাইজর।

আপনি যেকোনো বিষয়ে আমাকে প্রশ্ন করতে পারেন:
• শ্রীমঙ্গলের খাঁটি আগর আতর (Dehn al Oud), কান্নৌজ গোলাপ বা চন্দনের ব্লেন্ডিং ও ম্যাসারেশন গাইড
• ৫০ মিলি বা ১০০ মিলি Extrait de Parfum (৩০% তেল) ফর্মুলেশন ও ফিক্সেটিভ অনুপাত
• বাংলাদেশে লাক্সারি পারফিউমের লাভজনক মূল্য নির্ধারণ (MSRP) ও ৭০%+ মার্জিন নিশ্চিত করা
• স্টিডফাস্ট বা পাঠাও কুরিয়ারে ক্যাশ অন ডেলিভারি (COD) দ্রুত কালেক্ট করা ও রিটার্ন কমানোর উপায়

নিচের দ্রুত সাজেশনে ক্লিক করুন অথবা আপনার প্রশ্নটি লিখুন!`,
      timestamp: 'এখন',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedNoteIndex, setSavedNoteIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'gemini_help') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // AI Strategic Advisor state
  const [advisorPrompt, setAdvisorPrompt] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorResponse, setAdvisorResponse] = useState<string>(`### ভেল্যুর (VELLURE) মাস্টার স্ট্র্যাটেজি ও বিজনেস ইন্টেলিজেন্স রিপোর্ট

**১. এক্সিকিউটিভ ইনসাইট ও সেলস গ্রোথ:**
- বর্তমান সর্বোচ্চ রাজস্ব অর্জনকারী পারফিউম হলো **Oud Royal De Sreemangal** এবং **Kashmir White Musk Attar**, যা সিলেট ও ঢাকার ভিআইপি গ্রাহকদের মধ্যে ৬৮% রিপিট পারচেজ রেট অর্জন করেছে।
- শ্রীমঙ্গলের খাঁটি আগর কাঠের একক-উৎস পাতন (Single-origin artisanal distillation) আপনার ব্র্যান্ডের সবচেয়ে বড় অনন্য বৈশিষ্ট্য। বিজ্ঞাপনে এই ইতিহাস তুলে ধরুন।

**২. কাঁচামাল সোর্সিং ও ইনভেন্টরি অগ্রাধিকার:**
- **কম্বোডিয়ান ও শ্রীমঙ্গল ওয়াইল্ড আগর তেল (Dehn Al Oud)**: বর্ষার আগে দাম বৃদ্ধির আগেই অন্তত ২.৫ কেজি রিজার্ভ নিশ্চিত করুন। এতে আনুমানিক ৭৪% গ্রস মার্জিন সুরক্ষিত থাকবে।
- **ফরাসি অ্যারোমা কেমিক্যালস ও ফিক্সেটিভস**: ৫০ মিলি ও ১০০ মিলি EDP বোতলজাতকরণ অবিরাম চালু রাখতে Galaxolide, Hedione এবং Ambroxan ক্রিস্টাল দ্রুত অর্ডার করুন।
- **প্যাকেজিং স্টক**: কুরিয়ার হ্যান্ডওভার বিলম্ব এড়াতে Rongta ৩"×২" স্টিকার রোল এবং ভেলভেট গিফট বক্সের অন্তত ৩০ দিনের বাফার স্টক রাখুন।

**৩. ভিআইপি কাস্টমার রিটেনশন ও হাই-টিকেট ডেলিভারি:**
- গোল্ড ক্যালিগ্রাফি খোদাই করা ১২ মিলি রয়্যাল ক্রিস্টাল তোলা বক্স সংস্করণ চালু করুন।
- ডেলিভারির ৭ দিন পর হোয়াটসঅ্যাপ ফলো-আপ বার্তা পাঠিয়ে সুগন্ধি ব্যবহারের নিয়ম ও ফিডব্যাক নিন; এতে কাস্টমার রেফারেল ২৮% বৃদ্ধি পায়।

**৪. ৭-দিনের কার্যপরিকল্পনা (Tactical Action Plan):**
- [দিন ১-২] ফর্মুলা ভল্টের খরচ ও নতুন গ্লাস বোতলের ভ্যাট-ইনভয়েস অডিট করুন।
- [দিন ৩-৪] সীমিত সংস্করণের "শ্রীমঙ্গল মনসুন রিজার্ভ" পারফিউমের জন্য প্রি-অর্ডার শুরু করুন।
- [দিন ৫-৭] গুগল শীট ইনভেন্টরির সাথে স্টিডফাস্ট ও পাঠাও কুরিয়ারের ক্যাশ অন ডেলিভারি (COD) রিকভারি সমন্বয় করুন।`);

  // Trending Name Analyzer state
  const [nameTheme, setNameTheme] = useState('শ্রীমঙ্গল আগরউড ও স্পাইসড গোল্ডেন আম্বার');
  const [nameCategory, setNameCategory] = useState('আর্টিসানাল আতর ও এক্সট্রাইট ডি পারফাম');
  const [nameGender, setNameGender] = useState('রয়্যাল ইউনিসেক্স');
  const [namesLoading, setNamesLoading] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<any[]>([
    {
      name: "Sreemangal Noir Reserve",
      bengaliName: "শ্রীমঙ্গল নোয়ার রিজার্ভ",
      tagline: "Wild Agarwood steeped in monsoon rain and roasted tea leaves",
      accords: ["Smoky Oud", "Black Tea", "Petrichor", "Dark Amber"],
      topNotes: "Bergamot, Green Tea Leaf, Sreemangal Petrichor",
      heartNotes: "Cardamom Pod, Bulgarian Rose, Smoked Cedar",
      baseNotes: "Wild Dehn Al Oud, Vetiver, Ambergris, Benzoin",
      projectedMargin: "78%",
      story: "শ্রীমঙ্গলের কুয়াশাচ্ছন্ন পাহাড়ে তামার পাত্রে পাতিত খাঁটি আগর কাঠ। ঐতিহ্যবাহী আভিজাত্যের প্রতীক।"
    },
    {
      name: "Imperial Sultana Attar",
      bengaliName: "ইম্পেরিয়াল সুলতানা আতর",
      tagline: "Royal Taif rose macerated in aged golden amber and Mysore sandalwood",
      accords: ["Velvet Rose", "Creamy Sandalwood", "Golden Amber", "Saffron"],
      topNotes: "Persian Saffron, Pink Pepper, Moroccan Neroli",
      heartNotes: "Taif Rose Otto, Night Blooming Jasmine, Orris Butter",
      baseNotes: "Mysore Sandalwood, Royal Honey, White Musk, Frankincense",
      projectedMargin: "82%",
      story: "অ্যালকোহলমুক্ত খাঁটি অনুপাতে তৈরি। রাজকীয় আবহ ও ১৪ ঘণ্টার বেশি লাস্টিং প্রদান করে।"
    },
    {
      name: "Sylhet Rain & White Amber",
      bengaliName: "সিলেট রেইন ও হোয়াইট আম্বার",
      tagline: "Fresh crystalline air of northeastern valleys meeting sensual amber warmth",
      accords: ["Aquatic Ozone", "Clean Linen", "White Amber", "Crisp Citrus"],
      topNotes: "Calabrian Mandarin, Crushed Mint, Rain Mist",
      heartNotes: "Hedione, Magnolia Blossom, White Violet",
      baseNotes: "Ambroxan, White Amber, Iso E Super, Cashmeran",
      projectedMargin: "74%",
      story: "চা বাগানের বৃষ্টির পর ভেসে আসা নির্মল সুবাস ও আম্বারের উষ্ণতা।"
    }
  ]);

  // Formula Ratio Suggestions state
  const [ratioType, setRatioType] = useState('Extrait de Parfum (30% oil concentration)');
  const [ratioNotes, setRatioNotes] = useState('Dehn al Oud Sreemangal, Taifi Rose, Sandalwood, Ambroxan');
  const [ratioTargetMl, setRatioTargetMl] = useState(50);
  const [ratioLoading, setRatioLoading] = useState(false);
  const [formulaRatioData, setFormulaRatioData] = useState<any>({
    concentrationName: "Extrait de Parfum (30% Fragrance Oil)",
    oilPercentage: 30,
    alcoholPercentage: 68,
    fixativeAndWaterPercentage: 2,
    macerationWeeks: 6,
    notesBreakdown: {
      topPercentage: 20,
      heartPercentage: 45,
      basePercentage: 35
    },
    suggestedFormula: [
      { ingredient: "Bergamot Calabrian FCF", type: "Top Note", ratio: "12%", suggestedGrams: "1.80g", purpose: "সূচনায় উজ্জ্বল ও সতেজ লেবুজাতীয় সাইট্রাস সুবাস" },
      { ingredient: "Pink Pepper CO2", type: "Top Note", ratio: "8%", suggestedGrams: "1.20g", purpose: "হালকা মসলাদার আকর্ষণীয় ওপেনিং" },
      { ingredient: "Rosa Damascena Absolute", type: "Heart Note", ratio: "22%", suggestedGrams: "3.30g", purpose: "মিষ্টি মধুর মতো গভীর গোলাপের কেন্দ্রবিন্দু" },
      { ingredient: "Hedione High Cis", type: "Heart Note", ratio: "15%", suggestedGrams: "2.25g", purpose: "সুবাসের প্রক্ষেপণ (Projection) ও ফুলের বিস্তার" },
      { ingredient: "Cardamom Green Oil", type: "Heart Note", ratio: "8%", suggestedGrams: "1.20g", purpose: "প্রাচ্যের উষ্ণ মসলার রাজকীয় ছোঁয়া" },
      { ingredient: "Sreemangal Dehn Al Oud", type: "Base Note", ratio: "18%", suggestedGrams: "2.70g", purpose: "গভীর কাঠের আভিজাত্যপূর্ণ স্থায়ী ভিত্তি" },
      { ingredient: "Ambroxan Crystals", type: "Base Note", ratio: "7%", suggestedGrams: "1.05g", purpose: "দীর্ঘস্থায়ী অ্যাম্বার মিনারেল সিলাজ (Sillage)" },
      { ingredient: "Iso E Super", type: "Base Note", ratio: "10%", suggestedGrams: "1.50g", purpose: "ভেলভেট কাষ্ঠল বুস্টার ও ফিক্সেটিভ" }
    ],
    perfumerNote: "মিশ্রণের পর বোতলগুলোকে ১৪°C থেকে ১৮°C তাপমাত্রায় অন্তত ৬ সপ্তাহ অন্ধকার স্থানে ম্যাসারেশন হতে দিন। চূড়ান্ত বোতলজাত করার আগে ৪°C তাপমাত্রায় ফিল্টার করুন।"
  });

  // Quick Notes state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Formula Scratchpad' | 'Supplier Quote' | 'VIP Client Request' | 'Operational'>('Formula Scratchpad');
  const [newNoteContent, setNewNoteContent] = useState('');

  // 1. Send question to Gemini 3.8 Flash
  const handleSendChat = async (questionText?: string) => {
    const q = (questionText || chatInput).trim();
    if (!q || chatLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const answer = await askGeminiHelp(q, chatMessages);
      const botMessage: ChatMessage = {
        role: 'model',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Copy bot text
  const handleCopyChatText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Save chat response directly to quick notes
  const handleSaveToNotes = (text: string, index: number) => {
    const newNote: QuickNote = {
      id: `NOTE-${Date.now()}`,
      title: 'Gemini 3.8 Flash পারফিউম পরামর্শ',
      category: 'Formula Scratchpad',
      content: text,
      timestamp: new Date().toLocaleString(),
    };
    onAddQuickNote(newNote);
    setSavedNoteIndex(index);
    setTimeout(() => setSavedNoteIndex(null), 2000);
  };

  // 2. Refresh Strategic Advisor
  const handleRunAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const res = await fetchStrategicAdvisor(advisorPrompt);
      setAdvisorResponse(res);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // 3. Generate Trending Names
  const handleGenerateNames = async () => {
    setNamesLoading(true);
    try {
      const names = await fetchTrendingNames(nameTheme, nameCategory, nameGender);
      setGeneratedNames(names);
    } finally {
      setNamesLoading(false);
    }
  };

  // 4. Calculate Formula Ratios
  const handleCalculateRatio = async () => {
    setRatioLoading(true);
    try {
      const data = await fetchFormulaRatio(ratioType, ratioNotes, ratioTargetMl);
      setFormulaRatioData(data);
    } finally {
      setRatioLoading(false);
    }
  };

  // 5. Create Note
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: QuickNote = {
      id: `NOTE-${Date.now()}`,
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      content: newNoteContent.trim(),
      timestamp: new Date().toLocaleString(),
    };

    onAddQuickNote(newNote);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  // Sync Sheet
  const handleSyncSheet = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(`আজ, ${time}`);
    }, 900);
  };

  // Quick suggestion prompts
  const suggestions = [
    'শ্রীমঙ্গলের আগর আতর (দাহন আল উদ) দিয়ে সেরা ব্লেন্ডিং ফর্মুলা কীভাবে করব?',
    '৫০ মিলি এক্সট্রাইট ডি পারফামে (৩০%) তেল, অ্যালকোহল ও ফিক্সেটিভের অনুপাত কত?',
    'বাংলাদেশে পারফিউমের প্রফিটেবল প্রাইসিং (MSRP) ও ৭০%+ গ্রস মার্জিন রক্ষার কৌশল?',
    'কুরিয়ার রিটার্ন কমাতে ও ক্যাশ অন ডেলিভারি (COD) দ্রুত কালেকশনের উপায় কী?',
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner & External Inventory Sync */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Bot className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-100 tracking-wide">
                জেমিনাই ৩.৮ ফ্ল্যাশ এআই অ্যাডভাইজর ও ইনভেন্টরি ম্যানেজমেন্ট
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              শ্রীমঙ্গলের খাঁটি আগর আতর ব্লেন্ডিং, ব্যবসায়িক লাভ বৃদ্ধি ও রিয়েল-টাইম গুগল শীট ইনভেন্টরি সিঙ্ক। যেকোনো জিজ্ঞাসায় জেমিনাই ৩.৮ ফ্ল্যাশ এআই আপনাকে সাহায্য করতে প্রস্তুত।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={sheetUrl || 'https://docs.google.com/spreadsheets'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/40 text-xs font-semibold transition-all shadow-md shadow-emerald-950/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>গুগল শীট ওপেন করুন</span>
            </a>

            <button
              onClick={handleSyncSheet}
              disabled={isSyncing}
              title="ইনভেন্টরি সিঙ্ক রিফ্রেশ করুন"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-400 text-xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সিঙ্ক রিফ্রেশ'}</span>
            </button>
          </div>
        </div>

        {/* Google Sheet URL Config Ribbon */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-neutral-400 truncate">
            <span className="text-emerald-400 font-medium">ইনভেন্টরি গুগল শীট লিংক:</span>
            {isEditingSheetUrl ? (
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={tempSheetUrl}
                  onChange={(e) => setTempSheetUrl(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-100 font-mono w-72 sm:w-96 focus:border-amber-500 focus:outline-none"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <button
                  onClick={() => {
                    onUpdateSheetUrl(tempSheetUrl);
                    setIsEditingSheetUrl(false);
                  }}
                  className="p-1 rounded bg-emerald-600 text-neutral-950 hover:bg-emerald-500"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="font-mono text-neutral-300 truncate max-w-sm sm:max-w-md">
                {sheetUrl || 'কোনো এক্সটার্নাল শীট যুক্ত করা নেই'}
              </span>
            )}
            {!isEditingSheetUrl && (
              <button
                onClick={() => setIsEditingSheetUrl(true)}
                className="text-neutral-500 hover:text-amber-400 p-0.5"
                title="শীট লিংক পরিবর্তন করুন"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-neutral-400 font-mono">
            <span>সর্বশেষ সিঙ্ক: <span className="text-emerald-400">{lastSyncTime}</span></span>
            <button
              onClick={() => setShowEmbedPreview(!showEmbedPreview)}
              className="text-amber-400 hover:underline"
            >
              {showEmbedPreview ? 'লাইভ প্রিভিউ লুকান' : 'লাইভ শীট প্রিভিউ দেখুন'}
            </button>
          </div>
        </div>

        {/* Optional Embedded Sheet Preview */}
        {showEmbedPreview && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="w-full h-80 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <iframe
                title="গুগল শীট লাইভ ভিউ"
                src={sheetUrl ? sheetUrl.replace('/edit', '/preview') : 'https://docs.google.com/spreadsheets'}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Feature Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800">
        <button
          onClick={() => setActiveTab('gemini_help')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gemini_help'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
              : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
          }`}
        >
          <Bot className="w-4 h-4 shrink-0" />
          <span>জেমিনাই ৩.৮ হেল্প</span>
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'advisor'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
              : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
          }`}
        >
          <Lightbulb className="w-4 h-4 shrink-0" />
          <span>বিজনেস স্ট্র্যাটেজি</span>
        </button>

        <button
          onClick={() => setActiveTab('names')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'names'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
              : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>পারফিউম নাম ও আইডিয়া</span>
        </button>

        <button
          onClick={() => setActiveTab('ratios')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'ratios'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
              : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
          }`}
        >
          <FlaskConical className="w-4 h-4 shrink-0" />
          <span>ফর্মুলেশন অনুপাত</span>
        </button>

        <button
          onClick={() => setActiveTab('notepad')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'notepad'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
              : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>ল্যাব ডায়েরি ({quickNotes.length})</span>
        </button>
      </div>

      {/* TAB 1: Gemini 3.8 Flash Interactive Helpdesk */}
      {activeTab === 'gemini_help' && (
        <div className="bg-neutral-900/80 border border-amber-500/40 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-950/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                  <span>জেমিনাই ৩.৮ ফ্ল্যাশ পারফিউম হেল্পডেস্ক (Gemini 3.8 Flash)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    Live AI
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  সুগন্ধি রসায়ন, আগরউড ম্যাসারেশন, মূল্য নির্ধারণ ও ব্যবসায়িক যেকোনো প্রশ্ন বাংলায় জিজ্ঞাসা করুন
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    role: 'model',
                    text: 'নতুন আলোচনা শুরু হয়েছে। আপনার প্রশ্ন বা পারফিউম সংক্রান্ত জিজ্ঞাসা লিখুন।',
                    timestamp: 'এখন',
                  },
                ]);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 text-xs transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>কথোপকথন রিস্টার্ট করুন</span>
            </button>
          </div>

          {/* Quick Questions Chips */}
          <div>
            <span className="text-[11px] font-medium text-neutral-400 block mb-2">
              💡 দ্রুত ক্লিক করে প্রশ্ন করুন (Quick Suggestions):
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(sug)}
                  disabled={chatLoading}
                  className="text-left text-xs px-3 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-amber-950/40 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-200 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Thread */}
          <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800 space-y-4 max-h-[500px] overflow-y-auto">
            {chatMessages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-neutral-500 font-mono">
                    <span>{isUser ? 'আপনি (User)' : 'Gemini 3.8 Flash (AI)'}</span>
                    {msg.timestamp && <span>• {msg.timestamp}</span>}
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-amber-600 text-neutral-950 font-medium rounded-tr-none shadow-md shadow-amber-950/30'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {!isUser && (
                    <div className="flex items-center space-x-2 mt-1.5">
                      <button
                        onClick={() => handleCopyChatText(msg.text, index)}
                        className="text-[11px] text-neutral-400 hover:text-amber-400 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSaveToNotes(msg.text, index)}
                        className="text-[11px] text-neutral-400 hover:text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors"
                      >
                        {savedNoteIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">নোটপ্যাডে সেভ হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            <span>নোটপ্যাডে সেভ করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center space-x-2 text-xs text-amber-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>জেমিনাই ৩.৮ ফ্ল্যাশ উত্তর প্রস্তুত করছে...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center space-x-2 bg-neutral-950 p-2 rounded-2xl border border-neutral-800 focus-within:border-amber-500 transition-colors">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendChat();
                }
              }}
              placeholder="জেমিনাই ৩.৮ ফ্ল্যাশকে বাংলায় যেকোনো কিছু জিজ্ঞাসা করুন (যেমন: আগরউড ব্লেন্ডিং, প্যাকেজিং বা COD)..."
              className="flex-1 bg-transparent text-neutral-100 placeholder:text-neutral-500 text-xs px-3 py-2 focus:outline-none"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50 transition-all shadow-md shadow-amber-950/30 shrink-0"
            >
              {chatLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>পাঠান</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Strategic Business Advisor Report */}
      {activeTab === 'advisor' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>ভেল্যুর মাস্টার স্ট্র্যাটেজিক ইনসাইট ও বিজনেস রিপোর্ট</span>
              </h3>
              <p className="text-xs text-neutral-400">
                শ্রীমঙ্গল আতর হাব, সেলস ট্রেন্ড, লাভজনক মূল্য ও কাঁচামাল সোর্সিংয়ের সামগ্রিক পরামর্শ
              </p>
            </div>

            <button
              onClick={handleRunAdvisor}
              disabled={advisorLoading}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-950/40"
            >
              {advisorLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>বিশ্লেষণ চলছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>নতুন রিপোর্ট জেনারেট করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              নির্দিষ্ট কোনো ব্যবসায়িক বা ইনভেন্টরি বিষয়ে প্রশ্ন (ঐচ্ছিক):
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={advisorPrompt}
                onChange={(e) => setAdvisorPrompt(e.target.value)}
                placeholder="যেমন: শ্রীমঙ্গলের বর্ষার আগর তেল সংগ্রহ ও ভিআইপি গ্রাহকদের জন্য নতুন আতর পরিকল্পনা..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={handleRunAdvisor}
                disabled={advisorLoading}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
              >
                আস্ক করুন
              </button>
            </div>
          </div>

          {/* Report Display */}
          <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 text-xs text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
            {advisorResponse}
          </div>
        </div>
      )}

      {/* TAB 3: Trending Name & Concept Generator */}
      {activeTab === 'names' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>নতুন পারফিউম ও আতর কনসেপ্ট জেনারেটর</span>
            </h3>
            <p className="text-xs text-neutral-400">
              ভেল্যুর ব্র্যান্ডের ঐতিহ্য, শ্রীমঙ্গলের সুবাস ও আন্তর্জাতিক রাজকীয় নোটসের ওপর ভিত্তি করে নতুন পারফিউমের নাম ও সুগন্ধি প্রোফাইল
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1">থিম বা অ্যারোমা স্টাইল:</label>
              <input
                type="text"
                value={nameTheme}
                onChange={(e) => setNameTheme(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">ক্যাটাগরি:</label>
              <select
                value={nameCategory}
                onChange={(e) => setNameCategory(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="আর্টিসানাল আতর ও এক্সট্রাইট ডি পারফাম">আর্টিসানাল আতর ও এক্সট্রাইট ডি পারফাম</option>
                <option value="পিওর আতর (১০০% নন-অ্যালকোহলিক)">পিওর আতর (১০০% নন-অ্যালকোহলিক)</option>
                <option value="ইউ ডি পারফাম (EDP ২০%)">ইউ ডি পারফাম (EDP ২০%)</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">টার্গেট কাস্টমার:</label>
              <select
                value={nameGender}
                onChange={(e) => setNameGender(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="রয়্যাল ইউনিসেক্স">রয়্যাল ইউনিসেক্স</option>
                <option value="ম্যাসকুলিন / রিজার্ভ">ম্যাসকুলিন / রিজার্ভ</option>
                <option value="ফেমিনিন / ব্রাইডাল">ফেমিনিন / ব্রাইডাল</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateNames}
              disabled={namesLoading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-950/40"
            >
              {namesLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>আইডিয়া তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>নতুন পারফিউম আইডিয়া জেনারেট করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedNames.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-serif-luxury font-bold text-amber-300">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-300 font-semibold mt-0.5">
                        {item.bengaliName}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      মার্জিন: {item.projectedMargin}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 italic mt-2">
                    "{item.tagline}"
                  </p>

                  <div className="mt-3 space-y-1.5 text-[11px] bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850">
                    <div>
                      <strong className="text-amber-400">টপ নোট:</strong> {item.topNotes}
                    </div>
                    <div>
                      <strong className="text-amber-400">হার্ট নোট:</strong> {item.heartNotes}
                    </div>
                    <div>
                      <strong className="text-amber-400">বেস নোট:</strong> {item.baseNotes}
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-3 leading-relaxed">
                    {item.story}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                  <span>VELLURE Heritage Blend</span>
                  <button
                    onClick={() => {
                      const note: QuickNote = {
                        id: `NOTE-${Date.now()}`,
                        title: `${item.name} (${item.bengaliName})`,
                        category: 'Formula Scratchpad',
                        content: `টপ: ${item.topNotes}\nহার্ট: ${item.heartNotes}\nবেস: ${item.baseNotes}\nবিবরণ: ${item.story}`,
                        timestamp: new Date().toLocaleString(),
                      };
                      onAddQuickNote(note);
                      alert('আইডিয়াটি ল্যাব ডায়েরিতে সংরক্ষিত হয়েছে!');
                    }}
                    className="text-amber-400 hover:underline"
                  >
                    + ডায়েরিতে সেভ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Formulation Ratios Calculator */}
      {activeTab === 'ratios' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>পারফিউম ও আতর ফর্মুলেশন ক্যালকুলেটর (IFRA স্ট্যান্ডার্ড)</span>
            </h3>
            <p className="text-xs text-neutral-400">
              তেলের ঘনত্ব, অ্যালকোহল, ফিক্সেটিভ ও সুগন্ধি উপাদানের সঠিক গ্রাম হিসাব
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1">সুগন্ধির ধরন:</label>
              <select
                value={ratioType}
                onChange={(e) => setRatioType(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="Extrait de Parfum (30% oil concentration)">Extrait de Parfum (৩০% তেল)</option>
                <option value="Pure Artisanal Attar (100% concentrated oil)">Pure Artisanal Attar (১০০% তেল)</option>
                <option value="Eau de Parfum (20% oil concentration)">Eau de Parfum (২০% তেল)</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">মূল নোটস:</label>
              <input
                type="text"
                value={ratioNotes}
                onChange={(e) => setRatioNotes(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">টার্গেট ভলিউম (মিলি):</label>
              <input
                type="number"
                value={ratioTargetMl}
                onChange={(e) => setRatioTargetMl(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCalculateRatio}
              disabled={ratioLoading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-950/40"
            >
              {ratioLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>হিসাব হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>অনুপাত হিসাব করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Results Table */}
          {formulaRatioData && (
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">সুগন্ধি তেল</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                    {formulaRatioData.oilPercentage}%
                  </div>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">পারফিউমার অ্যালকোহল</div>
                  <div className="text-base font-bold font-mono text-neutral-100 mt-0.5">
                    {formulaRatioData.alcoholPercentage}%
                  </div>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">ফিক্সেটিভ ও ব্যালেন্স</div>
                  <div className="text-base font-bold font-mono text-blue-400 mt-0.5">
                    {formulaRatioData.fixativeAndWaterPercentage}%
                  </div>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">ম্যাসারেশন সময়কাল</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                    {formulaRatioData.macerationWeeks} সপ্তাহ
                  </div>
                </div>
              </div>

              {formulaRatioData.suggestedFormula && (
                <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900/90 text-neutral-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">উপাদান (Ingredient)</th>
                        <th className="py-2.5 px-3">নোটের ধরন</th>
                        <th className="py-2.5 px-3 text-center">অনুপাত (%)</th>
                        <th className="py-2.5 px-3 text-center">গ্রাম (g)</th>
                        <th className="py-2.5 px-3">কার্যকারিতা ও বৈশিষ্ট্য</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-200">
                      {formulaRatioData.suggestedFormula.map((ing: any, iIdx: number) => (
                        <tr key={iIdx} className="hover:bg-neutral-800/30">
                          <td className="py-2.5 px-3 font-semibold text-neutral-100">{ing.ingredient}</td>
                          <td className="py-2.5 px-3 text-neutral-400">{ing.type}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-amber-400">{ing.ratio}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-100">{ing.suggestedGrams}</td>
                          <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{ing.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {formulaRatioData.perfumerNote && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5">মাস্টার পারফিউমার রিকমেন্ডেশন:</strong>
                  {formulaRatioData.perfumerNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Laboratory Notes & Scratchpad */}
      {activeTab === 'notepad' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>ল্যাবরেটরি ডায়েরি ও কুইক নোটপ্যাড</span>
              </h3>
              <p className="text-xs text-neutral-400">
                কাস্টম সুগন্ধি রিকুয়েস্ট, শ্রীমঙ্গল আগরউড ব্যাচ নম্বর, সাপ্লায়ার কোটেশন ও টিমের কাজের রিমাইন্ডার সেভ করুন
              </p>
            </div>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleCreateNote} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="নোটের শিরোনাম (যেমন: শ্রীমঙ্গল আগর কাঠ ব্যাচ #৪, স্পেশাল ব্রাইডাল আতর)..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Formula Scratchpad">ফর্মুলা নোট</option>
                  <option value="Supplier Quote">সাপ্লায়ার কোটেশন</option>
                  <option value="VIP Client Request">ভিআইপি কাস্টমার রিকুয়েস্ট</option>
                  <option value="Operational">অপারেশনাল নোট</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                required
                rows={3}
                placeholder="ফর্মুলেশন অনুপাত, তেলের গ্রেড, কাস্টমারের পছন্দের নোট বা কাজের বিবরণ লিখুন..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-neutral-100 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>নোটপ্যাডে সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>

          {/* Saved Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickNotes.map((note) => (
              <div
                key={note.id}
                className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {note.category === 'Formula Scratchpad'
                        ? 'ফর্মুলা নোট'
                        : note.category === 'Supplier Quote'
                        ? 'সাপ্লায়ার কোটেশন'
                        : note.category === 'VIP Client Request'
                        ? 'ভিআইপি রিকুয়েস্ট'
                        : 'অপারেশনাল'}
                    </span>
                    <button
                      onClick={() => onDeleteQuickNote(note.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      title="নোট ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-neutral-100 text-xs mt-2">
                    {note.title}
                  </h4>
                  <p className="text-neutral-400 text-xs mt-1 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 border-t border-neutral-800 pt-2">
                  {note.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
