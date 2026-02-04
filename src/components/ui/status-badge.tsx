import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Check, Loader2 } from "lucide-react";

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
        subtle: "bg-transparent",
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
  submitted: "bg-info/10 text-info border border-info/20",
  in_review: "bg-warning/10 text-warning border border-warning/20",
  approved: "bg-success/10 text-success border border-success/20",
  testing: "bg-primary/10 text-primary border border-primary/20",
  completed: "bg-success/10 text-success border border-success/20",
  rejected: "bg-destructive/10 text-destructive border border-destructive/20",
  on_hold: "bg-warning/10 text-warning border border-warning/20",
  scheduled: "bg-info/10 text-info border border-info/20",
  confirmed: "bg-info/10 text-info border border-info/20",
  in_progress: "bg-primary/10 text-primary border border-primary/20",
  pending_review: "bg-warning/10 text-warning border border-warning/20",
  pending_report: "bg-warning/10 text-warning border border-warning/20",
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
  isLoading?: boolean;
  onChange?: (newStatus: StatusType) => void;
  availableStatuses?: { value: StatusType; label: string; description?: string }[];
}

function StatusBadge({
  className,
  size,
  variant = "filled",
  interactive,
  status,
  label,
  showIndicator = true,
  pulse,
  isLoading,
  onChange,
  availableStatuses,
  ...props
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

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
        onChange && "pr-2",
        isLoading && "opacity-70",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={interactive || onChange ? { scale: 1.02 } : undefined}
      whileTap={interactive || onChange ? { scale: 0.98 } : undefined}
      {...(props as any)}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className="h-3 w-3 animate-spin" />
          </motion.div>
        ) : showIndicator ? (
          <motion.div
            key="indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <StatusIndicator
              status={status}
              size={size === "xs" ? "xs" : size === "sm" ? "sm" : "md"}
              pulse={pulse}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.span 
        layout
        className="leading-none"
      >
        {statusLabel}
      </motion.span>
      
      {onChange && (
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3 opacity-60" />
        </motion.div>
      )}
    </motion.div>
  );

  if (onChange && availableStatuses) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>{badgeContent}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] p-1">
          {availableStatuses.map((s, index) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <DropdownMenuItem
                onClick={() => {
                  onChange(s.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "gap-3 py-2.5 px-3 cursor-pointer rounded-lg",
                  "transition-colors duration-150",
                  s.value === status && "bg-primary/5"
                )}
              >
                <StatusIndicator status={s.value} size="sm" glow={s.value === status} />
                <div className="flex-1 min-w-0">
                  <span className="block font-medium">{s.label}</span>
                  {s.description && (
                    <span className="block text-xs text-muted-foreground truncate">
                      {s.description}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {s.value === status && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return badgeContent;
}

export { StatusBadge, statusBadgeVariants };