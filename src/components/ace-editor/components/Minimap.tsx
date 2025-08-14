import React, { useEffect, useRef } from 'react';

interface MinimapProps {
  content: string;
  currentLine: number;
  totalLines: number;
  onLineClick: (line: number) => void;
  visible: boolean;
}

export const Minimap: React.FC<MinimapProps> = ({
  content,
  currentLine,
  totalLines,
  onLineClick,
  visible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;

    // Set canvas size
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Clear canvas
    ctx.fillStyle = 'hsl(var(--editor-background))';
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    // Draw minimap
    const lines = content.split('\n');
    const lineHeight = Math.max(1, containerHeight / Math.max(lines.length, 1));

    lines.forEach((line, index) => {
      const y = index * lineHeight;
      
      // Draw line background for non-empty lines
      if (line.trim()) {
        ctx.fillStyle = 'hsl(var(--editor-foreground) / 0.1)';
        ctx.fillRect(0, y, containerWidth * 0.8, Math.max(1, lineHeight));
      }

      // Highlight current line
      if (index === currentLine) {
        ctx.fillStyle = 'hsl(var(--primary) / 0.3)';
        ctx.fillRect(0, y, containerWidth, Math.max(2, lineHeight));
      }

      // Draw indentation
      const indentLevel = (line.match(/^\s*/)?.[0].length || 0) / 2;
      if (indentLevel > 0) {
        ctx.fillStyle = 'hsl(var(--primary) / 0.2)';
        ctx.fillRect(0, y, Math.min(containerWidth * 0.1 * indentLevel, containerWidth * 0.3), Math.max(1, lineHeight));
      }
    });

    // Draw viewport indicator
    const viewportHeight = Math.min(containerHeight * 0.2, 40);
    const viewportY = (currentLine / Math.max(totalLines - 1, 1)) * (containerHeight - viewportHeight);
    
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, viewportY, containerWidth, viewportHeight);
    ctx.fillStyle = 'hsl(var(--primary) / 0.1)';
    ctx.fillRect(0, viewportY, containerWidth, viewportHeight);

  }, [content, currentLine, totalLines, visible]);

  const handleClick = (event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const lineNumber = Math.floor((y / rect.height) * totalLines);
    onLineClick(Math.max(0, Math.min(lineNumber, totalLines - 1)));
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="w-20 h-full bg-card border-l border-border cursor-pointer"
      onClick={handleClick}
      title="Minimap - Click to navigate"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};