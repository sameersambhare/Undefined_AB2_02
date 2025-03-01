'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FiCornerRightDown } from 'react-icons/fi';

interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
  library?: 'shadcn' | 'mui' | 'antd';
}

interface ResizableComponentProps {
  children: React.ReactNode;
  component: DroppedComponent;
  isSelected: boolean;
  isPreviewMode: boolean;
  onResize: (id: string, width: string, height: string) => void;
}

const ResizableComponent: React.FC<ResizableComponentProps> = ({
  children,
  component,
  isSelected,
  isPreviewMode,
  onResize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  // Handle resize start for mouse
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setStartSize({ width, height });
      setStartPos({ x: e.clientX, y: e.clientY });
      setIsResizing(true);
    }
  };

  // Handle touch resize start
  const handleTouchResizeStart = (e: React.TouchEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setStartSize({ width, height });
      setStartPos({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
      setIsResizing(true);
    }
  };

  // Handle resize move (shared logic for both mouse and touch)
  const handleResizeMove = (clientX: number, clientY: number) => {
    if (!isResizing) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    
    let newWidth = Math.max(20, startSize.width + deltaX);
    let newHeight = Math.max(20, startSize.height + deltaY);
    
    // Maintain aspect ratio for Circle
    if (component.type === 'Circle') {
      newHeight = newWidth;
    }
    
    // Special case for Line component
    if (component.type === 'Line') {
      newHeight = 0;
    }
    
    // Update component size
    onResize(component.id, `${newWidth}px`, `${newHeight}px`);
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    handleResizeMove(e.clientX, e.clientY);
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing) return;
    e.preventDefault(); // Prevent scrolling while resizing
    handleResizeMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Handle resize end (for both mouse and touch)
  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleResizeEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, startPos, startSize]);

  return (
    <div 
      ref={containerRef}
      className="relative"
    >
      {children}
      
      {/* Resize handle - only show when selected and not in preview mode */}
      {isSelected && !isPreviewMode && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-sm shadow-sm z-10 touch-none"
          onMouseDown={handleResizeStart}
          onTouchStart={handleTouchResizeStart}
          title="Resize"
        >
          <FiCornerRightDown className="w-3 h-3 text-orange-500" />
        </div>
      )}
    </div>
  );
};

export default ResizableComponent; 