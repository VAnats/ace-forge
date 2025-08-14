import React from 'react';
import { AlertCircle, CheckCircle, Info, GitBranch, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorState } from '../types';

interface StatusBarProps {
  state: EditorState;
  cursorPosition?: { row: number; column: number };
  selectionRange?: { start: number; end: number };
  onTogglePanel: (panel: string) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  state,
  cursorPosition,
  selectionRange,
  onTogglePanel,
}) => {
  const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
  const hasProblems = false; // You'd calculate this based on linter results
  const hasSelection = selectionRange && selectionRange.start !== selectionRange.end;

  return (
    <div className="h-6 bg-primary text-primary-foreground flex items-center justify-between px-3 text-xs">
      {/* Left Side - File Info */}
      <div className="flex items-center gap-4">
        {/* Git Branch */}
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>

        {/* Problems */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => onTogglePanel('problems')}
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          0 Problems
        </Button>

        {/* Auto Save Status */}
        <div className="flex items-center gap-1 text-primary-foreground/80">
          <CheckCircle className="h-3 w-3" />
          <span>Auto Save: On</span>
        </div>
      </div>

      {/* Right Side - Editor Info */}
      <div className="flex items-center gap-4">
        {/* Selection Info */}
        {hasSelection && selectionRange && (
          <span>
            {selectionRange.end - selectionRange.start} selected
          </span>
        )}

        {/* Cursor Position */}
        {cursorPosition && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
            title="Go to Line"
          >
            Ln {cursorPosition.row + 1}, Col {cursorPosition.column + 1}
          </Button>
        )}

        {/* Language Mode */}
        {activeTab && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
            title="Select Language Mode"
          >
            {activeTab.language.toUpperCase()}
          </Button>
        )}

        {/* Encoding */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
          title="Select Encoding"
        >
          UTF-8
        </Button>

        {/* End of Line */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
          title="Select End of Line Sequence"
        >
          LF
        </Button>

        {/* Tab Size */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
          title="Select Indentation"
        >
          Spaces: {state.settings.tabSize}
        </Button>

        {/* Performance */}
        <div className="flex items-center gap-1 text-primary-foreground/80">
          <Zap className="h-3 w-3" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};