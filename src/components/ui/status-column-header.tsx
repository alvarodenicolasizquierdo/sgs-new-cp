import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, Reorder, useDragControls } from "framer-motion";
import { StatusIndicator } from "./status-indicator";
import { Button } from "./button";
import { Input } from "./input";
import { Plus, MoreHorizontal, GripVertical, Check, X, Palette, Eye, EyeOff, Trash2, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface StatusColumnHeaderProps {
  status: string;
  label: string;
  count: number;
  color?: string;
  onAdd?: () => void;
  onEdit?: (newLabel: string) => void;
  onColorChange?: (color: string) => void;
  onHide?: () => void;
  onDelete?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDraggable?: boolean;
  isDragging?: boolean;
  isHidden?: boolean;
  className?: string;
}

const statusColors = [
  { name: "Gray", value: "bg-muted-foreground" },
  { name: "Blue", value: "bg-info" },
  { name: "Purple", value: "bg-pending" },
  { name: "Green", value: "bg-success" },
  { name: "Yellow", value: "bg-warning" },
  { name: "Orange", value: "bg-accent" },
  { name: "Red", value: "bg-destructive" },
  { name: "Primary", value: "bg-primary" },
];

export function StatusColumnHeader({
  status,
  label,
  count,
  color,
  onAdd,
  onEdit,
  onColorChange,
  onHide,
  onDelete,
  onDragStart,
  onDragEnd,
  isDraggable = false,
  isDragging = false,
  isHidden = false,
  className,
}: StatusColumnHeaderProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(label);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragControls = useDragControls();

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== label) {
      onEdit?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Get status-based glow color
  const getGlowColor = () => {
    if (status === "completed" || status === "approved") return "bg-success";
    if (status === "in_progress" || status === "testing") return "bg-primary";
    if (status === "in_review" || status === "pending_review" || status === "on_hold") return "bg-warning";
    if (status === "rejected") return "bg-destructive";
    if (status === "submitted" || status === "scheduled") return "bg-info";
    return "bg-muted-foreground";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: isDragging ? 0.8 : 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl",
        "bg-gradient-to-r from-muted/40 via-transparent to-transparent",
        "border border-transparent",
        "group transition-all duration-200",
        "hover:from-muted/60 hover:border-border/50",
        isDragging && "shadow-lg border-primary/30 bg-card",
        isHidden && "opacity-50",
        className
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Drag handle */}
        {isDraggable && (
          <motion.div
            className={cn(
              "cursor-grab active:cursor-grabbing p-0.5 rounded",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-muted"
            )}
            onPointerDown={(e) => {
              dragControls.start(e);
              onDragStart?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        )}
        
        {/* Status indicator with glow effect */}
        <div className="relative flex-shrink-0">
          <StatusIndicator
            status={status as any}
            size="md"
            className="shadow-sm relative z-10"
          />
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full blur-md opacity-40",
              color || getGlowColor()
            )}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Editable label */}
        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="h-7 text-sm font-semibold px-2"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-success hover:text-success"
              onClick={handleSaveEdit}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCancelEdit}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <motion.span 
            className="font-semibold text-sm tracking-tight truncate"
            layout
          >
            {label}
          </motion.span>
        )}

        {/* Animated count badge */}
        <motion.span
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "inline-flex items-center justify-center flex-shrink-0",
            "min-w-[22px] h-[22px] px-1.5 rounded-full",
            "text-xs font-semibold",
            "transition-colors duration-200",
            count === 0 
              ? "bg-muted/50 text-muted-foreground" 
              : "bg-primary/10 text-primary"
          )}
        >
          {count}
        </motion.span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {onAdd && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {(onEdit || onColorChange || onHide || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Rename status
                </DropdownMenuItem>
              )}
              
              {onColorChange && (
                <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                  <PopoverTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()}
                      className="gap-2"
                    >
                      <Palette className="h-4 w-4" />
                      Change color
                    </DropdownMenuItem>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="start" className="w-40 p-2">
                    <div className="grid grid-cols-4 gap-1.5">
                      {statusColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => {
                            onColorChange(c.value);
                            setShowColorPicker(false);
                          }}
                          className={cn(
                            "w-7 h-7 rounded-full transition-transform hover:scale-110",
                            c.value,
                            color === c.value && "ring-2 ring-offset-2 ring-primary"
                          )}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              
              {onHide && (
                <DropdownMenuItem onClick={onHide} className="gap-2">
                  {isHidden ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Show column
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide column
                    </>
                  )}
                </DropdownMenuItem>
              )}
              
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
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