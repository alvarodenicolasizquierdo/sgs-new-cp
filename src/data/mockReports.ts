import { format, subDays, subHours } from "date-fns";

export type TransactionType = "test_request" | "inspection" | "certification" | "payment" | "refund";
export type TransactionStatus = "completed" | "pending" | "failed" | "processing";

export interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  description: string;
  reference: string;
  supplier: string;
  amount: number;
  status: TransactionStatus;
  category: string;
  testType?: string;
}

export interface ReportSummary {
  totalTransactions: number;
  totalValue: number;
  pendingCount: number;
  completedCount: number;
  avgProcessingDays: number;
  topSuppliers: { name: string; count: number; value: number }[];
}

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastRun: Date;
  schedule?: "daily" | "weekly" | "monthly";
  filters: Record<string, string>;
  columns: string[];
  createdBy: string;
}

export interface BalanceItem {
  id: string;
  category: string;
  pending: number;
  completed: number;
  failed: number;
  total: number;
}

// Generate mock transactions
const suppliers = [
  "Evergreen Textiles Ltd",
  "Pacific Garments Co",
  "Golden Thread Mills",
  "Sunrise Apparel",
  "Premier Fabrics Inc",
  "Elite Manufacturing",
  "Quality Stitch Works",
  "Global Textiles Corp",
];

const categories = ["Physical Testing", "Chemical Testing", "Performance Testing", "Safety Compliance", "Certification"];
const testTypes = ["Tensile Strength", "Colorfastness", "Pilling Resistance", "Shrinkage", "Seam Strength", "Flammability"];

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < 150; i++) {
    const type: TransactionType = ["test_request", "inspection", "certification", "payment", "refund"][
      Math.floor(Math.random() * 5)
    ] as TransactionType;
    
    const status: TransactionStatus = ["completed", "pending", "failed", "processing"][
      Math.floor(Math.random() * 4)
    ] as TransactionStatus;
    
    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, "0")}`,
      date: subHours(new Date(), Math.floor(Math.random() * 720)), // Last 30 days
      type,
      description: type === "test_request" 
        ? `Test Request - ${testTypes[Math.floor(Math.random() * testTypes.length)]}`
        : type === "inspection"
        ? `Factory Inspection - ${["Pre-production", "In-line", "Final"][Math.floor(Math.random() * 3)]}`
        : type === "certification"
        ? `Certificate Issuance - ${["OEKO-TEX", "GOTS", "BCI", "GRS"][Math.floor(Math.random() * 4)]}`
        : type === "payment"
        ? "Service Payment"
        : "Service Refund",
      reference: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      amount: type === "refund" 
        ? -(Math.floor(Math.random() * 500) + 100)
        : Math.floor(Math.random() * 2000) + 200,
      status,
      category: categories[Math.floor(Math.random() * categories.length)],
      testType: type === "test_request" ? testTypes[Math.floor(Math.random() * testTypes.length)] : undefined,
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockTransactions = generateTransactions();

export const mockReportSummary: ReportSummary = {
  totalTransactions: mockTransactions.length,
  totalValue: mockTransactions.reduce((sum, t) => sum + t.amount, 0),
  pendingCount: mockTransactions.filter((t) => t.status === "pending").length,
  completedCount: mockTransactions.filter((t) => t.status === "completed").length,
  avgProcessingDays: 3.2,
  topSuppliers: suppliers.slice(0, 5).map((name) => ({
    name,
    count: mockTransactions.filter((t) => t.supplier === name).length,
    value: mockTransactions.filter((t) => t.supplier === name).reduce((sum, t) => sum + t.amount, 0),
  })),
};

export const mockSavedReports: SavedReport[] = [
  {
    id: "rpt-001",
    name: "Monthly Test Summary",
    description: "Summary of all testing activities by supplier and category",
    createdAt: subDays(new Date(), 45),
    lastRun: subDays(new Date(), 2),
    schedule: "monthly",
    filters: { status: "completed", type: "test_request" },
    columns: ["date", "supplier", "category", "amount", "status"],
    createdBy: "John Smith",
  },
  {
    id: "rpt-002",
    name: "Pending Inspections Report",
    description: "All pending factory inspections requiring action",
    createdAt: subDays(new Date(), 30),
    lastRun: subDays(new Date(), 1),
    schedule: "weekly",
    filters: { status: "pending", type: "inspection" },
    columns: ["date", "supplier", "reference", "status"],
    createdBy: "Sarah Johnson",
  },
  {
    id: "rpt-003",
    name: "Certification Tracker",
    description: "Track all certification issuances and renewals",
    createdAt: subDays(new Date(), 60),
    lastRun: subDays(new Date(), 7),
    schedule: "daily",
    filters: { type: "certification" },
    columns: ["date", "supplier", "description", "status", "amount"],
    createdBy: "Mike Chen",
  },
  {
    id: "rpt-004",
    name: "Supplier Payment Analysis",
    description: "Financial overview by supplier with payment trends",
    createdAt: subDays(new Date(), 15),
    lastRun: subHours(new Date(), 6),
    filters: { type: "payment" },
    columns: ["date", "supplier", "amount", "reference"],
    createdBy: "Lisa Wang",
  },
];

export const mockBalances: BalanceItem[] = [
  {
    id: "bal-001",
    category: "Physical Testing",
    pending: 24500,
    completed: 156200,
    failed: 3200,
    total: 183900,
  },
  {
    id: "bal-002",
    category: "Chemical Testing",
    pending: 18300,
    completed: 89400,
    failed: 1500,
    total: 109200,
  },
  {
    id: "bal-003",
    category: "Inspections",
    pending: 32100,
    completed: 214800,
    failed: 4800,
    total: 251700,
  },
  {
    id: "bal-004",
    category: "Certifications",
    pending: 12400,
    completed: 67500,
    failed: 800,
    total: 80700,
  },
  {
    id: "bal-005",
    category: "Performance Testing",
    pending: 8900,
    completed: 45200,
    failed: 2100,
    total: 56200,
  },
];

export const transactionColumns = [
  { id: "date", label: "Date", defaultVisible: true },
  { id: "type", label: "Type", defaultVisible: true },
  { id: "description", label: "Description", defaultVisible: true },
  { id: "reference", label: "Reference", defaultVisible: true },
  { id: "supplier", label: "Supplier", defaultVisible: true },
  { id: "category", label: "Category", defaultVisible: false },
  { id: "testType", label: "Test Type", defaultVisible: false },
  { id: "amount", label: "Amount", defaultVisible: true },
  { id: "status", label: "Status", defaultVisible: true },
];
