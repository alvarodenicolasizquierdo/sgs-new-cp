import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardWithTooltipProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label: string;
  };
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "pending";
  className?: string;
  methodology?: string;
  lastUpdated?: string;
}

const variantStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
  pending: "text-pending",
};

const trendColors = {
  up: "text-success bg-success/10",
  down: "text-destructive bg-destructive/10",
  neutral: "text-muted-foreground bg-muted",
};

export function MetricCardWithTooltip({
  title,
  value,
  icon,
  trend,
  variant = "default",
  className,
  methodology,
  lastUpdated,
}: MetricCardWithTooltipProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border/60 p-6 shadow-card card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">{title}</p>
            {methodology && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/40 cursor-help hover:text-muted-foreground/70 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
                    {methodology}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className={cn("text-2xl font-semibold tracking-tight animate-fade-in", variantStyles[variant])}>
            {value}
          </p>
          <div className="space-y-1">
            {trend && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    trendColors[trend.direction]
                  )}
                >
                  {trend.direction === "up" && <ArrowUp className="h-3 w-3" />}
                  {trend.direction === "down" && <ArrowDown className="h-3 w-3" />}
                  {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
            {lastUpdated && (
              <p className="text-[10px] text-muted-foreground/60">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
        </div>
        <div className={cn("p-2.5 rounded-xl bg-muted/40", variantStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
