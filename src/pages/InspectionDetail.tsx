import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockInspections } from "@/data/mockInspections";
import { InspectionStatusBadge } from "@/components/inspection/InspectionStatusBadge";
import { InspectionResultBadge } from "@/components/inspection/InspectionResultBadge";
import { InspectionTypeBadge } from "@/components/inspection/InspectionTypeBadge";
import { RiskLevelBadge } from "@/components/inspection/RiskLevelBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const totalDefects = inspection.criticalDefects + inspection.majorDefects + inspection.minorDefects;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/inspections")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Inspections
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{inspection.inspectionNumber}</h1>
                <InspectionStatusBadge status={inspection.status} />
                <InspectionResultBadge result={inspection.result} />
              </div>
              <p className="text-muted-foreground mt-1">{inspection.productName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Score Card */}
          {inspection.score !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inspection Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div
                    className={cn(
                      "text-5xl font-bold",
                      inspection.score >= 90
                        ? "text-success"
                        : inspection.score >= 70
                        ? "text-warning"
                        : "text-destructive"
                    )}
                  >
                    {inspection.score}%
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={inspection.score}
                      className="h-3"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>0</span>
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
              <CardTitle className="text-lg">Defects Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{inspection.sampleSize}</p>
                  <p className="text-sm text-muted-foreground">Sample Size</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <p className="text-2xl font-bold text-destructive">{inspection.criticalDefects}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <p className="text-2xl font-bold text-warning">{inspection.majorDefects}</p>
                  <p className="text-sm text-muted-foreground">Major</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">{inspection.minorDefects}</p>
                  <p className="text-sm text-muted-foreground">Minor</p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">AQL Level</span>
                  <span className="text-lg font-semibold">{inspection.aqlLevel}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium">Total Defects Found</span>
                  <span className="text-lg font-semibold">{totalDefects}</span>
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
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inspection Created</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(inspection.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                  {inspection.completedDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Inspection Completed</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(inspection.completedDate), "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inspector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Inspector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={inspection.inspector.avatar} />
                  <AvatarFallback>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Supplier</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Schedule</CardTitle>
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
                  <span className="text-sm font-medium">
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InspectionDetail;
