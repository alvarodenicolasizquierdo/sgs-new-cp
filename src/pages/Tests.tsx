import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TRFFilters } from "@/components/trf/TRFFilters";
import { TRFTable } from "@/components/trf/TRFTable";
import { TRFKanban } from "@/components/trf/TRFKanban";
import { TRFBulkActions } from "@/components/trf/TRFBulkActions";
import { mockTRFs } from "@/data/mockTRFs";
import { TRFFilter } from "@/types/trf";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Download,
  Upload,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react";

const defaultFilters: TRFFilter = {
  search: "",
  status: [],
  priority: [],
  testTypes: [],
  supplier: [],
  lab: [],
  dateRange: {},
  slaStatus: [],
};

const Tests = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [filters, setFilters] = useState<TRFFilter>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return mockTRFs.filter((trf) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          trf.trfNumber.toLowerCase().includes(search) ||
          trf.productName.toLowerCase().includes(search) ||
          trf.productCode.toLowerCase().includes(search) ||
          trf.supplier.name.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(trf.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(trf.priority)) {
        return false;
      }

      // SLA filter
      if (filters.slaStatus.length > 0 && !filters.slaStatus.includes(trf.slaStatus)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const total = mockTRFs.length;
    const onTrack = mockTRFs.filter((t) => t.slaStatus === "on_track").length;
    const atRisk = mockTRFs.filter((t) => t.slaStatus === "at_risk").length;
    const overdue = mockTRFs.filter((t) => t.slaStatus === "overdue").length;
    return { total, onTrack, atRisk, overdue };
  }, []);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Test Request Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all test requests across your supply chain
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate("/tests/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            New TRF
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total TRFs</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <p className="text-sm text-muted-foreground">On Track</p>
          </div>
          <p className="text-2xl font-bold text-success">{stats.onTrack}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <p className="text-sm text-muted-foreground">At Risk</p>
          </div>
          <p className="text-2xl font-bold text-warning">{stats.atRisk}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
          <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <TRFFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "kanban")}>
            <TabsList className="h-9">
              <TabsTrigger value="table" className="gap-1.5 px-3">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-1.5 px-3">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Bulk Actions */}
      <TRFBulkActions
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
      />

      {/* Content */}
      <div className="mt-4">
        {viewMode === "table" ? (
          <TRFTable
            data={filteredData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        ) : (
          <TRFKanban data={filteredData} />
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredData.length} of {mockTRFs.length} test requests
      </div>
    </DashboardLayout>
  );
};

export default Tests;
