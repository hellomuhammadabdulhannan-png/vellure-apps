export type ModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export interface UserPermission {
  userId: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Master Perfumer' | 'Store Manager' | 'Dispatch Specialist' | 'Lab Formulator' | 'Sales Associate';
  department: 'Executive' | 'Laboratory' | 'Logistics' | 'Sales & Marketing' | 'Finance';
  status: 'Active' | 'Suspended';
  allowedModules: ModuleId[];
  createdAt: string;
  lastLogin: string;
}

export type CourierPartner = 'Steadfast Courier' | 'Pathao Courier';

export interface OrderItem {
  id: string;
  productName: string;
  type: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string; // e.g. INV-2026-0842
  trackingId: string; // e.g. ST-BD-98231 or PTH-88421
  date: string; // YYYY-MM-DD
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  district: string;
  thana?: string;
  courierPartner: CourierPartner;
  courierConsignmentId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  advancePaid: number;
  codAmount: number;
  paymentStatus: 'Full Paid' | 'Partial Paid' | 'Cash on Delivery (COD)';
  orderStatus: 'Delivered' | 'In Transit' | 'Processing' | 'Dispatched' | 'Cancelled' | 'Returned';
  paymentMethod: 'bKash Merchant' | 'Nagad Personal' | 'City Bank BD' | 'Cash on Delivery';
  notes?: string;
  reviewReminderDate?: string;
  reviewStatus: 'Pending' | 'Sent' | 'Completed';
  thermalPrinted?: boolean;
}

export interface FormulaIngredient {
  id: string;
  name: string;
  category: 'Top Note' | 'Heart Note' | 'Base Note' | 'Solvent/Carrier' | 'Fixative';
  casNumber?: string;
  percentage: number; // e.g. 15 (%)
  gramsPer100g: number;
  unitCostPerGram: number; // in BDT
}

export interface FragranceFormula {
  id: string;
  code: string; // e.g. VEL-ATT-001
  name: string;
  bengaliName?: string;
  type: 'Pure Artisanal Attar' | 'Extrait de Parfum (30%)' | 'Eau de Parfum (20%)';
  olfactoryFamily: 'Oriental Woody' | 'Floral Amber' | 'Fresh Aquatic Oud' | 'Spicy Leather' | 'Gourmand Rose';
  description: string;
  targetSizeMl: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  ingredients: FormulaIngredient[];
  macerationDays: number;
  costPerBottle: number; // BDT
  recommendedMSRP: number; // BDT
  profitMarginPercent: number;
  isConfidential: boolean;
  createdDate: string;
}

export interface RawMaterialInvoice {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  supplierLocation: string;
  purchaseDate: string;
  items: {
    materialName: string;
    quantity: number;
    unit: 'kg' | 'liter' | 'gram' | 'pieces' | 'roll';
    ratePerUnit: number;
    subtotal: number;
  }[];
  totalCost: number;
  taxOrDuty: number;
  netPayable: number;
  paymentStatus: 'Paid' | 'Credit' | 'Partial';
  paymentMethod: string;
  receivedBy: string;
}

export interface OperatingExpense {
  id: string;
  date: string;
  category: 'Rent & Distillation Lab' | 'Packaging & Boxes' | 'Thermal Paper Rolls' | 'Courier Shipping Charges' | 'Staff Salaries' | 'Digital Ads & Marketing' | 'Utilities & Glass Cleaning';
  description: string;
  amount: number;
  paidVia: string;
  approvedBy: string;
}

export interface AssetCategory {
  categoryName: string;
  description: string;
  estimatedValue: number;
  details: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  category: 'Formula Scratchpad' | 'Supplier Quote' | 'VIP Client Request' | 'Operational';
}

export interface ReviewReminderItem {
  invoiceId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  dispatchedDate: string;
  scheduledDate: string;
  status: 'Pending' | 'Sent' | 'Feedback Received';
  customerRating?: number;
  customerFeedback?: string;
}
