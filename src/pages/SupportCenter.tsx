import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  BookOpen, 
  Ticket, 
  Settings,
  HelpCircle,
  X,
  Mail,
  FileText,
  Send,
  CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SupportCenterChat } from '@/components/support/SupportCenterChat';
import { SupportCenterKnowledge } from '@/components/support/SupportCenterKnowledge';
import { SupportCenterTickets } from '@/components/support/SupportCenterTickets';
import { SupportCenterAdmin } from '@/components/support/SupportCenterAdmin';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { useSearchParams } from 'react-router-dom';

// Mock current user role - in production this would come from auth context
const CURRENT_USER_ROLE = 'admin'; // 'user' | 'admin'

export default function SupportCenter() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'chat';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showEscalationDialog, setShowEscalationDialog] = useState(false);
  const [escalationType, setEscalationType] = useState<'email' | 'form' | null>(null);
  const [ticketFormData, setTicketFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contextHelp, sendMessage } = useAISupportContext();

  // Handle switching to chat and sending a query
  const handleAskAI = (query: string) => {
    setActiveTab('chat');
    if (query) {
      sendMessage(query);
    }
  };

  const isAdmin = CURRENT_USER_ROLE === 'admin';

  const handleEscalate = (type: 'email' | 'form') => {
    setEscalationType(type);
    setShowEscalationDialog(true);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Ticket submitted:', ticketFormData);
    
    setIsSubmitting(false);
    setShowNewTicketDialog(false);
    setTicketFormData({
      name: '',
      email: '',
      category: '',
      subject: '',
      description: ''
    });
    
    toast.success('Ticket submitted successfully', {
      description: 'Our team will respond within 24 hours.'
    });
    
    setActiveTab('tickets');
  };

  const handleEmailEscalation = () => {
    const subject = encodeURIComponent(`SMART Advanced Support Request - ${contextHelp?.title || 'General'}`);
    const body = encodeURIComponent(
      `Hi Support Team,\n\nI need help with the following:\n\n[Please describe your issue here]\n\n---\nContext:\n- Page: ${contextHelp?.title || 'Unknown'}\n\nThank you!`
    );
    
    window.location.href = `mailto:support@smartadvanced.example.com?subject=${subject}&body=${body}`;
    
    toast.success('Email client opened', {
      description: 'Complete your message and send to our support team.'
    });
    
    setShowEscalationDialog(false);
  };

  const tabs = [
    { id: 'chat', label: 'Ask Carlos', icon: MessageCircle },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-120px)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <HelpCircle className="h-4 w-4" />
                Support Center
              </div>
              <h1 className="text-2xl font-bold">How can we help you today?</h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative",
                        isActive 
                          ? "text-primary" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="h-[calc(100%-57px)]">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <SupportCenterChat onEscalate={handleEscalate} />
                  </motion.div>
                )}
                
                {activeTab === 'knowledge' && (
                  <motion.div
                    key="knowledge"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <SupportCenterKnowledge onAskAI={handleAskAI} />
                  </motion.div>
                )}
                
                {activeTab === 'tickets' && (
                  <motion.div
                    key="tickets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <SupportCenterTickets onCreateTicket={() => setShowNewTicketDialog(true)} />
                  </motion.div>
                )}
                
                {activeTab === 'admin' && isAdmin && (
                  <motion.div
                    key="admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <SupportCenterAdmin />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* New Ticket Dialog */}
        <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Submit a request and our team will respond within 24 hours.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={ticketFormData.name}
                    onChange={e => setTicketFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={ticketFormData.email}
                    onChange={e => setTicketFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={ticketFormData.category}
                  onValueChange={value => setTicketFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="testing">Testing & TRFs</SelectItem>
                    <SelectItem value="inspections">Inspections</SelectItem>
                    <SelectItem value="suppliers">Suppliers</SelectItem>
                    <SelectItem value="reports">Reports & Analytics</SelectItem>
                    <SelectItem value="account">Account & Settings</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={ticketFormData.subject}
                  onChange={e => setTicketFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief summary of your issue"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={ticketFormData.description}
                  onChange={e => setTicketFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={4}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewTicketDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Escalation Dialog */}
        <Dialog open={showEscalationDialog} onOpenChange={setShowEscalationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {escalationType === 'email' ? 'Email Support' : 'Submit Support Request'}
              </DialogTitle>
              <DialogDescription>
                {escalationType === 'email' 
                  ? 'Open your email client with a pre-filled support request.'
                  : 'Submit a request and our team will respond within 24 hours.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {escalationType === 'email' ? (
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Context included:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Current page: {contextHelp?.title || 'Unknown'}</li>
                    <li>• Recent conversation history</li>
                  </ul>
                </div>
                
                <Button onClick={handleEmailEscalation} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Would you like to create a support ticket?
                </p>
                <Button 
                  onClick={() => {
                    setShowEscalationDialog(false);
                    setShowNewTicketDialog(true);
                  }} 
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
