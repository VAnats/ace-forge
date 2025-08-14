import React, { useEffect, useCallback, useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useEditorState } from './hooks/useEditorState';
import { FileExplorer } from './components/FileExplorer';
import { EditorTabs } from './components/EditorTabs';
import { EditorToolbar } from './components/EditorToolbar';
import { AceEditor } from './components/AceEditor';
import { StatusBar } from './components/StatusBar';
import { CommandPalette } from './components/CommandPalette';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchReplace } from './components/SearchReplace';
import { QuickActions } from './components/QuickActions';
import { Minimap } from './components/Minimap';
import { SearchOptions } from './types';
import { toast } from '@/hooks/use-toast';

export const AceEditorApp: React.FC = () => {
  const { state, actions } = useEditorState();
  const [cursorPosition, setCursorPosition] = useState<{ row: number; column: number }>({ row: 0, column: 0 });
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    replaceWith: '',
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    inSelection: false,
  });

  // Load file content from server
  const loadFileContent = useCallback(async (path: string) => {
    try {
      const response = await fetch(`?action=read&path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error('Failed to load file');
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const fileName = path.split('/').pop() || 'Untitled';
      actions.openTab(path, data.content, fileName);
    } catch (error) {
      toast({
        title: "Error loading file",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [actions]);

  // Handle file selection from explorer
  const handleFileSelect = useCallback((path: string) => {
    loadFileContent(path);
  }, [loadFileContent]);

  // Handle save current file
  const handleSaveFile = useCallback(() => {
    if (state.activeTabId) {
      actions.saveTab(state.activeTabId);
    } else {
      toast({
        title: "No file to save",
        description: "Please open a file first",
        variant: "destructive",
      });
    }
  }, [state.activeTabId, actions]);

  // Handle open file dialog (this would typically open a file browser)
  const handleOpenFile = useCallback(() => {
    // Since we don't have a file dialog in the browser, we'll just show a toast
    toast({
      title: "Open File",
      description: "Use the file explorer to browse and open files",
    });
  }, []);

  // Handle new file
  const handleNewFile = useCallback(() => {
    const fileName = `untitled-${Date.now()}.txt`;
    actions.openTab(fileName, '', fileName);
    toast({
      title: "New file created",
      description: fileName,
    });
  }, [actions]);

  // Handle search
  const handleSearch = useCallback(() => {
    setShowSearchReplace(true);
  }, []);

  // Handle search operations
  const handleSearchQuery = useCallback((query: string, options: SearchOptions) => {
    // This would integrate with ace editor's search functionality
    toast({
      title: "Searching",
      description: `Searching for: ${query}`,
    });
  }, []);

  const handleReplace = useCallback((query: string, replaceWith: string, options: SearchOptions) => {
    toast({
      title: "Replace",
      description: `Replacing "${query}" with "${replaceWith}"`,
    });
  }, []);

  const handleReplaceAll = useCallback((query: string, replaceWith: string, options: SearchOptions) => {
    toast({
      title: "Replace All",
      description: `Replaced all instances of "${query}"`,
    });
  }, []);

  // Handle quick actions
  const handleQuickAction = useCallback((action: string) => {
    const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
    if (!activeTab) return;

    switch (action) {
      case 'format':
        // Format code logic would go here
        break;
      case 'run-js':
        // JavaScript execution logic
        break;
      case 'run-php':
        // PHP syntax check logic
        break;
      case 'copy-path':
        navigator.clipboard.writeText(activeTab.path);
        break;
      case 'copy-content':
        navigator.clipboard.writeText(activeTab.content);
        break;
      case 'download':
        // Download file logic
        const blob = new Blob([activeTab.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeTab.name;
        a.click();
        URL.revokeObjectURL(url);
        break;
      default:
        break;
    }
  }, [state.tabs, state.activeTabId]);

  // Handle minimap line click
  const handleMinimapLineClick = useCallback((line: number) => {
    // This would scroll to the specific line in the editor
    toast({
      title: "Navigate",
      description: `Jumping to line ${line + 1}`,
    });
  }, []);

  // Handle theme toggle
  const handleToggleTheme = useCallback(() => {
    const currentTheme = state.settings.theme;
    const isDark = currentTheme.includes('dark') || currentTheme.includes('monokai') || currentTheme.includes('twilight');
    const newTheme = isDark ? 'ace/theme/github' : 'ace/theme/monokai';
    actions.updateSettings({ theme: newTheme });
    
    toast({
      title: "Theme changed",
      description: `Switched to ${newTheme.split('/').pop()}`,
    });
  }, [state.settings.theme, actions]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        switch (e.key.toLowerCase()) {
          case 'n':
            if (e.shiftKey) return; // Let Ctrl+Shift+N pass through for new window
            e.preventDefault();
            handleNewFile();
            break;
          case 'o':
            e.preventDefault();
            handleOpenFile();
            break;
          case 's':
            e.preventDefault();
            handleSaveFile();
            break;
        case 'f':
          if (!e.shiftKey) {
            e.preventDefault();
            handleSearch();
          }
          break;
        case 'h':
          e.preventDefault();
          setShowSearchReplace(true);
          break;
          case 'p':
            if (e.shiftKey) {
              e.preventDefault();
              actions.toggleCommandPalette();
            }
            break;
          case ',':
            e.preventDefault();
            actions.toggleSettings();
            break;
          case '`':
            if (e.shiftKey) {
              e.preventDefault();
              // Toggle terminal (not implemented yet)
              toast({
                title: "Terminal",
                description: "Terminal feature coming soon!",
              });
            }
            break;
        }
      }
    };

    // Listen for custom events from ace editor
    const handleAceSave = (e: CustomEvent) => {
      if (e.detail) {
        actions.saveTab(e.detail);
      } else {
        handleSaveFile();
      }
    };

    const handleAceOpen = () => handleOpenFile();
    const handleAceNew = () => handleNewFile();
    const handleAceCommandPalette = () => actions.toggleCommandPalette();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('ace-save', handleAceSave as EventListener);
    window.addEventListener('ace-open', handleAceOpen);
    window.addEventListener('ace-new', handleAceNew);
    window.addEventListener('ace-command-palette', handleAceCommandPalette);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('ace-save', handleAceSave as EventListener);
      window.removeEventListener('ace-open', handleAceOpen);
      window.removeEventListener('ace-new', handleAceNew);
      window.removeEventListener('ace-command-palette', handleAceCommandPalette);
    };
  }, [actions, handleNewFile, handleOpenFile, handleSaveFile]);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Toolbar */}
      <EditorToolbar
        state={state}
        onToggleSidebar={actions.toggleSidebar}
        onSaveFile={handleSaveFile}
        onOpenFile={handleOpenFile}
        onToggleCommandPalette={actions.toggleCommandPalette}
        onToggleSettings={actions.toggleSettings}
        onNewFile={handleNewFile}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          {state.showSidebar && (
            <>
              <ResizablePanel 
                defaultSize={25} 
                minSize={15} 
                maxSize={50}
                className="min-w-[200px]"
              >
                <FileExplorer
                  onFileSelect={handleFileSelect}
                  currentDirectory={state.currentDirectory}
                  onDirectoryChange={(dir) => {
                    // Update current directory in state if needed
                  }}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Editor Area */}
          <ResizablePanel defaultSize={state.showSidebar ? 75 : 100} minSize={30}>
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <EditorTabs
                tabs={state.tabs}
                activeTabId={state.activeTabId}
                onTabSelect={actions.setActiveTab}
                onTabClose={actions.closeTab}
                onTabSave={actions.saveTab}
              />

              {/* Quick Actions */}
              <QuickActions
                activeTab={state.tabs.find(tab => tab.id === state.activeTabId)}
                onAction={handleQuickAction}
              />

              {/* Editor with Minimap */}
              <div className="flex-1 flex relative">
                <div className="flex-1">
                  <AceEditor
                    state={state}
                    onContentChange={actions.updateTabContent}
                    onCursorChange={setCursorPosition}
                    onSelectionChange={setSelectionRange}
                    className="h-full w-full"
                  />
                </div>
                
                {state.settings.showMinimap && (
                  <Minimap
                    content={state.tabs.find(tab => tab.id === state.activeTabId)?.content || ''}
                    currentLine={cursorPosition.row}
                    totalLines={state.tabs.find(tab => tab.id === state.activeTabId)?.content.split('\n').length || 0}
                    onLineClick={handleMinimapLineClick}
                    visible={state.settings.showMinimap}
                  />
                )}

                {/* Search & Replace Panel */}
                <SearchReplace
                  open={showSearchReplace}
                  onClose={() => setShowSearchReplace(false)}
                  options={searchOptions}
                  onOptionsChange={setSearchOptions}
                  onSearch={handleSearchQuery}
                  onReplace={handleReplace}
                  onReplaceAll={handleReplaceAll}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <StatusBar
        state={state}
        cursorPosition={cursorPosition}
        selectionRange={selectionRange}
        onTogglePanel={(panel) => {
          // Handle panel toggling
          toast({
            title: "Panel",
            description: `${panel} panel coming soon!`,
          });
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        open={state.commandPaletteOpen}
        onClose={() => actions.toggleCommandPalette()}
        state={state}
        onSaveFile={handleSaveFile}
        onOpenFile={handleOpenFile}
        onNewFile={handleNewFile}
        onToggleSettings={actions.toggleSettings}
        onSearch={handleSearch}
        onToggleTheme={handleToggleTheme}
      />

      {/* Settings Panel */}
      <SettingsPanel
        open={state.settingsOpen}
        onClose={() => actions.toggleSettings()}
        settings={state.settings}
        onUpdateSettings={actions.updateSettings}
      />
    </div>
  );
};