import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TRF } from "@/types/trf";
import { TRFStatusBadge } from "./TRFStatusBadge";
import { TRFPriorityBadge } from "./TRFPriorityBadge";
import { TRFTestingLevelBadge } from "./TRFTestingLevelBadge";
import { SLAIndicator } from "./SLAIndicator";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TRFTableProps {
  data: TRF[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

type SortField = "trfNumber" | "styleName" | "supplier" | "status" | "dueDate" | "priority" | "testingLevel";
type SortDirection = "asc" | "desc";

export function TRFTable({ data, selectedIds, onSelectionChange }: TRFTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "trfNumber":
        comparison = a.trfNumber.localeCompare(b.trfNumber);
        break;
      case "styleName":
        comparison = a.styleName.localeCompare(b.styleName);
        break;
      case "supplier":
        comparison = a.supplier.name.localeCompare(b.supplier.name);
        break;
      case "testingLevel":
        const levelOrder = { base: 0, bulk: 1, garment: 2 };
        comparison = levelOrder[a.testingLevel] - levelOrder[b.testingLevel];
        break;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "dueDate":
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case "priority":
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((item) => item.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const SortableHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => handleSort(field)}
      >
        {children}
        {sortField === field ? (
          sortDirection === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  );

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) (el as any).indeterminate = someSelected;
                }}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <SortableHeader field="trfNumber">TRF ID</SortableHeader>
            <SortableHeader field="styleName">Style</SortableHeader>
            <SortableHeader field="supplier">Supplier</SortableHeader>
            <SortableHeader field="testingLevel">Level</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="priority">Priority</SortableHeader>
            <TableHead>Progress</TableHead>
            <SortableHeader field="dueDate">Due Date</SortableHeader>
            <TableHead>Assigned</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((trf) => (
            <TableRow
              key={trf.id}
              className={cn(
                "cursor-pointer transition-colors",
                selectedIds.includes(trf.id) && "bg-muted/50"
              )}
              onClick={() => navigate(`/tests/${trf.id}`)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(trf.id)}
                  onCheckedChange={() => toggleOne(trf.id)}
                />
              </TableCell>
              <TableCell className="font-medium text-primary">{trf.trfNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{trf.styleName}</p>
                  <p className="text-xs text-muted-foreground">{trf.styleNumber}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-muted">
                      {trf.supplier.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{trf.supplier.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <TRFTestingLevelBadge level={trf.testingLevel} />
              </TableCell>
              <TableCell>
                <TRFStatusBadge status={trf.status} />
              </TableCell>
              <TableCell>
                <TRFPriorityBadge priority={trf.priority} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 min-w-[100px]">
                  <Progress value={trf.progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-8">{trf.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <SLAIndicator status={trf.slaStatus} dueDate={trf.dueDate} />
              </TableCell>
              <TableCell>
                {trf.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {trf.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{trf.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/tests/${trf.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/tests/${trf.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
