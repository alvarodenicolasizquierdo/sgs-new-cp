import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import { Check, ChevronRight, Clock, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";

interface WorkflowStep {
  status: string;
  label: string;
  description?: string;
  completedAt?: string;
  icon?: React.ReactNode;
}

interface StatusWorkflowProps {
  steps: WorkflowStep[];
  currentStatus: string;
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  showLabels?: boolean;
  animated?: boolean;
  onStepClick?: (status: string) => void;
  className?: string;
}

export function StatusWorkflow({
  steps,
  currentStatus,
  direction = "horizontal",
  size = "md",
  variant = "default",
  showLabels = true,
  animated = true,
  onStepClick,
  className,
}: StatusWorkflowProps) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);
  const [hoveredStep, setHoveredStep] = React.useState<number | null>(null);

  const getStepState = (index: number) => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  const sizeConfig = {
    sm: {
      step: "gap-2",
      indicator: "h-7 w-7",
      icon: "h-3.5 w-3.5",
      text: "text-xs",
      description: "text-[10px]",
      connector: direction === "horizontal" ? "h-[2px] min-w-[32px] flex-1" : "w-[2px] min-h-[24px]",
    },
    md: {
      step: "gap-3",
      indicator: "h-9 w-9",
      icon: "h-4 w-4",
      text: "text-sm",
      description: "text-xs",
      connector: direction === "horizontal" ? "h-[2px] min-w-[40px] flex-1" : "w-[2px] min-h-[32px]",
    },
    lg: {
      step: "gap-4",
      indicator: "h-11 w-11",
      icon: "h-5 w-5",
      text: "text-base",
      description: "text-sm",
      connector: direction === "horizontal" ? "h-[2px] min-w-[56px] flex-1" : "w-[2px] min-h-[48px]",
    },
  };

  const config = sizeConfig[size];

  const StepIndicator = ({ step, index, state }: { step: WorkflowStep; index: number; state: string }) => {
    const isHovered = hoveredStep === index;
    const isClickable = !!onStepClick && state !== "upcoming";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onStepClick?.(step.status)}
            className={cn(
              "relative flex items-center justify-center rounded-full",
              "transition-all duration-300 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              config.indicator,
              isClickable && "cursor-pointer",
              !isClickable && state === "upcoming" && "cursor-default"
            )}
            initial={animated ? { scale: 0.8, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: animated ? index * 0.08 : 0, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={isClickable ? { scale: 1.1 } : undefined}
            whileTap={isClickable ? { scale: 0.95 } : undefined}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            {/* Background circle */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                state === "completed" && "bg-success shadow-md",
                state === "current" && "bg-primary shadow-lg",
                state === "upcoming" && "bg-muted border-2 border-border"
              )}
              animate={{
                boxShadow: state === "current" 
                  ? "0 0 0 4px hsl(var(--primary) / 0.15)" 
                  : "none"
              }}
            />
            
            {/* Icon/Check */}
            <AnimatePresence mode="wait">
              {state === "completed" ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative z-10"
                >
                  <Check className={cn("text-success-foreground", config.icon)} strokeWidth={3} />
                </motion.div>
              ) : state === "current" ? (
                <motion.div
                  key="current"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative z-10"
                >
                  {step.icon || (
                    <Sparkles className={cn("text-primary-foreground", config.icon)} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <span className={cn(
                    "font-semibold text-muted-foreground",
                    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
                  )}>
                    {index + 1}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse animation for current step */}
            {state === "current" && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  initial={{ opacity: 0.4, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  initial={{ opacity: 0.2, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeOut",
                    delay: 0.3,
                  }}
                />
              </>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side={direction === "horizontal" ? "bottom" : "right"} className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{step.label}</p>
            {step.description && (
              <p className="text-muted-foreground text-xs">{step.description}</p>
            )}
            {step.completedAt && state === "completed" && (
              <p className="text-success text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.completedAt}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const Connector = ({ fromIndex }: { fromIndex: number }) => {
    const fromState = getStepState(fromIndex);
    const toState = getStepState(fromIndex + 1);
    const isCompleted = fromState === "completed";
    const isActive = fromState === "completed" || toState === "current";

    return (
      <div
        className={cn(
          "relative",
          config.connector,
          direction === "horizontal" ? "mx-1" : "my-1 self-center"
        )}
      >
        {/* Background track */}
        <div
          className={cn(
            "absolute rounded-full bg-border",
            direction === "horizontal" ? "inset-0" : "inset-0"
          )}
        />
        
        {/* Progress fill */}
        <motion.div
          className={cn(
            "absolute rounded-full",
            isCompleted ? "bg-success" : isActive ? "bg-primary" : "bg-border",
            direction === "horizontal" ? "h-full" : "w-full"
          )}
          initial={{ 
            [direction === "horizontal" ? "width" : "height"]: "0%" 
          }}
          animate={{
            [direction === "horizontal" ? "width" : "height"]: isActive ? "100%" : "0%",
          }}
          transition={{ 
            duration: animated ? 0.4 : 0, 
            delay: animated ? fromIndex * 0.1 + 0.15 : 0,
            ease: "easeOut"
          }}
        />

        {/* Chevron indicator */}
        {direction === "horizontal" && variant !== "compact" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ 
              opacity: isCompleted ? 1 : 0,
              x: isCompleted ? 0 : -5
            }}
            transition={{ duration: 0.3, delay: fromIndex * 0.1 + 0.3 }}
          >
            <ChevronRight className={cn(
              "h-3 w-3",
              isCompleted ? "text-success" : "text-muted-foreground"
            )} />
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" && "items-center",
        direction === "vertical" && "flex-col items-stretch",
        className
      )}
    >
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.status}>
            <motion.div
              initial={animated ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: animated ? index * 0.08 : 0 }}
              className={cn(
                "flex",
                direction === "horizontal" && "flex-col items-center",
                direction === "vertical" && "flex-row items-start",
                config.step
              )}
            >
              <StepIndicator step={step} index={index} state={state} />

              {/* Labels */}
              {showLabels && variant !== "compact" && (
                <motion.div
                  className={cn(
                    "flex flex-col",
                    direction === "horizontal" && "items-center text-center mt-2",
                    direction === "vertical" && "flex-1"
                  )}
                  initial={animated ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ delay: animated ? index * 0.08 + 0.1 : 0 }}
                >
                  <span
                    className={cn(
                      "font-medium leading-tight",
                      config.text,
                      state === "upcoming" && "text-muted-foreground",
                      state === "current" && "text-primary",
                      state === "completed" && "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  
                  {variant === "detailed" && step.description && (
                    <span className={cn(
                      "text-muted-foreground mt-0.5 leading-tight",
                      config.description,
                      direction === "horizontal" && "max-w-[100px]"
                    )}>
                      {step.description}
                    </span>
                  )}
                  
                  {variant === "detailed" && step.completedAt && state === "completed" && (
                    <motion.span 
                      className={cn("text-success mt-1 flex items-center gap-1", config.description)}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="h-3 w-3" />
                      {step.completedAt}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Connector */}
            {!isLast && <Connector fromIndex={index} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}