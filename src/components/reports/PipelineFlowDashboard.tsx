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
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  FileText,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Timer,
  Zap,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockTRFs } from "@/data/mockTRFs";
import { mockInspections } from "@/data/mockInspections";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";

interface StageItem {
  id: string;
  name: string;
  type: "trf" | "inspection";
  stage: string;
  daysInStage: number;
  isBottleneck: boolean;
  sla?: string;
}

const STAGE_COLORS = {
  draft: "hsl(var(--muted-foreground))",
  submitted: "hsl(var(--info))",
  in_review: "hsl(var(--warning))",
  approved: "hsl(var(--success))",
  testing: "hsl(var(--primary))",
  completed: "hsl(var(--success))",
  rejected: "hsl(var(--destructive))",
  on_hold: "hsl(var(--warning))",
  scheduled: "hsl(var(--info))",
  in_progress: "hsl(var(--primary))",
  pending_review: "hsl(var(--warning))",
  cancelled: "hsl(var(--muted-foreground))",
};

export function PipelineFlowDashboard() {
  const navigate = useNavigate();
  const [selectedPipeline, setSelectedPipeline] = useState<"trf" | "inspection" | "all">("all");

  const handleItemClick = (item: StageItem) => {
    if (item.type === "trf") {
      navigate(`/tests/${item.id}`);
    } else {
      navigate(`/inspections/${item.id}`);
    }
  };

  // Calculate TRF pipeline metrics
  const trfMetrics = useMemo(() => {
    const stages = {
      draft: mockTRFs.filter((t) => t.status === "draft").length,
      submitted: mockTRFs.filter((t) => t.status === "submitted").length,
      in_review: mockTRFs.filter((t) => t.status === "in_review").length,
      approved: mockTRFs.filter((t) => t.status === "approved").length,
      testing: mockTRFs.filter((t) => t.status === "testing").length,
      completed: mockTRFs.filter((t) => t.status === "completed").length,
      on_hold: mockTRFs.filter((t) => t.status === "on_hold").length,
      rejected: mockTRFs.filter((t) => t.status === "rejected").length,
    };

    const total = mockTRFs.length;
    const activeTests = stages.testing + stages.in_review + stages.approved;
    const atRisk = mockTRFs.filter((t) => t.slaStatus === "at_risk").length;
    const overdue = mockTRFs.filter((t) => t.slaStatus === "overdue").length;

    const avgProgress = Math.round(
      mockTRFs.reduce((sum, t) => sum + t.progress, 0) / total
    );

    return { stages, total, activeTests, atRisk, overdue, avgProgress };
  }, []);

  // Calculate inspection pipeline metrics
  const inspectionMetrics = useMemo(() => {
    const stages = {
      scheduled: mockInspections.filter((i) => i.status === "scheduled").length,
      in_progress: mockInspections.filter((i) => i.status === "in_progress").length,
      pending_review: mockInspections.filter((i) => i.status === "pending_review").length,
      completed: mockInspections.filter((i) => i.status === "completed").length,
      on_hold: mockInspections.filter((i) => i.status === "on_hold").length,
      cancelled: mockInspections.filter((i) => i.status === "cancelled").length,
    };

    const total = mockInspections.length;
    const passRate = Math.round(
      (mockInspections.filter((i) => i.result === "pass").length /
        mockInspections.filter((i) => i.status === "completed").length) *
        100
    );

    return { stages, total, passRate };
  }, []);

  // Funnel data for TRF pipeline
  const trfFunnelData = [
    { name: "Submitted", value: trfMetrics.stages.submitted + trfMetrics.stages.in_review + trfMetrics.stages.approved + trfMetrics.stages.testing + trfMetrics.stages.completed, fill: "hsl(var(--info))" },
    { name: "In Review", value: trfMetrics.stages.in_review + trfMetrics.stages.approved + trfMetrics.stages.testing + trfMetrics.stages.completed, fill: "hsl(var(--warning))" },
    { name: "Testing", value: trfMetrics.stages.testing + trfMetrics.stages.completed, fill: "hsl(var(--primary))" },
    { name: "Completed", value: trfMetrics.stages.completed, fill: "hsl(var(--success))" },
  ];

  // Stage throughput data (mock)
  const throughputData = [
    { week: "Week 1", trfs: 12, inspections: 8 },
    { week: "Week 2", trfs: 15, inspections: 11 },
    { week: "Week 3", trfs: 10, inspections: 14 },
    { week: "Week 4", trfs: 18, inspections: 9 },
  ];

  // Bottleneck items
  const bottleneckItems = useMemo((): StageItem[] => {
    const items: StageItem[] = [];

    mockTRFs
      .filter((t) => t.slaStatus === "at_risk" || t.slaStatus === "overdue")
      .forEach((t) => {
        items.push({
          id: t.id,
          name: t.trfNumber,
          type: "trf",
          stage: t.status,
          daysInStage: Math.floor(Math.random() * 10) + 3,
          isBottleneck: true,
          sla: t.slaStatus,
        });
      });

    mockInspections
      .filter((i) => i.status === "on_hold" || i.status === "pending_review")
      .forEach((i) => {
        items.push({
          id: i.id,
          name: i.inspectionNumber,
          type: "inspection",
          stage: i.status,
          daysInStage: Math.floor(Math.random() * 7) + 2,
          isBottleneck: true,
        });
      });

    return items.sort((a, b) => b.daysInStage - a.daysInStage);
  }, []);

  // Stage configuration
  const trfStages = [
    { key: "draft", label: "Draft", icon: FileText },
    { key: "submitted", label: "Submitted", icon: ArrowUpRight },
    { key: "in_review", label: "In Review", icon: Clock },
    { key: "approved", label: "Approved", icon: CheckCircle2 },
    { key: "testing", label: "Testing", icon: PlayCircle },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const inspectionStages = [
    { key: "scheduled", label: "Scheduled", icon: Clock },
    { key: "in_progress", label: "In Progress", icon: PlayCircle },
    { key: "pending_review", label: "Pending Review", icon: AlertCircle },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedPipeline === "all" ? "default" : "outline"}
          onClick={() => setSelectedPipeline("all")}
        >
          All Pipelines
        </Button>
        <Button
          variant={selectedPipeline === "trf" ? "default" : "outline"}
          onClick={() => setSelectedPipeline("trf")}
        >
          Test Requests
        </Button>
        <Button
          variant={selectedPipeline === "inspection" ? "default" : "outline"}
          onClick={() => setSelectedPipeline("inspection")}
        >
          Inspections
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Pipeline
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trfMetrics.activeTests + inspectionMetrics.stages.in_progress}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Items currently processing
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
                At Risk
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {trfMetrics.atRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                SLA at risk of breach
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Timer className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {trfMetrics.overdue}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Past due date
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
                Avg Progress
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trfMetrics.avgProgress}%</div>
              <Progress value={trfMetrics.avgProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* TRF Pipeline Stages */}
      {(selectedPipeline === "all" || selectedPipeline === "trf") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Test Request Pipeline</CardTitle>
                </div>
                <Badge variant="secondary">{trfMetrics.total} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {trfStages.map((stage, index) => {
                  const count = trfMetrics.stages[stage.key as keyof typeof trfMetrics.stages] || 0;
                  const Icon = stage.icon;
                  return (
                    <div key={stage.key} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-all",
                            count > 0
                              ? "bg-primary/10 ring-2 ring-primary/30"
                              : "bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              count > 0 ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <p className="text-sm font-medium">{stage.label}</p>
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            count > 0 ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {count}
                        </p>
                      </div>
                      {index < trfStages.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* On Hold / Rejected */}
              {(trfMetrics.stages.on_hold > 0 || trfMetrics.stages.rejected > 0) && (
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  {trfMetrics.stages.on_hold > 0 && (
                    <div className="flex items-center gap-2">
                      <PauseCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm text-muted-foreground">On Hold:</span>
                      <span className="font-semibold text-warning">{trfMetrics.stages.on_hold}</span>
                    </div>
                  )}
                  {trfMetrics.stages.rejected > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-muted-foreground">Rejected:</span>
                      <span className="font-semibold text-destructive">{trfMetrics.stages.rejected}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Inspection Pipeline Stages */}
      {(selectedPipeline === "all" || selectedPipeline === "inspection") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-info" />
                  <CardTitle className="text-base">Inspection Pipeline</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{inspectionMetrics.total} total</Badge>
                  <Badge variant="outline" className="border-success text-success">
                    {inspectionMetrics.passRate}% pass rate
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {inspectionStages.map((stage, index) => {
                  const count = inspectionMetrics.stages[stage.key as keyof typeof inspectionMetrics.stages] || 0;
                  const Icon = stage.icon;
                  return (
                    <div key={stage.key} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-all",
                            count > 0
                              ? "bg-info/10 ring-2 ring-info/30"
                              : "bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              count > 0 ? "text-info" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <p className="text-sm font-medium">{stage.label}</p>
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            count > 0 ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {count}
                        </p>
                      </div>
                      {index < inspectionStages.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="trfs" name="TRFs Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inspections" name="Inspections Completed" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">TRFs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-info" />
                  <span className="text-sm text-muted-foreground">Inspections</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottleneck Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Bottleneck Items</CardTitle>
                <Badge variant="destructive">{bottleneckItems.length} items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottleneckItems.slice(0, 6).map((item, index) => (
                  <TooltipProvider key={item.id}>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                item.type === "trf" ? "bg-primary/10" : "bg-info/10"
                              )}
                            >
                              {item.type === "trf" ? (
                                <FileText className="h-4 w-4 text-primary" />
                              ) : (
                                <ClipboardCheck className="h-4 w-4 text-info" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {item.stage.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={item.sla === "overdue" ? "destructive" : "outline"}
                              className={cn(
                                item.sla === "at_risk" && "border-warning text-warning"
                              )}
                            >
                              {item.daysInStage}d in stage
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {item.type === "trf" 
                            ? `View Test Request ${item.name} details` 
                            : `View Inspection ${item.name} details`}
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                ))}
              </div>
              {bottleneckItems.length > 6 && (
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => navigate(selectedPipeline === "inspection" ? "/inspections" : "/tests")}
                      >
                        View All {bottleneckItems.length} Items
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Navigate to {selectedPipeline === "inspection" ? "Inspections" : "Tests"} list</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
