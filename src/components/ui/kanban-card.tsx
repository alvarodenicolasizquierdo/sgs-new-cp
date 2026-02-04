import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Card, CardContent } from "./card";
import { GripVertical, ExternalLink } from "lucide-react";

interface KanbanCardProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  className?: string;
  priority?: "urgent" | "high" | "normal" | "low";
  accentColor?: string;
}

const priorityConfig = {
  urgent: {
    border: "border-l-destructive",
    glow: "group-hover:shadow-destructive/10",
    bg: "group-hover:bg-destructive/[0.02]",
  },
  high: {
    border: "border-l-warning",
    glow: "group-hover:shadow-warning/10",
    bg: "group-hover:bg-warning/[0.02]",
  },
  normal: {
    border: "border-l-primary",
    glow: "group-hover:shadow-primary/10",
    bg: "group-hover:bg-primary/[0.02]",
  },
  low: {
    border: "border-l-muted-foreground/50",
    glow: "",
    bg: "",
  },
};

export function KanbanCard({
  id,
  children,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isSelected = false,
  isHighlighted = false,
  className,
  priority = "normal",
  accentColor,
}: KanbanCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const priorityStyles = priorityConfig[priority];

  // Mouse position for gradient effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Create a gradient that follows the mouse
  const gradientX = useTransform(mouseX, [0, 300], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 200], [0, 100]);

  return (
    <motion.div
      layout="position"
      layoutId={id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.7 : 1,
        y: 0,
        scale: isDragging ? 1.03 : 1,
        rotate: isDragging ? 2 : 0,
        zIndex: isDragging ? 50 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
        className={cn(
          "relative cursor-pointer group overflow-hidden",
          "border-l-[3px] border border-border/50",
          "transition-all duration-300 ease-out",
          "hover:border-border",
          priorityStyles.border,
          
          // Shadow and glow effects
          "shadow-sm",
          "hover:shadow-xl hover:shadow-black/5",
          priorityStyles.glow,
          
          // Selection states
          isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          isHighlighted && "ring-2 ring-accent ring-offset-2",
          
          // Dragging state
          isDragging && [
            "shadow-2xl shadow-black/20",
            "ring-2 ring-primary/40",
            "border-primary/30",
          ],
          
          className
        )}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${gradientX.get()}% ${gradientY.get()}%, hsl(var(--primary) / 0.06) 0%, transparent 50%)`
              : undefined,
          }}
        />

        {/* Top shine effect on hover */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)",
          }}
        />

        <CardContent className="p-4 relative">
          {/* Drag handle */}
          <motion.div
            className={cn(
              "absolute left-1 top-1/2 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100 transition-all duration-200",
              "cursor-grab active:cursor-grabbing",
              "hover:bg-muted rounded p-0.5"
            )}
            initial={{ x: -5 }}
            animate={{ x: isHovered ? 0 : -5 }}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/70" />
          </motion.div>

          {/* Quick view button */}
          <motion.div
            className={cn(
              "absolute right-2 top-2",
              "opacity-0 group-hover:opacity-100 transition-all duration-200"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className={cn(
                "p-1 rounded-md",
                "bg-muted/80 hover:bg-muted",
                "text-muted-foreground hover:text-foreground",
                "transition-colors"
              )}
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </motion.div>

          {/* Content with padding for drag handle */}
          <div className="pl-5">{children}</div>
        </CardContent>

        {/* Selection indicator border animation */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-primary"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}

        {/* Drag shadow effect */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </Card>
    </motion.div>
  );
}