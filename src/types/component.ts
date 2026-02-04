// Component/Material Types based on TU Sainsbury's Spec
// Implements N:M relationship between Styles and Components

export type ComponentType = "fabric" | "trim";

export type FibreType = 
  | "cotton"
  | "organic_cotton"
  | "bci_cotton"
  | "polyester"
  | "recycled_polyester"
  | "nylon"
  | "recycled_nylon"
  | "viscose"
  | "tencel"
  | "modal"
  | "linen"
  | "silk"
  | "wool"
  | "cashmere"
  | "elastane"
  | "spandex"
  | "other";

export type ComponentStatus = 
  | "draft"
  | "pending"
  | "submitted"
  | "approved"
  | "rejected"
  | "queried";

export type DyeMethod = 
  | "piece_dyed"
  | "yarn_dyed"
  | "garment_dyed"
  | "printed"
  | "raw"
  | "other";

export type FabricConstruction = 
  | "jersey"
  | "interlock"
  | "rib"
  | "fleece"
  | "french_terry"
  | "twill"
  | "poplin"
  | "denim"
  | "canvas"
  | "satin"
  | "chiffon"
  | "voile"
  | "other";

// Fibre composition entry
export interface FibreComposition {
  id: string;
  fibreType: FibreType;
  fibreLabel: string; // Display name
  percentage: number;
  isSustainable: boolean;
  isRecycled: boolean;
  certificationCode?: string;
}

// Base component interface
export interface ComponentBase {
  id: string;
  linkId?: string; // For reuse tracking - links to original component
  componentType: ComponentType;
  mill: string;
  tuReference: string;
  countryOfOrigin: string;
  isSustainable: boolean;
  isRegenerative: boolean;
  reachCompliant: boolean;
  
  // Testing status per style (from lnk_style_component)
  status: ComponentStatus;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Fabric component
export interface FabricComponent extends ComponentBase {
  componentType: "fabric";
  composition: FibreComposition[]; // Must total 100%
  construction: FabricConstruction;
  weight: number; // g/m²
  width: number; // cm
  dyeMethod: DyeMethod;
  colour?: string;
}

// Trim component
export interface TrimComponent extends ComponentBase {
  componentType: "trim";
  trimType: string; // Button, zipper, label, etc.
  colour: string;
  size?: string;
  material?: string;
}

export type Component = FabricComponent | TrimComponent;

// N:M Link between Style and Component
export interface StyleComponentLink {
  id: string;
  styleId: string;
  componentId: string;
  testId?: string; // FK to BASE test for this component
  labId?: string;
  tuStatus: ComponentStatus;
  linkedAt: string;
  linkedBy: string;
  
  // Testing data that may be copied from another style
  baseTestCopiedFrom?: string; // StyleID if copied
  baseTestCopiedAt?: string;
  baseTestExpiresAt?: string;
}

// Component Test
export type TestLevel = "base" | "bulk" | "garment";
export type TestUploadMethod = "lab" | "upload";
export type TestStatus = "draft" | "pending" | "submitted" | "tested";

export interface ComponentTest {
  id: string;
  componentId: string;
  styleId: string;
  level: TestLevel;
  uploadMethod: TestUploadMethod;
  status: TestStatus;
  
  // Lab info
  labId: string;
  labName: string;
  
  // Actual composition (may differ from quoted)
  actualComposition?: FibreComposition[];
  
  // Results
  testDate?: string;
  dueDate?: string;
  reportCode?: string;
  colourCode?: string;
  
  // Score grid
  parameters: TestParameter[];
  
  // Attachments
  attachments: TestAttachment[];
  
  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface TestParameter {
  id: string;
  name: string;
  specification: string;
  result?: string;
  status: "pass" | "fail" | "conditional" | "pending";
  notes?: string;
}

export interface TestAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Filter types
export interface ComponentFilter {
  search: string;
  type: ComponentType[];
  status: ComponentStatus[];
  isSustainable?: boolean;
  construction?: FabricConstruction[];
  fibreTypes?: FibreType[];
}

// Config objects
export const componentTypeConfig: Record<ComponentType, { label: string; icon: string }> = {
  fabric: { label: "Fabric", icon: "🧵" },
  trim: { label: "Trim", icon: "🔘" },
};

export const componentStatusConfig: Record<ComponentStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-muted-foreground", bgColor: "bg-muted" },
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  submitted: { label: "Submitted", color: "text-info", bgColor: "bg-info/10" },
  approved: { label: "Approved", color: "text-success", bgColor: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bgColor: "bg-destructive/10" },
  queried: { label: "Queried", color: "text-warning", bgColor: "bg-warning/10" },
};

export const fibreTypeConfig: Record<FibreType, { 
  label: string; 
  isSustainable: boolean;
  category: "natural" | "synthetic" | "regenerated" 
}> = {
  cotton: { label: "Cotton", isSustainable: false, category: "natural" },
  organic_cotton: { label: "Organic Cotton", isSustainable: true, category: "natural" },
  bci_cotton: { label: "BCI Cotton", isSustainable: true, category: "natural" },
  polyester: { label: "Polyester", isSustainable: false, category: "synthetic" },
  recycled_polyester: { label: "Recycled Polyester", isSustainable: true, category: "synthetic" },
  nylon: { label: "Nylon", isSustainable: false, category: "synthetic" },
  recycled_nylon: { label: "Recycled Nylon", isSustainable: true, category: "synthetic" },
  viscose: { label: "Viscose", isSustainable: false, category: "regenerated" },
  tencel: { label: "TENCEL™", isSustainable: true, category: "regenerated" },
  modal: { label: "Modal", isSustainable: true, category: "regenerated" },
  linen: { label: "Linen", isSustainable: true, category: "natural" },
  silk: { label: "Silk", isSustainable: false, category: "natural" },
  wool: { label: "Wool", isSustainable: false, category: "natural" },
  cashmere: { label: "Cashmere", isSustainable: false, category: "natural" },
  elastane: { label: "Elastane", isSustainable: false, category: "synthetic" },
  spandex: { label: "Spandex", isSustainable: false, category: "synthetic" },
  other: { label: "Other", isSustainable: false, category: "synthetic" },
};

export const constructionConfig: Record<FabricConstruction, { label: string; type: "knit" | "woven" }> = {
  jersey: { label: "Jersey", type: "knit" },
  interlock: { label: "Interlock", type: "knit" },
  rib: { label: "Rib", type: "knit" },
  fleece: { label: "Fleece", type: "knit" },
  french_terry: { label: "French Terry", type: "knit" },
  twill: { label: "Twill", type: "woven" },
  poplin: { label: "Poplin", type: "woven" },
  denim: { label: "Denim", type: "woven" },
  canvas: { label: "Canvas", type: "woven" },
  satin: { label: "Satin", type: "woven" },
  chiffon: { label: "Chiffon", type: "woven" },
  voile: { label: "Voile", type: "woven" },
  other: { label: "Other", type: "woven" },
};

export const dyeMethodConfig: Record<DyeMethod, { label: string }> = {
  piece_dyed: { label: "Piece Dyed" },
  yarn_dyed: { label: "Yarn Dyed" },
  garment_dyed: { label: "Garment Dyed" },
  printed: { label: "Printed" },
  raw: { label: "Raw/Undyed" },
  other: { label: "Other" },
};

export const testLevelConfig: Record<TestLevel, { 
  label: string; 
  order: number;
  prerequisite?: TestLevel;
  canBeCopied: boolean;
}> = {
  base: { 
    label: "BASE Testing", 
    order: 1,
    canBeCopied: true, // Can copy within validity period
  },
  bulk: { 
    label: "BULK Testing", 
    order: 2,
    prerequisite: "base",
    canBeCopied: false, // Never copied - always per-style
  },
  garment: { 
    label: "Garment Testing", 
    order: 3,
    prerequisite: "base",
    canBeCopied: false,
  },
};
