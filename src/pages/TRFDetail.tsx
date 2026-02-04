import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockTRFs } from "@/data/mockTRFs";
import { TRFStatus, statusConfig } from "@/types/trf";
import { TRFPriorityBadge } from "@/components/trf/TRFPriorityBadge";
import { SLAIndicator } from "@/components/trf/SLAIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusWorkflow } from "@/components/ui/status-workflow";
import { StatusBadge } from "@/components/ui/status-badge";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Archive,
  Link2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const availableTRFStatuses: { value: TRFStatus; label: string; description: string }[] = [
  { value: "draft", label: "Draft", description: "Initial form state" },
  { value: "submitted", label: "Submitted", description: "Awaiting review" },
  { value: "in_review", label: "In Review", description: "Being evaluated" },
  { value: "approved", label: "Approved", description: "Ready for testing" },
  { value: "testing", label: "Testing", description: "Lab analysis in progress" },
  { value: "completed", label: "Completed", description: "Results ready" },
  { value: "rejected", label: "Rejected", description: "Not approved" },
  { value: "on_hold", label: "On Hold", description: "Temporarily paused" },
];

const TRFDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "basic",
    "product",
    "testing",
  ]);
  const [currentStatus, setCurrentStatus] = useState<TRFStatus | null>(null);

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

  const status = currentStatus || trf.status;

  const handleStatusChange = (newStatus: TRFStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
  };

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
          <motion.div 
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
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
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div 
            className="p-4 border-l-2 border-muted ml-6 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
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
      {/* Archived Banner */}
      {trf.isArchived && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-muted/50 border border-muted rounded-lg flex items-center gap-3"
        >
          <Archive className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-sm">This TRF is archived</p>
            <p className="text-xs text-muted-foreground">
              Archived on {trf.archivedAt ? new Date(trf.archivedAt).toLocaleDateString() : "unknown date"}
              {trf.archivedReason && ` • ${trf.archivedReason}`}
            </p>
          </div>
          <Button variant="outline" size="sm">
            Restore
          </Button>
        </motion.div>
      )}
      
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold">{trf.trfNumber}</h1>
              <StatusBadge 
                status={status}
                size="md"
                onChange={handleStatusChange}
                availableStatuses={availableTRFStatuses}
              />
              <TRFPriorityBadge priority={trf.priority} />
            </div>
            <p className="text-lg">{trf.styleName}</p>
            <p className="text-sm text-muted-foreground">{trf.styleNumber}</p>
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
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="font-semibold">Workflow Progress</span>
              </div>
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
              currentStatus={status}
              size="md"
              variant="detailed"
              onStepClick={(clickedStatus) => {
                const stepIndex = availableTRFStatuses.findIndex(s => s.value === clickedStatus);
                const currentIndex = availableTRFStatuses.findIndex(s => s.value === status);
                if (stepIndex <= currentIndex) {
                  handleStatusChange(clickedStatus as TRFStatus);
                }
              }}
              className="mb-6"
            />
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <Progress value={trf.progress} className="h-2 w-40" />
                  <span className={cn(
                    "text-sm font-semibold",
                    trf.progress >= 75 ? "text-success" : 
                    trf.progress >= 50 ? "text-warning" : 
                    "text-muted-foreground"
                  )}>
                    {trf.progress}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <p className="font-medium mt-0.5">
                  {new Date(trf.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Form Sections */}
        <motion.div 
          className="xl:col-span-2 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
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

          <Section id="style" title="Style Details" icon={FileText} status="complete">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Style Name</label>
                <p className="font-medium">{trf.styleName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Style Number</label>
                <p className="font-medium">{trf.styleNumber}</p>
              </div>
              {trf.designStyleRef && (
                <div>
                  <label className="text-sm text-muted-foreground">Design Style Ref</label>
                  <p className="font-medium">{trf.designStyleRef}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">Testing Level</label>
                <p className="font-medium capitalize">{trf.testingLevel}</p>
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
              {trf.linkedReportNumber && (
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Linked SMART Report</label>
                  <p className="font-medium text-primary">{trf.linkedReportNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {trf.isAmendment ? "This is an amendment to a previous test" : "Linked for reference"}
                  </p>
                </div>
              )}
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

          <Section id="linked-reports" title="Linked Reports" icon={FileText}>
            {trf.linkedReportNumber ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">{trf.linkedReportNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {trf.isAmendment ? "Amendment Source" : "Linked SMART Report"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Report</Button>
                    <Button variant="outline" size="sm">Request Amend</Button>
                  </div>
                </div>
                {trf.isAmendment && trf.parentTrfId && (
                  <div className="p-3 border border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Previous TRF</p>
                    <p className="font-medium">{trf.parentTrfId}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This TRF amends results from a previous test
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No linked reports</p>
                <p className="text-xs mt-1 mb-3">Link an existing SMART report to avoid retesting</p>
                <Button variant="outline" size="sm">
                  Link Existing Report
                </Button>
              </div>
            )}
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
        </motion.div>

        {/* Right Column - Activity & Actions */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
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
                        <AvatarImage src={trf.assignedTo.avatar} />
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
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.div 
                      key={activity.id} 
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
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
                    </motion.div>
                  ))}
                </AnimatePresence>
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
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TRFDetail;