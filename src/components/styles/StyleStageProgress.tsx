import { cn } from "@/lib/utils";
import { StyleStage, stageConfig } from "@/types/style";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StyleStageProgressProps {
  currentStage: StyleStage;
  className?: string;
}

const stageOrder: StyleStage[] = [
  "base",
  "base_approved",
  "bulk",
  "bulk_approved",
  "product",
  "product_approved",
];

export function StyleStageProgress({ currentStage, className }: StyleStageProgressProps) {
  const currentIndex = stageOrder.indexOf(currentStage);
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stageOrder.map((stage, index) => {
        const config = stageConfig[stage];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        return (
          <Tooltip key={stage} delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full transition-all",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {index < stageOrder.length - 1 && (
                  <div
                    className={cn(
                      "w-4 h-0.5 transition-colors",
                      isCompleted ? "bg-success" : "bg-muted"
                    )}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="font-medium">{config.label}</div>
              <div className="text-muted-foreground">{config.description}</div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
