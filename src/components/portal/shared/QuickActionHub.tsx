/**
 * Quick Action Hub Component
 * 
 * Horizontal scrolling quick action buttons with navigation arrows.
 * Supports snap scrolling and responsive layout.
 * 
 * Follows design system: h-8 buttons, text-xs, gap-2, scroll behavior.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo, useState, useRef, useEffect } from 'react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Quick action item
 */
export interface QuickActionItem {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * Action label
   */
  label: string;
  
  /**
   * Lucide icon
   */
  icon: LucideIcon;
  
  /**
   * Navigation path or click handler
   */
  path?: string;
  onClick?: () => void;
  
  /**
   * Icon color (CSS variable)
   */
  iconColor?: string;
}

/**
 * Quick Action Hub Props
 */
export interface QuickActionHubProps {
  /**
   * Array of quick actions
   */
  actions: QuickActionItem[];
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Quick Action Hub Component
 * 
 * Horizontal scrolling action buttons with arrow navigation.
 * 
 * @example
 * ```tsx
 * <QuickActionHub
 *   actions={[
 *     { id: '1', label: 'New Project', icon: Plus, path: '/projects/new' },
 *     { id: '2', label: 'Upload', icon: Upload, onClick: handleUpload },
 *   ]}
 * />
 * ```
 */
export const QuickActionHub = memo(function QuickActionHub({
  actions,
  className = '',
}: QuickActionHubProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const navigate = useNavigate();
  
  // Check scroll position to show/hide arrows
  const updateArrowVisibility = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };
  
  useEffect(() => {
    updateArrowVisibility();
    const scrollElement = scrollRef.current;
    
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateArrowVisibility);
      window.addEventListener('resize', updateArrowVisibility);
      
      return () => {
        scrollElement.removeEventListener('scroll', updateArrowVisibility);
        window.removeEventListener('resize', updateArrowVisibility);
      };
    }
  }, [actions]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };
  
  const handleActionClick = (action: QuickActionItem) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-2 whitespace-nowrap shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => handleActionClick(action)}
            >
              <div 
                className="h-4 w-4 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: action.iconColor || 'hsl(var(--primary))' }}
              >
                <Icon className="h-3 w-3 text-white" />
              </div>
              <span>{action.label}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 flex items-center justify-center hover:bg-background transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 flex items-center justify-center hover:bg-background transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

