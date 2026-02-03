import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRF, TRFStatus, statusConfig } from "@/types/trf";
import { TRFPriorityBadge } from "./TRFPriorityBadge";
import { SLAIndicator } from "./SLAIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const getItemsByStatus = (status: TRFStatus) => {
    return data.filter((item) => item.status === status);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TRFStatus) => {
    e.preventDefault();
    // In a real app, this would update the TRF status
    console.log(`Move ${draggedItem} to ${status}`);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {kanbanColumns.map((column) => {
        const items = getItemsByStatus(column.status);
        const config = statusConfig[column.status];

        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-[300px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-3 h-3 rounded-full",
                    config.bgColor.replace("/10", "")
                  )}
                  style={{
                    backgroundColor:
                      column.status === "completed" || column.status === "approved"
                        ? "hsl(var(--success))"
                        : column.status === "testing"
                        ? "hsl(var(--primary))"
                        : column.status === "in_review"
                        ? "hsl(var(--warning))"
                        : column.status === "submitted"
                        ? "hsl(var(--info))"
                        : "hsl(var(--muted-foreground))",
                  }}
                />
                <span className="font-medium text-sm">{column.label}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {items.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Content */}
            <div className="space-y-3 min-h-[500px] bg-muted/30 rounded-lg p-2">
              {items.map((trf) => (
                <Card
                  key={trf.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, trf.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => navigate(`/tests/${trf.id}`)}
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-all duration-200 group",
                    draggedItem === trf.id && "opacity-50 rotate-2"
                  )}
                >
                  <CardContent className="p-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <span className="text-xs font-medium text-primary">
                          {trf.trfNumber}
                        </span>
                      </div>
                      <TRFPriorityBadge priority={trf.priority} showLabel={false} />
                    </div>

                    {/* Product Info */}
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {trf.productName}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {trf.supplier.name}
                    </p>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-3">
                      <Progress value={trf.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {trf.progress}%
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <SLAIndicator status={trf.slaStatus} dueDate={trf.dueDate} />
                      {trf.assignedTo && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {trf.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {items.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">No items</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
