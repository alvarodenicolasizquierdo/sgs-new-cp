import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Columns3, GripVertical, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { transactionColumns } from "@/data/mockReports";
import { motion, Reorder } from "framer-motion";

interface ColumnEditorProps {
  visibleColumns: string[];
  columnOrder: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
  onColumnOrderChange: (order: string[]) => void;
}

export function ColumnEditor({
  visibleColumns,
  columnOrder,
  onVisibleColumnsChange,
  onColumnOrderChange,
}: ColumnEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      onVisibleColumnsChange(visibleColumns.filter((c) => c !== columnId));
    } else {
      onVisibleColumnsChange([...visibleColumns, columnId]);
    }
  };

  const resetToDefaults = () => {
    onVisibleColumnsChange(
      transactionColumns.filter((c) => c.defaultVisible).map((c) => c.id)
    );
    onColumnOrderChange(transactionColumns.map((c) => c.id));
  };

  const orderedColumns = columnOrder
    .map((id) => transactionColumns.find((c) => c.id === id))
    .filter(Boolean) as typeof transactionColumns;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Edit Columns</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="h-7 px-2 text-xs gap-1.5"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Drag to reorder, toggle to show/hide
          </p>
        </div>
        
        <Reorder.Group
          axis="y"
          values={columnOrder}
          onReorder={onColumnOrderChange}
          className="p-2 space-y-1 max-h-[300px] overflow-y-auto"
        >
          {orderedColumns.map((column) => (
            <Reorder.Item
              key={column.id}
              value={column.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-grab active:cursor-grabbing",
                "bg-background hover:bg-muted/50 transition-colors",
                "border border-transparent hover:border-border"
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
              <Checkbox
                id={column.id}
                checked={visibleColumns.includes(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              />
              <label
                htmlFor={column.id}
                className="flex-1 text-sm cursor-pointer select-none"
              >
                {column.label}
              </label>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <Separator />
        
        <div className="p-2">
          <p className="text-xs text-muted-foreground text-center">
            {visibleColumns.length} of {transactionColumns.length} columns visible
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
