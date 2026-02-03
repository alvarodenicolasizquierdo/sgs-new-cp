import { useState } from "react";
import { InspectionFilter, InspectionStatus, InspectionType, InspectionResult, RiskLevel } from "@/types/inspection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspectionFiltersProps {
  filters: InspectionFilter;
  onFiltersChange: (filters: InspectionFilter) => void;
}

const statusOptions: { value: InspectionStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_review", label: "Pending Review" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "on_hold", label: "On Hold" },
];

const typeOptions: { value: InspectionType; label: string }[] = [
  { value: "pre_production", label: "Pre-Production (PPI)" },
  { value: "during_production", label: "During Production (DPI)" },
  { value: "final_random", label: "Final Random (FRI)" },
  { value: "container_loading", label: "Container Loading (CLI)" },
  { value: "factory_audit", label: "Factory Audit (FA)" },
];

const resultOptions: { value: InspectionResult; label: string }[] = [
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "conditional", label: "Conditional" },
  { value: "pending", label: "Pending" },
];

const riskOptions: { value: RiskLevel; label: string }[] = [
  { value: "low", label: "Low Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "high", label: "High Risk" },
];

export function InspectionFilters({ filters, onFiltersChange }: InspectionFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const toggleFilter = <K extends keyof InspectionFilter>(
    key: K,
    value: InspectionFilter[K] extends (infer T)[] ? T : never
  ) => {
    const current = filters[key] as unknown[];
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: newValues });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.inspectionType.length > 0 ||
    filters.result.length > 0 ||
    filters.riskLevel.length > 0;

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      status: [],
      inspectionType: [],
      result: [],
      riskLevel: [],
      supplier: [],
      factory: [],
      inspector: [],
      dateRange: {},
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inspections, PO, products..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Status
            {filters.status.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {filters.status.length}
              </span>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-2">
          <div className="space-y-1">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={() => toggleFilter("status", option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Type Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Type
            {filters.inspectionType.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {filters.inspectionType.length}
              </span>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-2">
          <div className="space-y-1">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.inspectionType.includes(option.value)}
                  onCheckedChange={() => toggleFilter("inspectionType", option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Result Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Result
            {filters.result.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {filters.result.length}
              </span>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-2">
          <div className="space-y-1">
            {resultOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.result.includes(option.value)}
                  onCheckedChange={() => toggleFilter("result", option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Risk Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Risk
            {filters.riskLevel.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {filters.riskLevel.length}
              </span>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-2">
          <div className="space-y-1">
            {riskOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.riskLevel.includes(option.value)}
                  onCheckedChange={() => toggleFilter("riskLevel", option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground gap-1"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
