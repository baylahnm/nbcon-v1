import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDraggableOptions {
  initialPosition?: { x: number; y: number };
  bounds?: 'window' | 'parent' | null;
  disabled?: boolean;
}

interface UseDraggableReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  dragRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export const useDraggable = (options: UseDraggableOptions = {}): UseDraggableReturn => {
  const { initialPosition = { x: 0, y: 0 }, bounds = 'window', disabled = false } = options;
  
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button') || target.closest('input') || target.closest('textarea');
    
    // Don't start dragging if clicking on interactive elements
    if (isClickableElement) return;
    
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Apply bounds
    if (bounds === 'window' && dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset, bounds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    position,
    isDragging,
    dragRef,
    handleMouseDown
  };
};
