import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Book, 
  FileText, 
  Video, 
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { helpDatabase, HelpItem, getContextHelp } from '@/data/helpContent';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';

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

// Simulated resources (webinars, guides, videos)
const resources = [
  {
    id: 'r1',
    title: 'Getting Started with SMART Advanced',
    type: 'video',
    duration: '5 min',
    thumbnail: '🎬'
  },
  {
    id: 'r2',
    title: 'TRF Workflow Complete Guide',
    type: 'guide',
    pages: 12,
    thumbnail: '📖'
  },
  {
    id: 'r3',
    title: 'Supplier Risk Assessment Webinar',
    type: 'webinar',
    duration: '45 min',
    thumbnail: '🎥'
  },
  {
    id: 'r4',
    title: 'Inspection Scheduling Best Practices',
    type: 'guide',
    pages: 8,
    thumbnail: '📋'
  },
  {
    id: 'r5',
    title: 'Custom Reports Tutorial',
    type: 'video',
    duration: '8 min',
    thumbnail: '📊'
  },
];

export function HelpDrawer({ open, onOpenChange }: HelpDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { open: openAIPanel, sendMessage, contextHelp } = useAISupportContext();

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

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedCategory ? groupedHelp[selectedCategory] || [] : [];
    }
    const query = searchQuery.toLowerCase();
    return helpDatabase.filter(item => 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.keywords.some(k => k.includes(query))
    );
  }, [searchQuery, selectedCategory, groupedHelp]);

  const handleAskAI = () => {
    onOpenChange(false);
    openAIPanel();
    if (searchQuery.trim()) {
      sendMessage(searchQuery);
    }
  };

  const handleQuestionClick = (question: string) => {
    onOpenChange(false);
    openAIPanel();
    sendMessage(question);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 pb-0">
            <SheetTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Book className="h-4 w-4 text-primary" />
              </div>
              Help Center
            </SheetTitle>
          </SheetHeader>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Ask AI button */}
            <Button
              variant="outline"
              className="w-full mt-3 justify-between group"
              onClick={handleAskAI}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {searchQuery ? `Ask AI: "${searchQuery}"` : 'Ask AI Assistant'}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <Separator />

          {/* Content */}
          <Tabs defaultValue="browse" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 grid grid-cols-2">
              <TabsTrigger value="browse">Browse Topics</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-4">
                  {/* Context-aware suggestions */}
                  {contextHelp && !searchQuery && !selectedCategory && (
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">For this page: {contextHelp.title}</span>
                      </div>
                      <div className="space-y-2">
                        {contextHelp.commonQuestions.slice(0, 3).map(q => (
                          <button
                            key={q.id}
                            onClick={() => handleQuestionClick(q.question)}
                            className="w-full text-left text-sm p-2 rounded-md hover:bg-background/80 transition-colors flex items-center justify-between group"
                          >
                            <span className="text-muted-foreground line-clamp-1">{q.question}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search results */}
                  {searchQuery && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="space-y-2">
                        {filteredItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleQuestionClick(item.question)}
                            className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{item.question}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.answer}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                            <Badge variant="secondary" className="mt-2 text-[10px]">
                              {categoryLabels[item.category]}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category grid (when no search) */}
                  {!searchQuery && !selectedCategory && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(groupedHelp).map(([category, items]) => {
                        const Icon = categoryIcons[category] || HelpCircle;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all text-left group"
                          >
                            <Icon className="h-5 w-5 text-primary mb-2" />
                            <p className="font-medium text-sm">{categoryLabels[category]}</p>
                            <p className="text-xs text-muted-foreground">{items.length} articles</p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category items */}
                  {selectedCategory && !searchQuery && (
                    <div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                      >
                        <ChevronRight className="h-3 w-3 rotate-180" />
                        Back to topics
                      </button>
                      <h3 className="font-semibold mb-3">{categoryLabels[selectedCategory]}</h3>
                      <div className="space-y-2">
                        {(groupedHelp[selectedCategory] || []).map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleQuestionClick(item.question)}
                            className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm">{item.question}</p>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resources" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-3">
                  {resources.map(resource => (
                    <div
                      key={resource.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{resource.thumbnail}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{resource.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {resource.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {resource.type === 'guide' ? `${resource.pages} pages` : resource.duration}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full" onClick={handleAskAI}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with AI Assistant
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
