import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StyleStage, stageConfig } from "@/types/style";
import { CheckCircle2 } from "lucide-react";

interface StyleStageBadgeProps {
  stage: StyleStage;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function StyleStageBadge({ stage, size = "md", showIcon = true, className }: StyleStageBadgeProps) {
  const config = stageConfig[stage];
  const isApproved = stage.includes("approved");
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.bgColor,
        config.color,
        "border-transparent font-medium gap-1",
        size === "sm" && "text-xs px-2 py-0.5",
        className
      )}
    >
      {showIcon && isApproved && <CheckCircle2 className="h-3 w-3" />}
      {config.shortLabel}
    </Badge>
  );
}
