import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Book, 
  FileText, 
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Sparkles,
  MessageCircle,
  Ticket,
  ArrowRight
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { helpDatabase, HelpItem, getContextHelp } from '@/data/helpContent';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { InstantSearchDropdown } from './InstantSearchDropdown';

interface HelpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  'getting-started': Lightbulb,
  'testing': FileText,
  'suppliers': Book,
  'inspections': HelpCircle,
  'reports': FileText,
  'general': HelpCircle,
};

const categoryLabels: Record<string, string> = {
  'getting-started': 'Getting Started',
  'testing': 'Testing & TRFs',
  'suppliers': 'Suppliers',
  'inspections': 'Inspections',
  'reports': 'Reports',
  'general': 'General',
};

// Quick actions for the drawer
const quickActions = [
  { 
    id: 'ask', 
    title: 'Ask Carlos', 
    description: 'Get instant AI-powered help', 
    icon: Sparkles, 
    color: 'bg-primary/10 text-primary border-primary/20',
    action: 'chat' 
  },
  { 
    id: 'browse', 
    title: 'Knowledge Base', 
    description: 'Browse help articles', 
    icon: Book, 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    action: 'knowledge' 
  },
  { 
    id: 'ticket', 
    title: 'Support Tickets', 
    description: 'View or create tickets', 
    icon: Ticket, 
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    action: 'tickets' 
  },
];

export function HelpDrawer({ open, onOpenChange }: HelpDrawerProps) {
  const [selectedArticle, setSelectedArticle] = useState<HelpItem | null>(null);
  const { open: openAIPanel, sendMessage, contextHelp } = useAISupportContext();
  const navigate = useNavigate();

  // Group help items by category
  const groupedHelp = useMemo(() => {
    const groups: Record<string, HelpItem[]> = {};
    helpDatabase.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, []);

  const handleAskAI = (query?: string) => {
    onOpenChange(false);
    openAIPanel();
    if (query) {
      sendMessage(query);
    }
  };

  const handleQuestionClick = (question: string) => {
    onOpenChange(false);
    openAIPanel();
    sendMessage(question);
  };

  const handleArticleSelect = (article: HelpItem) => {
    setSelectedArticle(article);
  };

  const handleQuickAction = (action: string) => {
    onOpenChange(false);
    navigate(`/support?tab=${action}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0">
        <div className="flex flex-col h-full">
          {/* Header - Slack style */}
          <SheetHeader className="p-4 pb-0 border-b-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block">Help</span>
                  <span className="text-xs font-normal text-muted-foreground">How can we help?</span>
                </div>
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Search with Instant Results */}
          <div className="px-4 py-3">
            <InstantSearchDropdown
              onSelectArticle={handleArticleSelect}
              onAskAI={handleAskAI}
              placeholder="Search for help..."
            />
          </div>

          <Separator />

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* Selected Article View */}
              {selectedArticle ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {categoryLabels[selectedArticle.category]}
                    </Badge>
                    <h3 className="font-semibold text-lg">{selectedArticle.question}</h3>
                  </div>
                  
                  <div className="prose prose-sm dark:prose-invert bg-secondary/30 rounded-xl p-4">
                    {selectedArticle.answer}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuestionClick(selectedArticle.question)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask Carlos for more details
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Quick Actions */}
                  <div className="grid gap-2">
                    {quickActions.map((action, i) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card 
                            className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                            onClick={() => action.action === 'chat' ? handleAskAI() : handleQuickAction(action.action)}
                          >
                            <CardContent className="p-3 flex items-center gap-3">
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", action.color)}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{action.title}</p>
                                <p className="text-xs text-muted-foreground">{action.description}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Context-aware suggestions */}
                  {contextHelp && (
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Help for: {contextHelp.title}</span>
                      </div>
                      <div className="space-y-2">
                        {contextHelp.commonQuestions.slice(0, 3).map(q => (
                          <button
                            key={q.id}
                            onClick={() => handleQuestionClick(q.question)}
                            className="w-full text-left text-sm p-2.5 rounded-lg bg-background/50 hover:bg-background transition-colors flex items-center justify-between group"
                          >
                            <span className="text-muted-foreground line-clamp-1">{q.question}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Topics */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Popular Topics</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(groupedHelp).slice(0, 4).map(([category, items]) => {
                        const Icon = categoryIcons[category] || HelpCircle;
                        return (
                          <button
                            key={category}
                            onClick={() => handleQuickAction('knowledge')}
                            className="p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all text-left group"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                            <p className="font-medium text-sm">{categoryLabels[category]}</p>
                            <p className="text-[10px] text-muted-foreground">{items.length} articles</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <Button 
              className="w-full" 
              onClick={() => {
                onOpenChange(false);
                navigate('/support');
              }}
            >
              Open Support Center
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
