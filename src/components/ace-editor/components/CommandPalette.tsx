import React, { useState, useMemo, useEffect } from 'react';
import { Command, Search, Settings, Save, FolderOpen, FileText, Palette, Terminal, GitBranch } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommandPaletteItem, EditorState } from '../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  state: EditorState;
  onSaveFile: () => void;
  onOpenFile: () => void;
  onNewFile: () => void;
  onToggleSettings: () => void;
  onSearch: () => void;
  onToggleTheme: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  state,
  onSaveFile,
  onOpenFile,
  onNewFile,
  onToggleSettings,
  onSearch,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandPaletteItem[] = useMemo(() => [
    {
      id: 'file.new',
      title: 'File: New File',
      description: 'Create a new file',
      category: 'File',
      shortcut: 'Ctrl+N',
      action: () => {
        onNewFile();
        onClose();
      }
    },
    {
      id: 'file.open',
      title: 'File: Open File',
      description: 'Open an existing file',
      category: 'File',
      shortcut: 'Ctrl+O',
      action: () => {
        onOpenFile();
        onClose();
      }
    },
    {
      id: 'file.save',
      title: 'File: Save',
      description: 'Save the current file',
      category: 'File',
      shortcut: 'Ctrl+S',
      action: () => {
        onSaveFile();
        onClose();
      }
    },
    {
      id: 'edit.search',
      title: 'Edit: Find',
      description: 'Search in the current file',
      category: 'Edit',
      shortcut: 'Ctrl+F',
      action: () => {
        onSearch();
        onClose();
      }
    },
    {
      id: 'edit.replace',
      title: 'Edit: Replace',
      description: 'Find and replace in the current file',
      category: 'Edit',
      shortcut: 'Ctrl+H',
      action: () => {
        onSearch();
        onClose();
      }
    },
    {
      id: 'view.settings',
      title: 'View: Settings',
      description: 'Open editor settings',
      category: 'View',
      shortcut: 'Ctrl+,',
      action: () => {
        onToggleSettings();
        onClose();
      }
    },
    {
      id: 'view.toggle-theme',
      title: 'View: Toggle Theme',
      description: 'Switch between light and dark themes',
      category: 'View',
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'preferences.font-size-increase',
      title: 'Preferences: Increase Font Size',
      description: 'Make the editor font larger',
      category: 'Preferences',
      shortcut: 'Ctrl+=',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'preferences.font-size-decrease',
      title: 'Preferences: Decrease Font Size',
      description: 'Make the editor font smaller',
      category: 'Preferences',
      shortcut: 'Ctrl+-',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'editor.fold-all',
      title: 'Editor: Fold All',
      description: 'Fold all code blocks',
      category: 'Editor',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'editor.unfold-all',
      title: 'Editor: Unfold All',
      description: 'Unfold all code blocks',
      category: 'Editor',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'editor.toggle-word-wrap',
      title: 'Editor: Toggle Word Wrap',
      description: 'Enable or disable word wrapping',
      category: 'Editor',
      shortcut: 'Alt+Z',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'editor.toggle-minimap',
      title: 'Editor: Toggle Minimap',
      description: 'Show or hide the minimap',
      category: 'Editor',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'format.document',
      title: 'Format: Format Document',
      description: 'Format the entire document',
      category: 'Format',
      shortcut: 'Shift+Alt+F',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    },
    {
      id: 'terminal.new',
      title: 'Terminal: Create New Terminal',
      description: 'Open a new terminal instance',
      category: 'Terminal',
      shortcut: 'Ctrl+Shift+`',
      action: () => {
        // This would be handled by parent component
        onClose();
      }
    }
  ], [onNewFile, onOpenFile, onSaveFile, onSearch, onToggleSettings, onToggleTheme, onClose]);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    
    const lowercaseQuery = query.toLowerCase();
    return commands.filter(command => 
      command.title.toLowerCase().includes(lowercaseQuery) ||
      command.description?.toLowerCase().includes(lowercaseQuery) ||
      command.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          Math.min(prev + 1, filteredCommands.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'file':
        return FileText;
      case 'edit':
        return Search;
      case 'view':
        return Palette;
      case 'preferences':
        return Settings;
      case 'editor':
        return Command;
      case 'terminal':
        return Terminal;
      case 'format':
        return Command;
      default:
        return Command;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Command className="h-4 w-4" />
            Command Palette
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-4 pb-2">
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-border"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {filteredCommands.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command, index) => {
                  const IconComponent = getCategoryIcon(command.category);
                  return (
                    <div
                      key={command.id}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                        index === selectedIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => command.action()}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {command.title}
                        </div>
                        {command.description && (
                          <div className={`text-xs mt-0.5 truncate ${
                            index === selectedIndex 
                              ? 'text-primary-foreground/80' 
                              : 'text-muted-foreground'
                          }`}>
                            {command.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          index === selectedIndex 
                            ? 'bg-primary-foreground/20 text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {command.category}
                        </span>
                        {command.shortcut && (
                          <kbd className={`text-xs px-2 py-0.5 rounded border ${
                            index === selectedIndex 
                              ? 'border-primary-foreground/20 text-primary-foreground' 
                              : 'border-border text-muted-foreground'
                          }`}>
                            {command.shortcut}
                          </kbd>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Use ↑↓ to navigate • Enter to select • Esc to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};