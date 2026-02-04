import { TestingLevel, testingLevelConfig } from "@/types/trf";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TRFTestingLevelBadgeProps {
  level: TestingLevel;
  size?: "sm" | "md";
}

export function TRFTestingLevelBadge({ level, size = "sm" }: TRFTestingLevelBadgeProps) {
  const config = testingLevelConfig[level];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md",
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
      data-help="testing-level"
    >
      {config.label}
    </span>
  );
}
