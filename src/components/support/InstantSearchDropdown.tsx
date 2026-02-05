import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ChevronRight, 
  Clock, 
  TrendingUp,
  FileText,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Hash,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { helpDatabase, HelpItem, searchHelp } from '@/data/helpContent';
import { cn } from '@/lib/utils';

interface InstantSearchDropdownProps {
  onSelectArticle: (article: HelpItem) => void;
  onAskAI?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Recent searches (would be persisted in localStorage in production)
const recentSearches = ['TRF status', 'supplier approval', 'inspection types'];

// Trending topics
const trendingTopics = ['Testing workflow', 'New supplier setup', 'Generate reports'];

// Result categories for grouping
const CATEGORIES = {
  articles: { label: 'Articles', icon: FileText },
  guides: { label: 'Guides', icon: BookOpen },
  faq: { label: 'FAQ', icon: HelpCircle },
};

export function InstantSearchDropdown({ 
  onSelectArticle, 
  onAskAI,
  placeholder = "Search for help...",
  className 
}: InstantSearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Instant search results with grouping
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchHelp(query).slice(0, 6);
  }, [query]);

  // Grouped results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, HelpItem[]> = {};
    searchResults.forEach(result => {
      const cat = result.category?.toLowerCase() || 'articles';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(result);
    });
    return groups;
  }, [searchResults]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => {
    const items: Array<{ type: 'article' | 'ai'; item?: HelpItem }> = [];
    searchResults.forEach(r => items.push({ type: 'article', item: r }));
    if (onAskAI && query.trim()) items.push({ type: 'ai' });
    return items;
  }, [searchResults, onAskAI, query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (!isFocused) setIsOpen(false);
    }, 200);
  };

  const handleSelect = useCallback((article: HelpItem) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelectArticle(article);
  }, [onSelectArticle]);

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const handleAskAI = useCallback(() => {
    if (onAskAI && query.trim()) {
      onAskAI(query);
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [onAskAI, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < flatResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
          const selected = flatResults[selectedIndex];
          if (selected.type === 'ai') {
            handleAskAI();
          } else if (selected.item) {
            handleSelect(selected.item);
          }
        } else if (query.trim() && onAskAI) {
          handleAskAI();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const showSuggestions = isOpen && !query.trim();
  const showResults = isOpen && query.trim() && searchResults.length > 0;
  const showNoResults = isOpen && query.trim() && searchResults.length === 0;

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 rounded-xl h-11"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {(showSuggestions || showResults || showNoResults) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Suggestions (when no query) */}
            {showSuggestions && (
              <div className="p-3 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentSearch(search)}
                          className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Trending</span>
                  </div>
                  <div className="space-y-1">
                    {trendingTopics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearch(topic)}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group"
                      >
                        <span>{topic}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyboard hints */}
                <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">esc</kbd>
                    close
                  </span>
                </div>
              </div>
            )}

            {/* Search Results - Grouped */}
            {showResults && (
              <div>
                {/* Results count header */}
                <div className="px-3 py-2 border-b border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
                  </span>
                </div>

                <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
                  {searchResults.map((article, i) => {
                    const isSelected = selectedIndex === i;
                    return (
                      <motion.button
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => handleSelect(article)}
                        className={cn(
                          "w-full text-left p-3 transition-colors group flex items-start gap-3",
                          isSelected ? "bg-primary/10" : "hover:bg-secondary/50"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium line-clamp-1">{article.question}</p>
                            {article.category && (
                              <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                                {article.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {article.answer.replace(/\*\*/g, '').substring(0, 100)}...
                          </p>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 text-muted-foreground transition-all flex-shrink-0 mt-2",
                          isSelected ? "opacity-100 translate-x-0.5" : "opacity-0 group-hover:opacity-100"
                        )} />
                      </motion.button>
                    );
                  })}

                  {/* Ask AI option */}
                  {onAskAI && (
                    <button
                      onClick={handleAskAI}
                      className={cn(
                        "w-full text-left p-3 transition-colors group flex items-center gap-3",
                        selectedIndex === searchResults.length 
                          ? "bg-primary/10" 
                          : "hover:bg-primary/5 bg-gradient-to-r from-primary/5 to-transparent"
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">
                          Ask Carlos: "{query}"
                        </p>
                        <p className="text-xs text-muted-foreground">Get AI-powered help</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        AI
                      </Badge>
                    </button>
                  )}
                </div>

                {/* Keyboard hints footer */}
                <div className="flex items-center justify-center gap-4 py-2 border-t border-border bg-muted/30">
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CornerDownLeft className="h-3 w-3" />
                    select
                  </span>
                </div>
              </div>
            )}

            {/* No Results */}
            {showNoResults && (
              <div className="p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No results found</p>
                <p className="text-xs text-muted-foreground mb-4">
                  We couldn't find anything matching "{query}"
                </p>
                {onAskAI && (
                  <Button onClick={handleAskAI} size="sm" className="rounded-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ask Carlos instead
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
