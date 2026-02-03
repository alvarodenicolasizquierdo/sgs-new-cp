import { InspectionStatus, inspectionStatusConfig } from "@/types/inspection";
import { cn } from "@/lib/utils";

interface InspectionStatusBadgeProps {
  status: InspectionStatus;
  size?: "sm" | "md";
}

export function InspectionStatusBadge({ status, size = "md" }: InspectionStatusBadgeProps) {
  const config = inspectionStatusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {config.label}
    </span>
  );
}
