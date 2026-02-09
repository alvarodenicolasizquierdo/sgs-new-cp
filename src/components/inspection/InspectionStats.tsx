import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inspection } from "@/types/inspection";
import { useMemo } from "react";

interface InspectionStatsProps {
  data: Inspection[];
}

export function InspectionStats({ data }: InspectionStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const completed = data.filter((d) => d.status === "completed").length;
    const passed = data.filter((d) => d.result === "pass").length;
    const failed = data.filter((d) => d.result === "fail").length;
    const scheduled = data.filter((d) => d.status === "scheduled").length;
    const inProgress = data.filter((d) => d.status === "in_progress").length;
    const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;

    const riskBreakdown = {
      low: data.filter((d) => d.riskLevel === "low").length,
      medium: data.filter((d) => d.riskLevel === "medium").length,
      high: data.filter((d) => d.riskLevel === "high").length,
    };

    return { total, completed, passed, failed, scheduled, inProgress, passRate, riskBreakdown };
  }, [data]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">Total</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">Scheduled</p>
          <p className="text-2xl font-semibold text-info">{stats.scheduled}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">In Progress</p>
          <p className="text-2xl font-semibold text-primary">{stats.inProgress}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">Completed</p>
          <p className="text-2xl font-semibold">{stats.completed}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">Pass Rate</p>
          <p className="text-2xl font-semibold text-success">{stats.passRate}%</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/80">High Risk</p>
          <p className="text-2xl font-semibold text-destructive">{stats.riskBreakdown.high}</p>
        </CardContent>
      </Card>
    </div>
  );
}
