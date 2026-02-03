import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRF, TRFStatus, statusConfig } from "@/types/trf";
import { TRFPriorityBadge } from "./TRFPriorityBadge";
import { SLAIndicator } from "./SLAIndicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { StatusColumnHeader } from "@/components/ui/status-column-header";
import { KanbanCard } from "@/components/ui/kanban-card";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";

interface TRFKanbanProps {
  data: TRF[];
}

const kanbanColumns: { status: TRFStatus; label: string }[] = [
  { status: "draft", label: "Draft" },
  { status: "submitted", label: "Submitted" },
  { status: "in_review", label: "In Review" },
  { status: "approved", label: "Approved" },
  { status: "testing", label: "Testing" },
  { status: "completed", label: "Completed" },
];

export function TRFKanban({ data }: TRFKanbanProps) {
  const navigate = useNavigate();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TRFStatus | null>(null);

  const getItemsByStatus = (status: TRFStatus) => {
    return data.filter((item) => item.status === status);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TRFStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(status);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, status: TRFStatus) => {
    e.preventDefault();
    console.log(`Move ${draggedItem} to ${status}`);
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-h-[600px] px-1">
        {kanbanColumns.map((column, columnIndex) => {
          const items = getItemsByStatus(column.status);
          const isDropTarget = dropTarget === column.status;

          return (
            <motion.div
              key={column.status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: columnIndex * 0.05 }}
              className="flex-shrink-0 w-[320px]"
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Linear-style Column Header */}
              <StatusColumnHeader
                status={column.status}
                label={column.label}
                count={items.length}
                isDraggable
                onAdd={() => navigate("/tests/new")}
              />

              {/* Column Content */}
              <div
                className={cn(
                  "space-y-3 min-h-[500px] rounded-xl p-2 transition-all duration-200",
                  "bg-gradient-to-b from-muted/20 to-muted/5",
                  isDropTarget && "bg-primary/5 ring-2 ring-primary/20 ring-dashed"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {items.map((trf, index) => (
                    <KanbanCard
                      key={trf.id}
                      id={trf.id}
                      priority={trf.priority}
                      isDragging={draggedItem === trf.id}
                      onClick={() => navigate(`/tests/${trf.id}`)}
                      onDragStart={(e) => handleDragStart(e, trf.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-primary">
                          {trf.trfNumber}
                        </span>
                        <TRFPriorityBadge priority={trf.priority} showLabel={false} />
                      </div>

                      {/* Product Info */}
                      <h4 className="font-medium text-sm mb-1 line-clamp-2 leading-snug">
                        {trf.productName}
                      </h4>
                      
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">{trf.supplier.name}</span>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-2 mb-3">
                        <Progress 
                          value={trf.progress} 
                          className="h-1.5 flex-1 bg-muted" 
                        />
                        <span className={cn(
                          "text-xs font-medium",
                          trf.progress >= 75 ? "text-success" : 
                          trf.progress >= 50 ? "text-warning" : 
                          "text-muted-foreground"
                        )}>
                          {trf.progress}%
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <SLAIndicator status={trf.slaStatus} dueDate={trf.dueDate} />
                        {trf.assignedTo && (
                          <Avatar className="h-6 w-6 ring-2 ring-background">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                              {trf.assignedTo.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </KanbanCard>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex flex-col items-center justify-center h-32",
                      "border-2 border-dashed border-muted rounded-xl",
                      "text-muted-foreground"
                    )}
                  >
                    <p className="text-sm">No items</p>
                    <p className="text-xs mt-1">Drag items here</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
