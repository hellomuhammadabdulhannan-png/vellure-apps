import {
  UserPermission,
  Invoice,
  FragranceFormula,
  RawMaterialInvoice,
  OperatingExpense,
  AssetCategory,
  QuickNote,
  ModuleDefinition
} from '../types';

export const BRAND_DETAILS = {
  name: "VELLURE",
  tagline: "Luxury Fragrances & Attar",
  email: "Contact.Vellurefragrances.com",
  mobile: "+8801820-032330",
  whatsapp: "+8801820-032330",
  website: "vellurefragrances.com",
  address: "Sreemangal, Moulvibazar, Bangladesh",
  registeredCity: "Sreemangal",
  registeredDistrict: "Moulvibazar",
  country: "Bangladesh",
  currency: "৳",
  currencyCode: "BDT",
};

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 1,
    name: "User & Access Management",
    shortName: "Users & Privileges",
    description: "Admin controls system access, credentials and page permissions for staff.",
    icon: "ShieldAlert"
  },
  {
    id: 2,
    name: "Customer History & Analytics",
    shortName: "Sales Analytics",
    description: "Real-time sales dashboard, customer logs, filters and quick-view invoices.",
    icon: "BarChart3"
  },
  {
    id: 3,
    name: "AI Insights & Inventory Integration",
    shortName: "AI Advisor & Sheet (জেমিনাই ৩.৮)",
    description: "Gemini 3.8 Flash পারফিউম হেল্পডেস্ক, গুগল শীট লাইভ স্টক সিঙ্ক ও সুগন্ধি ফর্মুলেশন।",
    icon: "Sparkles"
  },
  {
    id: 4,
    name: "Formula Vault & Buying Invoices",
    shortName: "Formulas & Vault",
    description: "Central recipe book, fragrance dilutions, and raw material purchase logs.",
    icon: "FlaskConical"
  },
  {
    id: 5,
    name: "Financial Overview (P&L & Assets)",
    shortName: "P&L & Assets",
    description: "Financial accounting health check, operating costs, and asset balance indicators.",
    icon: "DollarSign"
  },
  {
    id: 6,
    name: "Invoice Generator & Courier Dispatch",
    shortName: "Dispatch & Invoices",
    description: "Billing, Pathao & Steadfast integration, WhatsApp triggers and 7-day review queue.",
    icon: "FileText"
  },
  {
    id: 7,
    name: "Courier Sticker Thermal Printer",
    shortName: "Thermal Labels",
    description: "Print labels for Rongta & universal thermal printers (3\"x2\", 4\"x6\", 80mm).",
    icon: "Printer"
  },
  {
    id: 8,
    name: "Premium Thank You Card Generator",
    shortName: "Luxury Cards",
    description: "Luxury packaging insert card with fragrance care instructions and brand crest.",
    icon: "Award"
  }
];

export const INITIAL_USERS: UserPermission[] = [
  {
    userId: "USR-001",
    username: "abdul.hannan",
    password: "Kr100300500",
    fullName: "Md. Abdul Hannan",
    email: "hannan@vellurefragrances.com",
    role: "Super Admin",
    department: "Executive",
    status: "Active",
    allowedModules: [1, 2, 3, 4, 5, 6, 7, 8],
    createdAt: "2025-01-10",
    lastLogin: "Just now"
  },
  {
    userId: "USR-002",
    username: "farhan.logistics",
    password: "Farhan@Vellure26",
    fullName: "Farhan Ahmed",
    email: "farhan@vellurefragrances.com",
    role: "Dispatch Specialist",
    department: "Logistics",
    status: "Active",
    allowedModules: [2, 6, 7, 8],
    createdAt: "2025-04-15",
    lastLogin: "2 hours ago"
  },
  {
    userId: "USR-003",
    username: "nusrat.lab",
    password: "Nusrat@Vellure26",
    fullName: "Nusrat Jahan",
    email: "nusrat@vellurefragrances.com",
    role: "Lab Formulator",
    department: "Laboratory",
    status: "Active",
    allowedModules: [3, 4],
    createdAt: "2025-06-20",
    lastLogin: "Yesterday"
  },
  {
    userId: "USR-004",
    username: "tanvir.sales",
    password: "Tanvir@Vellure26",
    fullName: "Tanvir Hossain",
    email: "tanvir@vellurefragrances.com",
    role: "Sales Associate",
    department: "Sales & Marketing",
    status: "Active",
    allowedModules: [2, 6, 8],
    createdAt: "2025-08-01",
    lastLogin: "Today, 10:15 AM"
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "VEL-INV-2026-0101",
    trackingId: "ST-BD-98231",
    date: "2026-09-25",
    time: "11:20 AM",
    customerName: "Barrister Rafiqul Islam",
    customerPhone: "01711234567",
    customerEmail: "rafiq.islam@lawchambers.bd",
    deliveryAddress: "House 42, Road 11, Block D, Banani",
    district: "Dhaka",
    thana: "Banani",
    courierPartner: "Steadfast Courier",
    courierConsignmentId: "ST-CONS-99120",
    items: [
      {
        id: "ITM-01",
        productName: "Oud Royal De Sreemangal",
        type: "Attar (Pure Oil)",
        size: "12ml Tola",
        quantity: 1,
        unitPrice: 5800
      },
      {
        id: "ITM-02",
        productName: "Sultana Rose Taifi",
        type: "Extrait de Parfum",
        size: "50ml",
        quantity: 1,
        unitPrice: 4200
      }
    ],
    subtotal: 10000,
    deliveryFee: 120,
    discount: 500,
    advancePaid: 2000,
    codAmount: 7620,
    paymentStatus: "Partial Paid",
    orderStatus: "Dispatched",
    paymentMethod: "bKash Merchant",
    notes: "VIP customer - Include luxury golden velvet pouch and handwritten note.",
    reviewReminderDate: "2026-10-02",
    reviewStatus: "Pending",
    thermalPrinted: true
  },
  {
    id: "VEL-INV-2026-0102",
    trackingId: "PTH-88421",
    date: "2026-09-25",
    time: "09:45 AM",
    customerName: "Dr. Mahjabeen Akhter",
    customerPhone: "01819876543",
    customerEmail: "mahjabeen.doctor@gmail.com",
    deliveryAddress: "Apartment 6B, Concord Tower, Gulshan-2",
    district: "Dhaka",
    thana: "Gulshan",
    courierPartner: "Pathao Courier",
    courierConsignmentId: "PTH-772391",
    items: [
      {
        id: "ITM-03",
        productName: "Sylhet Rain & White Amber",
        type: "Eau de Parfum",
        size: "100ml",
        quantity: 1,
        unitPrice: 3800
      }
    ],
    subtotal: 3800,
    deliveryFee: 120,
    discount: 0,
    advancePaid: 3920,
    codAmount: 0,
    paymentStatus: "Full Paid",
    orderStatus: "In Transit",
    paymentMethod: "City Bank BD",
    notes: "Leave with building reception if unavailable.",
    reviewReminderDate: "2026-10-02",
    reviewStatus: "Pending",
    thermalPrinted: true
  },
  {
    id: "VEL-INV-2026-0103",
    trackingId: "ST-BD-98232",
    date: "2026-09-24",
    time: "04:15 PM",
    customerName: "Zubair Al Mahmood",
    customerPhone: "01912334455",
    deliveryAddress: "GEC Circle, East Nasirabad, House 14",
    district: "Chittagong",
    thana: "Panchlaish",
    courierPartner: "Steadfast Courier",
    courierConsignmentId: "ST-CONS-99121",
    items: [
      {
        id: "ITM-04",
        productName: "Kashmir White Musk Attar",
        type: "Attar (Pure Oil)",
        size: "6ml",
        quantity: 2,
        unitPrice: 1950
      },
      {
        id: "ITM-05",
        productName: "Smoky Cardamom Tea Attar",
        type: "Attar (Pure Oil)",
        size: "6ml",
        quantity: 1,
        unitPrice: 2200
      }
    ],
    subtotal: 6100,
    deliveryFee: 150,
    discount: 300,
    advancePaid: 0,
    codAmount: 5950,
    paymentStatus: "Cash on Delivery (COD)",
    orderStatus: "In Transit",
    paymentMethod: "Cash on Delivery",
    notes: "Call before reaching location.",
    reviewReminderDate: "2026-10-01",
    reviewStatus: "Pending",
    thermalPrinted: true
  },
  {
    id: "VEL-INV-2026-0104",
    trackingId: "ST-BD-98188",
    date: "2026-09-22",
    time: "02:30 PM",
    customerName: "Engr. Saiful Haque",
    customerPhone: "01722998877",
    deliveryAddress: "Zindabazar Point, Jalalabad Mansion",
    district: "Sylhet",
    thana: "Kotwali",
    courierPartner: "Steadfast Courier",
    courierConsignmentId: "ST-CONS-99084",
    items: [
      {
        id: "ITM-06",
        productName: "Oud Royal De Sreemangal",
        type: "Extrait de Parfum",
        size: "50ml",
        quantity: 1,
        unitPrice: 6200
      }
    ],
    subtotal: 6200,
    deliveryFee: 80,
    discount: 0,
    advancePaid: 6280,
    codAmount: 0,
    paymentStatus: "Full Paid",
    orderStatus: "Delivered",
    paymentMethod: "bKash Merchant",
    notes: "Sylhet local pickup partner hub.",
    reviewReminderDate: "2026-09-29",
    reviewStatus: "Sent",
    thermalPrinted: true
  },
  {
    id: "VEL-INV-2026-0105",
    trackingId: "PTH-88390",
    date: "2026-09-18",
    time: "01:10 PM",
    customerName: "Syeda Anika Tabassum",
    customerPhone: "01633554422",
    deliveryAddress: "Road 7/A, House 22, Dhanmondi",
    district: "Dhaka",
    thana: "Dhanmondi",
    courierPartner: "Pathao Courier",
    courierConsignmentId: "PTH-771902",
    items: [
      {
        id: "ITM-07",
        productName: "Imperial Ambergris Tola",
        type: "Attar (Pure Oil)",
        size: "12ml Tola",
        quantity: 1,
        unitPrice: 7500
      }
    ],
    subtotal: 7500,
    deliveryFee: 120,
    discount: 500,
    advancePaid: 1000,
    codAmount: 6120,
    paymentStatus: "Partial Paid",
    orderStatus: "Delivered",
    paymentMethod: "Nagad Personal",
    notes: "Gift packaging for wedding anniversary.",
    reviewReminderDate: "2026-09-25",
    reviewStatus: "Completed",
    thermalPrinted: true
  },
  {
    id: "VEL-INV-2026-0106",
    trackingId: "ST-BD-98240",
    date: "2026-09-25",
    time: "12:50 PM",
    customerName: "Fazle Rabbi",
    customerPhone: "01855667788",
    deliveryAddress: "College Road, Near Tea Garden Resort",
    district: "Moulvibazar",
    thana: "Sreemangal",
    courierPartner: "Steadfast Courier",
    items: [
      {
        id: "ITM-08",
        productName: "Smoky Cardamom Tea Attar",
        type: "Attar (Pure Oil)",
        size: "3ml",
        quantity: 1,
        unitPrice: 1200
      }
    ],
    subtotal: 1200,
    deliveryFee: 60,
    discount: 0,
    advancePaid: 0,
    codAmount: 1260,
    paymentStatus: "Cash on Delivery (COD)",
    orderStatus: "Processing",
    paymentMethod: "Cash on Delivery",
    notes: "Local Sreemangal delivery.",
    reviewReminderDate: "2026-10-02",
    reviewStatus: "Pending",
    thermalPrinted: false
  }
];

export const INITIAL_FORMULAS: FragranceFormula[] = [
  {
    id: "FOR-001",
    code: "VEL-OUD-01",
    name: "Oud Royal De Sreemangal",
    bengaliName: "উদ রয়েল দ্য শ্রীমঙ্গল",
    type: "Extrait de Parfum (30%)",
    olfactoryFamily: "Oriental Woody",
    description: "The crown jewel of VELLURE. Pure wild Aquilaria agallocha from Sreemangal rainforest estates married with smoky leather and golden amber.",
    targetSizeMl: 50,
    topNotes: ["Calabrian Bergamot", "Sichuan Pepper", "Green Tea Shoot"],
    heartNotes: ["Rosa Damascena Absolute", "Nutmeg", "Orris Butter"],
    baseNotes: ["Sreemangal Wild Dehn Al Oud", "Mysore Sandalwood", "Ambroxan Crystals", "Birch Tar"],
    ingredients: [
      { id: "ING-1", name: "Sreemangal Wild Dehn Al Oud Oil", category: "Base Note", percentage: 18, gramsPer100g: 5.4, unitCostPerGram: 450 },
      { id: "ING-2", name: "Rosa Damascena Absolute", category: "Heart Note", percentage: 12, gramsPer100g: 3.6, unitCostPerGram: 180 },
      { id: "ING-3", name: "Mysore Sandalwood Oil (Santalum Album)", category: "Base Note", percentage: 14, gramsPer100g: 4.2, unitCostPerGram: 220 },
      { id: "ING-4", name: "Ambroxan Crystals (Fine Grade)", category: "Fixative", percentage: 8, gramsPer100g: 2.4, unitCostPerGram: 65 },
      { id: "ING-5", name: "Iso E Super", category: "Fixative", percentage: 16, gramsPer100g: 4.8, unitCostPerGram: 25 },
      { id: "ING-6", name: "Calabrian Bergamot FCF", category: "Top Note", percentage: 10, gramsPer100g: 3.0, unitCostPerGram: 45 },
      { id: "ING-7", name: "Hedione High-Cis", category: "Heart Note", percentage: 12, gramsPer100g: 3.6, unitCostPerGram: 30 },
      { id: "ING-8", name: "Orris & Spice Accord", category: "Heart Note", percentage: 10, gramsPer100g: 3.0, unitCostPerGram: 85 }
    ],
    macerationDays: 45,
    costPerBottle: 1850,
    recommendedMSRP: 6200,
    profitMarginPercent: 70.1,
    isConfidential: true,
    createdDate: "2025-02-14"
  },
  {
    id: "FOR-002",
    code: "VEL-ATT-02",
    name: "Sultana Rose Taifi",
    bengaliName: "সুলতানা রোজ তায়িফি আতর",
    type: "Pure Artisanal Attar",
    olfactoryFamily: "Floral Amber",
    description: "Zero-alcohol concentrated attar using first-pick Taifi roses hydro-distilled into creamy Australian sandalwood and white amber base.",
    targetSizeMl: 12,
    topNotes: ["Taifi Rose Otto", "Moroccan Neroli", "Persian Saffron"],
    heartNotes: ["Damascus Rose Petal", "Jasmine Sambac", "Honey Accord"],
    baseNotes: ["White Sandalwood Oil", "Golden Ambergris Resin", "Civet Musk (Cruelty-Free)"],
    ingredients: [
      { id: "ING-9", name: "Taifi Rose Otto Oil", category: "Heart Note", percentage: 28, gramsPer100g: 3.36, unitCostPerGram: 380 },
      { id: "ING-10", name: "Sandalwood Oil (Carrier / Base)", category: "Solvent/Carrier", percentage: 40, gramsPer100g: 4.80, unitCostPerGram: 210 },
      { id: "ING-11", name: "Persian Saffron Super Negin Tincture", category: "Top Note", percentage: 10, gramsPer100g: 1.20, unitCostPerGram: 350 },
      { id: "ING-12", name: "Ambergris White Resonoid", category: "Base Note", percentage: 12, gramsPer100g: 1.44, unitCostPerGram: 290 },
      { id: "ING-13", name: "Jasmine Sambac Pure CO2", category: "Heart Note", percentage: 10, gramsPer100g: 1.20, unitCostPerGram: 160 }
    ],
    macerationDays: 60,
    costPerBottle: 1650,
    recommendedMSRP: 5800,
    profitMarginPercent: 71.5,
    isConfidential: true,
    createdDate: "2025-03-01"
  },
  {
    id: "FOR-003",
    code: "VEL-EDP-03",
    name: "Sylhet Rain & White Amber",
    bengaliName: "সিলেট রেইন ও হোয়াইট আম্বার",
    type: "Eau de Parfum (20%)",
    olfactoryFamily: "Fresh Aquatic Oud",
    description: "Captures the fresh rain-drenched petrichor of the Sreemangal tea hills drying into an intimate white amber and mineral musk.",
    targetSizeMl: 100,
    topNotes: ["Crushed Mint", "Calabrian Mandarin", "Petrichor Ozone"],
    heartNotes: ["White Lotus", "Hedione", "Green Cardamom"],
    baseNotes: ["White Amber", "Ambroxan", "Clean Cedarwood", "Cashmeran"],
    ingredients: [
      { id: "ING-14", name: "Ambroxan Crystals", category: "Base Note", percentage: 22, gramsPer100g: 4.4, unitCostPerGram: 65 },
      { id: "ING-15", name: "Iso E Super & Cashmeran Blend", category: "Fixative", percentage: 28, gramsPer100g: 5.6, unitCostPerGram: 28 },
      { id: "ING-16", name: "Petrichor Geosmin & Ozone Accord", category: "Top Note", percentage: 15, gramsPer100g: 3.0, unitCostPerGram: 90 },
      { id: "ING-17", name: "Calabrian Mandarin Oil", category: "Top Note", percentage: 15, gramsPer100g: 3.0, unitCostPerGram: 35 },
      { id: "ING-18", name: "Hedione High-Cis", category: "Heart Note", percentage: 20, gramsPer100g: 4.0, unitCostPerGram: 30 }
    ],
    macerationDays: 30,
    costPerBottle: 1100,
    recommendedMSRP: 3800,
    profitMarginPercent: 71.0,
    isConfidential: false,
    createdDate: "2025-05-18"
  }
];

export const INITIAL_BUYING_INVOICES: RawMaterialInvoice[] = [
  {
    id: "RAW-2026-081",
    invoiceNumber: "SAD-9021-INV",
    supplierName: "Sylhet Agarwood Artisanal Distillers",
    supplierLocation: "Barlekha, Moulvibazar, Bangladesh",
    purchaseDate: "2026-09-12",
    items: [
      { materialName: "Aged Sreemangal Wild Dehn Al Oud Oil (Copper Still)", quantity: 250, unit: "gram", ratePerUnit: 420, subtotal: 105000 },
      { materialName: "Distillation Grade Agarwood Chips (Grade Super Double)", quantity: 5, unit: "kg", ratePerUnit: 14000, subtotal: 70000 }
    ],
    totalCost: 175000,
    taxOrDuty: 0,
    netPayable: 175000,
    paymentStatus: "Paid",
    paymentMethod: "City Bank BD Transfer",
    receivedBy: "Md. Abdul Hannan"
  },
  {
    id: "RAW-2026-082",
    invoiceNumber: "FRA-BD-3301",
    supplierName: "Fine Aromatics Imports (Grasse - Dhaka Hub)",
    supplierLocation: "Motijheel, Dhaka",
    purchaseDate: "2026-09-15",
    items: [
      { materialName: "Ambroxan Crystals 99.5%", quantity: 2, unit: "kg", ratePerUnit: 52000, subtotal: 104000 },
      { materialName: "Hedione High-Cis (Firmenich)", quantity: 5, unit: "liter", ratePerUnit: 18500, subtotal: 92500 },
      { materialName: "Iso E Super (IFF Grade)", quantity: 10, unit: "liter", ratePerUnit: 14000, subtotal: 140000 },
      { materialName: "Rosa Damascena Absolute (Bulgarian Import)", quantity: 100, unit: "gram", ratePerUnit: 175, subtotal: 17500 }
    ],
    totalCost: 354000,
    taxOrDuty: 12000,
    netPayable: 366000,
    paymentStatus: "Paid",
    paymentMethod: "Bank Asia Pay Order",
    receivedBy: "Nusrat Jahan"
  },
  {
    id: "RAW-2026-083",
    invoiceNumber: "GLS-PKG-774",
    supplierName: "Amber Glass & Sprayers Packaging Co.",
    supplierLocation: "Old Dhaka, Lalbagh",
    purchaseDate: "2026-09-20",
    items: [
      { materialName: "Luxury 50ml Heavy Base Glass Perfume Bottles + Gold Magnetic Caps", quantity: 500, unit: "pieces", ratePerUnit: 185, subtotal: 92500 },
      { materialName: "12ml Crystal Octagon Attar Tolas with Glass Dip Rods", quantity: 600, unit: "pieces", ratePerUnit: 95, subtotal: 57000 },
      { materialName: "Rongta 3\"x2\" High-Density Direct Thermal Sticky Label Rolls", quantity: 40, unit: "roll", ratePerUnit: 420, subtotal: 16800 },
      { materialName: "Rigid Drawer Luxury Gift Boxes with Gold Foil Stamping", quantity: 500, unit: "pieces", ratePerUnit: 140, subtotal: 70000 }
    ],
    totalCost: 236300,
    taxOrDuty: 0,
    netPayable: 236300,
    paymentStatus: "Credit",
    paymentMethod: "Cheque (Due in 15 days)",
    receivedBy: "Farhan Ahmed"
  }
];

export const INITIAL_OPERATING_EXPENSES: OperatingExpense[] = [
  {
    id: "EXP-01",
    date: "2026-09-01",
    category: "Rent & Distillation Lab",
    description: "Sreemangal Master Laboratory & Aging Vault Facility Rent",
    amount: 35000,
    paidVia: "bKash Merchant",
    approvedBy: "Md. Abdul Hannan"
  },
  {
    id: "EXP-02",
    date: "2026-09-05",
    category: "Staff Salaries",
    description: "Laboratory assistant, dispatch specialist & sales executive payroll",
    amount: 68000,
    paidVia: "City Bank BD",
    approvedBy: "Md. Abdul Hannan"
  },
  {
    id: "EXP-03",
    date: "2026-09-10",
    category: "Digital Ads & Marketing",
    description: "Facebook & Instagram VIP Audience Campaigns (Dhaka & Sylhet)",
    amount: 24000,
    paidVia: "Credit Card",
    approvedBy: "Tanvir Hossain"
  },
  {
    id: "EXP-04",
    date: "2026-09-18",
    category: "Courier Shipping Charges",
    description: "Steadfast & Pathao monthly COD remittance & advance delivery prepaid balance",
    amount: 14500,
    paidVia: "bKash Merchant",
    approvedBy: "Farhan Ahmed"
  },
  {
    id: "EXP-05",
    date: "2026-09-22",
    category: "Utilities & Glass Cleaning",
    description: "Laboratory ultrasonic bottle sanitation, power & climate control for maceration room",
    amount: 11200,
    paidVia: "Nagad",
    approvedBy: "Nusrat Jahan"
  }
];

export const INITIAL_ASSET_BREAKDOWN: AssetCategory[] = [
  {
    categoryName: "Liquid Bank & Merchant Reserves",
    description: "bKash Merchant, Nagad Personal, and City Bank operating accounts",
    estimatedValue: 485000,
    details: "Ready cash flow for daily COD settlement, logistics payments, and raw wood procurement."
  },
  {
    categoryName: "Raw Aroma Oils & Pure Agarwood Stock",
    description: "Wild Sreemangal Dehn Al Oud, Taifi Rose, Mysore Sandalwood, and French Aroma Chemicals",
    estimatedValue: 920000,
    details: "Stored in sealed nitrogen-flushed amber glass demijohns in Sreemangal vault."
  },
  {
    categoryName: "Finished Goods in Maceration & Ready Stock",
    description: "Bottled Extrait de Parfums (50ml/100ml) and aging artisanal Attar tolas",
    estimatedValue: 640000,
    details: "Inventory ready for instant Steadfast/Pathao courier dispatch."
  },
  {
    categoryName: "Lab Equipment, Printers & Packaging",
    description: "Pneumatic bottle crimpers, magnetic heating stirrers, Rongta thermal printers & rigid luxury boxes",
    estimatedValue: 275000,
    details: "Capital assets including 2 Rongta POS thermal printers, precision analytical balances (0.001g), and copper test stills."
  }
];

export const INITIAL_QUICK_NOTES: QuickNote[] = [
  {
    id: "NOTE-01",
    title: "Sreemangal Rain Formula Adjustment",
    content: "Increase Ambroxan from 20% to 22% and test 0.5% Cashmeran for better winter longevity in Dhaka air conditioning.",
    timestamp: "2026-09-24 04:30 PM",
    category: "Formula Scratchpad"
  },
  {
    id: "NOTE-02",
    title: "Sylhet Distiller Barlekha Batch Inquiry",
    content: "Mr. Faruk promised 500g copper-distilled 12-year agarwood oil at ৳390/g if ordered before Oct 15th.",
    timestamp: "2026-09-22 11:15 AM",
    category: "Supplier Quote"
  },
  {
    id: "NOTE-03",
    title: "VIP Custom Bridal Request - Dr. Mahjabeen",
    content: "Wants 20 pieces of custom 6ml crystal tolas with custom calligraphy for wedding reception favors.",
    timestamp: "2026-09-20 02:00 PM",
    category: "VIP Client Request"
  }
];

export const DEFAULT_INVENTORY_SHEET_URL = "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing";
