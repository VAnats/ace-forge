import React from 'react';
import { X, FileText, Save, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorTab } from '../types';
import { cn } from '@/lib/utils';

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabSave: (tabId: string) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabSave,
}) => {
  if (tabs.length === 0) {
    return (
      <div className="h-10 bg-card border-b border-border flex items-center justify-center text-sm text-muted-foreground">
        No files open
      </div>
    );
  }

  return (
    <div className="h-10 bg-card border-b border-border flex items-center overflow-x-auto scrollbar-none">
      <div className="flex min-w-full">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onTabSelect(tab.id)}
            onClose={() => onTabClose(tab.id)}
            onSave={() => onTabSave(tab.id)}
          />
        ))}
        {/* Spacer to push content to left */}
        <div className="flex-1 min-w-0" />
      </div>
    </div>
  );
};

interface TabItemProps {
  tab: EditorTab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onSave: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  onSelect,
  onClose,
  onSave,
}) => {
  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors border-r border-border min-w-0 max-w-[200px]",
        isActive 
          ? "bg-background text-foreground border-b-2 border-b-primary" 
          : "bg-card hover:bg-background/50 text-muted-foreground hover:text-foreground"
      )}
      onClick={onSelect}
      onMouseDown={handleMiddleClick}
      title={tab.path}
    >
      {/* File Icon */}
      <FileText className="h-4 w-4 flex-shrink-0" />
      
      {/* File Name */}
      <span className="truncate flex-1 text-sm">
        {tab.name}
      </span>
      
      {/* Modified Indicator / Close Button */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {tab.modified && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleSaveClick}
            title="Save file"
          >
            <Save className="h-3 w-3" />
          </Button>
        )}
        
        {tab.modified ? (
          <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
            onClick={handleCloseClick}
            title="Close tab"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};