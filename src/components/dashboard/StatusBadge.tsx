import { cn } from "@/lib/utils";

export type TestStatus = "pending" | "in_progress" | "passed" | "failed" | "scheduled";

interface StatusBadgeProps {
  status: TestStatus;
  size?: "sm" | "md";
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-pending/10 text-pending border-pending/20",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-info/10 text-info border-info/20",
  },
  passed: {
    label: "Passed",
    className: "bg-success/10 text-success border-success/20",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.className,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          status === "pending" && "bg-pending",
          status === "in_progress" && "bg-info animate-pulse",
          status === "passed" && "bg-success",
          status === "failed" && "bg-destructive",
          status === "scheduled" && "bg-muted-foreground"
        )}
      />
      {config.label}
    </span>
  );
}
