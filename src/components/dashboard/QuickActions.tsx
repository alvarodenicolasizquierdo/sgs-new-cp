import { FlaskConical, CalendarCheck, Microscope, FileBarChart, ListChecks, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: FlaskConical, label: "New Test", variant: "default" as const },
  { icon: CalendarCheck, label: "Schedule", variant: "outline" as const },
  { icon: Microscope, label: "Sample", variant: "outline" as const },
  { icon: FileBarChart, label: "Report", variant: "outline" as const },
  { icon: ListChecks, label: "Pending", variant: "outline" as const },
  { icon: TrendingUp, label: "Analytics", variant: "outline" as const },
];

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
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
