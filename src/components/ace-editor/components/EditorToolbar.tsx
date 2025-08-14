import React from 'react';
import { 
  Menu, 
  Save, 
  FolderOpen, 
  Search, 
  Settings, 
  Terminal, 
  GitBranch,
  Play,
  Bug,
  Command,
  SplitSquareHorizontal,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { EditorState } from '../types';

interface EditorToolbarProps {
  state: EditorState;
  onToggleSidebar: () => void;
  onSaveFile: () => void;
  onOpenFile: () => void;
  onToggleCommandPalette: () => void;
  onToggleSettings: () => void;
  onNewFile: () => void;
  onSearch: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  state,
  onToggleSidebar,
  onSaveFile,
  onOpenFile,
  onToggleCommandPalette,
  onToggleSettings,
  onNewFile,
  onSearch,
}) => {
  const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);

  return (
    <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Side - Main Actions */}
      <div className="flex items-center gap-2">
        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={onNewFile}>
              <FolderOpen className="h-4 w-4 mr-2" />
              New File
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenFile}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open File
              <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSaveFile} disabled={!activeTab?.modified}>
              <Save className="h-4 w-4 mr-2" />
              Save
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Save className="h-4 w-4 mr-2" />
              Save All
              <DropdownMenuShortcut>⌘⇧S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              Find
              <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Search className="h-4 w-4 mr-2" />
              Find in Files
              <DropdownMenuShortcut>⌘⇧F</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={`h-8 w-8 p-0 ${state.showSidebar ? 'bg-primary/10 text-primary' : ''}`}
        >
          <SplitSquareHorizontal className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* File Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenFile}
          className="h-8 px-3"
          title="Open File (Ctrl+O)"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveFile}
          disabled={!activeTab?.modified}
          className="h-8 px-3"
          title="Save File (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearch}
          className="h-8 px-3"
          title="Search (Ctrl+F)"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - File Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {activeTab && (
          <>
            <span className="font-medium">{activeTab.name}</span>
            {activeTab.modified && (
              <span className="text-primary">•</span>
            )}
            <Separator orientation="vertical" className="h-4" />
            <span className="uppercase text-xs">{activeTab.language}</span>
          </>
        )}
      </div>

      {/* Right Side - Tools & Settings */}
      <div className="flex items-center gap-2">
        {/* Development Tools */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3"
          title="Run Code"
        >
          <Play className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3"
          title="Debug"
        >
          <Bug className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3"
          title="Terminal"
        >
          <Terminal className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Command Palette */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCommandPalette}
          className="h-8 px-3"
          title="Command Palette (Ctrl+Shift+P)"
        >
          <Command className="h-4 w-4" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
          className="h-8 w-8 p-0"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};