import { useState, useMemo } from "react";
import { mockFactories, Factory } from "@/data/mockFactories";
import { FactoryMarker } from "./FactoryMarker";
import { FactoryDetailPanel } from "./FactoryDetailPanel";
import { RiskMapLegend } from "./RiskMapLegend";
import { RiskMapStats } from "./RiskMapStats";
import { WorldMapSVG } from "./WorldMapSVG";
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

// Mercator projection for map visualization (matching WorldMapSVG viewBox 1009.67 x 665.96)
function projectToMap(lat: number, lng: number, width: number, height: number) {
  // Normalize longitude to 0-1 range (offset slightly for the SVG)
  const x = ((lng + 180) / 360) * width;
  // Custom projection to match the simplified SVG map
  const y = (90 - lat) / 180 * height * 1.1 - 20;
  return { x: Math.max(0, Math.min(width, x)), y: Math.max(0, Math.min(height, y)) };
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

  // Map dimensions (matching WorldMapSVG viewBox approximately)
  const mapWidth = 1010;
  const mapHeight = 666;

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
            <div className="relative w-full aspect-[2/1] min-h-[400px] bg-gradient-to-b from-sky-50/50 to-sky-100/30 dark:from-slate-900/50 dark:to-slate-800/30 overflow-hidden rounded-b-lg">
              {/* World Map Background */}
              <div
                className="absolute inset-0 transition-transform duration-300"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              >
                <WorldMapSVG className="w-full h-full" />
              </div>

              {/* Factory Markers */}
              <div
                className="absolute inset-0 transition-transform duration-300"
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
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md" onClick={handleResetZoom}>
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
