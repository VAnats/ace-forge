import React, { useState, useEffect } from 'react';
import { Search, Replace, X, ChevronDown, ChevronRight, Type, FileText, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';
import { SearchOptions } from '../types';

interface SearchReplaceProps {
  open: boolean;
  onClose: () => void;
  options: SearchOptions;
  onOptionsChange: (options: SearchOptions) => void;
  onSearch: (query: string, options: SearchOptions) => void;
  onReplace: (query: string, replaceWith: string, options: SearchOptions) => void;
  onReplaceAll: (query: string, replaceWith: string, options: SearchOptions) => void;
}

export const SearchReplace: React.FC<SearchReplaceProps> = ({
  open,
  onClose,
  options,
  onOptionsChange,
  onSearch,
  onReplace,
  onReplaceAll,
}) => {
  const [showReplace, setShowReplace] = useState(false);
  const [query, setQuery] = useState(options.query);
  const [replaceWith, setReplaceWith] = useState(options.replaceWith || '');

  useEffect(() => {
    setQuery(options.query);
    setReplaceWith(options.replaceWith || '');
  }, [options]);

  const handleSearch = () => {
    const newOptions = { ...options, query };
    onOptionsChange(newOptions);
    onSearch(query, newOptions);
  };

  const handleReplace = () => {
    const newOptions = { ...options, query, replaceWith };
    onOptionsChange(newOptions);
    onReplace(query, replaceWith, newOptions);
  };

  const handleReplaceAll = () => {
    const newOptions = { ...options, query, replaceWith };
    onOptionsChange(newOptions);
    onReplaceAll(query, replaceWith, newOptions);
  };

  if (!open) return null;

  return (
    <div className="absolute top-0 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Search & Replace</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Find"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="flex-1 text-sm"
            autoFocus
          />
          <Button size="sm" onClick={handleSearch} disabled={!query}>
            <Search className="h-3 w-3" />
          </Button>
        </div>

        {/* Replace Section */}
        <Collapsible open={showReplace} onOpenChange={setShowReplace}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs p-2">
              {showReplace ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              <Replace className="h-3 w-3 mr-1" />
              Replace
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Replace"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleReplace();
                  }
                }}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleReplace} disabled={!query}>
                Replace
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleReplaceAll} 
              disabled={!query}
              className="w-full text-xs"
            >
              Replace All
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Options */}
        <div className="flex items-center gap-1 pt-2 border-t border-border">
          <Toggle
            pressed={options.caseSensitive}
            onPressedChange={(pressed) => 
              onOptionsChange({ ...options, caseSensitive: pressed })
            }
            size="sm"
            title="Case Sensitive"
          >
            <Type className="h-3 w-3" />
          </Toggle>
          <Toggle
            pressed={options.wholeWord}
            onPressedChange={(pressed) => 
              onOptionsChange({ ...options, wholeWord: pressed })
            }
            size="sm"
            title="Whole Word"
          >
            <FileText className="h-3 w-3" />
          </Toggle>
          <Toggle
            pressed={options.regex}
            onPressedChange={(pressed) => 
              onOptionsChange({ ...options, regex: pressed })
            }
            size="sm"
            title="Regular Expression"
          >
            <Code className="h-3 w-3" />
          </Toggle>
        </div>

        {/* Results Info */}
        {query && (
          <div className="text-xs text-muted-foreground pt-1">
            Press Enter to find next • F3 for next • Shift+F3 for previous
          </div>
        )}
      </div>
    </div>
  );
};