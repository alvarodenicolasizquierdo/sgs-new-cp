import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle,
  Paperclip,
  Send,
  MoreVertical,
  User,
  Bot,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  senderName: string;
  senderAvatar?: string;
  createdAt: Date;
  isInternal?: boolean;
}

interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}

interface TicketDetailViewProps {
  ticket: TicketDetail;
  onBack: () => void;
  onSendReply: (message: string) => Promise<void>;
}

// Mock ticket with conversation thread
export const mockTicketDetail: TicketDetail = {
  id: 'TKT-001',
  subject: 'Unable to generate TRF for bulk testing',
  description: 'When I try to create a bulk test request for multiple styles, the system shows an error message saying "Invalid batch size". I need to submit testing for 15 styles at once.',
  status: 'in_progress',
  priority: 'high',
  category: 'Testing & TRFs',
  createdAt: new Date('2026-02-03T10:30:00'),
  updatedAt: new Date('2026-02-04T14:20:00'),
  messages: [
    {
      id: 'm1',
      content: 'When I try to create a bulk test request for multiple styles, the system shows an error message saying "Invalid batch size". I need to submit testing for 15 styles at once.',
      sender: 'user',
      senderName: 'Mark Thompson',
      senderAvatar: '/src/assets/profiles/mark.png',
      createdAt: new Date('2026-02-03T10:30:00'),
    },
    {
      id: 'm2',
      content: 'Thank you for reporting this issue. I can see the error in our logs. The current bulk limit is set to 10 styles per batch. I\'m checking with the development team if we can increase this limit for your account.',
      sender: 'agent',
      senderName: 'Support Agent',
      createdAt: new Date('2026-02-03T14:15:00'),
    },
    {
      id: 'm3',
      content: 'I\'ve escalated this to our product team. In the meantime, you can submit two batches: one with 10 styles and another with 5 styles. Would that work as a temporary solution?',
      sender: 'agent',
      senderName: 'Support Agent',
      createdAt: new Date('2026-02-04T09:00:00'),
    },
    {
      id: 'm4',
      content: 'Yes, that would work for now. But please let me know when the limit is increased. We often have larger batches to process.',
      sender: 'user',
      senderName: 'Mark Thompson',
      senderAvatar: '/src/assets/profiles/mark.png',
      createdAt: new Date('2026-02-04T14:20:00'),
    },
  ]
};

export function TicketDetailView({ ticket, onBack, onSendReply }: TicketDetailViewProps) {
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await onSendReply(replyText);
      setReplyText('');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: TicketDetail['status']) => {
    const variants: Record<TicketDetail['status'], string> = {
      open: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      resolved: 'bg-green-500/10 text-green-600 border-green-500/20',
      closed: 'bg-muted text-muted-foreground border-border',
    };
    const labels: Record<TicketDetail['status'], string> = {
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

  const getPriorityBadge = (priority: TicketDetail['priority']) => {
    const variants: Record<TicketDetail['priority'], string> = {
      low: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      urgent: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return (
      <Badge variant="outline" className={cn("text-xs uppercase", variants[priority])}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0 mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <Badge variant="secondary" className="text-xs">{ticket.category}</Badge>
            </div>
            <h3 className="font-semibold text-base line-clamp-2">{ticket.subject}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Opened {formatDistanceToNow(ticket.createdAt, { addSuffix: true })} • Last updated {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline / Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Status timeline */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Created</span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground rotate-[-90deg]" />
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground rotate-[-90deg]" />
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-muted" />
              <span className="text-xs text-muted-foreground">Resolved</span>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            {ticket.messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.senderAvatar ? (
                    <AvatarImage src={message.senderAvatar} />
                  ) : null}
                  <AvatarFallback className={cn(
                    message.sender === 'agent' ? "bg-primary/10 text-primary" : "bg-muted"
                  )}>
                    {message.sender === 'agent' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn(
                  "flex-1 max-w-[85%]",
                  message.sender === 'user' ? "items-end" : ""
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{message.senderName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {format(message.createdAt, 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <Card className={cn(
                    "overflow-hidden",
                    message.sender === 'user' 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-muted/50"
                  )}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Reply Box */}
      {ticket.status !== 'closed' && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="resize-none pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSendReply();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 bottom-1 h-8 w-8"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <Button 
              onClick={handleSendReply}
              disabled={!replyText.trim() || isSending}
              className="self-end"
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">⌘</kbd> + <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↵</kbd> to send
          </p>
        </div>
      )}
    </div>
  );
}
