import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inspection, inspectionStatusConfig, InspectionStatus } from "@/types/inspection";
import { InspectionResultBadge } from "./InspectionResultBadge";
import { InspectionTypeBadge } from "./InspectionTypeBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StatusColumnHeader } from "@/components/ui/status-column-header";
import { KanbanCard } from "@/components/ui/kanban-card";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InspectionKanbanProps {
  data: Inspection[];
}

const kanbanColumns: InspectionStatus[] = [
  "scheduled",
  "in_progress",
  "pending_review",
  "completed",
];

export function InspectionKanban({ data }: InspectionKanbanProps) {
  const navigate = useNavigate();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<InspectionStatus | null>(null);

  const getColumnData = (status: InspectionStatus) => {
    return data.filter((d) => d.status === status);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: InspectionStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(status);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, status: InspectionStatus) => {
    e.preventDefault();
    // TODO: persist status change
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-w-max px-1">
        {kanbanColumns.map((status, columnIndex) => {
          const columnData = getColumnData(status);
          const config = inspectionStatusConfig[status];
          const isDropTarget = dropTarget === status;

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: columnIndex * 0.05 }}
              className="w-80 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Linear-style Column Header */}
              <StatusColumnHeader
                status={status}
                label={config.label}
                count={columnData.length}
                isDraggable
                onAdd={() => navigate("/inspections/new")}
              />

              {/* Column Content */}
              <div
                className={cn(
                  "space-y-3 min-h-[400px] rounded-xl p-2 transition-all duration-200",
                  "bg-gradient-to-b from-muted/20 to-muted/5",
                  isDropTarget && "bg-primary/5 ring-2 ring-primary/20 ring-dashed"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {columnData.map((inspection) => (
                    <KanbanCard
                      key={inspection.id}
                      id={inspection.id}
                      priority={inspection.riskLevel === "high" ? "high" : inspection.riskLevel === "medium" ? "normal" : "low"}
                      isDragging={draggedItem === inspection.id}
                      onClick={() => navigate(`/inspections/${inspection.id}`)}
                      onDragStart={(e) => handleDragStart(e, inspection.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{inspection.inspectionNumber}</p>
                          <p className="font-semibold text-sm mt-0.5">{inspection.purchaseOrder}</p>
                        </div>
                        <InspectionTypeBadge type={inspection.inspectionType} />
                      </div>

                      {/* Product */}
                      <p className="text-sm line-clamp-1 mb-2">{inspection.productName}</p>

                      {/* Supplier & Factory */}
                      <div className="text-xs text-muted-foreground mb-3">
                        <p className="font-medium text-foreground">{inspection.supplier.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {inspection.factory.name}, {inspection.factory.country}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 ring-2 ring-background">
                            <AvatarImage src={inspection.inspector.avatar} />
                            <AvatarFallback className="text-[10px] font-semibold">
                              {inspection.inspector.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <RiskLevelBadge riskLevel={inspection.riskLevel} size="sm" showIcon={false} />
                        </div>
                        <div className="flex items-center gap-2">
                          <InspectionResultBadge result={inspection.result} size="sm" />
                          {inspection.score !== undefined && (
                            <span
                              className={cn(
                                "text-xs font-bold",
                                inspection.score >= 90
                                  ? "text-success"
                                  : inspection.score >= 70
                                  ? "text-warning"
                                  : "text-destructive"
                              )}
                            >
                              {inspection.score}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(inspection.scheduledDate), "MMM d, yyyy")}
                      </div>
                    </KanbanCard>
                  ))}
                </AnimatePresence>

                {columnData.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex flex-col items-center justify-center h-32",
                      "border-2 border-dashed border-muted rounded-xl",
                      "text-muted-foreground"
                    )}
                  >
                    <p className="text-sm">No inspections</p>
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
