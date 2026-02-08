import { InspectionResult, resultConfig } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InspectionResultBadgeProps {
  result?: InspectionResult;
  size?: "sm" | "md";
}

const icons: Record<InspectionResult, React.ElementType> = {
  pass: CheckCircle2,
  fail: XCircle,
  pending: Clock,
  requires_action: AlertTriangle,
};

export function InspectionResultBadge({ result, size = "md" }: InspectionResultBadgeProps) {
  if (!result) {
    return (
      <span className="text-xs text-muted-foreground">—</span>
    );
  }

  const config = resultConfig[result];
  const Icon = icons[result];
  const isWorkflowState = !config.isOutcome;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        isWorkflowState && "border border-dashed border-current/20"
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
      {isWorkflowState && <Info className="h-2.5 w-2.5 opacity-60" />}
    </span>
  );

  if (isWorkflowState) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-xs">
            <p className="font-medium mb-1">Workflow Status</p>
            <p>This status indicates the current processing stage. Final inspection outcome (Pass/Fail) is determined after all test items are evaluated per AQL criteria.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
