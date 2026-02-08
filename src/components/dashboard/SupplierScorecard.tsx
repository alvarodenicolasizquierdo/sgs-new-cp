import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  score: number;
  testsCompleted: number;
  passRate: number;
  trend: "up" | "down";
}

const topSuppliers: Supplier[] = [
  { id: "1", name: "SafeGuard Manufacturing Co.", score: 98, testsCompleted: 45, passRate: 97, trend: "up" },
  { id: "2", name: "AirPure Technologies", score: 95, testsCompleted: 38, passRate: 94, trend: "up" },
  { id: "3", name: "ElectraSafe Corp.", score: 91, testsCompleted: 52, passRate: 90, trend: "down" },
  { id: "4", name: "ProtecHands Industries", score: 88, testsCompleted: 29, passRate: 86, trend: "up" },
  { id: "5", name: "TextilePro Ltd.", score: 82, testsCompleted: 34, passRate: 79, trend: "down" },
];

function getScoreColor(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-warning";
  return "text-destructive";
}

function getProgressColor(score: number) {
  if (score >= 90) return "bg-success";
  if (score >= 75) return "bg-warning";
  return "bg-destructive";
}

export function SupplierScorecard() {
  return (
    <div className="bg-card rounded-xl border border-border/60 p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Supplier Performance</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Top suppliers by quality score</p>
        </div>
        <div className={cn("p-2.5 rounded-xl bg-muted/40")}>
          <Building2 className="h-5 w-5 text-muted-foreground/60" />
        </div>
      </div>
      <div className="space-y-1">
        {topSuppliers.map((supplier, index) => (
          <div
            key={supplier.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/40 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm truncate">{supplier.name}</span>
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold", getScoreColor(supplier.score))}>
                    {supplier.score}
                  </span>
                  {supplier.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-500", getProgressColor(supplier.score))}
                  style={{ width: `${supplier.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-muted-foreground/60">
                  {supplier.testsCompleted} tests
                </span>
                <span className="text-[11px] text-muted-foreground/60">
                  {supplier.passRate}% pass rate
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
