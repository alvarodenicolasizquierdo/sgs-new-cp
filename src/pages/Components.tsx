import { useState, useMemo, useEffect } from "react";
import { tagScreen } from "@/utils/clarityTracking";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  mockComponents, 
  mockFabricComponents, 
  mockTrimComponents,
  getStylesUsingComponent,
  mockStyleComponentLinks,
} from "@/data/mockComponents";
import { mockStyles } from "@/data/mockStyles";
import { 
  Component, 
  FabricComponent, 
  TrimComponent,
  ComponentStatus, 
  ComponentType,
  FabricConstruction,
  componentStatusConfig, 
  componentTypeConfig,
  constructionConfig,
  fibreTypeConfig,
} from "@/types/component";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Scissors, 
  Link2,
  Leaf,
  Package,
  Recycle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Components() {
  useEffect(() => { tagScreen('smart-components'); }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ComponentType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ComponentStatus[]>([]);
  const [sustainableOnly, setSustainableOnly] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  
  // Stats
  const stats = useMemo(() => ({
    total: mockComponents.length,
    fabrics: mockFabricComponents.length,
    trims: mockTrimComponents.length,
    sustainable: mockComponents.filter(c => c.isSustainable).length,
    approved: mockComponents.filter(c => c.status === "approved").length,
    pending: mockComponents.filter(c => c.status === "pending").length,
  }), []);
  
  // Filtered components
  const filteredComponents = useMemo(() => {
    return mockComponents.filter(comp => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          comp.tuReference.toLowerCase().includes(query) ||
          comp.mill.toLowerCase().includes(query) ||
          comp.countryOfOrigin.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Type
      if (typeFilter !== "all" && comp.componentType !== typeFilter) {
        return false;
      }
      
      // Status
      if (statusFilter.length > 0 && !statusFilter.includes(comp.status)) {
        return false;
      }
      
      // Sustainable
      if (sustainableOnly && !comp.isSustainable) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, typeFilter, statusFilter, sustainableOnly]);
  
  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter([]);
    setSustainableOnly(false);
  };
  
  const hasActiveFilters = typeFilter !== "all" || statusFilter.length > 0 || sustainableOnly;
  
  const getLinkedStylesCount = (componentId: string) => {
    return mockStyleComponentLinks.filter(l => l.componentId === componentId).length;
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Components</h1>
            <p className="text-muted-foreground">
              Manage fabrics, trims, and materials with N:M style linking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/components/new?type=trim">
                <Plus className="h-4 w-4 mr-2" />
                New Trim
              </Link>
            </Button>
            <Button asChild>
              <Link to="/components/new?type=fabric">
                <Plus className="h-4 w-4 mr-2" />
                New Fabric
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold flex items-center gap-2">
                <Scissors className="h-5 w-5 text-muted-foreground" />
                {stats.fabrics}
              </div>
              <div className="text-sm text-muted-foreground">Fabrics</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.trims}</div>
              <div className="text-sm text-muted-foreground">Trims</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {stats.sustainable}
              </div>
              <div className="text-sm text-muted-foreground">Sustainable</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, mill, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ComponentType | "all")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fabric">Fabric</SelectItem>
                <SelectItem value="trim">Trim</SelectItem>
              </SelectContent>
            </Select>
            
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
                {(Object.keys(componentStatusConfig) as ComponentStatus[]).map(status => (
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
                    <Badge variant="outline" className={cn(componentStatusConfig[status].bgColor, componentStatusConfig[status].color, "text-xs")}>
                      {componentStatusConfig[status].label}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sustainable Toggle */}
            <Button
              variant={sustainableOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSustainableOnly(!sustainableOnly)}
            >
              <Leaf className="h-4 w-4 mr-2" />
              Sustainable
            </Button>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredComponents.length} of {mockComponents.length} components
        </div>
        
        {/* Tabs for Fabric/Trim */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Components</TabsTrigger>
            <TabsTrigger value="fabrics">
              Fabrics
              <Badge variant="secondary" className="ml-2">{mockFabricComponents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="trims">
              Trims
              <Badge variant="secondary" className="ml-2">{mockTrimComponents.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ComponentTable 
              components={filteredComponents} 
              onSelect={setSelectedComponent}
              getLinkedStylesCount={getLinkedStylesCount}
            />
          </TabsContent>
          
          <TabsContent value="fabrics">
            <ComponentTable 
              components={filteredComponents.filter(c => c.componentType === "fabric")} 
              onSelect={setSelectedComponent}
              getLinkedStylesCount={getLinkedStylesCount}
            />
          </TabsContent>
          
          <TabsContent value="trims">
            <ComponentTable 
              components={filteredComponents.filter(c => c.componentType === "trim")} 
              onSelect={setSelectedComponent}
              getLinkedStylesCount={getLinkedStylesCount}
            />
          </TabsContent>
        </Tabs>
        
        {filteredComponents.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No components found</h3>
              <p className="text-muted-foreground mt-1">
                {hasActiveFilters 
                  ? "Try adjusting your filters."
                  : "Create your first component to get started."}
              </p>
            </div>
          </Card>
        )}
        
        {/* Component Detail Dialog */}
        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-2xl">
            {selectedComponent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-lg">{componentTypeConfig[selectedComponent.componentType].icon}</span>
                    {selectedComponent.tuReference}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedComponent.mill} • {selectedComponent.countryOfOrigin}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Status & Flags */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className={cn(componentStatusConfig[selectedComponent.status].bgColor, componentStatusConfig[selectedComponent.status].color)}>
                      {componentStatusConfig[selectedComponent.status].label}
                    </Badge>
                    {selectedComponent.isSustainable && (
                      <Badge variant="outline" className="border-success text-success">
                        <Leaf className="h-3 w-3 mr-1" />
                        Sustainable
                      </Badge>
                    )}
                    {selectedComponent.isRegenerative && (
                      <Badge variant="outline" className="border-success text-success">
                        <Recycle className="h-3 w-3 mr-1" />
                        Regenerative
                      </Badge>
                    )}
                    {selectedComponent.reachCompliant && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        REACH Compliant
                      </Badge>
                    )}
                  </div>
                  
                  {/* Fabric-specific details */}
                  {selectedComponent.componentType === "fabric" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Construction</div>
                        <div className="font-medium">
                          {constructionConfig[(selectedComponent as FabricComponent).construction]?.label || (selectedComponent as FabricComponent).construction}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Weight</div>
                        <div className="font-medium">{(selectedComponent as FabricComponent).weight} g/m²</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Width</div>
                        <div className="font-medium">{(selectedComponent as FabricComponent).width} cm</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Dye Method</div>
                        <div className="font-medium capitalize">{(selectedComponent as FabricComponent).dyeMethod.replace("_", " ")}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground mb-2">Composition</div>
                        <div className="flex flex-wrap gap-2">
                          {(selectedComponent as FabricComponent).composition.map((f, i) => (
                            <Badge key={i} variant="outline" className={cn(f.isSustainable && "border-success text-success")}>
                              {f.percentage}% {f.fibreLabel}
                              {f.isSustainable && <Leaf className="h-3 w-3 ml-1" />}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Trim-specific details */}
                  {selectedComponent.componentType === "trim" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Trim Type</div>
                        <div className="font-medium">{(selectedComponent as TrimComponent).trimType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Colour</div>
                        <div className="font-medium">{(selectedComponent as TrimComponent).colour}</div>
                      </div>
                      {(selectedComponent as TrimComponent).size && (
                        <div>
                          <div className="text-sm text-muted-foreground">Size</div>
                          <div className="font-medium">{(selectedComponent as TrimComponent).size}</div>
                        </div>
                      )}
                      {(selectedComponent as TrimComponent).material && (
                        <div>
                          <div className="text-sm text-muted-foreground">Material</div>
                          <div className="font-medium">{(selectedComponent as TrimComponent).material}</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Linked Styles */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Linked Styles ({getLinkedStylesCount(selectedComponent.id)})
                    </div>
                    <div className="space-y-2">
                      {mockStyleComponentLinks
                        .filter(l => l.componentId === selectedComponent.id)
                        .map(link => {
                          const style = mockStyles.find(s => s.id === link.styleId);
                          if (!style) return null;
                          return (
                            <Link
                              key={link.id}
                              to={`/styles/${style.id}`}
                              className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                              <div>
                                <div className="font-mono text-sm">{style.tuStyleNo}</div>
                                <div className="text-sm text-muted-foreground">{style.description}</div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Component Table
function ComponentTable({ 
  components, 
  onSelect,
  getLinkedStylesCount 
}: { 
  components: Component[]; 
  onSelect: (c: Component) => void;
  getLinkedStylesCount: (id: string) => number;
}) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Mill</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Linked Styles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Flags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map(comp => (
            <TableRow 
              key={comp.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelect(comp)}
            >
              <TableCell className="font-mono">{comp.tuReference}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {componentTypeConfig[comp.componentType].icon} {componentTypeConfig[comp.componentType].label}
                </Badge>
              </TableCell>
              <TableCell>{comp.mill}</TableCell>
              <TableCell>
                {comp.componentType === "fabric" ? (
                  <span className="text-sm">
                    {constructionConfig[(comp as FabricComponent).construction]?.label} • {(comp as FabricComponent).weight}g/m²
                  </span>
                ) : (
                  <span className="text-sm">
                    {(comp as TrimComponent).trimType} • {(comp as TrimComponent).colour}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="gap-1">
                  <Link2 className="h-3 w-3" />
                  {getLinkedStylesCount(comp.id)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(componentStatusConfig[comp.status].bgColor, componentStatusConfig[comp.status].color)}>
                  {componentStatusConfig[comp.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {comp.isSustainable && <Leaf className="h-4 w-4 text-success" />}
                  {comp.reachCompliant && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
