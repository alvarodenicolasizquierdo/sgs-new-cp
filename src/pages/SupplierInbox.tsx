import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  mockSupplierTasks, 
  getPendingTasks, 
  getTaskStats,
} from "@/data/mockTasks";
import { 
  SupplierTask, 
  TaskType, 
  TaskPriority,
  TaskStatus,
  taskTypeConfig, 
  taskPriorityConfig,
  taskStatusConfig,
} from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { format, parseISO, formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";

export default function SupplierInbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("pending");
  
  const stats = useMemo(() => getTaskStats(), []);
  
  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return mockSupplierTasks.filter(task => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.styleTuNo?.toLowerCase().includes(query) ||
          task.styleDescription?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Status
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }
      
      // Type
      if (typeFilter !== "all" && task.type !== typeFilter) {
        return false;
      }
      
      // Priority
      if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, typeFilter, priorityFilter, statusFilter]);
  
  // Group by priority for pending tasks
  const urgentTasks = filteredTasks.filter(t => t.priority === "urgent");
  const highTasks = filteredTasks.filter(t => t.priority === "high");
  const normalTasks = filteredTasks.filter(t => t.priority === "normal" || t.priority === "low");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="h-6 w-6" />
            My Inbox
          </h1>
          <p className="text-muted-foreground">
            Your pending tasks and approvals - sorted by priority
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card 
            className={cn("cursor-pointer transition-all", statusFilter === "pending" && "ring-2 ring-primary")}
            onClick={() => setStatusFilter("pending")}
          >
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className={cn(stats.urgent > 0 && "border-destructive/50")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
                {stats.urgent > 0 && <AlertTriangle className="h-5 w-5 text-destructive" />}
              </div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </CardContent>
          </Card>
          <Card className={cn(stats.atRisk > 0 && "border-warning/50")}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{stats.atRisk}</div>
              <div className="text-sm text-muted-foreground">At Risk</div>
            </CardContent>
          </Card>
          <Card className={cn(stats.overdue > 0 && "border-destructive/50")}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
          <Card 
            className={cn("cursor-pointer transition-all", statusFilter === "completed" && "ring-2 ring-primary")}
            onClick={() => setStatusFilter("completed")}
          >
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TaskType | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(taskTypeConfig) as TaskType[]).map(type => (
                  <SelectItem key={type} value={type}>
                    {taskTypeConfig[type].icon} {taskTypeConfig[type].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Priority
                  {priorityFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {priorityFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(taskPriorityConfig) as TaskPriority[]).map(priority => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={(checked) => {
                      setPriorityFilter(prev => 
                        checked 
                          ? [...prev, priority]
                          : prev.filter(p => p !== priority)
                      );
                    }}
                  >
                    <Badge variant="outline" className={cn(taskPriorityConfig[priority].bgColor, taskPriorityConfig[priority].color, "text-xs")}>
                      {taskPriorityConfig[priority].label}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Results */}
        <div className="text-sm text-muted-foreground">
          {filteredTasks.length} tasks
        </div>
        
        {/* Task List */}
        {statusFilter === "pending" && filteredTasks.length > 0 ? (
          <div className="space-y-6">
            {/* Urgent Section */}
            {urgentTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  URGENT ({urgentTasks.length})
                </h2>
                <div className="space-y-2">
                  {urgentTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
            
            {/* High Priority Section */}
            {highTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  HIGH PRIORITY ({highTasks.length})
                </h2>
                <div className="space-y-2">
                  {highTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Normal Section */}
            {normalTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                  OTHER TASKS ({normalTasks.length})
                </h2>
                <div className="space-y-2">
                  {normalTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
        
        {filteredTasks.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              {statusFilter === "pending" ? (
                <>
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-muted-foreground mt-1">
                    No pending tasks. Great work!
                  </p>
                </>
              ) : (
                <>
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No completed tasks</h3>
                  <p className="text-muted-foreground mt-1">
                    Completed tasks will appear here.
                  </p>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// Task Card Component
function TaskCard({ task }: { task: SupplierTask }) {
  const typeConfig = taskTypeConfig[task.type];
  const priorityConfig = taskPriorityConfig[task.priority];
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== "completed";
  
  return (
    <Card className={cn(
      "hover:shadow-md transition-all cursor-pointer group",
      "border-l-4",
      task.priority === "urgent" && "border-l-destructive",
      task.priority === "high" && "border-l-warning",
      task.priority === "normal" && "border-l-primary",
      task.priority === "low" && "border-l-muted-foreground",
      task.status === "completed" && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-2xl flex-shrink-0">{typeConfig.icon}</div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>
                  <Badge variant="outline" className={cn(priorityConfig.bgColor, priorityConfig.color, "text-xs")}>
                    {priorityConfig.label}
                  </Badge>
                  {task.slaStatus === "at_risk" && task.status !== "completed" && (
                    <Badge variant="outline" className="text-warning border-warning text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      At Risk
                    </Badge>
                  )}
                  {isOverdue && (
                    <Badge variant="outline" className="text-destructive border-destructive text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              </div>
              
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Style Info */}
            {task.styleId && (
              <Link 
                to={`/styles/${task.styleId}`}
                className="inline-flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-mono">{task.styleTuNo}</span>
                <span>•</span>
                <span>{task.styleDescription}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            
            {/* Query Message */}
            {task.queryMessage && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <MessageSquare className="h-4 w-4" />
                  Query from {task.assignedBy?.name}
                </div>
                <p className="text-sm text-muted-foreground">{task.queryMessage}</p>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignedTo.avatar} />
                  <AvatarFallback className="text-xs">
                    {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {task.assignedTo.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {task.status === "completed" && task.completedAt ? (
                  <span className="text-success">
                    Completed {formatDistanceToNow(parseISO(task.completedAt), { addSuffix: true })}
                  </span>
                ) : task.dueDate ? (
                  <span className={cn(isOverdue && "text-destructive")}>
                    Due {format(parseISO(task.dueDate), "dd MMM yyyy")}
                  </span>
                ) : (
                  <span>
                    Created {formatDistanceToNow(parseISO(task.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
