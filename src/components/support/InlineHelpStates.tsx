import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  AlertCircle, 
  Info, 
  Lock, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAISupportContext } from '@/contexts/AISupportContext';

// ============================================
// Disabled Button with Help
// ============================================

interface DisabledButtonHelpProps {
  children: ReactNode;
  reason: string;
  suggestion?: string;
  learnMoreQuestion?: string;
}

export function DisabledButtonHelp({ 
  children, 
  reason, 
  suggestion,
  learnMoreQuestion 
}: DisabledButtonHelpProps) {
  const { open, sendMessage } = useAISupportContext();
  
  const handleLearnMore = () => {
    if (learnMoreQuestion) {
      open();
      sendMessage(learnMoreQuestion);
    }
  };
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1.5 cursor-not-allowed">
            <span className="opacity-50 pointer-events-none">{children}</span>
            <Lock className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Action unavailable</p>
                <p className="text-xs text-muted-foreground mt-0.5">{reason}</p>
              </div>
            </div>
            {suggestion && (
              <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                💡 {suggestion}
              </p>
            )}
            {learnMoreQuestion && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs justify-between"
                onClick={handleLearnMore}
              >
                Learn more
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================
// Error State with Help
// ============================================

interface ErrorStateHelpProps {
  title?: string;
  message: string;
  helpQuestion?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }>;
  className?: string;
}

export function ErrorStateHelp({ 
  title = 'Something went wrong',
  message, 
  helpQuestion,
  actions,
  className 
}: ErrorStateHelpProps) {
  const { open, sendMessage } = useAISupportContext();
  
  const handleGetHelp = () => {
    open();
    if (helpQuestion) {
      sendMessage(helpQuestion);
    } else {
      sendMessage(`I'm getting an error: ${message}`);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg border border-destructive/30 bg-destructive/5",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h4 className="font-semibold text-destructive mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">{message}</p>
      
      <div className="flex items-center gap-2">
        {actions?.map((action, i) => (
          <Button
            key={i}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGetHelp}
          className="text-primary"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Get Help
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// Inline Error Message with Help
// ============================================

interface InlineErrorProps {
  message: string;
  helpText?: string;
  onGetHelp?: () => void;
}

export function InlineError({ message, helpText, onGetHelp }: InlineErrorProps) {
  const { open, sendMessage } = useAISupportContext();
  
  const handleHelp = () => {
    if (onGetHelp) {
      onGetHelp();
    } else {
      open();
      sendMessage(`Help with error: ${message}`);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-start gap-2 text-destructive text-sm mt-1.5"
    >
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <span>{message}</span>
        {helpText && (
          <button
            onClick={handleHelp}
            className="ml-2 text-primary underline-offset-2 hover:underline inline-flex items-center gap-1"
          >
            {helpText}
            <HelpCircle className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// Warning Banner with Help
// ============================================

interface WarningBannerProps {
  title: string;
  message: string;
  helpQuestion?: string;
  onDismiss?: () => void;
  className?: string;
}

export function WarningBanner({ 
  title, 
  message, 
  helpQuestion,
  onDismiss,
  className 
}: WarningBannerProps) {
  const { open, sendMessage } = useAISupportContext();
  const [dismissed, setDismissed] = useState(false);
  
  const handleGetHelp = () => {
    open();
    if (helpQuestion) {
      sendMessage(helpQuestion);
    }
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };
  
  if (dismissed) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10",
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-sm text-amber-700 dark:text-amber-400">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
        {helpQuestion && (
          <button
            onClick={handleGetHelp}
            className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
          >
            Learn more
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 text-muted-foreground"
        >
          ×
        </Button>
      )}
    </motion.div>
  );
}

// ============================================
// Permission Denied State
// ============================================

interface PermissionDeniedProps {
  feature: string;
  requiredRole?: string;
  helpQuestion?: string;
  className?: string;
}

export function PermissionDenied({ 
  feature, 
  requiredRole,
  helpQuestion,
  className 
}: PermissionDeniedProps) {
  const { open, sendMessage } = useAISupportContext();
  
  const handleGetHelp = () => {
    open();
    sendMessage(helpQuestion || `How do I get access to ${feature}?`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-border",
        className
      )}
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
      <h4 className="font-semibold mb-1">Access Restricted</h4>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-2">
        You don't have permission to access <span className="font-medium">{feature}</span>.
      </p>
      {requiredRole && (
        <p className="text-xs text-muted-foreground mb-4">
          Required role: <span className="font-medium text-primary">{requiredRole}</span>
        </p>
      )}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Request Access
        </Button>
        <Button variant="ghost" size="sm" onClick={handleGetHelp}>
          <HelpCircle className="h-4 w-4 mr-1" />
          Learn More
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// Empty State with Help
// ============================================

interface EmptyStateHelpProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  helpQuestion?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyStateHelp({ 
  icon: Icon = HelpCircle,
  title, 
  description,
  helpQuestion,
  action,
  className 
}: EmptyStateHelpProps) {
  const { open, sendMessage } = useAISupportContext();
  
  const handleGetHelp = () => {
    open();
    if (helpQuestion) {
      sendMessage(helpQuestion);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      <div className="flex gap-2">
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {helpQuestion && (
          <Button variant="ghost" size="sm" onClick={handleGetHelp}>
            <HelpCircle className="h-4 w-4 mr-1" />
            How does this work?
          </Button>
        )}
      </div>
    </motion.div>
  );
}
