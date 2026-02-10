import { useState, useMemo, useEffect } from "react";
import { tagScreen } from "@/utils/clarityTracking";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StyleCard } from "@/components/styles/StyleCard";
import { StyleStatusBadge } from "@/components/styles/StyleStatusBadge";
import { StyleStageBadge } from "@/components/styles/StyleStageBadge";
import { mockStyles, mockSuppliers, mockTechnologists } from "@/data/mockStyles";
import { Style, StyleStatus, StyleStage, Division, Season, styleStatusConfig, stageConfig, divisionConfig } from "@/types/style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar,
  Package,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import { cn } from "@/lib/utils";

type ViewMode = "cards" | "table";

export default function Styles() {
  useEffect(() => { tagScreen('smart-styles'); }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [statusFilter, setStatusFilter] = useState<StyleStatus[]>([]);
  const [stageFilter, setStageFilter] = useState<StyleStage[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<Division[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<Season | "all">("all");
  
  // Stats
  const stats = useMemo(() => {
    const pending = mockStyles.filter(s => s.status === "pending").length;
    const submitted = mockStyles.filter(s => s.status === "submitted").length;
    const approved = mockStyles.filter(s => s.status === "approved").length;
    const atRisk = mockStyles.filter(s => isPast(parseISO(s.goldSealDate)) && s.status !== "approved").length;
    return { pending, submitted, approved, atRisk, total: mockStyles.length };
  }, []);
  
  // Filtered styles
  const filteredStyles = useMemo(() => {
    return mockStyles.filter(style => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          style.tuStyleNo.toLowerCase().includes(query) ||
          style.designStyleRef.toLowerCase().includes(query) ||
          style.description.toLowerCase().includes(query) ||
          style.productColour.toLowerCase().includes(query) ||
          style.supplier.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(style.status)) {
        return false;
      }
      
      // Stage filter
      if (stageFilter.length > 0 && !stageFilter.includes(style.stage)) {
        return false;
      }
      
      // Division filter
      if (divisionFilter.length > 0 && !divisionFilter.includes(style.division)) {
        return false;
      }
      
      // Season filter
      if (seasonFilter !== "all" && style.season !== seasonFilter) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, statusFilter, stageFilter, divisionFilter, seasonFilter]);
  
  const clearFilters = () => {
    setStatusFilter([]);
    setStageFilter([]);
    setDivisionFilter([]);
    setSeasonFilter("all");
  };
  
  const hasActiveFilters = statusFilter.length > 0 || stageFilter.length > 0 || divisionFilter.length > 0 || seasonFilter !== "all";
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Styles</h1>
            <p className="text-muted-foreground/80">
              Manage product styles and their testing lifecycle
            </p>
          </div>
          <Button asChild>
            <Link to="/styles/new">
              <Plus className="h-4 w-4 mr-2" />
              New Style
            </Link>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border/60 rounded-xl shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">{stats.total}</div>
              <div className="text-sm text-muted-foreground/70">Total Styles</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 rounded-xl shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-warning">{stats.pending}</div>
              <div className="text-sm text-muted-foreground/70">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 rounded-xl shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-primary">{stats.submitted}</div>
              <div className="text-sm text-muted-foreground/70">Submitted</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 rounded-xl shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-success">{stats.approved}</div>
              <div className="text-sm text-muted-foreground/70">Approved</div>
            </CardContent>
          </Card>
          <Card className={cn("border-border/60 rounded-xl shadow-card", stats.atRisk > 0 && "border-destructive/50")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold text-destructive">{stats.atRisk}</div>
                {stats.atRisk > 0 && <AlertTriangle className="h-5 w-5 text-destructive" />}
              </div>
              <div className="text-sm text-muted-foreground/70">At Risk</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search styles, suppliers, colours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status
                  {statusFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {statusFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(styleStatusConfig) as StyleStatus[]).map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      setStatusFilter(prev => 
                        checked 
                          ? [...prev, status]
                          : prev.filter(s => s !== status)
                      );
                    }}
                  >
                    <StyleStatusBadge status={status} size="sm" />
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Stage Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Stage
                  {stageFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {stageFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(stageConfig) as StyleStage[]).map(stage => (
                  <DropdownMenuCheckboxItem
                    key={stage}
                    checked={stageFilter.includes(stage)}
                    onCheckedChange={(checked) => {
                      setStageFilter(prev => 
                        checked 
                          ? [...prev, stage]
                          : prev.filter(s => s !== stage)
                      );
                    }}
                  >
                    <StyleStageBadge stage={stage} size="sm" />
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Division Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Division
                  {divisionFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {divisionFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Division</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(divisionConfig) as Division[]).map(division => (
                  <DropdownMenuCheckboxItem
                    key={division}
                    checked={divisionFilter.includes(division)}
                    onCheckedChange={(checked) => {
                      setDivisionFilter(prev => 
                        checked 
                          ? [...prev, division]
                          : prev.filter(d => d !== division)
                      );
                    }}
                  >
                    {divisionConfig[division].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Season Filter */}
            <Select value={seasonFilter} onValueChange={(v) => setSeasonFilter(v as Season | "all")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="SS24">SS24</SelectItem>
                <SelectItem value="AW24">AW24</SelectItem>
                <SelectItem value="SS25">SS25</SelectItem>
                <SelectItem value="AW25">AW25</SelectItem>
                <SelectItem value="SS26">SS26</SelectItem>
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            
            {/* View Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-muted-foreground/60">
          Showing {filteredStyles.length} of {mockStyles.length} styles
        </div>
        
        {/* Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStyles.map(style => (
              <StyleCard key={style.id} style={style} />
            ))}
          </div>
        ) : (
          <Card className="border-border/60 rounded-xl shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Style</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Gold Seal Date</TableHead>
                  <TableHead>Fabric Tech</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStyles.map(style => (
                  <TableRow key={style.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link to={`/styles/${style.id}`} className="font-mono text-sm hover:text-primary">
                        {style.tuStyleNo}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="font-medium truncate">{style.description}</div>
                        <div className="text-xs text-muted-foreground/60">{style.designStyleRef}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StyleStatusBadge status={style.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      <StyleStageBadge stage={style.stage} size="sm" />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{style.supplier.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{divisionConfig[style.division].label}</span>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "text-sm",
                        isPast(parseISO(style.goldSealDate)) && style.status !== "approved" && "text-destructive"
                      )}>
                        {format(parseISO(style.goldSealDate), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={style.fabricTech.avatar} />
                          <AvatarFallback className="text-xs">
                            {style.fabricTech.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{style.fabricTech.name}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        
        {filteredStyles.length === 0 && (
          <Card className="p-12 border-border/60 rounded-xl">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-semibold">No styles found</h3>
              <p className="text-muted-foreground/70 mt-1">
                {hasActiveFilters 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Create your first style to get started."}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button className="mt-4" asChild>
                  <Link to="/styles/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Style
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
