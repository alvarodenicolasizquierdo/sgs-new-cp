export type TRFStatus = 
  | "draft" 
  | "submitted" 
  | "in_review" 
  | "approved" 
  | "testing" 
  | "completed" 
  | "rejected" 
  | "on_hold";

export type TRFPriority = "urgent" | "high" | "normal" | "low";

export type TestType = 
  | "physical" 
  | "chemical" 
  | "flammability" 
  | "colorfastness" 
  | "dimensional" 
  | "performance";

export interface TRF {
  id: string;
  trfNumber: string;
  productName: string;
  productCode: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  lab: {
    id: string;
    name: string;
    location: string;
  };
  status: TRFStatus;
  priority: TRFPriority;
  testTypes: TestType[];
  submittedDate: string;
  dueDate: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  progress: number;
  slaStatus: "on_track" | "at_risk" | "overdue";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TRFFilter {
  search: string;
  status: TRFStatus[];
  priority: TRFPriority[];
  testTypes: TestType[];
  supplier: string[];
  lab: string[];
  dateRange: { from?: Date; to?: Date };
  slaStatus: ("on_track" | "at_risk" | "overdue")[];
}

export const statusConfig: Record<TRFStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-muted-foreground", bgColor: "bg-muted" },
  submitted: { label: "Submitted", color: "text-info", bgColor: "bg-info/10" },
  in_review: { label: "In Review", color: "text-warning", bgColor: "bg-warning/10" },
  approved: { label: "Approved", color: "text-success", bgColor: "bg-success/10" },
  testing: { label: "Testing", color: "text-primary", bgColor: "bg-primary/10" },
  completed: { label: "Completed", color: "text-success", bgColor: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bgColor: "bg-destructive/10" },
  on_hold: { label: "On Hold", color: "text-warning", bgColor: "bg-warning/10" },
};

export const priorityConfig: Record<TRFPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: "Urgent", color: "text-destructive", bgColor: "bg-destructive/10" },
  high: { label: "High", color: "text-warning", bgColor: "bg-warning/10" },
  normal: { label: "Normal", color: "text-primary", bgColor: "bg-primary/10" },
  low: { label: "Low", color: "text-muted-foreground", bgColor: "bg-muted" },
};

export const slaConfig: Record<"on_track" | "at_risk" | "overdue", { label: string; color: string }> = {
  on_track: { label: "On Track", color: "bg-success" },
  at_risk: { label: "At Risk", color: "bg-warning" },
  overdue: { label: "Overdue", color: "bg-destructive" },
};
