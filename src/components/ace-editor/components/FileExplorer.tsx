import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronDown, File, Folder, RefreshCw, Search, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileItem } from '../types';
import { toast } from '@/hooks/use-toast';

interface FileExplorerProps {
  onFileSelect: (path: string) => void;
  currentDirectory: string;
  onDirectoryChange: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  onFileSelect,
  currentDirectory,
  onDirectoryChange,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);

  const loadFiles = useCallback(async (path: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`?action=list&path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error('Failed to load files');
      
      const data: FileItem[] = await response.json();
      setFiles(data);
      setFilteredFiles(data);
    } catch (error) {
      toast({
        title: "Error loading files",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      setFiles([]);
      setFilteredFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles(currentDirectory);
  }, [currentDirectory, loadFiles]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchQuery, files]);

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDir) {
      toggleDirectory(file.path);
      onDirectoryChange(file.path);
    } else {
      onFileSelect(file.path);
    }
  };

  const renderFileItem = (file: FileItem, depth: number = 0) => {
    const isExpanded = expandedDirs.has(file.path);
    const indentStyle = { paddingLeft: `${depth * 16 + 8}px` };

    return (
      <div key={file.path} className="select-none">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-sm text-sm transition-colors group"
          style={indentStyle}
          onClick={() => handleFileClick(file)}
        >
          {file.isDir ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 text-primary" />
            </>
          ) : (
            <>
              <div className="w-4" /> {/* Spacer for alignment */}
              <File className="h-4 w-4 text-muted-foreground" />
            </>
          )}
          <span className="truncate flex-1 group-hover:text-foreground">
            {file.name}
          </span>
          {file.size && !file.isDir && (
            <span className="text-xs text-muted-foreground hidden group-hover:inline">
              {formatFileSize(file.size)}
            </span>
          )}
        </div>
        
        {file.isDir && isExpanded && (
          <DirectoryContents 
            path={file.path} 
            depth={depth + 1} 
            onFileSelect={onFileSelect}
            onDirectoryChange={onDirectoryChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => loadFiles(currentDirectory)}
              disabled={loading}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background border-border"
          />
        </div>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              {searchQuery ? 'No files match your search' : 'No files found'}
            </div>
          ) : (
            filteredFiles.map(file => renderFileItem(file))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// Component for loading directory contents dynamically
const DirectoryContents: React.FC<{
  path: string;
  depth: number;
  onFileSelect: (path: string) => void;
  onDirectoryChange: (path: string) => void;
}> = ({ path, depth, onFileSelect, onDirectoryChange }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDirFiles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`?action=list&path=${encodeURIComponent(path)}`);
        if (!response.ok) throw new Error('Failed to load directory');
        
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error loading directory:', error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadDirFiles();
  }, [path]);

  if (loading) {
    return (
      <div className="py-1 px-4 text-xs text-muted-foreground" style={{ paddingLeft: `${depth * 16 + 24}px` }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {files.map(file => {
        const isExpanded = false; // You'd manage this state in parent
        const indentStyle = { paddingLeft: `${depth * 16 + 8}px` };

        return (
          <div key={file.path}>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-sm text-sm transition-colors group"
              style={indentStyle}
              onClick={() => {
                if (file.isDir) {
                  onDirectoryChange(file.path);
                } else {
                  onFileSelect(file.path);
                }
              }}
            >
              {file.isDir ? (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Folder className="h-4 w-4 text-primary" />
                </>
              ) : (
                <>
                  <div className="w-4" />
                  <File className="h-4 w-4 text-muted-foreground" />
                </>
              )}
              <span className="truncate flex-1 group-hover:text-foreground">
                {file.name}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)}${units[unitIndex]}`;
};