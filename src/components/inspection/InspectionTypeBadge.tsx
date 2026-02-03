import { InspectionType, inspectionTypeConfig } from "@/types/inspection";
import { cn } from "@/lib/utils";

interface InspectionTypeBadgeProps {
  type: InspectionType;
  variant?: "short" | "full";
}

export function InspectionTypeBadge({ type, variant = "short" }: InspectionTypeBadgeProps) {
  const config = inspectionTypeConfig[type];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground"
      )}
    >
      {variant === "short" ? config.shortLabel : config.label}
    </span>
  );
}
