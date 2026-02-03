import { useState, useMemo } from "react";
import { mockFactories, Factory } from "@/data/mockFactories";
import { FactoryMarker } from "./FactoryMarker";
import { FactoryDetailPanel } from "./FactoryDetailPanel";
import { RiskMapLegend } from "./RiskMapLegend";
import { RiskMapStats } from "./RiskMapStats";
import { RiskLevelBadge } from "@/components/inspection/RiskLevelBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskLevel } from "@/types/inspection";
import { Search, Filter, Map, List, Globe2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple mercator projection for map visualization
function projectToMap(lat: number, lng: number, width: number, height: number) {
  // Normalize longitude to 0-1 range
  const x = ((lng + 180) / 360) * width;
  // Mercator projection for latitude
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN * height) / (2 * Math.PI);
  return { x, y };
}

export function RiskMap() {
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [zoom, setZoom] = useState(1);

  const filteredFactories = useMemo(() => {
    return mockFactories.filter((factory) => {
      const matchesSearch =
        factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === "all" || factory.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchQuery, riskFilter]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Map dimensions
  const mapWidth = 800;
  const mapHeight = 500;

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <RiskMapStats factories={filteredFactories} />

      {/* Main Map Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" />
              <CardTitle>Factory Risk Assessment Map</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {filteredFactories.length} factories
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search factories, suppliers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel | "all")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {viewMode === "map" ? (
            <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-muted/30 to-muted/60 overflow-hidden rounded-b-lg">
              {/* World Map Background (simplified) */}
              <svg
                viewBox="0 0 800 500"
                className="absolute inset-0 w-full h-full"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              >
                {/* Simplified world continents */}
                <g fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5">
                  {/* Europe */}
                  <path d="M380 100 L420 90 L450 100 L460 120 L440 150 L400 160 L380 140 Z" />
                  {/* Asia */}
                  <path d="M460 80 L550 70 L620 90 L680 130 L700 180 L680 220 L620 240 L550 220 L500 180 L460 140 Z" />
                  {/* Africa */}
                  <path d="M380 180 L420 170 L460 190 L470 250 L450 320 L400 340 L360 300 L350 240 L360 200 Z" />
                  {/* North America */}
                  <path d="M80 80 L200 60 L280 100 L300 180 L260 220 L180 200 L100 150 Z" />
                  {/* South America */}
                  <path d="M200 260 L260 250 L280 300 L270 380 L230 420 L190 380 L180 320 Z" />
                  {/* Australia */}
                  <path d="M620 320 L700 300 L740 340 L720 400 L660 420 L620 380 Z" />
                  {/* Southeast Asia */}
                  <path d="M580 200 L640 190 L680 220 L670 280 L620 300 L580 260 Z" />
                </g>

                {/* Grid lines */}
                <g stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="4,4" opacity="0.5">
                  {[0, 100, 200, 300, 400, 500].map((y) => (
                    <line key={`h-${y}`} x1="0" y1={y} x2="800" y2={y} />
                  ))}
                  {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
                    <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" />
                  ))}
                </g>
              </svg>

              {/* Factory Markers */}
              <div
                className="absolute inset-0"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              >
                {filteredFactories.map((factory) => {
                  const pos = projectToMap(
                    factory.coordinates.lat,
                    factory.coordinates.lng,
                    mapWidth,
                    mapHeight
                  );
                  return (
                    <FactoryMarker
                      key={factory.id}
                      factory={factory}
                      isSelected={selectedFactory?.id === factory.id}
                      onClick={() => setSelectedFactory(factory)}
                      style={{
                        left: `${(pos.x / mapWidth) * 100}%`,
                        top: `${(pos.y / mapHeight) * 100}%`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleResetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Legend */}
              <RiskMapLegend />

              {/* Factory Detail Panel */}
              {selectedFactory && (
                <FactoryDetailPanel
                  factory={selectedFactory}
                  onClose={() => setSelectedFactory(null)}
                />
              )}
            </div>
          ) : (
            /* List View */
            <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
              {filteredFactories.map((factory) => (
                <div
                  key={factory.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                    selectedFactory?.id === factory.id && "bg-muted"
                  )}
                  onClick={() => setSelectedFactory(factory)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{factory.name}</h4>
                        <RiskLevelBadge riskLevel={factory.riskLevel} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {factory.supplierName} • {factory.location}, {factory.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className={cn(
                          "text-lg font-bold",
                          factory.riskLevel === "low" && "text-success",
                          factory.riskLevel === "medium" && "text-warning",
                          factory.riskLevel === "high" && "text-destructive"
                        )}>
                          {factory.riskScore}
                        </p>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{factory.passRate}%</p>
                        <p className="text-xs text-muted-foreground">Pass Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{factory.totalInspections}</p>
                        <p className="text-xs text-muted-foreground">Inspections</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFactories.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Globe2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No factories match your search criteria</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
