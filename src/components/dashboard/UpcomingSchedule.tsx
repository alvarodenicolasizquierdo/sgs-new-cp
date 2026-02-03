import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  title: string;
  type: "inspection" | "test" | "audit";
  time: string;
  location: string;
  supplier: string;
}

const upcomingItems: ScheduleItem[] = [
  {
    id: "1",
    title: "PPE Batch Inspection",
    type: "inspection",
    time: "09:00 AM",
    location: "Lab A - Building 3",
    supplier: "SafeGuard Manufacturing",
  },
  {
    id: "2",
    title: "Chemical Resistance Test",
    type: "test",
    time: "11:30 AM",
    location: "Chemical Lab",
    supplier: "ChemPro Industries",
  },
  {
    id: "3",
    title: "Supplier Quality Audit",
    type: "audit",
    time: "02:00 PM",
    location: "Virtual - Zoom",
    supplier: "TextilePro Ltd.",
  },
  {
    id: "4",
    title: "Electrical Safety Certification",
    type: "test",
    time: "04:00 PM",
    location: "Electrical Lab",
    supplier: "ElectraSafe Corp.",
  },
];

const typeColors = {
  inspection: "bg-info/10 text-info border-info/20",
  test: "bg-success/10 text-success border-success/20",
  audit: "bg-pending/10 text-pending border-pending/20",
};

export function UpcomingSchedule() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Today's Schedule</h3>
          <p className="text-sm text-muted-foreground">February 3, 2026</p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {upcomingItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium border capitalize",
                  typeColors[item.type]
                )}
              >
                {item.type}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{item.supplier}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
