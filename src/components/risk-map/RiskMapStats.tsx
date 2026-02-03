import { Factory } from "@/data/mockFactories";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, AlertTriangle, Shield, TrendingDown } from "lucide-react";

interface RiskMapStatsProps {
  factories: Factory[];
}

export function RiskMapStats({ factories }: RiskMapStatsProps) {
  const totalFactories = factories.length;
  const highRiskCount = factories.filter((f) => f.riskLevel === "high").length;
  const avgRiskScore = Math.round(
    factories.reduce((sum, f) => sum + f.riskScore, 0) / totalFactories
  );
  const avgPassRate = Math.round(
    factories.reduce((sum, f) => sum + f.passRate, 0) / totalFactories
  );

  const stats = [
    {
      label: "Total Factories",
      value: totalFactories,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "High Risk",
      value: highRiskCount,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Avg Risk Score",
      value: avgRiskScore,
      icon: Shield,
      color: avgRiskScore < 40 ? "text-success" : avgRiskScore < 60 ? "text-warning" : "text-destructive",
      bgColor: avgRiskScore < 40 ? "bg-success/10" : avgRiskScore < 60 ? "bg-warning/10" : "bg-destructive/10",
    },
    {
      label: "Avg Pass Rate",
      value: `${avgPassRate}%`,
      icon: TrendingDown,
      color: avgPassRate > 85 ? "text-success" : avgPassRate > 70 ? "text-warning" : "text-destructive",
      bgColor: avgPassRate > 85 ? "bg-success/10" : avgPassRate > 70 ? "bg-warning/10" : "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
