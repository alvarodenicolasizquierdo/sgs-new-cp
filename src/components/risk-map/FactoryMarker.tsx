import { Factory } from "@/data/mockFactories";
import { RiskLevel } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FactoryMarkerProps {
  factory: Factory;
  isSelected: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}

export function FactoryMarker({ factory, isSelected, onClick, style }: FactoryMarkerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 z-10",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
            isSelected && "scale-125 z-30"
          )}
          style={style}
        >
          <div className="relative flex flex-col items-center">
            {/* Pulse ring for high risk factories */}
            {factory.riskLevel === "high" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-destructive/30 animate-ping" />
            )}
            
            {/* Pin marker head */}
            <div
              className={cn(
                "relative w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
                factory.riskLevel === "low" && "bg-success",
                factory.riskLevel === "medium" && "bg-warning",
                factory.riskLevel === "high" && "bg-destructive",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <span className="text-xs font-bold text-white">
                {factory.riskScore}
              </span>
              
              {/* Critical issues badge */}
              {factory.criticalIssues > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive border border-white rounded-full flex items-center justify-center shadow-sm">
                  <AlertTriangle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            
            {/* Pin tail/pointer */}
            <div
              className={cn(
                "w-0 h-0 -mt-0.5",
                "border-l-[7px] border-l-transparent",
                "border-r-[7px] border-r-transparent",
                "border-t-[10px]",
                factory.riskLevel === "low" && "border-t-success",
                factory.riskLevel === "medium" && "border-t-warning",
                factory.riskLevel === "high" && "border-t-destructive"
              )}
            />
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1.5">
          <p className="font-semibold">{factory.name}</p>
          <p className="text-xs text-muted-foreground">{factory.supplierName}</p>
          <p className="text-xs text-muted-foreground">{factory.location}, {factory.country}</p>
          <div className="flex items-center gap-3 pt-1 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Risk: </span>
              <span className={cn(
                "text-sm font-bold",
                factory.riskLevel === "low" && "text-success",
                factory.riskLevel === "medium" && "text-warning",
                factory.riskLevel === "high" && "text-destructive"
              )}>
                {factory.riskScore}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Pass: </span>
              <span className="text-sm font-bold">{factory.passRate}%</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
