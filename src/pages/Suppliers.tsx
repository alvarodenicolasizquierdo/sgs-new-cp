import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  mockSuppliers,
  getSupplierStats,
  complianceStatusConfig,
  tierConfig,
  Supplier,
} from "@/data/mockSuppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Package,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  Calendar,
  BarChart3,
  List,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  SupplierPerformanceChart,
  MultiSupplierPerformanceChart,
} from "@/components/suppliers/SupplierPerformanceChart";

export default function Suppliers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "charts">("list");

  const stats = useMemo(() => getSupplierStats(), []);

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter((supplier) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          supplier.name.toLowerCase().includes(query) ||
          supplier.code.toLowerCase().includes(query) ||
          supplier.country.toLowerCase().includes(query) ||
          supplier.city.toLowerCase().includes(query) ||
          supplier.contactName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Compliance filter
      if (complianceFilter !== "all" && supplier.complianceStatus !== complianceFilter) {
        return false;
      }

      // Tier filter
      if (tierFilter !== "all" && supplier.tier !== tierFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, complianceFilter, tierFilter]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getComplianceIcon = (status: Supplier["complianceStatus"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "at_risk":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "non_compliant":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending_audit":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Suppliers
            </h1>
            <p className="text-muted-foreground">
              Manage supplier directory and performance
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/suppliers/new")}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "charts")} className="w-auto">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="border-success/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div className="text-2xl font-bold text-success">{stats.compliant}</div>
              </div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </CardContent>
          </Card>
          <Card className="border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div className="text-2xl font-bold text-warning">{stats.atRisk}</div>
              </div>
              <div className="text-sm text-muted-foreground">At Risk</div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div className="text-2xl font-bold text-destructive">{stats.nonCompliant}</div>
              </div>
              <div className="text-sm text-muted-foreground">Non-Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.pendingAudit}</div>
              </div>
              <div className="text-sm text-muted-foreground">Pending Audit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{stats.avgScore}%</div>
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{stats.totalStyles}</div>
              </div>
              <div className="text-sm text-muted-foreground">Active Styles</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers, codes, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={complianceFilter} onValueChange={setComplianceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Compliance Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                <SelectItem value="pending_audit">Pending Audit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="preferred">Preferred</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredSuppliers.length} suppliers
        </div>

        {/* List View - Suppliers Table */}
        {viewMode === "list" && (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Compliance</TableHead>
                    <TableHead className="text-center">Tier</TableHead>
                    <TableHead className="text-center">Styles</TableHead>
                    <TableHead className="text-center">Pass Rate</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => {
                    const complianceConfig = complianceStatusConfig[supplier.complianceStatus];
                    const supplierTierConfig = tierConfig[supplier.tier];

                    return (
                      <TableRow
                        key={supplier.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {supplier.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {supplier.code}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {supplier.city}, {supplier.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{supplier.contactName}</div>
                          <div className="text-xs text-muted-foreground">{supplier.contactEmail}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("text-lg font-bold", getScoreColor(supplier.performanceScore))}>
                            {supplier.performanceScore}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn(complianceConfig.bgColor, complianceConfig.color, "gap-1")}
                          >
                            {getComplianceIcon(supplier.complianceStatus)}
                            {complianceConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn(supplierTierConfig.bgColor, supplierTierConfig.color)}
                          >
                            {supplierTierConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium">{supplier.activeStylesCount}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Progress
                              value={supplier.passRate}
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {supplier.passRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>View Styles</DropdownMenuItem>
                              <DropdownMenuItem>View Tests</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Schedule Audit</DropdownMenuItem>
                              <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            {filteredSuppliers.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No suppliers found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Charts View - Performance Trends */}
        {viewMode === "charts" && (
          <div className="space-y-6">
            {/* Multi-supplier comparison */}
            <MultiSupplierPerformanceChart
              suppliers={[
                { id: "sup-1", name: "Textile Excellence Ltd", currentScore: 92, color: "hsl(var(--primary))" },
                { id: "sup-4", name: "Viet Garment Solutions", currentScore: 91, color: "hsl(var(--success))" },
                { id: "sup-2", name: "Dragon Fabrics Co", currentScore: 88, color: "hsl(var(--info))" },
                { id: "sup-7", name: "Euro Fashion Fabrics", currentScore: 96, color: "hsl(var(--accent))" },
              ]}
            />

            {/* Individual supplier charts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Individual Supplier Trends</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSuppliers.slice(0, 6).map((supplier) => (
                  <SupplierPerformanceChart
                    key={supplier.id}
                    supplierId={supplier.id}
                    supplierName={supplier.name}
                    currentScore={supplier.performanceScore}
                  />
                ))}
              </div>
            </div>

            {filteredSuppliers.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No suppliers found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your filters to see performance trends
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Supplier Detail Dialog */}
        <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
          <DialogContent className="max-w-2xl">
            {selectedSupplier && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {selectedSupplier.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <DialogTitle className="text-xl">{selectedSupplier.name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <span className="font-mono">{selectedSupplier.code}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        {selectedSupplier.city}, {selectedSupplier.country}
                      </DialogDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        tierConfig[selectedSupplier.tier].bgColor,
                        tierConfig[selectedSupplier.tier].color
                      )}
                    >
                      {tierConfig[selectedSupplier.tier].label}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Performance */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className={cn("text-2xl font-bold", getScoreColor(selectedSupplier.performanceScore))}>
                          {selectedSupplier.performanceScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pass Rate</span>
                        <span className="font-medium">{selectedSupplier.passRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Tests</span>
                        <span className="font-medium">{selectedSupplier.totalTestsCount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            complianceStatusConfig[selectedSupplier.complianceStatus].bgColor,
                            complianceStatusConfig[selectedSupplier.complianceStatus].color,
                            "gap-1"
                          )}
                        >
                          {getComplianceIcon(selectedSupplier.complianceStatus)}
                          {complianceStatusConfig[selectedSupplier.complianceStatus].label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Audit</span>
                        <span className="text-sm">{format(parseISO(selectedSupplier.lastAuditDate), "dd MMM yyyy")}</span>
                      </div>
                      {selectedSupplier.nextAuditDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Next Audit</span>
                          <span className="text-sm">{format(parseISO(selectedSupplier.nextAuditDate), "dd MMM yyyy")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="font-medium">{selectedSupplier.contactName}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {selectedSupplier.contactEmail}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {selectedSupplier.contactPhone}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certifications */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {selectedSupplier.certifications.length > 0 ? (
                          selectedSupplier.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No certifications</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Specializations */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.specializations.map((spec) => (
                      <Badge key={spec} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <Button className="flex-1 gap-2">
                    <Package className="h-4 w-4" />
                    View {selectedSupplier.activeStylesCount} Active Styles
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Audit
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
