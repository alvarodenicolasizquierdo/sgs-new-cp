import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 select-none",
  {
    variants: {
      size: {
        xs: "px-2 py-0.5 text-[10px]",
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
      },
      variant: {
        default: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-secondary/50",
        outline: "border border-border bg-transparent",
        filled: "",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
      interactive: false,
    },
  }
);

// Status color mappings for filled variant
const statusColorMap = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-info/10 text-info",
  in_review: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  testing: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  on_hold: "bg-warning/10 text-warning",
  scheduled: "bg-info/10 text-info",
  in_progress: "bg-primary/10 text-primary",
  pending_review: "bg-warning/10 text-warning",
  cancelled: "bg-muted text-muted-foreground",
} as const;

type StatusType = keyof typeof statusColorMap;

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  label?: string;
  showIndicator?: boolean;
  pulse?: boolean;
  onChange?: (newStatus: StatusType) => void;
  availableStatuses?: { value: StatusType; label: string }[];
}

function StatusBadge({
  className,
  size,
  variant,
  interactive,
  status,
  label,
  showIndicator = true,
  pulse,
  onChange,
  availableStatuses,
  ...props
}: StatusBadgeProps) {
  const statusLabel =
    label ||
    status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const badgeContent = (
    <motion.div
      className={cn(
        statusBadgeVariants({ size, variant, interactive: interactive || !!onChange }),
        variant === "filled" && statusColorMap[status],
        onChange && "pr-1.5",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={interactive || onChange ? { scale: 1.02 } : undefined}
      whileTap={interactive || onChange ? { scale: 0.98 } : undefined}
      {...(props as any)}
    >
      {showIndicator && (
        <StatusIndicator
          status={status}
          size={size === "xs" ? "xs" : size === "sm" ? "sm" : "md"}
          pulse={pulse}
        />
      )}
      <span>{statusLabel}</span>
      {onChange && <ChevronDown className="h-3 w-3 opacity-60" />}
    </motion.div>
  );

  if (onChange && availableStatuses) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{badgeContent}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          {availableStatuses.map((s) => (
            <DropdownMenuItem
              key={s.value}
              onClick={() => onChange(s.value)}
              className="gap-3"
            >
              <StatusIndicator status={s.value} size="sm" />
              <span className="flex-1">{s.label}</span>
              {s.value === status && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return badgeContent;
}

export { StatusBadge, statusBadgeVariants };
