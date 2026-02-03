import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import { Check, ChevronRight } from "lucide-react";

interface WorkflowStep {
  status: string;
  label: string;
  description?: string;
  completedAt?: string;
}

interface StatusWorkflowProps {
  steps: WorkflowStep[];
  currentStatus: string;
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusWorkflow({
  steps,
  currentStatus,
  direction = "horizontal",
  size = "md",
  className,
}: StatusWorkflowProps) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);

  const getStepState = (index: number) => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  const sizeClasses = {
    sm: {
      step: "gap-2",
      indicator: "h-6 w-6",
      text: "text-xs",
      connector: direction === "horizontal" ? "h-0.5 w-8" : "w-0.5 h-8",
    },
    md: {
      step: "gap-3",
      indicator: "h-8 w-8",
      text: "text-sm",
      connector: direction === "horizontal" ? "h-0.5 w-12" : "w-0.5 h-12",
    },
    lg: {
      step: "gap-4",
      indicator: "h-10 w-10",
      text: "text-base",
      connector: direction === "horizontal" ? "h-0.5 w-16" : "w-0.5 h-16",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-center",
        direction === "vertical" && "flex-col items-start",
        className
      )}
    >
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.status}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center",
                direction === "vertical" && "flex-row",
                sizes.step
              )}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full",
                  "transition-all duration-300",
                  sizes.indicator,
                  state === "completed" && "bg-success text-success-foreground",
                  state === "current" && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  state === "upcoming" && "bg-muted text-muted-foreground"
                )}
              >
                {state === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <StatusIndicator
                    status={step.status as any}
                    size={size === "lg" ? "md" : "sm"}
                    pulse={state === "current"}
                  />
                )}

                {/* Glow effect for current step */}
                {state === "current" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                )}
              </div>

              {/* Step label */}
              <div
                className={cn(
                  "flex flex-col",
                  direction === "horizontal" && "hidden md:flex"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    sizes.text,
                    state === "upcoming" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
                {step.completedAt && state === "completed" && (
                  <span className="text-xs text-success">
                    {step.completedAt}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  "relative",
                  sizes.connector,
                  direction === "horizontal" ? "mx-2" : "my-2 ml-4"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-border rounded-full",
                    direction === "vertical" && "left-1/2 -translate-x-1/2"
                  )}
                />
                <motion.div
                  className={cn(
                    "absolute rounded-full bg-success",
                    direction === "horizontal" ? "h-full" : "w-full left-1/2 -translate-x-1/2"
                  )}
                  initial={{ [direction === "horizontal" ? "width" : "height"]: "0%" }}
                  animate={{
                    [direction === "horizontal" ? "width" : "height"]:
                      state === "completed" || getStepState(index + 1) === "current"
                        ? "100%"
                        : "0%",
                  }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                />

                {direction === "horizontal" && (
                  <ChevronRight
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                      "h-3 w-3 text-muted-foreground opacity-0",
                      state === "completed" && "opacity-100 text-success"
                    )}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
