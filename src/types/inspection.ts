export type InspectionStatus = 
  | "scheduled" 
  | "in_progress" 
  | "pending_review" 
  | "completed" 
  | "cancelled" 
  | "on_hold";

export type InspectionType = 
  | "pre_production" 
  | "during_production" 
  | "final_random" 
  | "container_loading" 
  | "factory_audit";

// Final inspection outcomes are PASS or FAIL only (AQL-based).
// "pending" and "requires_action" are workflow states, not outcomes.
export type InspectionOutcome = "pass" | "fail";
export type InspectionWorkflowResult = "pending" | "requires_action";
export type InspectionResult = InspectionOutcome | InspectionWorkflowResult;

export type RiskLevel = "low" | "medium" | "high";

export interface Inspection {
  id: string;
  inspectionNumber: string;
  purchaseOrder: string;
  productName: string;
  productCode: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  factory: {
    id: string;
    name: string;
    location: string;
    country: string;
  };
  inspector: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: InspectionStatus;
  inspectionType: InspectionType;
  result?: InspectionResult;
  riskLevel: RiskLevel;
  scheduledDate: string;
  completedDate?: string;
  sampleSize: number;
  defectsFound: number;
  criticalDefects: number;
  majorDefects: number;
  minorDefects: number;
  aqlLevel: string;
  score?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionFilter {
  search: string;
  status: InspectionStatus[];
  inspectionType: InspectionType[];
  result: InspectionResult[];
  riskLevel: RiskLevel[];
  supplier: string[];
  factory: string[];
  inspector: string[];
  dateRange: { from?: Date; to?: Date };
}

export const inspectionStatusConfig: Record<InspectionStatus, { label: string; color: string; bgColor: string }> = {
  scheduled: { label: "Scheduled", color: "text-info", bgColor: "bg-info/10" },
  in_progress: { label: "In Progress", color: "text-primary", bgColor: "bg-primary/10" },
  pending_review: { label: "Pending Review", color: "text-warning", bgColor: "bg-warning/10" },
  completed: { label: "Completed", color: "text-success", bgColor: "bg-success/10" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted" },
  on_hold: { label: "On Hold", color: "text-warning", bgColor: "bg-warning/10" },
};

export const inspectionTypeConfig: Record<InspectionType, { label: string; shortLabel: string }> = {
  pre_production: { label: "Pre-Production", shortLabel: "PPI" },
  during_production: { label: "During Production", shortLabel: "DPI" },
  final_random: { label: "Final Random", shortLabel: "FRI" },
  container_loading: { label: "Container Loading", shortLabel: "CLI" },
  factory_audit: { label: "Factory Audit", shortLabel: "FA" },
};

export const resultConfig: Record<InspectionResult, { label: string; color: string; bgColor: string; isOutcome: boolean }> = {
  pass: { label: "Pass", color: "text-success", bgColor: "bg-success/10", isOutcome: true },
  fail: { label: "Fail", color: "text-destructive", bgColor: "bg-destructive/10", isOutcome: true },
  pending: { label: "Pending", color: "text-muted-foreground", bgColor: "bg-muted", isOutcome: false },
  requires_action: { label: "Requires Corrective Action", color: "text-warning", bgColor: "bg-warning/10", isOutcome: false },
};

export const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low Risk", color: "text-success", bgColor: "bg-success/10" },
  medium: { label: "Medium Risk", color: "text-warning", bgColor: "bg-warning/10" },
  high: { label: "High Risk", color: "text-destructive", bgColor: "bg-destructive/10" },
};
