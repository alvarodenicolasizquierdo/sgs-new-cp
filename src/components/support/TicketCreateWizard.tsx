import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  X,
  FileText,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Paperclip,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TicketCreateWizardProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  onCancel: () => void;
}

interface TicketFormData {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  attachments: File[];
  contactEmail: string;
  contactName: string;
}

const CATEGORIES = [
  { id: 'testing', name: 'Testing & TRFs', icon: FileText, description: 'Test requests, results, and workflows' },
  { id: 'inspections', name: 'Inspections', icon: FileText, description: 'Inspection scheduling and reports' },
  { id: 'suppliers', name: 'Suppliers', icon: FileText, description: 'Supplier management and approval' },
  { id: 'reports', name: 'Reports & Analytics', icon: FileText, description: 'Report generation and data export' },
  { id: 'account', name: 'Account & Access', icon: FileText, description: 'Login, permissions, and settings' },
  { id: 'other', name: 'Other', icon: HelpCircle, description: 'General questions and feedback' },
];

const PRIORITIES = [
  { id: 'low', name: 'Low', description: 'General question, no rush', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  { id: 'medium', name: 'Medium', description: 'Impacting my work', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  { id: 'high', name: 'High', description: 'Blocking critical tasks', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  { id: 'urgent', name: 'Urgent', description: 'System down or major issue', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: AlertTriangle },
];

const STEPS = [
  { id: 1, name: 'Category', description: 'What area needs help?' },
  { id: 2, name: 'Details', description: 'Describe your issue' },
  { id: 3, name: 'Review', description: 'Confirm and submit' },
];

export function TicketCreateWizard({ onSubmit, onCancel }: TicketCreateWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    attachments: [],
    contactEmail: '',
    contactName: '',
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Ticket submitted successfully', {
        description: 'Our team will respond within 24 hours.'
      });
    } catch (error) {
      toast.error('Failed to submit ticket', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.attachments.length > 5) {
      toast.error('Maximum 5 attachments allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.category !== '';
      case 2: return formData.subject.trim() !== '' && formData.description.trim() !== '';
      case 3: return true;
      default: return false;
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.id === formData.category);
  const selectedPriority = PRIORITIES.find(p => p.id === formData.priority);

  return (
    <div className="flex flex-col h-full">
      {/* Header with Steps */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="text-lg font-semibold mb-4">Create Support Ticket</h2>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className={cn(
                  "text-xs mt-1.5 font-medium",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.name}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "h-0.5 w-16 mx-2",
                  currentStep > step.id ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-medium mb-1">What do you need help with?</h3>
                <p className="text-sm text-muted-foreground">Select the category that best matches your issue</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = formData.category === category.id;
                  
                  return (
                    <Card
                      key={category.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-sm",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Priority Level</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITIES.map((priority) => {
                    const isSelected = formData.priority === priority.id;
                    const Icon = priority.icon;
                    
                    return (
                      <button
                        key={priority.id}
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.id as TicketFormData['priority'] }))}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          isSelected
                            ? `${priority.color} ring-1 ring-current`
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {Icon && <Icon className="h-4 w-4" />}
                          <span className="font-medium text-sm">{priority.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{priority.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-medium mb-1">Describe your issue</h3>
                <p className="text-sm text-muted-foreground">The more detail you provide, the faster we can help</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief summary of your issue"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.subject.length}/100</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your issue in detail. Include steps to reproduce if applicable..."
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.description.length}/2000</p>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments (optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag files here or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Max 5 files, 10MB each</p>
                      </div>
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeAttachment(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.contactName}
                      onChange={e => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-medium mb-1">Review your ticket</h3>
                <p className="text-sm text-muted-foreground">Please confirm all details before submitting</p>
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 bg-muted/30 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={selectedPriority?.color}>
                        {selectedPriority?.name}
                      </Badge>
                      <Badge variant="secondary">{selectedCategory?.name}</Badge>
                    </div>
                    <h4 className="font-semibold mt-2">{formData.subject}</h4>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{formData.description}</p>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Attachments</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.attachments.map((file, i) => (
                            <Badge key={i} variant="secondary" className="gap-1">
                              <Paperclip className="h-3 w-3" />
                              {file.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div>
                        <Label className="text-xs text-muted-foreground">Contact Name</Label>
                        <p className="text-sm mt-1">{formData.contactName || '—'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-sm mt-1">{formData.contactEmail || '—'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600">Response Time</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.priority === 'urgent' 
                      ? 'Urgent tickets are prioritized. Expect a response within 4 hours during business hours.'
                      : formData.priority === 'high'
                      ? 'High priority tickets typically receive a response within 8 hours.'
                      : 'Our team will respond within 24 hours.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <Button variant="ghost" onClick={currentStep === 1 ? onCancel : handleBack}>
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </>
          )}
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !canProceed()}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Submit Ticket
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
