import { TRFStatus, statusConfig } from "@/types/trf";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { motion } from "framer-motion";

interface TRFStatusBadgeProps {
  status: TRFStatus;
  size?: "xs" | "sm" | "md";
  showIndicator?: boolean;
  animated?: boolean;
}

export function TRFStatusBadge({ 
  status, 
  size = "sm", 
  showIndicator = true,
  animated = true 
}: TRFStatusBadgeProps) {
  const config = statusConfig[status];

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1.5",
    sm: "px-2.5 py-1 text-xs gap-2",
    md: "px-3 py-1.5 text-sm gap-2",
  };

  const indicatorSizes = {
    xs: "xs" as const,
    sm: "sm" as const,
    md: "md" as const,
  };

  const content = (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-all duration-200",
        "hover:shadow-sm",
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
    >
      {showIndicator && (
        <StatusIndicator 
          status={status} 
          size={indicatorSizes[size]}
          pulse={status === "testing" || status === "in_review"}
        />
      )}
      {config.label}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex"
      >
        {content}
      </motion.span>
    );
  }

  return content;
}
