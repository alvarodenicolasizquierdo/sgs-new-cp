import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle,
  ChevronRight,
  Search,
  LayoutDashboard,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TicketDashboard } from './TicketDashboard';
import { TicketDetailView, mockTicketDetail } from './TicketDetailView';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  replies: number;
}

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to generate TRF for bulk testing',
    description: 'When I try to create a bulk test request, the system shows an error...',
    status: 'in_progress',
    priority: 'high',
    category: 'Testing & TRFs',
    createdAt: new Date('2026-02-03'),
    updatedAt: new Date('2026-02-04'),
    replies: 2
  },
  {
    id: 'TKT-002',
    subject: 'Supplier approval workflow question',
    description: 'Need clarification on the approval process for new suppliers...',
    status: 'open',
    priority: 'medium',
    category: 'Suppliers',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
    replies: 0
  },
  {
    id: 'TKT-003',
    subject: 'Report export feature not working',
    description: 'The export to PDF button is not responding...',
    status: 'resolved',
    priority: 'low',
    category: 'Reports',
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-01-30'),
    replies: 3
  },
  {
    id: 'TKT-004',
    subject: 'Need access to inspection module',
    description: 'My role should allow inspection access but I cannot see it...',
    status: 'closed',
    priority: 'medium',
    category: 'Account',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-22'),
    replies: 4
  },
];

// Mock stats
const mockStats = {
  open: 2,
  inProgress: 1,
  resolved: 5,
  avgResponseTime: '4h',
  satisfactionRate: 92,
  totalThisMonth: 8
};

interface SupportCenterTicketsProps {
  onCreateTicket?: () => void;
}

export function SupportCenterTickets({ onCreateTicket }: SupportCenterTicketsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || ticket.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    const variants: Record<Ticket['status'], string> = {
      open: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      resolved: 'bg-green-500/10 text-green-600 border-green-500/20',
      closed: 'bg-muted text-muted-foreground border-border',
    };
    const labels: Record<Ticket['status'], string> = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };
    return (
      <Badge variant="outline" className={cn("text-xs", variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const variants: Record<Ticket['priority'], string> = {
      low: 'bg-gray-500/10 text-gray-600',
      medium: 'bg-amber-500/10 text-amber-600',
      high: 'bg-red-500/10 text-red-600',
    };
    return (
      <Badge variant="secondary" className={cn("text-[10px] uppercase", variants[priority])}>
        {priority}
      </Badge>
    );
  };

  const handleSendReply = async (message: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Reply sent', { description: 'Your message has been sent to the support team.' });
  };

  // Show ticket detail view
  if (selectedTicketId) {
    return (
      <TicketDetailView 
        ticket={mockTicketDetail}
        onBack={() => setSelectedTicketId(null)}
        onSendReply={handleSendReply}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">My Support Tickets</h3>
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'dashboard' | 'list')}>
              <ToggleGroupItem value="dashboard" size="sm" aria-label="Dashboard view">
                <LayoutDashboard className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" size="sm" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Button size="sm" onClick={onCreateTicket}>
            <Plus className="h-4 w-4 mr-1" />
            New Ticket
          </Button>
        </div>
        
        {/* Dashboard Stats - Zendesk style */}
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TicketDashboard stats={mockStats} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search and Filter */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="pl-10 rounded-xl"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs">In Progress</TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator />

      {/* Tickets List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTickets.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No tickets found</p>
              <Button onClick={onCreateTicket}>
                <Plus className="h-4 w-4 mr-1" />
                Create your first ticket
              </Button>
            </Card>
          ) : (
            filteredTickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getStatusIcon(ticket.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <h4 className="font-medium text-sm line-clamp-1 mb-1">{ticket.subject}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                            <span>Created {format(ticket.createdAt, 'MMM d')}</span>
                            {ticket.replies > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {ticket.replies} replies
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
