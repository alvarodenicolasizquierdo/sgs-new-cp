import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, FileEdit, Trash2, Download, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspectionBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
}

export function InspectionBulkActions({ selectedCount, onClear }: InspectionBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              Actions
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <UserPlus className="h-4 w-4" />
              Assign Inspector
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <FileEdit className="h-4 w-4" />
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Download className="h-4 w-4" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Cancel Inspections
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
          <X className="h-3 w-3" />
          Clear
        </Button>
      </div>
    </div>
  );
}
