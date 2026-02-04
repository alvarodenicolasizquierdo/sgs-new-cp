// Style Management Types based on TU Sainsbury's Spec

export type StyleStatus = 
  | "pending"
  | "submitted"
  | "approved"
  | "deactivated"
  | "cancelled";

export type StyleStage = 
  | "base"
  | "base_approved"
  | "bulk"
  | "bulk_approved"
  | "product"
  | "product_approved";

export type Division = "childrens" | "mens" | "womens";

export type Season = "SS24" | "AW24" | "SS25" | "AW25" | "SS26" | "AW26";

export type SelfApprovalLevel = 0 | 1 | 2 | 3; // 0=None, 1=Bronze, 2=Silver, 3=Gold

export interface Supplier {
  id: string;
  code: string;
  name: string;
  selfApprovalLevel: SelfApprovalLevel;
  testExpiryMonths: number; // Typically 6
  factories: Factory[];
  logo?: string;
}

export interface Factory {
  id: string;
  name: string;
  country: string;
  supplierId: string;
}

export interface Technologist {
  id: string;
  name: string;
  email: string;
  type: "fabric" | "garment";
  avatar?: string;
}

export interface CareSymbol {
  id: string;
  code: string;
  category: "wash" | "bleach" | "tumble_dry" | "iron" | "dry_clean";
  description: string;
  icon: string;
}

export interface CareWording {
  id: string;
  text: string;
  symbolIds: string[]; // Related symbols
}

export interface Style {
  id: string;
  // Header fields
  supplierId: string;
  supplier: Supplier;
  tuStyleNo: string; // 9 digits
  designStyleRef: string;
  description: string;
  productColour: string;
  
  // Organizational
  factoryId: string;
  factory: Factory;
  division: Division;
  department: string;
  season: Season;
  endUse: string;
  countryOfOrigin: string;
  
  // Status & Stage
  status: StyleStatus;
  stage: StyleStage;
  toRead: boolean; // Active vs Archived
  overallStyleSheetApproved: boolean;
  
  // Dates
  fabricCutDate: string;
  goldSealDate: string;
  baseApprovalRequired?: string;
  
  // Assignment (Named Routing)
  fabricTechId: string;
  fabricTech: Technologist;
  garmentTechId: string;
  garmentTech: Technologist;
  
  // Product Info
  singleOrMultipack: "single" | "multipack";
  orderQuantity: number;
  internalDept?: string;
  promotionalClaims?: string;
  
  // Washed Product & EIM
  washedProduct: boolean;
  eimScoreAvailable?: boolean;
  eimForecastedScore?: number;
  eimAchievedScore?: number;
  
  // BCI Cotton (conditional)
  bciCottonKg?: number;
  bciOdfNumber?: string;
  spinner?: string;
  totalKnitWovenKg?: number;
  
  // Care Labels
  careSymbols: CareSymbol[];
  careWording: CareWording[];
  
  // Components
  componentIds: string[];
  
  // GSW
  gswStatus?: "not_started" | "submitted" | "approved" | "rejected";
  gswSubmittedDate?: string;
  gswApprovedDate?: string;
  gswVersion?: number;
  
  // Images
  images: StyleImage[];
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface StyleImage {
  id: string;
  url: string;
  type: "front" | "back" | "detail" | "other";
  description: string;
  uploadedAt: string;
}

// Filter types
export interface StyleFilter {
  search: string;
  status: StyleStatus[];
  stage: StyleStage[];
  division: Division[];
  season: Season[];
  supplier: string[];
  fabricTech: string[];
  garmentTech: string[];
  dateRange: { from?: Date; to?: Date };
}

// Config objects for UI
export const styleStatusConfig: Record<StyleStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  submitted: { label: "Submitted", color: "text-info", bgColor: "bg-info/10" },
  approved: { label: "Approved", color: "text-success", bgColor: "bg-success/10" },
  deactivated: { label: "Deactivated", color: "text-muted-foreground", bgColor: "bg-muted" },
  cancelled: { label: "Cancelled", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export const stageConfig: Record<StyleStage, { 
  label: string; 
  shortLabel: string;
  order: number;
  color: string; 
  bgColor: string;
  description: string;
}> = {
  base: { 
    label: "Base Testing", 
    shortLabel: "Base",
    order: 1,
    color: "text-warning", 
    bgColor: "bg-warning/10",
    description: "Initial component testing phase"
  },
  base_approved: { 
    label: "Base Approved", 
    shortLabel: "Base ✓",
    order: 2,
    color: "text-success", 
    bgColor: "bg-success/10",
    description: "All base tests approved by technologist"
  },
  bulk: { 
    label: "Bulk Testing", 
    shortLabel: "Bulk",
    order: 3,
    color: "text-primary", 
    bgColor: "bg-primary/10",
    description: "Production batch testing phase"
  },
  bulk_approved: { 
    label: "Bulk Approved", 
    shortLabel: "Bulk ✓",
    order: 4,
    color: "text-success", 
    bgColor: "bg-success/10",
    description: "All bulk tests approved"
  },
  product: { 
    label: "Product Testing", 
    shortLabel: "Product",
    order: 5,
    color: "text-info", 
    bgColor: "bg-info/10",
    description: "Finished garment testing"
  },
  product_approved: { 
    label: "Product Approved", 
    shortLabel: "Product ✓",
    order: 6,
    color: "text-success", 
    bgColor: "bg-success/10",
    description: "Ready for GSW submission"
  },
};

export const divisionConfig: Record<Division, { label: string; departments: string[] }> = {
  childrens: { 
    label: "Children's", 
    departments: ["Baby", "Toddler", "Kids 3-7", "Kids 8-14", "School Uniform"]
  },
  mens: { 
    label: "Men's", 
    departments: ["Casual", "Formal", "Outerwear", "Underwear", "Nightwear", "Sportswear"]
  },
  womens: { 
    label: "Women's", 
    departments: ["Casual", "Formal", "Outerwear", "Underwear", "Nightwear", "Maternity", "Sportswear"]
  },
};

export const selfApprovalConfig: Record<SelfApprovalLevel, { label: string; color: string }> = {
  0: { label: "None", color: "text-muted-foreground" },
  1: { label: "Bronze", color: "text-amber-700" },
  2: { label: "Silver", color: "text-slate-500" },
  3: { label: "Gold", color: "text-yellow-500" },
};
