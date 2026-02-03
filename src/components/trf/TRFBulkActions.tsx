import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Trash2, UserPlus, Tags, Archive, ChevronDown } from "lucide-react";

interface TRFBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
}

export function TRFBulkActions({ selectedCount, onClear }: TRFBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in slide-in-from-top-2">
      <span className="text-sm font-medium">
        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              Assign
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>John Chen</DropdownMenuItem>
            <DropdownMenuItem>Maria Santos</DropdownMenuItem>
            <DropdownMenuItem>David Kim</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Unassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Tags className="h-4 w-4" />
              Status
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Mark as Submitted</DropdownMenuItem>
            <DropdownMenuItem>Mark as In Review</DropdownMenuItem>
            <DropdownMenuItem>Mark as Approved</DropdownMenuItem>
            <DropdownMenuItem>Mark as On Hold</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button variant="outline" size="sm" className="gap-1">
          <Archive className="h-4 w-4" />
          Archive
        </Button>

        <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>

        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
