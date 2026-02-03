import { InspectionResult, resultConfig } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface InspectionResultBadgeProps {
  result?: InspectionResult;
  size?: "sm" | "md";
}

const icons: Record<InspectionResult, React.ElementType> = {
  pass: CheckCircle2,
  fail: XCircle,
  pending: Clock,
  conditional: AlertTriangle,
};

export function InspectionResultBadge({ result, size = "md" }: InspectionResultBadgeProps) {
  if (!result) {
    return (
      <span className="text-xs text-muted-foreground">—</span>
    );
  }

  const config = resultConfig[result];
  const Icon = icons[result];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
