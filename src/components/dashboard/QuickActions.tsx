import { Plus, FileText, Calendar, Upload, ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: Plus, label: "New Test Request", variant: "default" as const },
  { icon: Calendar, label: "Schedule Inspection", variant: "outline" as const },
  { icon: Upload, label: "Upload Sample", variant: "outline" as const },
  { icon: FileText, label: "Generate Report", variant: "outline" as const },
  { icon: ClipboardList, label: "View Pending", variant: "outline" as const },
  { icon: BarChart3, label: "Analytics", variant: "outline" as const },
];

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className={`h-auto py-4 flex-col gap-2 ${action.variant === "default" ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
