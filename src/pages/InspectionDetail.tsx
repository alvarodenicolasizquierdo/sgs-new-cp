import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockInspections } from "@/data/mockInspections";
import { InspectionStatus, inspectionStatusConfig } from "@/types/inspection";
import { InspectionResultBadge } from "@/components/inspection/InspectionResultBadge";
import { InspectionTypeBadge } from "@/components/inspection/InspectionTypeBadge";
import { RiskLevelBadge } from "@/components/inspection/RiskLevelBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusWorkflow } from "@/components/ui/status-workflow";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Edit,
  MoreHorizontal,
  User,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const availableInspectionStatuses: { value: InspectionStatus; label: string; description: string }[] = [
  { value: "scheduled", label: "Scheduled", description: "Inspection planned" },
  { value: "in_progress", label: "In Progress", description: "On-site inspection" },
  { value: "pending_review", label: "Pending Review", description: "Awaiting report" },
  { value: "completed", label: "Completed", description: "Report finalized" },
  { value: "cancelled", label: "Cancelled", description: "Inspection cancelled" },
];

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<InspectionStatus | null>(null);

  const inspection = mockInspections.find((i) => i.id === id);

  if (!inspection) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold mb-2">Inspection Not Found</h2>
          <p className="text-muted-foreground mb-4">The inspection you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/inspections")}>Back to Inspections</Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = currentStatus || inspection.status;
  const totalDefects = inspection.criticalDefects + inspection.majorDefects + inspection.minorDefects;

  const handleStatusChange = (newStatus: InspectionStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Status updated to ${inspectionStatusConfig[newStatus].label}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/inspections")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Inspections
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Package className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{inspection.inspectionNumber}</h1>
                <StatusBadge 
                  status={status}
                  size="md"
                  onChange={handleStatusChange}
                  availableStatuses={availableInspectionStatuses}
                />
                <InspectionResultBadge result={inspection.result} />
              </div>
              <p className="text-muted-foreground mt-1">{inspection.productName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {inspection.purchaseOrder}
                </span>
                <InspectionTypeBadge type={inspection.inspectionType} variant="full" />
                <RiskLevelBadge riskLevel={inspection.riskLevel} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Status Workflow Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Activity className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="font-semibold">Inspection Workflow</span>
              </div>
              <InspectionResultBadge result={inspection.result} size="md" />
            </div>
            
            <StatusWorkflow
              steps={[
                { status: "scheduled", label: "Scheduled", description: "Inspection planned" },
                { status: "confirmed", label: "Confirmed", description: "Details verified" },
                { status: "in_progress", label: "In Progress", description: "On-site inspection" },
                { status: "pending_review", label: "Pending Report", description: "Compiling findings" },
                { status: "completed", label: "Completed", description: "Report finalized" },
              ]}
              currentStatus={status}
              size="md"
              variant="detailed"
              onStepClick={(clickedStatus) => {
                const validStatuses: InspectionStatus[] = ["scheduled", "in_progress", "pending_review", "completed"];
                if (validStatuses.includes(clickedStatus as InspectionStatus)) {
                  handleStatusChange(clickedStatus as InspectionStatus);
                }
              }}
              className="mb-6"
            />
            
            <div className="flex items-center justify-between pt-4 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scheduled: {format(new Date(inspection.scheduledDate), "MMM d, yyyy")}</span>
              </div>
              {inspection.completedDate && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed: {format(new Date(inspection.completedDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div 
          className="xl:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Score Card */}
          {inspection.score !== undefined && (
            <Card className="overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-success/[0.02] to-transparent pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Inspection Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <motion.div
                    className={cn(
                      "text-5xl font-bold",
                      inspection.score >= 90
                        ? "text-success"
                        : inspection.score >= 70
                        ? "text-warning"
                        : "text-destructive"
                    )}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {inspection.score}%
                  </motion.div>
                  <div className="flex-1">
                    <div className="relative">
                      <Progress
                        value={inspection.score}
                        className="h-4"
                      />
                      <motion.div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-md",
                          inspection.score >= 90 ? "bg-success" : 
                          inspection.score >= 70 ? "bg-warning" : 
                          "bg-destructive"
                        )}
                        style={{ left: `${inspection.score}%` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>0</span>
                      <span className="font-medium">
                        {inspection.score >= 90 ? "Excellent" : 
                         inspection.score >= 70 ? "Good" : 
                         inspection.score >= 50 ? "Fair" : "Poor"}
                      </span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Defects Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Defects Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <motion.div 
                  className="text-center p-4 rounded-xl bg-muted/50 border border-border/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-2xl font-bold">{inspection.sampleSize}</p>
                  <p className="text-sm text-muted-foreground">Sample Size</p>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-2xl font-bold text-destructive">{inspection.criticalDefects}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-warning/10 border border-warning/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-2xl font-bold text-warning">{inspection.majorDefects}</p>
                  <p className="text-sm text-muted-foreground">Major</p>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-muted border border-border/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-2xl font-bold">{inspection.minorDefects}</p>
                  <p className="text-sm text-muted-foreground">Minor</p>
                </motion.div>
              </div>

              <div className="mt-4 p-4 rounded-xl border bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-medium">AQL Level</span>
                  <span className="text-lg font-semibold">{inspection.aqlLevel}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium">Total Defects Found</span>
                  <span className={cn(
                    "text-lg font-semibold",
                    totalDefects === 0 ? "text-success" : 
                    totalDefects <= 5 ? "text-warning" : 
                    "text-destructive"
                  )}>
                    {totalDefects}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Details */}
          <Card>
            <Tabs defaultValue="details" className="p-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Product Code</label>
                    <p className="mt-1">{inspection.productCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Purchase Order</label>
                    <p className="mt-1">{inspection.purchaseOrder}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                    <p className="mt-1">{format(new Date(inspection.scheduledDate), "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed Date</label>
                    <p className="mt-1">
                      {inspection.completedDate
                        ? format(new Date(inspection.completedDate), "MMMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="findings" className="mt-4">
                {inspection.notes ? (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm">{inspection.notes}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No findings recorded</p>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inspection Created</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(inspection.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </motion.div>
                  {inspection.completedDate && (
                    <motion.div 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Inspection Completed</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(inspection.completedDate), "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {/* Inspector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Inspector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={inspection.inspector.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {inspection.inspector.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{inspection.inspector.name}</p>
                  <p className="text-sm text-muted-foreground">Quality Inspector</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{inspection.supplier.name}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Factory</p>
                <p className="font-medium">{inspection.factory.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {inspection.factory.location}, {inspection.factory.country}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="text-sm font-medium">
                  {format(new Date(inspection.scheduledDate), "MMM d, yyyy")}
                </span>
              </div>
              {inspection.completedDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-sm font-medium text-success">
                    {format(new Date(inspection.completedDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">
                  {format(new Date(inspection.updatedAt), "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default InspectionDetail;