import { TRFPriority, priorityConfig } from "@/types/trf";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";

interface TRFPriorityBadgeProps {
  priority: TRFPriority;
  showLabel?: boolean;
}

const priorityIcons: Record<TRFPriority, React.ElementType> = {
  urgent: AlertTriangle,
  high: ArrowUp,
  normal: Minus,
  low: ArrowDown,
};

export function TRFPriorityBadge({ priority, showLabel = true }: TRFPriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = priorityIcons[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full px-2 py-0.5 text-xs",
        config.color,
        config.bgColor
      )}
      data-help="priority-badge"
    >
      <Icon className="h-3 w-3" />
      {showLabel && config.label}
    </span>
  );
}
