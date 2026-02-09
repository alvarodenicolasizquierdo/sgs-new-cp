import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceDataPoint {
  month: string;
  score: number;
  passRate: number;
  testsCompleted: number;
}

interface SupplierPerformanceChartProps {
  supplierId: string;
  supplierName: string;
  currentScore: number;
}

// Generate mock historical data for a supplier
const generateHistoricalData = (supplierId: string, currentScore: number): PerformanceDataPoint[] => {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const seed = supplierId.charCodeAt(supplierId.length - 1);
  
  return months.map((month, index) => {
    // Create realistic trending data with some variance
    const variance = ((seed * (index + 1)) % 15) - 7;
    const trendFactor = (index / months.length) * 10;
    const baseScore = Math.max(60, Math.min(100, currentScore - 10 + trendFactor + variance));
    
    return {
      month,
      score: Math.round(baseScore),
      passRate: Math.round(baseScore + ((seed % 5) - 2)),
      testsCompleted: 15 + ((seed * (index + 1)) % 20),
    };
  });
};

export function SupplierPerformanceChart({
  supplierId,
  supplierName,
  currentScore,
}: SupplierPerformanceChartProps) {
  const data = useMemo(
    () => generateHistoricalData(supplierId, currentScore),
    [supplierId, currentScore]
  );

  const firstScore = data[0].score;
  const lastScore = data[data.length - 1].score;
  const scoreDiff = lastScore - firstScore;
  const trendDirection = scoreDiff > 2 ? "up" : scoreDiff < -2 ? "down" : "stable";

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">{supplierName}</CardTitle>
            <CardDescription>6-month performance trend</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1",
                trendDirection === "up" && "bg-success/10 text-success",
                trendDirection === "down" && "bg-destructive/10 text-destructive",
                trendDirection === "stable" && "bg-muted text-muted-foreground"
              )}
            >
              {trendDirection === "up" && <TrendingUp className="h-3 w-3" />}
              {trendDirection === "down" && <TrendingDown className="h-3 w-3" />}
              {trendDirection === "stable" && <Minus className="h-3 w-3" />}
              {scoreDiff > 0 ? "+" : ""}
              {scoreDiff} pts
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-semibold">{currentScore}</p>
              <p className="text-xs text-muted-foreground/60">Current</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${supplierId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                domain={[50, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium text-sm mb-2">{label} 2024</p>
                        <div className="space-y-1 text-xs">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-medium">{payload[0].value}</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Pass Rate:</span>
                            <span className="font-medium">{payload[0].payload.passRate}%</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Tests:</span>
                            <span className="font-medium">{payload[0].payload.testsCompleted}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#gradient-${supplierId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Multi-supplier comparison chart
interface MultiSupplierChartProps {
  suppliers: Array<{
    id: string;
    name: string;
    currentScore: number;
    color: string;
  }>;
}

export function MultiSupplierPerformanceChart({ suppliers }: MultiSupplierChartProps) {
  const data = useMemo(() => {
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    
    return months.map((month, monthIndex) => {
      const point: Record<string, string | number> = { month };
      
      suppliers.forEach((supplier) => {
        const seed = supplier.id.charCodeAt(supplier.id.length - 1);
        const variance = ((seed * (monthIndex + 1)) % 15) - 7;
        const trendFactor = (monthIndex / months.length) * 10;
        const score = Math.max(
          60,
          Math.min(100, supplier.currentScore - 10 + trendFactor + variance)
        );
        point[supplier.id] = Math.round(score);
      });
      
      return point;
    });
  }, [suppliers]);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Supplier Performance Comparison</CardTitle>
        <CardDescription>6-month score trends across top suppliers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                domain={[50, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium text-sm mb-2">{label} 2024</p>
                        <div className="space-y-1.5">
                          {payload.map((entry) => {
                            const supplier = suppliers.find((s) => s.id === entry.dataKey);
                            return (
                              <p
                                key={entry.dataKey}
                                className="flex items-center justify-between gap-4 text-xs"
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-muted-foreground truncate max-w-[120px]">
                                    {supplier?.name}
                                  </span>
                                </span>
                                <span className="font-medium">{entry.value}</span>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={({ payload }) => (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {payload?.map((entry, index) => {
                      const supplier = suppliers.find((s) => s.id === entry.dataKey);
                      return (
                        <div key={String(entry.dataKey) || index} className="flex items-center gap-2 text-xs">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">{supplier?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              {suppliers.map((supplier) => (
                <Line
                  key={supplier.id}
                  type="monotone"
                  dataKey={supplier.id}
                  stroke={supplier.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: supplier.color }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
