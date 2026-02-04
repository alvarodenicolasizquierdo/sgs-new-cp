import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StyleStatus, styleStatusConfig } from "@/types/style";

interface StyleStatusBadgeProps {
  status: StyleStatus;
  size?: "sm" | "md";
  className?: string;
}

export function StyleStatusBadge({ status, size = "md", className }: StyleStatusBadgeProps) {
  const config = styleStatusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.bgColor,
        config.color,
        "border-transparent font-medium",
        size === "sm" && "text-xs px-2 py-0.5",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
