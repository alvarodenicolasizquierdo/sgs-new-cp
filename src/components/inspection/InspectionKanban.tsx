import { useNavigate } from "react-router-dom";
import { Inspection, inspectionStatusConfig, InspectionStatus } from "@/types/inspection";
import { InspectionStatusBadge } from "./InspectionStatusBadge";
import { InspectionResultBadge } from "./InspectionResultBadge";
import { InspectionTypeBadge } from "./InspectionTypeBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  const getColumnData = (status: InspectionStatus) => {
    return data.filter((d) => d.status === status);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-w-max">
        {kanbanColumns.map((status) => {
          const columnData = getColumnData(status);
          const config = inspectionStatusConfig[status];

          return (
            <div key={status} className="w-80 flex-shrink-0">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", config.bgColor.replace("/10", ""))} />
                  <span className="font-medium text-sm">{config.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {columnData.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="space-y-3 min-h-[200px]">
                {columnData.map((inspection) => (
                  <Card
                    key={inspection.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/inspections/${inspection.id}`)}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{inspection.inspectionNumber}</p>
                          <p className="font-medium text-sm mt-0.5">{inspection.purchaseOrder}</p>
                        </div>
                        <InspectionTypeBadge type={inspection.inspectionType} />
                      </div>

                      {/* Product */}
                      <p className="text-sm">{inspection.productName}</p>

                      {/* Supplier & Factory */}
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">{inspection.supplier.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {inspection.factory.name}, {inspection.factory.country}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={inspection.inspector.avatar} />
                            <AvatarFallback className="text-[10px]">
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
                                "text-xs font-semibold",
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(inspection.scheduledDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </Card>
                ))}

                {columnData.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No inspections
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
