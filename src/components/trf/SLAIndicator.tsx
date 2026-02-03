import { slaConfig } from "@/types/trf";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SLAIndicatorProps {
  status: "on_track" | "at_risk" | "overdue";
  dueDate: string;
}

export function SLAIndicator({ status, dueDate }: SLAIndicatorProps) {
  const config = slaConfig[status];
  const daysRemaining = Math.ceil(
    (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getDaysLabel = () => {
    if (daysRemaining < 0) return `${Math.abs(daysRemaining)}d overdue`;
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining === 1) return "Due tomorrow";
    return `${daysRemaining}d remaining`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", config.color)} />
          <span className="text-xs text-muted-foreground">{getDaysLabel()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
