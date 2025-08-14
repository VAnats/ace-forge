import React from 'react';
import { Lightbulb, Zap, Bug, PlayCircle, Download, Upload, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface QuickActionsProps {
  activeTab: any;
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ activeTab, onAction }) => {
  const handleAction = (actionType: string, message: string) => {
    onAction(actionType);
    toast({
      title: "Quick Action",
      description: message,
    });
  };

  if (!activeTab) return null;

  const isJavaScript = activeTab.language === 'javascript' || activeTab.language === 'typescript';
  const isPHP = activeTab.language === 'php';
  const isPython = activeTab.language === 'python';

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
      <div className="flex items-center gap-1">
        <Lightbulb className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">Quick Actions:</span>
      </div>

      {/* Format Code */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('format', 'Code formatted')}
        className="h-7 text-xs"
      >
        <Zap className="h-3 w-3 mr-1" />
        Format
      </Button>

      {/* Language-specific actions */}
      {isJavaScript && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('run-js', 'JavaScript executed')}
            className="h-7 text-xs"
          >
            <PlayCircle className="h-3 w-3 mr-1" />
            Run JS
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('lint', 'Code linted')}
            className="h-7 text-xs"
          >
            <Bug className="h-3 w-3 mr-1" />
            Lint
          </Button>
        </>
      )}

      {isPHP && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('run-php', 'PHP syntax checked')}
          className="h-7 text-xs"
        >
          <PlayCircle className="h-3 w-3 mr-1" />
          Check PHP
        </Button>
      )}

      {isPython && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('run-python', 'Python executed')}
          className="h-7 text-xs"
        >
          <PlayCircle className="h-3 w-3 mr-1" />
          Run Python
        </Button>
      )}

      {/* Universal actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            More Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleAction('copy-path', 'File path copied')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy File Path
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('copy-content', 'Content copied')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy All Content
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAction('download', 'File downloaded')}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('upload', 'Upload dialog opened')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload & Replace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAction('open-external', 'Opening in new tab')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};