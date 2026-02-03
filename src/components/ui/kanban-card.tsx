import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "./card";
import { GripVertical } from "lucide-react";

interface KanbanCardProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isSelected?: boolean;
  className?: string;
  priority?: "urgent" | "high" | "normal" | "low";
}

const priorityAccentColors = {
  urgent: "border-l-destructive",
  high: "border-l-warning",
  normal: "border-l-primary",
  low: "border-l-muted-foreground",
};

export function KanbanCard({
  id,
  children,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isSelected = false,
  className,
  priority,
}: KanbanCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.6 : 1,
        y: 0,
        rotate: isDragging ? 3 : 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ y: -2 }}
    >
      <Card
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
        className={cn(
          "relative cursor-pointer group",
          "border-l-2 border-l-transparent",
          "transition-all duration-200",
          "hover:shadow-lg hover:border-primary/30",
          "active:shadow-md",
          priority && priorityAccentColors[priority],
          isSelected && "ring-2 ring-primary ring-offset-2",
          isDragging && "shadow-2xl ring-2 ring-primary/50",
          className
        )}
      >
        {/* Gradient overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100",
            "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
            "transition-opacity duration-300 rounded-lg pointer-events-none"
          )}
        />

        <CardContent className="p-4 relative">
          {/* Drag handle */}
          <div
            className={cn(
              "absolute left-1 top-1/2 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "cursor-grab active:cursor-grabbing"
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="pl-4">{children}</div>
        </CardContent>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            layoutId={`selection-${id}`}
            className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </Card>
    </motion.div>
  );
}
