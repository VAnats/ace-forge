import React, { useEffect, useRef, useCallback } from 'react';
import AceEditorReact from 'react-ace';
import { EditorState } from '../types';

// Import modes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-text';

// Import themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/theme-cobalt';

// Import extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-code_lens';
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';
import 'ace-builds/src-noconflict/ext-emmet';
import 'ace-builds/src-noconflict/ext-error_marker';
import 'ace-builds/src-noconflict/ext-keybinding_menu';
import 'ace-builds/src-noconflict/ext-linking';
import 'ace-builds/src-noconflict/ext-modelist';
import 'ace-builds/src-noconflict/ext-options';
import 'ace-builds/src-noconflict/ext-prompt';
import 'ace-builds/src-noconflict/ext-rtl';
import 'ace-builds/src-noconflict/ext-spellcheck';
import 'ace-builds/src-noconflict/ext-split';
import 'ace-builds/src-noconflict/ext-static_highlight';
import 'ace-builds/src-noconflict/ext-statusbar';
import 'ace-builds/src-noconflict/ext-textarea';
import 'ace-builds/src-noconflict/ext-themelist';
import 'ace-builds/src-noconflict/ext-whitespace';

// Import key bindings
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-emacs';

interface AceEditorProps {
  state: EditorState;
  onContentChange: (tabId: string, content: string) => void;
  onCursorChange: (position: { row: number; column: number }) => void;
  onSelectionChange: (range: { start: number; end: number }) => void;
  className?: string;
}

export const AceEditor: React.FC<AceEditorProps> = ({
  state,
  onContentChange,
  onCursorChange,
  onSelectionChange,
  className,
}) => {
  const editorRef = useRef<AceEditorReact>(null);
  const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);

  const handleChange = useCallback((value: string) => {
    if (activeTab) {
      onContentChange(activeTab.id, value);
    }
  }, [activeTab, onContentChange]);

  const handleCursorChange = useCallback((selection: any) => {
    const cursor = selection.getCursor();
    onCursorChange({ row: cursor.row, column: cursor.column });
  }, [onCursorChange]);

  const handleSelectionChange = useCallback((selection: any) => {
    const range = selection.getRange();
    const start = selection.session.doc.positionToIndex(range.start);
    const end = selection.session.doc.positionToIndex(range.end);
    onSelectionChange({ start, end });
  }, [onSelectionChange]);

  // Setup keyboard shortcuts
  useEffect(() => {
    if (!editorRef.current?.editor) return;

    const editor = editorRef.current.editor;
    
    // Add custom commands
    editor.commands.addCommand({
      name: 'saveFile',
      bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
      exec: () => {
        // This would be handled by parent component
        const event = new CustomEvent('ace-save', { detail: activeTab?.id });
        window.dispatchEvent(event);
      }
    });

    editor.commands.addCommand({
      name: 'openFile',
      bindKey: { win: 'Ctrl-O', mac: 'Cmd-O' },
      exec: () => {
        const event = new CustomEvent('ace-open');
        window.dispatchEvent(event);
      }
    });

    editor.commands.addCommand({
      name: 'newFile',
      bindKey: { win: 'Ctrl-N', mac: 'Cmd-N' },
      exec: () => {
        const event = new CustomEvent('ace-new');
        window.dispatchEvent(event);
      }
    });

    editor.commands.addCommand({
      name: 'commandPalette',
      bindKey: { win: 'Ctrl-Shift-P', mac: 'Cmd-Shift-P' },
      exec: () => {
        const event = new CustomEvent('ace-command-palette');
        window.dispatchEvent(event);
      }
    });

    editor.commands.addCommand({
      name: 'duplicateLine',
      bindKey: { win: 'Ctrl-Shift-D', mac: 'Cmd-Shift-D' },
      exec: (editor: any) => {
        editor.duplicateSelection();
      }
    });

    editor.commands.addCommand({
      name: 'deleteLine',
      bindKey: { win: 'Ctrl-Shift-K', mac: 'Cmd-Shift-K' },
      exec: (editor: any) => {
        editor.removeLines();
      }
    });

    editor.commands.addCommand({
      name: 'moveLinesUp',
      bindKey: { win: 'Alt-Up', mac: 'Alt-Up' },
      exec: (editor: any) => {
        editor.moveLinesUp();
      }
    });

    editor.commands.addCommand({
      name: 'moveLinesDown',
      bindKey: { win: 'Alt-Down', mac: 'Alt-Down' },
      exec: (editor: any) => {
        editor.moveLinesDown();
      }
    });

    editor.commands.addCommand({
      name: 'toggleComment',
      bindKey: { win: 'Ctrl-/', mac: 'Cmd-/' },
      exec: (editor: any) => {
        editor.toggleCommentLines();
      }
    });

    editor.commands.addCommand({
      name: 'blockComment',
      bindKey: { win: 'Ctrl-Shift-/', mac: 'Cmd-Shift-/' },
      exec: (editor: any) => {
        editor.toggleBlockComment();
      }
    });

    // Multi-cursor support
    editor.commands.addCommand({
      name: 'addCursorAbove',
      bindKey: { win: 'Ctrl-Alt-Up', mac: 'Cmd-Alt-Up' },
      exec: (editor: any) => {
        editor.selectMoreLines(-1);
      }
    });

    editor.commands.addCommand({
      name: 'addCursorBelow',
      bindKey: { win: 'Ctrl-Alt-Down', mac: 'Cmd-Alt-Down' },
      exec: (editor: any) => {
        editor.selectMoreLines(1);
      }
    });

    editor.commands.addCommand({
      name: 'selectAllOccurrences',
      bindKey: { win: 'Ctrl-Shift-L', mac: 'Cmd-Shift-L' },
      exec: (editor: any) => {
        editor.selectAll();
      }
    });

  }, [activeTab]);

  // Get keyboard handler based on settings
  const getKeyboardHandler = () => {
    if (state.settings.vim) return 'ace/keyboard/vim';
    if (state.settings.emacs) return 'ace/keyboard/emacs';
    return '';
  };

  if (!activeTab) {
    return (
      <div className={`flex items-center justify-center h-full bg-background text-muted-foreground ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Open a file from the explorer or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <AceEditorReact
        ref={editorRef}
        mode={`ace/mode/${activeTab.language}`}
        theme={state.settings.theme}
        value={activeTab.content}
        onChange={handleChange}
        onSelectionChange={handleSelectionChange}
        onCursorChange={handleCursorChange}
        name={`ace-editor-${activeTab.id}`}
        width="100%"
        height="100%"
        fontSize={state.settings.fontSize}
        showPrintMargin={state.settings.showPrintMargin}
        showGutter={state.settings.showGutter}
        highlightActiveLine={state.settings.highlightActiveLine}
        wrapEnabled={state.settings.wordWrap}
        tabSize={state.settings.tabSize}
        keyboardHandler={getKeyboardHandler()}
        setOptions={{
          enableBasicAutocompletion: state.settings.enableBasicAutocompletion,
          enableLiveAutocompletion: state.settings.enableLiveAutocompletion,
          enableSnippets: state.settings.enableSnippets,
          showInvisibles: state.settings.showInvisibles,
          displayIndentGuides: true,
          showFoldWidgets: true,
          foldStyle: 'markbegin',
          enableMultiselect: true,
          behavioursEnabled: true,
          enableEmmet: true,
          useElasticTabstops: false,
          useSoftTabs: true,
          navigateWithinSoftTabs: true,
          enableBlockSelect: true,
        }}
        editorProps={{
          $blockScrolling: Infinity,
        }}
        style={{
          background: 'hsl(var(--editor-background))',
          color: 'hsl(var(--editor-foreground))',
        }}
      />
    </div>
  );
};