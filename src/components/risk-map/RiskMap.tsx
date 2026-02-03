import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockFactories, Factory } from "@/data/mockFactories";
import { LeafletMap } from "./LeafletMap";
import { FactoryDetailPanel } from "./FactoryDetailPanel";
import { RiskMapLegend } from "./RiskMapLegend";
import { RiskMapStats } from "./RiskMapStats";
import { MapStyleToggle, MapStyle } from "./MapStyleToggle";
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
import { 
  Search, 
  Filter, 
  Map, 
  List, 
  Globe2, 
  Layers, 
  RefreshCw,
  Download,
  Maximize2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RiskMap() {
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [mapStyle, setMapStyle] = useState<MapStyle>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Overview - Premium cards */}
      <motion.div variants={itemVariants}>
        <RiskMapStats factories={filteredFactories} />
      </motion.div>

      {/* Main Map Card - Immersive design */}
      <motion.div variants={itemVariants}>
        <Card className={cn(
          "overflow-hidden border-border/50",
          "shadow-lg shadow-primary/5",
          isFullscreen && "fixed inset-4 z-50"
        )}>
          <CardHeader className="pb-4 bg-gradient-to-b from-muted/30 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe2 className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg">Global Risk Assessment</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time supply chain visibility
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-0">
                  {filteredFactories.length} locations
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Quick filters */}
                <div className="hidden md:flex items-center gap-1 mr-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "h-8 text-xs gap-1.5",
                      riskFilter === "high" && "bg-destructive/10 text-destructive"
                    )}
                    onClick={() => setRiskFilter(riskFilter === "high" ? "all" : "high")}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    High Risk
                  </Button>
                </div>
                
                {/* View mode toggle */}
                <div className="flex items-center bg-muted rounded-lg p-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 rounded-md transition-all",
                      viewMode === "map" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="h-4 w-4 mr-1.5" />
                    Map
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 rounded-md transition-all",
                      viewMode === "list" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-1.5" />
                    List
                  </Button>
                </div>

                {/* Actions */}
                <div className="hidden sm:flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filters - Clean design */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search factories, suppliers, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>
              <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel | "all")}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Low Risk
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      Medium Risk
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      High Risk
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </CardHeader>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {viewMode === "map" ? (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "relative w-full",
                    isFullscreen ? "h-[calc(100vh-12rem)]" : "h-[500px] lg:h-[600px]"
                  )}
                >
                  {/* Leaflet Map */}
                  <LeafletMap
                    factories={filteredFactories}
                    selectedFactory={selectedFactory}
                    onFactorySelect={setSelectedFactory}
                    mapStyle={mapStyle}
                  />

                  {/* Map overlays */}
                  <RiskMapLegend />
                  <MapStyleToggle currentStyle={mapStyle} onStyleChange={setMapStyle} />

                  {/* Factory Detail Panel */}
                  <AnimatePresence>
                    {selectedFactory && (
                      <FactoryDetailPanel
                        factory={selectedFactory}
                        onClose={() => setSelectedFactory(null)}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "divide-y divide-border/50 overflow-y-auto custom-scrollbar",
                    isFullscreen ? "max-h-[calc(100vh-12rem)]" : "max-h-[500px] lg:max-h-[600px]"
                  )}
                >
                  {filteredFactories.map((factory, index) => (
                    <motion.div
                      key={factory.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200",
                        "hover:bg-muted/50",
                        selectedFactory?.id === factory.id && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                      onClick={() => setSelectedFactory(factory)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                              factory.riskLevel === "low" && "bg-success/10",
                              factory.riskLevel === "medium" && "bg-warning/10",
                              factory.riskLevel === "high" && "bg-destructive/10"
                            )}>
                              <span className={cn(
                                "text-sm font-bold",
                                factory.riskLevel === "low" && "text-success",
                                factory.riskLevel === "medium" && "text-warning",
                                factory.riskLevel === "high" && "text-destructive"
                              )}>
                                {factory.riskScore}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium truncate text-foreground">{factory.name}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {factory.supplierName} • {factory.location}, {factory.country}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="hidden md:block">
                            <RiskLevelBadge riskLevel={factory.riskLevel} size="sm" />
                          </div>
                          
                          <div className="flex items-center gap-6 text-right">
                            <div>
                              <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-success" />
                                {factory.passRate}%
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pass Rate</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{factory.totalInspections}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Inspections</p>
                            </div>
                            {factory.criticalIssues > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded-lg">
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                                <span className="text-xs font-medium text-destructive">{factory.criticalIssues}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredFactories.length === 0 && (
                    <motion.div 
                      className="p-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
                        <Globe2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">No factories found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
