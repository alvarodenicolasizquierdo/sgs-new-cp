import { FlaskConical, CalendarCheck, Microscope, FileBarChart, ListChecks, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: FlaskConical, label: "New Test", variant: "default" as const, path: "/tests/new" },
  { icon: CalendarCheck, label: "Schedule", variant: "outline" as const, path: "/inspections" },
  { icon: Microscope, label: "Sample", variant: "outline" as const, path: "/components/new" },
  { icon: FileBarChart, label: "Report", variant: "outline" as const, path: "/analytics" },
  { icon: ListChecks, label: "Pending", variant: "outline" as const, path: "/tests" },
  { icon: TrendingUp, label: "Analytics", variant: "outline" as const, path: "/analytics" },
];

export function QuickActions() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-card rounded-xl border border-border/60 p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            onClick={() => navigate(action.path)}
            className={`h-auto py-4 px-2 flex-col gap-2 group transition-all duration-200 ${
              action.variant === "default" 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30" 
                : "hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <div className={`p-2 rounded-lg transition-all ${
              action.variant === "default" 
                ? "bg-primary-foreground/10" 
                : "bg-muted group-hover:bg-primary/10"
            }`}>
              <action.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                action.variant === "default" ? "" : "group-hover:text-primary"
              }`} />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
