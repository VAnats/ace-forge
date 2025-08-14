import { useState, useCallback, useEffect } from 'react';
import { EditorState, EditorTab, EditorSettings, PanelType } from '../types';
import { toast } from '@/hooks/use-toast';

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'ace/theme/monokai',
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  showInvisibles: false,
  showGutter: true,
  showPrintMargin: true,
  highlightActiveLine: true,
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showMinimap: false,
  vim: false,
  emacs: false,
};

const DEFAULT_STATE: EditorState = {
  tabs: [],
  activeTabId: null,
  settings: DEFAULT_SETTINGS,
  showSidebar: true,
  sidebarWidth: 300,
  activePanels: ['files'],
  commandPaletteOpen: false,
  settingsOpen: false,
  currentDirectory: '',
  recentFiles: [],
};

export const useEditorState = () => {
  const [state, setState] = useState<EditorState>(() => {
    const saved = localStorage.getItem('ace-editor-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
      } catch (e) {
        console.warn('Failed to parse saved editor state:', e);
      }
    }
    return DEFAULT_STATE;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      ...state,
      tabs: state.tabs.map(tab => ({ ...tab, content: '' })) // Don't save content to avoid localStorage bloat
    };
    localStorage.setItem('ace-editor-state', JSON.stringify(stateToSave));
  }, [state]);

  const openTab = useCallback((path: string, content: string, name?: string) => {
    const existingTab = state.tabs.find(tab => tab.path === path);
    if (existingTab) {
      setState(prev => ({ ...prev, activeTabId: existingTab.id }));
      return;
    }

    const language = getLanguageFromPath(path);
    const tabName = name || path.split('/').pop() || 'Untitled';
    const newTab: EditorTab = {
      id: `tab-${Date.now()}-${Math.random()}`,
      path,
      name: tabName,
      content,
      modified: false,
      language,
    };

    setState(prev => ({
      ...prev,
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
      recentFiles: [path, ...prev.recentFiles.filter(f => f !== path)].slice(0, 10),
    }));

    toast({
      title: "File opened",
      description: `${tabName} opened successfully`,
    });
  }, [state.tabs]);

  const closeTab = useCallback((tabId: string) => {
    const tab = state.tabs.find(t => t.id === tabId);
    if (tab?.modified) {
      if (!confirm(`${tab.name} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    setState(prev => {
      const newTabs = prev.tabs.filter(t => t.id !== tabId);
      let newActiveId = prev.activeTabId;
      
      if (prev.activeTabId === tabId) {
        const currentIndex = prev.tabs.findIndex(t => t.id === tabId);
        newActiveId = newTabs.length > 0 ? 
          (newTabs[Math.min(currentIndex, newTabs.length - 1)]?.id || null) : null;
      }

      return {
        ...prev,
        tabs: newTabs,
        activeTabId: newActiveId,
      };
    });
  }, [state.tabs]);

  const updateTabContent = useCallback((tabId: string, content: string, modified = true) => {
    setState(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => 
        tab.id === tabId ? { ...tab, content, modified } : tab
      ),
    }));
  }, []);

  const saveTab = useCallback(async (tabId: string) => {
    const tab = state.tabs.find(t => t.id === tabId);
    if (!tab) return;

    try {
      const formData = new FormData();
      formData.append('path', tab.path);
      formData.append('content', tab.content);

      const response = await fetch('?action=save', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 'ok') {
        setState(prev => ({
          ...prev,
          tabs: prev.tabs.map(t => 
            t.id === tabId ? { ...t, modified: false } : t
          ),
        }));
        toast({
          title: "File saved",
          description: `${tab.name} saved successfully`,
        });
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [state.tabs]);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, sidebarWidth: Math.max(200, Math.min(600, width)) }));
  }, []);

  const togglePanel = useCallback((panel: PanelType) => {
    setState(prev => ({
      ...prev,
      activePanels: prev.activePanels.includes(panel)
        ? prev.activePanels.filter(p => p !== panel)
        : [...prev.activePanels, panel],
    }));
  }, []);

  const setActiveTab = useCallback((tabId: string) => {
    setState(prev => ({ ...prev, activeTabId: tabId }));
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setState(prev => ({ ...prev, commandPaletteOpen: !prev.commandPaletteOpen }));
  }, []);

  const toggleSettings = useCallback(() => {
    setState(prev => ({ ...prev, settingsOpen: !prev.settingsOpen }));
  }, []);

  return {
    state,
    actions: {
      openTab,
      closeTab,
      updateTabContent,
      saveTab,
      updateSettings,
      toggleSidebar,
      setSidebarWidth,
      togglePanel,
      setActiveTab,
      toggleCommandPalette,
      toggleSettings,
    },
  };
};

const getLanguageFromPath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    php: 'php',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    xml: 'xml',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    c: 'c_cpp',
    cpp: 'c_cpp',
    cs: 'csharp',
    go: 'golang',
    rs: 'rust',
    sql: 'sql',
    sh: 'sh',
    bash: 'sh',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
  };
  return languageMap[ext || ''] || 'text';
};