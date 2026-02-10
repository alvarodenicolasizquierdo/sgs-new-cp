import { useState, useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  FileText, 
  Video, 
  Lightbulb,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { helpDatabase, HelpItem, searchHelp } from '@/data/helpContent';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Notion-style categories with icons and colors
const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: Lightbulb, color: 'bg-amber-500/10 text-amber-600', emoji: '🚀' },
  { id: 'testing', name: 'Testing & TRFs', icon: FileText, color: 'bg-blue-500/10 text-blue-600', emoji: '🧪' },
  { id: 'suppliers', name: 'Suppliers', icon: Book, color: 'bg-green-500/10 text-green-600', emoji: '🏭' },
  { id: 'inspections', name: 'Inspections', icon: BookOpen, color: 'bg-purple-500/10 text-purple-600', emoji: '🔍' },
  { id: 'reports', name: 'Reports & Analytics', icon: TrendingUp, color: 'bg-pink-500/10 text-pink-600', emoji: '📊' },
  { id: 'general', name: 'General', icon: GraduationCap, color: 'bg-gray-500/10 text-gray-600', emoji: '📚' },
];

// Featured articles
const featuredArticles = [
  { id: 'gs-1', featured: true, readTime: '3 min' },
  { id: 't-1', featured: true, readTime: '5 min' },
  { id: 's-1', featured: true, readTime: '4 min' },
];

// Recent updates
const recentUpdates = [
  { title: 'New Bulk Testing Features', date: '2026-02-01', type: 'feature' },
  { title: 'Updated Supplier Scoring Algorithm', date: '2026-01-28', type: 'update' },
  { title: 'Inspection Mobile App Beta', date: '2026-01-25', type: 'announcement' },
];

export default function KnowledgeHub() {
  useEffect(() => { tagScreen('smart-knowledge-hub'); }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpItem | null>(null);
  const { open: openAIPanel, sendMessage } = useAISupportContext();

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

  const handleAskAI = () => {
    openAIPanel();
    if (searchQuery.trim()) {
      sendMessage(searchQuery);
    }
  };

  const handleArticleClick = (article: HelpItem) => {
    setSelectedArticle(article);
  };

  const getFeaturedInfo = (id: string) => {
    return featuredArticles.find(a => a.id === id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Knowledge Hub
          </div>
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground">
            Search our documentation, guides, and resources
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, tutorials..."
              className="pl-12 pr-32 h-14 text-lg rounded-xl border-2 focus:border-primary"
            />
            <Button
              onClick={handleAskAI}
              className="absolute right-2 top-1/2 -translate-y-1/2 gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        {selectedArticle ? (
          /* Article View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedArticle(null)}
              className="mb-4"
            >
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to articles
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {categories.find(c => c.id === selectedArticle.category)?.name}
                    </Badge>
                    <CardTitle className="text-2xl">{selectedArticle.question}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Star className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedArticle.answer}</ReactMarkdown>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Was this article helpful?
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">👍 Yes</Button>
                    <Button variant="outline" size="sm">👎 No</Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Still have questions?</p>
                  <Button onClick={handleAskAI} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : searchQuery || selectedCategory ? (
          /* Search/Category Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selectedCategory && (
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="mb-4"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                Back to categories
              </Button>
            )}
            
            <div className="grid gap-4">
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  {currentArticles.length} result{currentArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
              
              {currentArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {categories.find(c => c.id === article.category)?.emoji}
                            </span>
                            <h3 className="font-medium">{article.question}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.answer.replace(/\*\*/g, '').substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(c => c.id === article.category)?.name}
                            </Badge>
                            {getFeaturedInfo(article.id) && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getFeaturedInfo(article.id)?.readTime}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {currentArticles.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No articles found for your search.
                  </p>
                  <Button onClick={handleAskAI} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Ask AI Instead
                  </Button>
                </Card>
              )}
            </div>
          </motion.div>
        ) : (
          /* Default View: Categories + Featured */
          <div className="space-y-8">
            {/* Categories Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4">Browse by Topic</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category, i) => {
                  const Icon = category.icon;
                  const count = groupedArticles[category.id]?.length || 0;
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Card 
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-6">
                          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-3", category.color)}>
                            <span className="text-2xl">{category.emoji}</span>
                          </div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {count} article{count !== 1 ? 's' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Featured Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Popular Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {featuredArticles.map((featured, i) => {
                  const article = helpDatabase.find(a => a.id === featured.id);
                  if (!article) return null;
                  
                  return (
                    <Card 
                      key={article.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handleArticleClick(article)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {categories.find(c => c.id === article.category)?.emoji}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {featured.readTime}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2">{article.question}</h3>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                What's New
              </h2>
              <Card>
                <CardContent className="p-0">
                  {recentUpdates.map((update, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-accent/30 transition-colors cursor-pointer",
                        i !== recentUpdates.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          update.type === 'feature' && "bg-green-500",
                          update.type === 'update' && "bg-blue-500",
                          update.type === 'announcement' && "bg-amber-500"
                        )} />
                        <span className="font-medium text-sm">{update.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{update.date}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
