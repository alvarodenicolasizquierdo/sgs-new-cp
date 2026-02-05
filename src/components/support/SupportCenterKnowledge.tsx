import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  FileText, 
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { helpDatabase, HelpItem, searchHelp } from '@/data/helpContent';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { InstantSearchDropdown } from './InstantSearchDropdown';
import { ArticleBreadcrumbs } from './ArticleBreadcrumbs';

// Notion-style categories with icons and colors
const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: Lightbulb, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', emoji: '🚀' },
  { id: 'testing', name: 'Testing & TRFs', icon: FileText, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', emoji: '🧪' },
  { id: 'suppliers', name: 'Suppliers', icon: Book, color: 'bg-green-500/10 text-green-600 border-green-500/20', emoji: '🏭' },
  { id: 'inspections', name: 'Inspections', icon: BookOpen, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', emoji: '🔍' },
  { id: 'reports', name: 'Reports & Analytics', icon: TrendingUp, color: 'bg-pink-500/10 text-pink-600 border-pink-500/20', emoji: '📊' },
  { id: 'styles', name: 'Styles', icon: FileText, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', emoji: '👗' },
  { id: 'components', name: 'Components', icon: BookOpen, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20', emoji: '🧵' },
  { id: 'general', name: 'General', icon: GraduationCap, color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', emoji: '📚' },
];

// Featured articles
const featuredArticles = [
  { id: 'gs-1', readTime: '3 min' },
  { id: 't-1', readTime: '5 min' },
  { id: 'st-1', readTime: '4 min' },
];

interface SupportCenterKnowledgeProps {
  onAskAI?: (query: string) => void;
}

export function SupportCenterKnowledge({ onAskAI }: SupportCenterKnowledgeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpItem | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  // Group articles by category
  const groupedArticles = useMemo(() => {
    const groups: Record<string, HelpItem[]> = {};
    helpDatabase.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, []);

  // Current articles to display
  const currentArticles = useMemo(() => {
    if (selectedCategory) return groupedArticles[selectedCategory] || [];
    return [];
  }, [selectedCategory, groupedArticles]);

  const handleArticleClick = (article: HelpItem) => {
    setSelectedArticle(article);
    setFeedbackGiven(null);
  };

  const getFeaturedInfo = (id: string) => {
    return featuredArticles.find(a => a.id === id);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  // Get related articles from same category
  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return helpDatabase
      .filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id)
      .slice(0, 3);
  }, [selectedArticle]);

  // Build breadcrumb items
  const breadcrumbs = useMemo(() => {
    const items: { label: string; emoji?: string; onClick?: () => void }[] = [
      { label: 'Help Center', onClick: () => { setSelectedArticle(null); setSelectedCategory(null); } }
    ];

    if (selectedCategory) {
      const cat = getCategoryInfo(selectedCategory);
      items.push({
        label: cat?.name || selectedCategory,
        emoji: cat?.emoji,
        onClick: selectedArticle ? () => setSelectedArticle(null) : undefined
      });
    }

    if (selectedArticle) {
      items.push({
        label: selectedArticle.question.length > 40 
          ? selectedArticle.question.substring(0, 40) + '...' 
          : selectedArticle.question
      });
    }

    return items;
  }, [selectedCategory, selectedArticle]);

  const handleFeedback = (type: 'yes' | 'no') => {
    setFeedbackGiven(type);
    // In production, send analytics
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header with Instant Search */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <InstantSearchDropdown
          onSelectArticle={handleArticleClick}
          onAskAI={onAskAI}
          placeholder="Search for articles, guides, tutorials..."
        />
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              /* Article View with Breadcrumbs */
              <motion.div
                key="article"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Breadcrumbs */}
                <ArticleBreadcrumbs items={breadcrumbs} className="mb-4" />
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge 
                        variant="outline" 
                        className={cn("mb-2", getCategoryInfo(selectedArticle.category)?.color)}
                      >
                        {getCategoryInfo(selectedArticle.category)?.emoji} {getCategoryInfo(selectedArticle.category)?.name}
                      </Badge>
                      <h2 className="text-xl font-semibold">{selectedArticle.question}</h2>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Article Content */}
                  <div className="prose prose-sm dark:prose-invert max-w-none bg-secondary/30 rounded-xl p-6">
                    <ReactMarkdown>{selectedArticle.answer}</ReactMarkdown>
                  </div>
                  
                  <Separator />
                  
                  {/* Feedback Section */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    {feedbackGiven ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-2"
                      >
                        <p className="text-sm text-muted-foreground">
                          {feedbackGiven === 'yes' 
                            ? '🎉 Thanks for your feedback!' 
                            : '📝 Thank you! We\'ll work on improving this article.'}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Was this article helpful?
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full gap-2"
                            onClick={() => handleFeedback('yes')}
                          >
                            <ThumbsUp className="h-4 w-4" /> Yes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full gap-2"
                            onClick={() => handleFeedback('no')}
                          >
                            <ThumbsDown className="h-4 w-4" /> No
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Related Articles */}
                  {relatedArticles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Related Articles
                      </h3>
                      <div className="grid gap-2">
                        {relatedArticles.map(article => (
                          <Card 
                            key={article.id}
                            className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                            onClick={() => handleArticleClick(article)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm line-clamp-1 flex-1">{article.question}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : selectedCategory ? (
              /* Category Results with Breadcrumbs */
              <motion.div
                key="category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Breadcrumbs */}
                <ArticleBreadcrumbs items={breadcrumbs} className="mb-4" />

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center border",
                    getCategoryInfo(selectedCategory)?.color
                  )}>
                    <span className="text-xl">{getCategoryInfo(selectedCategory)?.emoji}</span>
                  </div>
                  <div>
                    <h2 className="font-semibold">{getCategoryInfo(selectedCategory)?.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {currentArticles.length} article{currentArticles.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {currentArticles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card 
                        className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                        onClick={() => handleArticleClick(article)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1 mb-1">{article.question}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {article.answer.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 120)}...
                              </p>
                              {getFeaturedInfo(article.id) && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-2">
                                  <Clock className="h-3 w-3" />
                                  {getFeaturedInfo(article.id)?.readTime}
                                </span>
                              )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Default View: Categories + Featured */
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Categories Grid */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Browse by Topic</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category, i) => {
                      const count = groupedArticles[category.id]?.length || 0;
                      if (count === 0) return null;
                      
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Card 
                            className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <CardContent className="p-4">
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-2 border", category.color)}>
                                <span className="text-xl">{category.emoji}</span>
                              </div>
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                {category.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {count} article{count !== 1 ? 's' : ''}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Articles */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Popular Articles
                  </h3>
                  <div className="grid gap-3">
                    {featuredArticles.map((featured) => {
                      const article = helpDatabase.find(a => a.id === featured.id);
                      if (!article) return null;
                      
                      return (
                        <Card 
                          key={article.id}
                          className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                          onClick={() => handleArticleClick(article)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {getCategoryInfo(article.category)?.emoji}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{article.question}</h4>
                                <span className="text-[10px] text-muted-foreground">
                                  {featured.readTime} read
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
