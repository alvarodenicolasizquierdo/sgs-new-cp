import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Sparkles,
  Calendar,
  Clock,
  Play,
  MoreHorizontal,
  FileText,
  Pencil,
  Trash2,
  Copy,
  Download,
  Wand2,
  Send,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { mockSavedReports, SavedReport } from "@/data/mockReports";
import { toast } from "sonner";

const scheduleLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function CustomReports() {
  const [reports, setReports] = useState<SavedReport[]>(mockSavedReports);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [aiPrompt, setAIPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRunReport = (report: SavedReport) => {
    toast.success(`Running "${report.name}"...`);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter((r) => r.id !== reportId));
    toast.success("Report deleted");
  };

  const handleDuplicateReport = (report: SavedReport) => {
    const newReport: SavedReport = {
      ...report,
      id: `rpt-${Date.now()}`,
      name: `${report.name} (Copy)`,
      createdAt: new Date(),
      lastRun: new Date(),
    };
    setReports([newReport, ...reports]);
    toast.success("Report duplicated");
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newReport: SavedReport = {
      id: `rpt-${Date.now()}`,
      name: "AI Generated Report",
      description: aiPrompt,
      createdAt: new Date(),
      lastRun: new Date(),
      filters: {},
      columns: ["date", "supplier", "amount", "status"],
      createdBy: "AI Assistant",
    };
    
    setReports([newReport, ...reports]);
    setIsGenerating(false);
    setShowAIDialog(false);
    setAIPrompt("");
    toast.success("Report generated successfully!");
  };

  const handleScheduleReport = (schedule: string) => {
    if (!selectedReport) return;
    
    setReports(reports.map((r) =>
      r.id === selectedReport.id
        ? { ...r, schedule: schedule as "daily" | "weekly" | "monthly" }
        : r
    ));
    setShowScheduleDialog(false);
    setSelectedReport(null);
    toast.success(`Report scheduled to run ${schedule}`);
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Saved Reports</h3>
          <p className="text-sm text-muted-foreground">
            Create, schedule, and manage your custom reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Generate Report with AI
                </DialogTitle>
                <DialogDescription>
                  Describe the report you want to create in natural language
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="e.g., Show me all pending inspections from the last quarter grouped by supplier, with total values..."
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setAIPrompt("Monthly summary of all test requests by category")}
                  >
                    Monthly test summary
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setAIPrompt("Top 10 suppliers by inspection pass rate")}
                  >
                    Supplier performance
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setAIPrompt("Failed certifications requiring follow-up")}
                  >
                    Failed certifications
                  </Badge>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-hover h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base line-clamp-1">
                        {report.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {report.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleDuplicateReport(report)}
                        >
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowScheduleDialog(true);
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                          Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {report.schedule && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {scheduleLabels[report.schedule]}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-muted-foreground">
                        {report.columns.length} columns
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Created by {report.createdBy} •{" "}
                        {format(report.createdAt, "MMM d, yyyy")}
                      </p>
                      <p>
                        Last run {formatDistanceToNow(report.lastRun, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 gap-2"
                    onClick={() => handleRunReport(report)}
                  >
                    <Play className="h-4 w-4" />
                    Run Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Report
            </DialogTitle>
            <DialogDescription>
              Set up automatic report generation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Select onValueChange={handleScheduleReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Recipients</label>
              <Input placeholder="email@example.com" />
              <p className="text-xs text-muted-foreground">
                Report will be sent to these addresses when generated
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
