import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const statusIndicatorVariants = cva(
  "relative inline-flex items-center justify-center rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-2 w-2",
        sm: "h-2.5 w-2.5",
        md: "h-3 w-3",
        lg: "h-4 w-4",
      },
      status: {
        draft: "bg-muted-foreground",
        submitted: "bg-info",
        in_review: "bg-warning",
        approved: "bg-success",
        testing: "bg-primary",
        completed: "bg-success",
        rejected: "bg-destructive",
        on_hold: "bg-warning",
        scheduled: "bg-info",
        in_progress: "bg-primary",
        pending_review: "bg-warning",
        cancelled: "bg-muted-foreground",
      },
      animated: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      animated: false,
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  pulse?: boolean;
}

function StatusIndicator({
  className,
  size,
  status,
  animated,
  pulse,
  ...props
}: StatusIndicatorProps) {
  if (animated || pulse) {
    return (
      <span className="relative inline-flex">
        <motion.span
          className={cn(statusIndicatorVariants({ size, status }), className)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        />
        {pulse && (
          <motion.span
            className={cn(
              "absolute inset-0 rounded-full opacity-75",
              statusIndicatorVariants({ size, status })
            )}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
            }}
          />
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(statusIndicatorVariants({ size, status }), className)}
      {...props}
    />
  );
}

export { StatusIndicator, statusIndicatorVariants };
