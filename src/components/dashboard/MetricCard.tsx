import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricCardProps {
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

export function MetricCard({ title, value, icon, trend, variant = "default", className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-6 card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold animate-fade-in", variantStyles[variant])}>
            {value}
          </p>
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
        </div>
        <div className={cn("p-3 rounded-lg bg-muted/50", variantStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
