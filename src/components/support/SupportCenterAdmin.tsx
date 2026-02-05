import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Check,
  BarChart3,
  Activity,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  mockUnansweredQuestions, 
  mockSupportStats,
  UnansweredQuestion
} from '@/data/mockSupportAnalytics';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function SupportCenterAdmin() {
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [editingAnswer, setEditingAnswer] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter unanswered questions
  const filteredQuestions = useMemo(() => {
    let filtered = mockUnansweredQuestions;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.query.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [statusFilter, searchQuery]);

  const handleSaveAnswer = () => {
    console.log('Saving answer for:', selectedQuestion?.id, editingAnswer);
    setSelectedQuestion(null);
    setEditingAnswer('');
  };

  const stats = [
    {
      title: 'Total Queries',
      value: mockSupportStats.totalQueries,
      change: '+12%',
      trend: 'up',
      icon: Activity,
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
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      title: 'Escalations',
      value: mockSupportStats.escalatedQueries,
      change: '-2%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-amber-500'
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-4">Support Admin</h3>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-card/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={cn("h-4 w-4", stat.color)} />
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px]",
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {stat.trend === 'up' ? <TrendingUp className="h-2 w-2 mr-0.5" /> : <TrendingDown className="h-2 w-2 mr-0.5" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="unanswered" className="flex-1 flex flex-col">
        <div className="px-4 pt-3">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="unanswered" className="text-xs">
              Unanswered ({mockUnansweredQuestions.filter(q => q.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="unanswered" className="flex-1 m-0 flex flex-col">
          {/* Filters */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
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

          {/* Questions List */}
          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-3">
              {filteredQuestions.map((question, i) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 mb-2">{question.query}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px]",
                                question.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                                question.status === 'in_review' && 'bg-blue-500/10 text-blue-600',
                                question.status === 'answered' && 'bg-green-500/10 text-green-600'
                              )}
                            >
                              {question.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant={question.count > 10 ? 'destructive' : 'outline'} className="text-[10px]">
                              Asked {question.count}x
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {format(question.lastAsked, 'MMM d')}
                            </span>
                          </div>
                        </div>
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
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Knowledge Base Answer</DialogTitle>
                              <DialogDescription>
                                This answer will be used by the AI assistant.
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
                                placeholder="Enter the answer..."
                                rows={5}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveAnswer}>
                                <Check className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Confidence Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm flex-1">High Confidence</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm flex-1">Medium Confidence</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm flex-1">Low Confidence</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'Testing & TRFs', count: 156 },
                      { name: 'Inspections', count: 98 },
                      { name: 'Suppliers', count: 67 },
                      { name: 'Reports', count: 45 },
                    ].map(cat => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <span className="text-sm">{cat.name}</span>
                        <Badge variant="secondary">{cat.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
