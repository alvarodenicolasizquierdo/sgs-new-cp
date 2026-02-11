import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, FileText, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EscalationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'form' | null;
  context: {
    currentPage: string;
    recentMessages: string[];
  };
}

export function EscalationPanel({ isOpen, onClose, type, context }: EscalationPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send to your backend
    void ({
      ...formData,
      context: {
        page: context.currentPage,
        conversation: context.recentMessages
      }
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast.success('Support request submitted', {
      description: 'Our team will respond within 24 hours.'
    });
    
    // Reset after delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        description: ''
      });
      onClose();
    }, 2000);
  };
  
  const handleEmailTicket = () => {
    const subject = encodeURIComponent(`SMART Advanced Support Request - ${context.currentPage}`);
    const body = encodeURIComponent(
      `Hi Support Team,\n\nI need help with the following:\n\n[Please describe your issue here]\n\n---\nContext:\n- Page: ${context.currentPage}\n- Recent conversation:\n${context.recentMessages.map(m => `  > ${m}`).join('\n')}\n\nThank you!`
    );
    
    window.location.href = `mailto:support@smartadvanced.example.com?subject=${subject}&body=${body}`;
    
    toast.success('Email client opened', {
      description: 'Complete your message and send to our support team.'
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-card z-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            {type === 'email' ? (
              <Mail className="h-5 w-5 text-primary" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
            <h3 className="font-semibold">
              {type === 'email' ? 'Email Support' : 'Submit Support Request'}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">Request Submitted!</h4>
              <p className="text-sm text-muted-foreground">
                Our team will get back to you within 24 hours.
              </p>
            </motion.div>
          ) : type === 'email' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click below to open your email client with a pre-filled support request.
              </p>
              
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Context included:</p>
                <ul className="text-xs space-y-1">
                  <li>• Current page: {context.currentPage}</li>
                  <li>• Recent conversation history</li>
                </ul>
              </div>
              
              <Button onClick={handleEmailTicket} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Open Email Client
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    required
                    className="h-9"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-9">
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
              
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief summary of your issue"
                  required
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={4}
                />
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-2 text-xs text-muted-foreground">
                <p>Context will be automatically included:</p>
                <p className="text-foreground">Page: {context.currentPage}</p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
