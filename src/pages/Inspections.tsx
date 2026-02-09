import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InspectionFilters } from "@/components/inspection/InspectionFilters";
import { InspectionTable } from "@/components/inspection/InspectionTable";
import { InspectionKanban } from "@/components/inspection/InspectionKanban";
import { InspectionBulkActions } from "@/components/inspection/InspectionBulkActions";
import { InspectionStats } from "@/components/inspection/InspectionStats";
import { mockInspections } from "@/data/mockInspections";
import { InspectionFilter } from "@/types/inspection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Download,
  Upload,
  LayoutGrid,
  List,
  RefreshCw,
  Calendar,
} from "lucide-react";

const defaultFilters: InspectionFilter = {
  search: "",
  status: [],
  inspectionType: [],
  result: [],
  riskLevel: [],
  supplier: [],
  factory: [],
  inspector: [],
  dateRange: {},
};

const Inspections = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [filters, setFilters] = useState<InspectionFilter>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return mockInspections.filter((inspection) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          inspection.inspectionNumber.toLowerCase().includes(search) ||
          inspection.purchaseOrder.toLowerCase().includes(search) ||
          inspection.productName.toLowerCase().includes(search) ||
          inspection.supplier.name.toLowerCase().includes(search) ||
          inspection.factory.name.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(inspection.status)) {
        return false;
      }

      // Type filter
      if (filters.inspectionType.length > 0 && !filters.inspectionType.includes(inspection.inspectionType)) {
        return false;
      }

      // Result filter
      if (filters.result.length > 0) {
        if (!inspection.result || !filters.result.includes(inspection.result)) {
          return false;
        }
      }

      // Risk filter
      if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(inspection.riskLevel)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inspections</h1>
          <p className="text-muted-foreground/80 mt-1">
            Manage and track all quality inspections across your supply chain
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate("/inspections/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <InspectionStats data={mockInspections} />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <InspectionFilters filters={filters} onFiltersChange={setFilters} />
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
      <InspectionBulkActions
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
      />

      {/* Content */}
      <div className="mt-4">
        {viewMode === "table" ? (
          <InspectionTable
            data={filteredData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        ) : (
          <InspectionKanban data={filteredData} />
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-muted-foreground/60">
        Showing {filteredData.length} of {mockInspections.length} inspections
      </div>
    </DashboardLayout>
  );
};

export default Inspections;
