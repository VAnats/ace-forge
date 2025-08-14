export interface FileItem {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
  modified?: string;
}

export interface EditorTab {
  id: string;
  path: string;
  name: string;
  content: string;
  modified: boolean;
  language: string;
  cursorPosition?: { row: number; column: number };
}

export interface EditorSettings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showInvisibles: boolean;
  showGutter: boolean;
  showPrintMargin: boolean;
  highlightActiveLine: boolean;
  enableBasicAutocompletion: boolean;
  enableLiveAutocompletion: boolean;
  enableSnippets: boolean;
  showMinimap: boolean;
  vim: boolean;
  emacs: boolean;
}

export interface SearchOptions {
  query: string;
  replaceWith?: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  inSelection: boolean;
}

export interface CommandPaletteItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

export type PanelType = 'files' | 'search' | 'replace' | 'outline' | 'problems' | 'terminal';

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  settings: EditorSettings;
  showSidebar: boolean;
  sidebarWidth: number;
  activePanels: PanelType[];
  commandPaletteOpen: boolean;
  settingsOpen: boolean;
  currentDirectory: string;
  recentFiles: string[];
}