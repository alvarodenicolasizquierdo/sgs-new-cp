import { useNavigate } from "react-router-dom";
import { Inspection } from "@/types/inspection";
import { InspectionStatusBadge } from "./InspectionStatusBadge";
import { InspectionResultBadge } from "./InspectionResultBadge";
import { InspectionTypeBadge } from "./InspectionTypeBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InspectionTableProps {
  data: Inspection[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function InspectionTable({ data, selectedIds, onSelectionChange }: InspectionTableProps) {
  const navigate = useNavigate();

  const toggleAll = () => {
    if (selectedIds.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((d) => d.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === data.length && data.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Inspection #</TableHead>
            <TableHead>PO / Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Supplier / Factory</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((inspection) => (
            <TableRow
              key={inspection.id}
              className={cn(
                "cursor-pointer hover:bg-muted/50 transition-colors",
                selectedIds.includes(inspection.id) && "bg-primary/5"
              )}
              onClick={() => navigate(`/inspections/${inspection.id}`)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(inspection.id)}
                  onCheckedChange={() => toggleOne(inspection.id)}
                />
              </TableCell>
              <TableCell>
                <span className="font-medium text-primary">{inspection.inspectionNumber}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{inspection.purchaseOrder}</p>
                  <p className="text-xs text-muted-foreground">{inspection.productName}</p>
                </div>
              </TableCell>
              <TableCell>
                <InspectionTypeBadge type={inspection.inspectionType} />
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{inspection.supplier.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {inspection.factory.name}, {inspection.factory.country}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={inspection.inspector.avatar} />
                    <AvatarFallback className="text-xs">
                      {inspection.inspector.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{inspection.inspector.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {format(new Date(inspection.scheduledDate), "MMM d, yyyy")}
                </span>
              </TableCell>
              <TableCell>
                <InspectionStatusBadge status={inspection.status} size="sm" />
              </TableCell>
              <TableCell>
                <InspectionResultBadge result={inspection.result} size="sm" />
              </TableCell>
              <TableCell>
                <RiskLevelBadge riskLevel={inspection.riskLevel} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                {inspection.score !== undefined ? (
                  <span
                    className={cn(
                      "font-semibold",
                      inspection.score >= 90
                        ? "text-success"
                        : inspection.score >= 70
                        ? "text-warning"
                        : "text-destructive"
                    )}
                  >
                    {inspection.score}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
