import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Book, 
  FileText, 
  Video, 
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  TrendingUp,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { helpDatabase, HelpItem, searchHelp } from '@/data/helpContent';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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

export function SupportCenterKnowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpItem | null>(null);

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

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchHelp(searchQuery);
  }, [searchQuery]);

  // Current articles to display
  const currentArticles = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    if (selectedCategory) return groupedArticles[selectedCategory] || [];
    return [];
  }, [searchQuery, selectedCategory, searchResults, groupedArticles]);

  const handleArticleClick = (article: HelpItem) => {
    setSelectedArticle(article);
  };

  const getFeaturedInfo = (id: string) => {
    return featuredArticles.find(a => a.id === id);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for articles, guides, tutorials..."
            className="pl-10 pr-10 rounded-xl"
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
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              /* Article View */
              <motion.div
                key="article"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                  className="mb-2 -ml-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
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
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none bg-secondary/30 rounded-xl p-6">
                    <ReactMarkdown>{selectedArticle.answer}</ReactMarkdown>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between py-2">
                    <p className="text-sm text-muted-foreground">
                      Was this article helpful?
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        👍 Yes
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        👎 No
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : searchQuery || selectedCategory ? (
              /* Search/Category Results */
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="-ml-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    All Topics
                  </Button>
                )}
                
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    {currentArticles.length} result{currentArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}
                
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
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg flex-shrink-0">
                                  {getCategoryInfo(article.category)?.emoji}
                                </span>
                                <h3 className="font-medium text-sm line-clamp-1">{article.question}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {article.answer.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 120)}...
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-[10px]", getCategoryInfo(article.category)?.color)}
                                >
                                  {getCategoryInfo(article.category)?.name}
                                </Badge>
                                {getFeaturedInfo(article.id) && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getFeaturedInfo(article.id)?.readTime}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {currentArticles.length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No articles found for your search.
                      </p>
                    </Card>
                  )}
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
                      const Icon = category.icon;
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
                    {featuredArticles.map((featured, i) => {
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
