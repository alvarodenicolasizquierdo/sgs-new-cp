import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  HelpCircle,
  ChevronRight,
  Edit,
  Check,
  X,
  BarChart3,
  PieChart,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';
import { 
  mockSupportQueries, 
  mockUnansweredQuestions, 
  mockConfidenceMetrics,
  mockSupportStats,
  UnansweredQuestion
} from '@/data/mockSupportAnalytics';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function SupportAdmin() {
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [editingAnswer, setEditingAnswer] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter unanswered questions
  const filteredQuestions = useMemo(() => {
    if (statusFilter === 'all') return mockUnansweredQuestions;
    return mockUnansweredQuestions.filter(q => q.status === statusFilter);
  }, [statusFilter]);

  // Calculate percentages for confidence pie
  const confidenceData = useMemo(() => {
    const latest = mockConfidenceMetrics[mockConfidenceMetrics.length - 1];
    return [
      { name: 'High', value: latest.high, color: '#22c55e' },
      { name: 'Medium', value: latest.medium, color: '#f59e0b' },
      { name: 'Low', value: latest.low, color: '#ef4444' },
    ];
  }, []);

  const handleSaveAnswer = () => {
    // In a real app, this would save to the database
    // TODO: persist answer to backend
    setSelectedQuestion(null);
    setEditingAnswer('');
  };

  const stats = [
    {
      title: 'Total Queries',
      value: mockSupportStats.totalQueries,
      change: '+12%',
      trend: 'up',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      title: 'Answer Rate',
      value: `${Math.round((mockSupportStats.answeredQueries / mockSupportStats.totalQueries) * 100)}%`,
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'Avg Confidence',
      value: `${mockSupportStats.avgConfidence}%`,
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'text-primary'
    },
    {
      title: 'Escalation Rate',
      value: `${Math.round((mockSupportStats.escalatedQueries / mockSupportStats.totalQueries) * 100)}%`,
      change: '-2%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-amber-500'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Support Analytics</h1>
            <p className="text-muted-foreground">
              Monitor AI support performance and manage unanswered questions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={cn("h-5 w-5", stat.color)} />
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Confidence Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                AI Confidence Trends
              </CardTitle>
              <CardDescription>
                Distribution of answer confidence levels over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockConfidenceMetrics}>
                    <defs>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="high" stroke="#22c55e" fill="url(#colorHigh)" name="High" />
                    <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#colorMedium)" name="Medium" />
                    <Area type="monotone" dataKey="low" stroke="#ef4444" fill="url(#colorLow)" name="Low" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Today's Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={confidenceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {confidenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {confidenceData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unanswered Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  Unanswered Questions
                </CardTitle>
                <CardDescription>
                  Questions that need human attention or knowledge base updates
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="text-center">Times Asked</TableHead>
                  <TableHead>Last Asked</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map(question => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium max-w-md">
                      <p className="line-clamp-2">{question.query}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={question.count > 10 ? 'destructive' : 'secondary'}>
                        {question.count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(question.lastAsked, 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {question.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          question.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                          question.status === 'in_review' && 'bg-blue-500/10 text-blue-600',
                          question.status === 'answered' && 'bg-green-500/10 text-green-600'
                        )}
                      >
                        {question.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setEditingAnswer(question.suggestedAnswer || '');
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Add Answer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Knowledge Base Answer</DialogTitle>
                            <DialogDescription>
                              Provide an answer that will be added to the AI's knowledge base.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium">{question.query}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Asked {question.count} times
                              </p>
                            </div>
                            <Textarea
                              value={editingAnswer}
                              onChange={e => setEditingAnswer(e.target.value)}
                              placeholder="Enter the answer for this question..."
                              rows={5}
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveAnswer}>
                              <Check className="h-4 w-4 mr-1" />
                              Save to Knowledge Base
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Queries
            </CardTitle>
            <CardDescription>
              Latest support queries with confidence scores and outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSupportQueries.slice(0, 6).map(query => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{query.userName}</p>
                        <p className="text-xs text-muted-foreground">{query.userRole}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{query.query}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {query.page}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          query.confidence === 'high' && 'bg-green-500/10 text-green-600',
                          query.confidence === 'medium' && 'bg-amber-500/10 text-amber-600',
                          query.confidence === 'low' && 'bg-red-500/10 text-red-600'
                        )}
                      >
                        {query.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {query.responseTime}ms
                    </TableCell>
                    <TableCell>
                      {query.wasEscalated ? (
                        <Badge variant="destructive" className="text-xs">
                          Escalated ({query.escalationType})
                        </Badge>
                      ) : query.helpful === true ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs">Helpful</span>
                        </div>
                      ) : query.helpful === false ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-4 w-4" />
                          <span className="text-xs">Not helpful</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No feedback</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
