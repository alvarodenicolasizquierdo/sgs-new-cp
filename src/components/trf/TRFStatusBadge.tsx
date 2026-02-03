import { TRFStatus, statusConfig } from "@/types/trf";
import { cn } from "@/lib/utils";

interface TRFStatusBadgeProps {
  status: TRFStatus;
  size?: "sm" | "md";
}

export function TRFStatusBadge({ status, size = "sm" }: TRFStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.color,
        config.bgColor,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {config.label}
    </span>
  );
}
