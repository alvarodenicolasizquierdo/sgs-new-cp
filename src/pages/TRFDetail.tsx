import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockTRFs } from "@/data/mockTRFs";
import { TRFStatusBadge } from "@/components/trf/TRFStatusBadge";
import { TRFPriorityBadge } from "@/components/trf/TRFPriorityBadge";
import { SLAIndicator } from "@/components/trf/SLAIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusWorkflow } from "@/components/ui/status-workflow";
import {
  ArrowLeft,
  Edit,
  Printer,
  Download,
  Share2,
  MoreHorizontal,
  Clock,
  User,
  Building2,
  FlaskConical,
  FileText,
  MessageSquare,
  History,
  Paperclip,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TRFDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "basic",
    "product",
    "testing",
  ]);

  const trf = mockTRFs.find((t) => t.id === id);

  if (!trf) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold mb-2">TRF Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The test request form you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
        </div>
      </DashboardLayout>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const Section = ({
    id,
    title,
    icon: Icon,
    children,
    status,
  }: {
    id: string;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    status?: "complete" | "incomplete" | "error";
  }) => {
    const isExpanded = expandedSections.includes(id);

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(id)}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{title}</span>
            </div>
            {status && (
              <div>
                {status === "complete" && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                {status === "incomplete" && (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
                {status === "error" && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 border-l-2 border-muted ml-6 mt-2">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const activities = [
    {
      id: 1,
      action: "Status changed to Testing",
      user: "John Chen",
      time: "2 hours ago",
      type: "status",
    },
    {
      id: 2,
      action: "Added comment",
      user: "Maria Santos",
      time: "5 hours ago",
      type: "comment",
      details: "Sample received and logged. Starting chemical analysis.",
    },
    {
      id: 3,
      action: "Assigned to John Chen",
      user: "System",
      time: "1 day ago",
      type: "assignment",
    },
    {
      id: 4,
      action: "TRF approved",
      user: "David Kim",
      time: "2 days ago",
      type: "approval",
    },
    {
      id: 5,
      action: "TRF submitted for review",
      user: "SafeGuard Manufacturing",
      time: "3 days ago",
      type: "submit",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/tests")}
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{trf.trfNumber}</h1>
              <TRFStatusBadge status={trf.status} size="md" />
              <TRFPriorityBadge priority={trf.priority} />
            </div>
            <p className="text-lg">{trf.productName}</p>
            <p className="text-sm text-muted-foreground">{trf.productCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-12 lg:ml-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Workflow */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Workflow Progress</span>
            <SLAIndicator status={trf.slaStatus} dueDate={trf.dueDate} />
          </div>
          <StatusWorkflow
            steps={[
              { status: "draft", label: "Draft", description: "Form created" },
              { status: "submitted", label: "Submitted", description: "Awaiting review" },
              { status: "in_review", label: "In Review", description: "Under evaluation" },
              { status: "approved", label: "Approved", description: "Ready for testing" },
              { status: "testing", label: "Testing", description: "Lab analysis" },
              { status: "completed", label: "Completed", description: "Results ready" },
            ]}
            currentStatus={trf.status}
            size="md"
            className="mb-4"
          />
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={trf.progress} className="h-2 w-32" />
                <span className="text-sm font-medium">{trf.progress}%</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              Due: {new Date(trf.dueDate).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Form Sections */}
        <div className="xl:col-span-2 space-y-4">
          <Section id="basic" title="Basic Information" icon={FileText} status="complete">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">TRF Number</label>
                <p className="font-medium">{trf.trfNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Submission Date</label>
                <p className="font-medium">
                  {trf.submittedDate
                    ? new Date(trf.submittedDate).toLocaleDateString()
                    : "Not submitted"}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Due Date</label>
                <p className="font-medium">{new Date(trf.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Priority</label>
                <div className="mt-1">
                  <TRFPriorityBadge priority={trf.priority} />
                </div>
              </div>
            </div>
          </Section>

          <Section id="product" title="Product Details" icon={FileText} status="complete">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Product Name</label>
                <p className="font-medium">{trf.productName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Product Code</label>
                <p className="font-medium">{trf.productCode}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Supplier</label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {trf.supplier.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{trf.supplier.name}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Testing Lab</label>
                <p className="font-medium">{trf.lab.name}</p>
                <p className="text-sm text-muted-foreground">{trf.lab.location}</p>
              </div>
            </div>
          </Section>

          <Section id="testing" title="Testing Requirements" icon={FlaskConical} status="incomplete">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Test Types</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trf.testTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              {trf.notes && (
                <div>
                  <label className="text-sm text-muted-foreground">Special Instructions</label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{trf.notes}</p>
                </div>
              )}
            </div>
          </Section>

          <Section id="attachments" title="Attachments" icon={Paperclip}>
            <div className="text-center py-8 text-muted-foreground">
              <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No attachments yet</p>
              <Button variant="outline" size="sm" className="mt-2">
                Add Attachment
              </Button>
            </div>
          </Section>
        </div>

        {/* Right Column - Activity & Actions */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  {trf.assignedTo ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {trf.assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{trf.assignedTo.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm">Unassigned</p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium text-sm">{trf.supplier.name}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Testing Lab</p>
                  <p className="font-medium text-sm">{trf.lab.name}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-sm">
                    {new Date(trf.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          activity.type === "status" && "bg-primary",
                          activity.type === "comment" && "bg-info",
                          activity.type === "assignment" && "bg-warning",
                          activity.type === "approval" && "bg-success",
                          activity.type === "submit" && "bg-muted-foreground"
                        )}
                      />
                      {index < activities.length - 1 && (
                        <div className="absolute left-0.5 top-4 w-0.5 h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{activity.action}</p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.details}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Comment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your comment... Use @ to mention team members"
                className="mb-3"
              />
              <Button size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TRFDetail;
