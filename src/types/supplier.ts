// Supplier Portal Types - Inbox-driven workflow model

export type TaskType = 
  | "style_approval"
  | "component_approval"
  | "test_review"
  | "gsw_review"
  | "fabric_hangar"
  | "query_response"
  | "bulk_approval"
  | "care_label_approval";

export type TaskPriority = "urgent" | "high" | "normal" | "low";

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface SupplierTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  
  // Related entities
  styleId?: string;
  styleTuNo?: string;
  styleDescription?: string;
  componentId?: string;
  testId?: string;
  
  // Assignment
  assignedTo: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  assignedBy?: {
    id: string;
    name: string;
  };
  
  // Dates
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  
  // SLA
  slaStatus: "on_track" | "at_risk" | "overdue";
  
  // Notes/Comments
  notes?: string;
  queryMessage?: string;
}

// Task type config
export const taskTypeConfig: Record<TaskType, { 
  label: string; 
  icon: string;
  description: string;
  color: string;
}> = {
  style_approval: { 
    label: "Style Approval", 
    icon: "📋",
    description: "Review and approve style sheet",
    color: "text-primary"
  },
  component_approval: { 
    label: "Component Approval", 
    icon: "🧵",
    description: "Review and approve component/material",
    color: "text-info"
  },
  test_review: { 
    label: "Test Review", 
    icon: "🔬",
    description: "Review test results and approve/reject",
    color: "text-warning"
  },
  gsw_review: { 
    label: "GSW Review", 
    icon: "📄",
    description: "Review Gold Seal Workbook submission",
    color: "text-success"
  },
  fabric_hangar: { 
    label: "Fabric Hangar", 
    icon: "🏷️",
    description: "Approve fabric sample submission",
    color: "text-purple-500"
  },
  query_response: { 
    label: "Query Response", 
    icon: "❓",
    description: "Respond to technologist query",
    color: "text-destructive"
  },
  bulk_approval: { 
    label: "Bulk Approval", 
    icon: "📦",
    description: "Approve bulk testing results",
    color: "text-blue-500"
  },
  care_label_approval: { 
    label: "Care Label Approval", 
    icon: "🏷️",
    description: "Review and approve care labels",
    color: "text-orange-500"
  },
};

export const taskPriorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: "Urgent", color: "text-destructive", bgColor: "bg-destructive/10" },
  high: { label: "High", color: "text-warning", bgColor: "bg-warning/10" },
  normal: { label: "Normal", color: "text-primary", bgColor: "bg-primary/10" },
  low: { label: "Low", color: "text-muted-foreground", bgColor: "bg-muted" },
};

export const taskStatusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  in_progress: { label: "In Progress", color: "text-info", bgColor: "bg-info/10" },
  completed: { label: "Completed", color: "text-success", bgColor: "bg-success/10" },
  blocked: { label: "Blocked", color: "text-destructive", bgColor: "bg-destructive/10" },
};
