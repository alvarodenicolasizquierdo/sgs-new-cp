import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Factory,
  MapPin,
  ChevronRight,
  Eye,
  Building2,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockInspections } from "@/data/mockInspections";
import { mockFactories, countryRiskSummary } from "@/data/mockFactories";
import { RiskLevel } from "@/types/inspection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RiskItem {
  id: string;
  name: string;
  type: "factory" | "inspection" | "supplier";
  riskLevel: RiskLevel;
  riskScore: number;
  details: string;
  action?: string;
}

const riskColors: Record<RiskLevel, string> = {
  low: "hsl(var(--success))",
  medium: "hsl(var(--warning))",
  high: "hsl(var(--destructive))",
};

export function RiskSummaryDashboard() {
  const navigate = useNavigate();
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | "all">("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleItemClick = (item: RiskItem) => {
    if (item.type === "factory") {
      navigate("/risk-assessment");
    } else if (item.type === "inspection") {
      navigate(`/inspections/${item.id}`);
    }
  };

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    const factories = mockFactories;
    const inspections = mockInspections;

    const highRiskFactories = factories.filter((f) => f.riskLevel === "high");
    const mediumRiskFactories = factories.filter((f) => f.riskLevel === "medium");
    const lowRiskFactories = factories.filter((f) => f.riskLevel === "low");

    const avgRiskScore = Math.round(
      factories.reduce((sum, f) => sum + f.riskScore, 0) / factories.length
    );

    const criticalIssues = factories.reduce((sum, f) => sum + f.criticalIssues, 0);
    const overallPassRate = Math.round(
      factories.reduce((sum, f) => sum + f.passRate, 0) / factories.length
    );

    const highRiskInspections = inspections.filter((i) => i.riskLevel === "high");
    const failedInspections = inspections.filter((i) => i.result === "fail");

    return {
      totalFactories: factories.length,
      highRisk: highRiskFactories.length,
      mediumRisk: mediumRiskFactories.length,
      lowRisk: lowRiskFactories.length,
      avgRiskScore,
      criticalIssues,
      overallPassRate,
      highRiskInspections: highRiskInspections.length,
      failedInspections: failedInspections.length,
    };
  }, []);

  // High risk items for drill-down
  const highRiskItems = useMemo((): RiskItem[] => {
    const items: RiskItem[] = [];

    // Add high-risk factories
    mockFactories
      .filter((f) => f.riskLevel === "high" || f.riskLevel === "medium")
      .forEach((f) => {
        items.push({
          id: f.id,
          name: f.name,
          type: "factory",
          riskLevel: f.riskLevel,
          riskScore: f.riskScore,
          details: `${f.location}, ${f.country} • ${f.criticalIssues} critical issues • ${f.passRate}% pass rate`,
          action: "View Factory",
        });
      });

    // Add high-risk inspections
    mockInspections
      .filter((i) => i.riskLevel === "high" || i.result === "fail")
      .forEach((i) => {
        items.push({
          id: i.id,
          name: i.inspectionNumber,
          type: "inspection",
          riskLevel: i.riskLevel,
          riskScore: i.riskLevel === "high" ? 80 : i.riskLevel === "medium" ? 50 : 20,
          details: `${i.productName} • ${i.factory.name} • ${i.criticalDefects} critical defects`,
          action: "View Inspection",
        });
      });

    return items.sort((a, b) => b.riskScore - a.riskScore);
  }, []);

  const filteredItems =
    selectedRiskLevel === "all"
      ? highRiskItems
      : highRiskItems.filter((i) => i.riskLevel === selectedRiskLevel);

  // Country risk data for chart
  const countryData = countryRiskSummary
    .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Risk Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Risk
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldX className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {riskMetrics.highRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Factories requiring immediate action
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="card-hover border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium Risk
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {riskMetrics.mediumRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Factories to monitor closely
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Risk
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {riskMetrics.lowRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Factories in good standing
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Risk Score
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riskMetrics.avgRiskScore}</div>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <TrendingDown className="h-4 w-4" />
                <span>-5 from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-destructive">
                    {riskMetrics.criticalIssues}
                  </p>
                </div>
                <Badge variant="destructive" className="h-6">
                  Needs Attention
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Pass Rate</p>
                  <p className="text-2xl font-bold">{riskMetrics.overallPassRate}%</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  +2.3%
                </div>
              </div>
              <Progress value={riskMetrics.overallPassRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Inspections</p>
                  <p className="text-2xl font-bold">{riskMetrics.failedInspections}</p>
                </div>
                <Badge variant="outline" className="h-6">
                  Last 30 days
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Risk Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Risk by Country</CardTitle>
                <Badge variant="secondary">Avg Score</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="country" type="category" width={80} tick={{ fontSize: 12 }} />
                    <ChartTooltip
                      formatter={(value: number) => [`Score: ${value}`, "Risk"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="avgRiskScore" radius={[0, 4, 4, 0]}>
                      {countryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.avgRiskScore >= 60
                              ? "hsl(var(--destructive))"
                              : entry.avgRiskScore >= 40
                              ? "hsl(var(--warning))"
                              : "hsl(var(--success))"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Factory Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "Low Risk (0-30)", count: riskMetrics.lowRisk, color: "bg-success" },
                  { level: "Medium Risk (31-60)", count: riskMetrics.mediumRisk, color: "bg-warning" },
                  { level: "High Risk (61-100)", count: riskMetrics.highRisk, color: "bg-destructive" },
                ].map((item) => (
                  <div key={item.level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.level}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} factories
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", item.color)}
                        style={{
                          width: `${(item.count / riskMetrics.totalFactories) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Factories</span>
                  <span className="font-semibold">{riskMetrics.totalFactories}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Drill-down List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Risk Items Requiring Action</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to expand for details and actions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedRiskLevel === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedRiskLevel === "high" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("high")}
                >
                  High
                </Button>
                <Button
                  variant={selectedRiskLevel === "medium" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("medium")}
                  className={selectedRiskLevel === "medium" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
                >
                  Medium
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredItems.slice(0, 10).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border rounded-lg overflow-hidden transition-all",
                      expandedItem === item.id ? "bg-muted/50" : "hover:bg-muted/30"
                    )}
                  >
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="w-full flex items-center gap-4 p-4 text-left"
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          item.riskLevel === "high"
                            ? "bg-destructive/10"
                            : item.riskLevel === "medium"
                            ? "bg-warning/10"
                            : "bg-success/10"
                        )}
                      >
                        {item.type === "factory" ? (
                          <Factory
                            className={cn(
                              "h-5 w-5",
                              item.riskLevel === "high"
                                ? "text-destructive"
                                : item.riskLevel === "medium"
                                ? "text-warning"
                                : "text-success"
                            )}
                          />
                        ) : (
                          <Eye
                            className={cn(
                              "h-5 w-5",
                              item.riskLevel === "high"
                                ? "text-destructive"
                                : item.riskLevel === "medium"
                                ? "text-warning"
                                : "text-success"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{item.name}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0",
                              item.riskLevel === "high"
                                ? "border-destructive text-destructive"
                                : item.riskLevel === "medium"
                                ? "border-warning text-warning"
                                : "border-success text-success"
                            )}
                          >
                            Score: {item.riskScore}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.details}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform",
                          expandedItem === item.id && "rotate-90"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedItem === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t bg-background"
                        >
                            <div className="p-4 flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                {item.type === "factory"
                                  ? "Review factory performance and schedule re-inspection"
                                  : "Review inspection results and initiate corrective action"}
                              </div>
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      className="gap-2"
                                      onClick={() => handleItemClick(item)}
                                    >
                                      {item.action}
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {item.type === "factory" 
                                        ? "Navigate to Risk Assessment" 
                                        : `View Inspection ${item.name} details`}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
