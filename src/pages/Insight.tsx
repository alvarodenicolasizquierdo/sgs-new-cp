import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  RefreshCw,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Activity,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { ReportOverview } from "@/components/reports/ReportOverview";
import { TransactionFilters, TransactionFiltersState } from "@/components/reports/TransactionFilters";
import { TransactionTable } from "@/components/reports/TransactionTable";
import { ColumnEditor } from "@/components/reports/ColumnEditor";
import { CustomReports } from "@/components/reports/CustomReports";
import { BalancesView } from "@/components/reports/BalancesView";
import { RiskSummaryDashboard } from "@/components/reports/RiskSummaryDashboard";
import { ComplianceHealthView } from "@/components/reports/ComplianceHealthView";
import { PipelineFlowDashboard } from "@/components/reports/PipelineFlowDashboard";
import { mockTransactions, transactionColumns } from "@/data/mockReports";

const ITEMS_PER_PAGE = 20;

export default function Reports() {
  const [activeTab, setActiveTab] = useState("risk");
  const [filters, setFilters] = useState<TransactionFiltersState>({
    search: "",
    type: "all",
    status: "all",
    supplier: "all",
    category: "all",
    dateRange: undefined,
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    transactionColumns.filter((c) => c.defaultVisible).map((c) => c.id)
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(
    transactionColumns.map((c) => c.id)
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique values for filters
  const suppliers = useMemo(
    () => [...new Set(mockTransactions.map((t) => t.supplier))],
    []
  );
  const categories = useMemo(
    () => [...new Set(mockTransactions.map((t) => t.category))],
    []
  );

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.reference.toLowerCase().includes(searchLower) ||
          transaction.supplier.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.type !== "all" && transaction.type !== filters.type) return false;
      if (filters.status !== "all" && transaction.status !== filters.status) return false;
      if (filters.supplier !== "all" && transaction.supplier !== filters.supplier) return false;
      if (filters.category !== "all" && transaction.category !== filters.category) return false;
      if (filters.dateRange?.from) {
        if (transaction.date < filters.dateRange.from) return false;
        if (filters.dateRange.to && transaction.date > filters.dateRange.to) return false;
      }
      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExport = () => {
    toast.success("Exporting transactions...", {
      description: `${selectedRows.length || filteredTransactions.length} records will be exported`,
    });
  };

  const handleRefresh = () => {
    toast.success("Data refreshed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Insight</h1>
        <p className="text-muted-foreground">
          Decision-oriented insights on risk, compliance, and pipeline health
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </motion.div>

    {/* Tabs */}
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
        <TabsTrigger value="risk" className="gap-2">
          <ShieldAlert className="h-4 w-4" />
          Risk Summary
        </TabsTrigger>
        <TabsTrigger value="compliance" className="gap-2">
          <Award className="h-4 w-4" />
          Compliance
        </TabsTrigger>
        <TabsTrigger value="pipeline" className="gap-2">
          <Activity className="h-4 w-4" />
          Pipeline Flow
        </TabsTrigger>
        <TabsTrigger value="overview" className="gap-2">
          Overview
        </TabsTrigger>
        <TabsTrigger value="transactions" className="gap-2">
          Transactions
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            {mockTransactions.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="balances" className="gap-2">
          Balances
        </TabsTrigger>
        <TabsTrigger value="reports" className="gap-2">
          Custom Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="risk" className="mt-0">
        <RiskSummaryDashboard />
      </TabsContent>

      <TabsContent value="compliance" className="mt-0">
        <ComplianceHealthView />
      </TabsContent>

      <TabsContent value="pipeline" className="mt-0">
        <PipelineFlowDashboard />
      </TabsContent>

      <TabsContent value="overview" className="mt-0">
        <ReportOverview />
      </TabsContent>

          <TabsContent value="transactions" className="mt-0 space-y-4">
            {/* Filters */}
            <TransactionFilters
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              suppliers={suppliers}
              categories={categories}
            />

            {/* Table Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRows.length > 0 && (
                  <Badge variant="secondary">
                    {selectedRows.length} selected
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {filteredTransactions.length} transactions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ColumnEditor
                  visibleColumns={visibleColumns}
                  columnOrder={columnOrder}
                  onVisibleColumnsChange={setVisibleColumns}
                  onColumnOrderChange={setColumnOrder}
                />
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <TransactionTable
              transactions={paginatedTransactions}
              visibleColumns={visibleColumns}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of{" "}
                  {filteredTransactions.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="balances" className="mt-0">
            <BalancesView />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <CustomReports />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
