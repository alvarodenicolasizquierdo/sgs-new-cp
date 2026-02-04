import { useState, useCallback, ReactNode } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from '@/components/ui/tooltip';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getElementHelp, getHelpById, ElementHelp } from '@/data/helpContent';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';

interface ContextualHelpTooltipProps {
  helpKey: string;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  className?: string;
}

export function ContextualHelpTooltip({ 
  helpKey, 
  children, 
  side = 'top',
  showIcon = false,
  className
}: ContextualHelpTooltipProps) {
  const { open, sendMessage } = useAISupportContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Look up help content
  const selector = `[data-help="${helpKey}"]`;
  const help = getElementHelp(selector);
  
  if (!help) {
    // No help content for this key, just render children
    return <>{children}</>;
  }
  
  const handleLearnMore = () => {
    if (help.learnMoreId) {
      const fullHelp = getHelpById(help.learnMoreId);
      if (fullHelp) {
        open();
        sendMessage(fullHelp.question);
      }
    } else {
      open();
    }
    setIsOpen(false);
  };
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 cursor-help", className)}>
            {children}
            {showIcon && (
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-xs p-3"
          sideOffset={8}
        >
          <div className="space-y-2">
            <p className="font-medium text-sm">{help.title}</p>
            <p className="text-xs text-muted-foreground">{help.description}</p>
            {help.learnMoreId && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs w-full justify-between mt-1"
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

// HOC for wrapping existing components with help tooltips
export function withContextualHelp<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  helpKey: string,
  options?: { side?: 'top' | 'right' | 'bottom' | 'left'; showIcon?: boolean }
) {
  return function WithHelpComponent(props: P) {
    return (
      <ContextualHelpTooltip helpKey={helpKey} {...options}>
        <WrappedComponent {...props} />
      </ContextualHelpTooltip>
    );
  };
}
