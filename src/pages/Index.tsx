import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import markAvatar from "@/assets/profiles/mark.png";
import karukaAvatar from "@/assets/profiles/karuka.jpg";
import alvaroAvatar from "@/assets/profiles/alvaro.jpg";
import ammAvatar from "@/assets/profiles/amm.jpg";
import saritaAvatar from "@/assets/profiles/sarita.jpg";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCardWithTooltip } from "@/components/dashboard/MetricCardWithTooltip";
import { RecentTestsTable } from "@/components/dashboard/RecentTestsTable";
import { QualityTrendsChart } from "@/components/dashboard/QualityTrendsChart";
import { SupplierScorecard } from "@/components/dashboard/SupplierScorecard";
import { TestTypeDistribution } from "@/components/dashboard/TestTypeDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingSchedule } from "@/components/dashboard/UpcomingSchedule";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your testing operations.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCardWithTooltip
          title="Total Tests"
          value="1,247"
          icon={<FlaskConical className="h-6 w-6" />}
          trend={{ value: 12, direction: "up", label: "vs last month" }}
          variant="default"
          lastUpdated="2 hours ago"
        />
        <MetricCardWithTooltip
          title="Tests Passed"
          value="1,089"
          icon={<CheckCircle2 className="h-6 w-6" />}
          trend={{ value: 8, direction: "up", label: "vs last month" }}
          variant="success"
          lastUpdated="2 hours ago"
        />
        <MetricCardWithTooltip
          title="Tests Failed"
          value="87"
          icon={<XCircle className="h-6 w-6" />}
          trend={{ value: 3, direction: "down", label: "vs last month" }}
          variant="destructive"
          lastUpdated="2 hours ago"
        />
        <MetricCardWithTooltip
          title="Pending Review"
          value="71"
          icon={<Clock className="h-6 w-6" />}
          trend={{ value: 5, direction: "up", label: "new today" }}
          variant="pending"
          lastUpdated="35 min ago"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCardWithTooltip
          title="Active Inspections"
          value="24"
          icon={<ClipboardCheck className="h-6 w-6" />}
          variant="info"
          lastUpdated="1 hour ago"
        />
        <MetricCardWithTooltip
          title="Compliance Rate"
          value="94.5%"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 2.1, direction: "up", label: "vs last quarter" }}
          variant="success"
          methodology="Compliance Rate = (Styles with all TRFs passed / Total styles with completed testing) × 100. Period: Last 90 days. Sample: 247 of 262 styles."
          lastUpdated="Data as of: Feb 7, 2026 14:30 UTC"
        />
        <MetricCardWithTooltip
          title="Avg. Turnaround"
          value="3.2 days"
          icon={<Clock className="h-6 w-6" />}
          trend={{ value: 0.5, direction: "down", label: "faster" }}
          variant="info"
          methodology="Average calendar days from TRF submission to final result, measured across all completed TRFs in the last 30 days."
          lastUpdated="1 hour ago"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Charts - 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <QualityTrendsChart />
          <RecentTestsTable />
        </div>

        {/* Sidebar Widgets - 1 column */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingSchedule />
          <TestTypeDistribution />
        </div>
      </div>

      {/* Supplier Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplierScorecard />
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest updates from your team</p>
          </div>
          <div className="space-y-4">
            {[
              {
                action: "Test completed",
                details: "TST-2024-0847 passed all requirements",
                time: "2 hours ago",
                type: "success",
                user: { name: "Karuka Yamamoto", avatar: karukaAvatar, initials: "KY" },
              },
              {
                action: "New inspection scheduled",
                details: "PPE Batch Inspection for SafeGuard Manufacturing",
                time: "4 hours ago",
                type: "info",
                user: { name: "Alvaro Mendez", avatar: alvaroAvatar, initials: "AM" },
              },
              {
                action: "Report generated",
                details: "Monthly quality summary - January 2024",
                time: "Yesterday",
                type: "default",
                user: { name: "Mark Thompson", avatar: markAvatar, initials: "MT" },
              },
              {
                action: "Test failed",
                details: "TST-2024-0849 did not meet flame resistance standards",
                time: "2 days ago",
                type: "destructive",
                user: { name: "Amm Rattanakorn", avatar: ammAvatar, initials: "AR" },
              },
              {
                action: "Supplier added",
                details: "NewTech Materials Inc. registered as new supplier",
                time: "3 days ago",
                type: "default",
                user: { name: "Sarita Kim", avatar: saritaAvatar, initials: "SK" },
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={item.user.avatar} alt={item.user.name} />
                  <AvatarFallback className="text-xs">{item.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.action}</p>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.type === "success"
                          ? "bg-success"
                          : item.type === "destructive"
                          ? "bg-destructive"
                          : item.type === "info"
                          ? "bg-info"
                          : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time} • {item.user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
