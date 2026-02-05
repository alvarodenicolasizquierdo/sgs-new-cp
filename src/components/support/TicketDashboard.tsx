import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
  Zap,
  User,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TicketStats {
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: string;
  satisfactionRate: number;
  totalThisMonth: number;
}

interface ActivityItem {
  id: string;
  type: 'reply' | 'status' | 'created';
  ticketId: string;
  ticketSubject: string;
  message: string;
  timestamp: Date;
}

interface TicketDashboardProps {
  stats: TicketStats;
  className?: string;
}

// Mock recent activity
const recentActivity: ActivityItem[] = [
  {
    id: 'a1',
    type: 'reply',
    ticketId: 'TKT-001',
    ticketSubject: 'Unable to generate TRF for bulk testing',
    message: 'Support agent replied to your ticket',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: 'a2',
    type: 'status',
    ticketId: 'TKT-003',
    ticketSubject: 'Report export feature not working',
    message: 'Ticket marked as resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'a3',
    type: 'created',
    ticketId: 'TKT-002',
    ticketSubject: 'Supplier approval workflow question',
    message: 'New ticket created',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export function TicketDashboard({ stats, className }: TicketDashboardProps) {
  const resolutionRate = stats.totalThisMonth > 0 
    ? Math.round((stats.resolved / stats.totalThisMonth) * 100) 
    : 0;

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'reply': return <MessageCircle className="h-3 w-3" />;
      case 'status': return <CheckCircle className="h-3 w-3" />;
      case 'created': return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'reply': return 'bg-blue-500/10 text-blue-500';
      case 'status': return 'bg-green-500/10 text-green-500';
      case 'created': return 'bg-amber-500/10 text-amber-500';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                  Needs attention
                </Badge>
              </div>
              <p className="text-3xl font-bold text-amber-600">{stats.open}</p>
              <p className="text-xs text-muted-foreground">Open tickets</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                  Active
                </Badge>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
                  This month
                </Badge>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-500" />
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
                  Avg
                </Badge>
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.avgResponseTime}</p>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Row: Metrics + Activity Feed */}
      <div className="grid grid-cols-3 gap-3">
        {/* Resolution Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Resolution</span>
                </div>
                <span className="text-lg font-bold">{resolutionRate}%</span>
              </div>
              <Progress value={resolutionRate} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-2">
                {stats.resolved} of {stats.totalThisMonth} resolved
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Satisfaction</span>
                </div>
                <span className="text-lg font-bold">{stats.satisfactionRate}%</span>
              </div>
              <Progress value={stats.satisfactionRate} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-2">
                Based on ticket feedback
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <div className="space-y-2">
                {recentActivity.slice(0, 2).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      getActivityColor(activity.type)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] line-clamp-1">{activity.message}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
