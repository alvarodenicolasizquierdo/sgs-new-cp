import { RiskLevel, riskLevelConfig } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldX } from "lucide-react";

interface RiskLevelBadgeProps {
  riskLevel: RiskLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const icons: Record<RiskLevel, React.ElementType> = {
  low: Shield,
  medium: ShieldAlert,
  high: ShieldX,
};

export function RiskLevelBadge({ riskLevel, size = "md", showIcon = true }: RiskLevelBadgeProps) {
  const config = riskLevelConfig[riskLevel];
  const Icon = icons[riskLevel];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
