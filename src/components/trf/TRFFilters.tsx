import { useState } from "react";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TRFStatus,
  TRFPriority,
  TRFFilter,
  statusConfig,
  priorityConfig,
} from "@/types/trf";

interface TRFFiltersProps {
  filters: TRFFilter;
  onFiltersChange: (filters: TRFFilter) => void;
}

export function TRFFilters({ filters, onFiltersChange }: TRFFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const toggleStatus = (status: TRFStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const togglePriority = (priority: TRFPriority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const toggleSLA = (sla: "on_track" | "at_risk" | "overdue") => {
    const newSLA = filters.slaStatus.includes(sla)
      ? filters.slaStatus.filter((s) => s !== sla)
      : [...filters.slaStatus, sla];
    onFiltersChange({ ...filters, slaStatus: newSLA });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      search: "",
      status: [],
      priority: [],
      testTypes: [],
      supplier: [],
      lab: [],
      dateRange: {},
      slaStatus: [],
    });
  };

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.slaStatus.length +
    (filters.search ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search TRFs by ID, product, supplier..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(statusConfig) as TRFStatus[]).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {statusConfig[status].label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Priority
              {filters.priority.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.priority.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(priorityConfig) as TRFPriority[]).map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={filters.priority.includes(priority)}
                onCheckedChange={() => togglePriority(priority)}
              >
                {priorityConfig[priority].label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* SLA Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              SLA Status
              {filters.slaStatus.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.slaStatus.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Filter by SLA</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.slaStatus.includes("on_track")}
              onCheckedChange={() => toggleSLA("on_track")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                On Track
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.slaStatus.includes("at_risk")}
              onCheckedChange={() => toggleSLA("at_risk")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                At Risk
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.slaStatus.includes("overdue")}
              onCheckedChange={() => toggleSLA("overdue")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                Overdue
              </span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
}
