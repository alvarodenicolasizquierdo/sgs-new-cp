import { Factory } from "@/data/mockFactories";
import { RiskLevel } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { MapPin, AlertTriangle } from "lucide-react";
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

const riskColors: Record<RiskLevel, string> = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground",
};

const riskPulse: Record<RiskLevel, string> = {
  low: "",
  medium: "",
  high: "animate-pulse",
};

export function FactoryMarker({ factory, isSelected, onClick, style }: FactoryMarkerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10",
            "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
            isSelected && "scale-150 z-20"
          )}
          style={style}
        >
          <div className="relative">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shadow-lg",
                riskColors[factory.riskLevel],
                riskPulse[factory.riskLevel]
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
            </div>
            {factory.criticalIssues > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                <AlertTriangle className="h-2.5 w-2.5 text-destructive-foreground" />
              </div>
            )}
            {isSelected && (
              <div className="absolute -inset-2 border-2 border-primary rounded-full animate-ping opacity-50" />
            )}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{factory.name}</p>
          <p className="text-xs text-muted-foreground">{factory.location}, {factory.country}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs">Risk Score:</span>
            <span className={cn(
              "text-xs font-bold",
              factory.riskLevel === "low" && "text-success",
              factory.riskLevel === "medium" && "text-warning",
              factory.riskLevel === "high" && "text-destructive"
            )}>
              {factory.riskScore}
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
