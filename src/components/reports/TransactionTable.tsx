import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  Eye,
  Download,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Transaction, transactionColumns } from "@/data/mockReports";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionTableProps {
  transactions: Transaction[];
  visibleColumns: string[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
}

type SortConfig = {
  key: keyof Transaction | null;
  direction: "asc" | "desc";
};

const statusVariants: Record<string, { className: string; label: string }> = {
  completed: { className: "bg-success/10 text-success border-success/20", label: "Completed" },
  pending: { className: "bg-warning/10 text-warning border-warning/20", label: "Pending" },
  processing: { className: "bg-info/10 text-info border-info/20", label: "Processing" },
  failed: { className: "bg-destructive/10 text-destructive border-destructive/20", label: "Failed" },
};

const typeLabels: Record<string, string> = {
  test_request: "Test Request",
  inspection: "Inspection",
  certification: "Certification",
  payment: "Payment",
  refund: "Refund",
};

export function TransactionTable({
  transactions,
  visibleColumns,
  selectedRows,
  onSelectedRowsChange,
}: TransactionTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "desc" });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal === undefined || bVal === undefined) return 0;
    
    let comparison = 0;
    if (aVal instanceof Date && bVal instanceof Date) {
      comparison = aVal.getTime() - bVal.getTime();
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }
    
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const isAllSelected = selectedRows.length === transactions.length;
  const isSomeSelected = selectedRows.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(transactions.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectedRowsChange(selectedRows.filter((r) => r !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  const renderSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const SortableHeader = ({ column, children }: { column: keyof Transaction; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(column)}
    >
      {children}
      {renderSortIcon(column)}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
                className={isSomeSelected ? "opacity-50" : ""}
              />
            </TableHead>
            {visibleColumns.includes("date") && (
              <TableHead>
                <SortableHeader column="date">Date</SortableHeader>
              </TableHead>
            )}
            {visibleColumns.includes("type") && (
              <TableHead>
                <SortableHeader column="type">Type</SortableHeader>
              </TableHead>
            )}
            {visibleColumns.includes("description") && (
              <TableHead className="min-w-[200px]">Description</TableHead>
            )}
            {visibleColumns.includes("reference") && (
              <TableHead>Reference</TableHead>
            )}
            {visibleColumns.includes("supplier") && (
              <TableHead>
                <SortableHeader column="supplier">Supplier</SortableHeader>
              </TableHead>
            )}
            {visibleColumns.includes("category") && (
              <TableHead>Category</TableHead>
            )}
            {visibleColumns.includes("testType") && (
              <TableHead>Test Type</TableHead>
            )}
            {visibleColumns.includes("amount") && (
              <TableHead className="text-right">
                <SortableHeader column="amount">Amount</SortableHeader>
              </TableHead>
            )}
            {visibleColumns.includes("status") && (
              <TableHead>
                <SortableHeader column="status">Status</SortableHeader>
              </TableHead>
            )}
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {sortedTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                className={cn(
                  "table-row-hover border-b",
                  selectedRows.includes(transaction.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(transaction.id)}
                    onCheckedChange={() => toggleSelectRow(transaction.id)}
                    aria-label={`Select ${transaction.id}`}
                  />
                </TableCell>
                {visibleColumns.includes("date") && (
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(transaction.date, "MMM d, yyyy")}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(transaction.date, "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("type") && (
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {typeLabels[transaction.type]}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("description") && (
                  <TableCell className="max-w-[250px] truncate">
                    {transaction.description}
                  </TableCell>
                )}
                {visibleColumns.includes("reference") && (
                  <TableCell className="font-mono text-sm">
                    {transaction.reference}
                  </TableCell>
                )}
                {visibleColumns.includes("supplier") && (
                  <TableCell>{transaction.supplier}</TableCell>
                )}
                {visibleColumns.includes("category") && (
                  <TableCell>{transaction.category}</TableCell>
                )}
                {visibleColumns.includes("testType") && (
                  <TableCell>{transaction.testType || "—"}</TableCell>
                )}
                {visibleColumns.includes("amount") && (
                  <TableCell className="text-right font-medium tabular-nums">
                    <span className={transaction.amount < 0 ? "text-destructive" : ""}>
                      {transaction.amount < 0 ? "-" : ""}$
                      {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("border", statusVariants[transaction.status]?.className)}
                    >
                      {statusVariants[transaction.status]?.label}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Reference
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
