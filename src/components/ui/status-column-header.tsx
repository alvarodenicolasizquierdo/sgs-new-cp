import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import { Button } from "./button";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface StatusColumnHeaderProps {
  status: string;
  label: string;
  count: number;
  onAdd?: () => void;
  onEdit?: () => void;
  onHide?: () => void;
  onDelete?: () => void;
  isDraggable?: boolean;
  className?: string;
}

export function StatusColumnHeader({
  status,
  label,
  count,
  onAdd,
  onEdit,
  onHide,
  onDelete,
  isDraggable = false,
  className,
}: StatusColumnHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center justify-between px-2 py-2 mb-3 rounded-lg",
        "bg-gradient-to-r from-transparent to-transparent",
        "hover:from-muted/30 hover:to-transparent",
        "group transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {isDraggable && (
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
        )}
        
        {/* Status indicator with glow effect */}
        <div className="relative">
          <StatusIndicator
            status={status as any}
            size="md"
            className="shadow-sm"
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-sm opacity-50",
              status === "completed" || status === "approved"
                ? "bg-success"
                : status === "in_progress" || status === "testing"
                ? "bg-primary"
                : status === "in_review" || status === "pending_review" || status === "on_hold"
                ? "bg-warning"
                : status === "rejected"
                ? "bg-destructive"
                : status === "submitted" || status === "scheduled"
                ? "bg-info"
                : "bg-muted-foreground"
            )}
          />
        </div>

        <span className="font-semibold text-sm tracking-tight">{label}</span>

        {/* Animated count badge */}
        <motion.span
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "inline-flex items-center justify-center",
            "min-w-[20px] h-5 px-1.5 rounded-full",
            "text-xs font-medium",
            "bg-muted text-muted-foreground",
            count > 0 && "bg-primary/10 text-primary"
          )}
        >
          {count}
        </motion.span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onAdd && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAdd}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}

        {(onEdit || onHide || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  Edit status
                </DropdownMenuItem>
              )}
              {onHide && (
                <DropdownMenuItem onClick={onHide}>
                  Hide column
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete status
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}
