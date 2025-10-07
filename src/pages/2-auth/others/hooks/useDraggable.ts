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
  handleTouchStart: (e: React.TouchEvent) => void;
}

export const useDraggable = (options: UseDraggableOptions = {}): UseDraggableReturn => {
  const { initialPosition = { x: 0, y: 0 }, bounds = 'window', disabled = false } = options;
  
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (disabled || !dragRef.current) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    setIsDragging(true);
  }, [disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button') || target.closest('input') || target.closest('textarea');
    
    // Don't start dragging if clicking on interactive elements
    if (isClickableElement) return;
    
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
  }, [disabled, startDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button') || target.closest('input') || target.closest('textarea');
    
    // Don't start dragging if touching interactive elements
    if (isClickableElement) return;
    
    const touch = e.touches[0];
    if (touch) {
      startDrag(touch.clientX, touch.clientY);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [disabled, startDrag]);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    let newX = clientX - dragOffset.x;
    let newY = clientY - dragOffset.y;

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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      updatePosition(touch.clientX, touch.clientY);
    }
  }, [updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    position,
    isDragging,
    dragRef,
    handleMouseDown,
    handleTouchStart
  };
};
