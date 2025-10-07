/**
 * Enhanced draggable hook using Option type for better error handling
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Option } from '@/lib/Option';

interface Position {
  x: number;
  y: number;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  bounds?: 'window' | 'parent' | Bounds | null;
  disabled?: boolean;
}

interface UseDraggableReturn {
  position: Position;
  isDragging: boolean;
  dragRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  // New Option-based methods
  getPosition: () => Option<Position>;
  setPosition: (position: Position) => Option<Position>;
  getBounds: () => Option<Bounds>;
  isValidPosition: (position: Position) => boolean;
}

export const useDraggableWithOption = (options: UseDraggableOptions = {}): UseDraggableReturn => {
  const { initialPosition = { x: 0, y: 0 }, bounds = 'window', disabled = false } = options;
  
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Calculate bounds using Option
  const calculateBounds = useCallback((): Option<Bounds> => {
    if (bounds === null) return Option.empty();
    
    if (bounds === 'window') {
      return Option.of({
        minX: 0,
        minY: 0,
        maxX: window.innerWidth,
        maxY: window.innerHeight
      });
    }
    
    if (bounds === 'parent') {
      return Option.ofNullable(dragRef.current?.parentElement)
        .map(parent => {
          const rect = parent.getBoundingClientRect();
          return {
            minX: rect.left,
            minY: rect.top,
            maxX: rect.right,
            maxY: rect.bottom
          };
        });
    }
    
    return Option.of(bounds);
  }, [bounds]);

  // Validate position using Option
  const isValidPosition = useCallback((pos: Position): boolean => {
    return calculateBounds()
      .map(bounds => {
        const elementBounds = Option.ofNullable(dragRef.current)
          .map(el => el.getBoundingClientRect())
          .orElse({ width: 0, height: 0 });
        
        return pos.x >= bounds.minX && 
               pos.y >= bounds.minY &&
               pos.x + elementBounds.width <= bounds.maxX &&
               pos.y + elementBounds.height <= bounds.maxY;
      })
      .orElse(true);
  }, [calculateBounds]);

  // Safe position setting with Option
  const setPositionSafe = useCallback((newPosition: Position): Option<Position> => {
    if (!isValidPosition(newPosition)) {
      return Option.empty();
    }
    
    setPosition(newPosition);
    return Option.of(newPosition);
  }, [isValidPosition]);

  const startDrag = useCallback((clientX: number, clientY: number): Option<void> => {
    if (disabled) return Option.empty();
    
    return Option.ofNullable(dragRef.current)
      .map(rect => {
        const bounds = rect.getBoundingClientRect();
        setDragOffset({
          x: clientX - bounds.left,
          y: clientY - bounds.top
        });
        setIsDragging(true);
        return undefined;
      });
  }, [disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button') || target.closest('input') || target.closest('textarea');
    
    if (isClickableElement) return;
    
    startDrag(e.clientX, e.clientY)
      .ifPresent(() => {
        e.preventDefault();
        e.stopPropagation();
      });
  }, [disabled, startDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button') || target.closest('input') || target.closest('textarea');
    
    if (isClickableElement) return;
    
    Option.ofNullable(e.touches[0])
      .map(touch => startDrag(touch.clientX, touch.clientY))
      .filter(Option.isSome)
      .ifPresent(() => {
        e.preventDefault();
        e.stopPropagation();
      });
  }, [disabled, startDrag]);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const newPosition = {
      x: clientX - dragOffset.x,
      y: clientY - dragOffset.y
    };

    // Apply bounds using Option
    calculateBounds()
      .map(bounds => {
        const elementBounds = Option.ofNullable(dragRef.current)
          .map(el => el.getBoundingClientRect())
          .orElse({ width: 0, height: 0 });
        
        return {
          x: Math.max(bounds.minX, Math.min(newPosition.x, bounds.maxX - elementBounds.width)),
          y: Math.max(bounds.minY, Math.min(newPosition.y, bounds.maxY - elementBounds.height))
        };
      })
      .orElse(newPosition)
      .ifPresent(setPosition);
  }, [isDragging, dragOffset, calculateBounds]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    Option.ofNullable(e.touches[0])
      .ifPresent(touch => updatePosition(touch.clientX, touch.clientY));
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
    handleTouchStart,
    // New Option-based methods
    getPosition: () => Option.of(position),
    setPosition: setPositionSafe,
    getBounds: calculateBounds,
    isValidPosition
  };
};
