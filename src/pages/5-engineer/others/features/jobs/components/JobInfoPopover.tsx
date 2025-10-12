import { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../1-HomePage/others/components/ui/popover';

interface JobInfoPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  type: 'match' | 'earnings' | 'skills' | 'similar';
}

export function JobInfoPopover({ trigger, content, type }: JobInfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMode, setOpenMode] = useState<'click' | 'hover' | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Clear any pending timeouts
  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Handle mouse enter on trigger
  const handleMouseEnter = () => {
    clearHoverTimeout();
    // Only open on hover if not already open via click
    if (openMode !== 'click') {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        setOpenMode('hover');
      }, 300); // 300ms delay before showing
    }
  };

  // Handle mouse leave from trigger
  const handleMouseLeave = () => {
    clearHoverTimeout();
    // Only close if opened via hover
    if (openMode === 'hover') {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setOpenMode(null);
      }, 200); // 200ms delay before hiding
    }
  };

  // Handle click on trigger
  const handleClick = () => {
    if (openMode === 'click' && isOpen) {
      // Close if already open via click
      setIsOpen(false);
      setOpenMode(null);
    } else {
      // Open via click (persistent)
      clearHoverTimeout();
      setIsOpen(true);
      setOpenMode('click');
    }
  };

  // Handle mouse enter on popover content
  const handleContentMouseEnter = () => {
    clearHoverTimeout();
  };

  // Handle mouse leave from popover content
  const handleContentMouseLeave = () => {
    if (openMode === 'hover') {
      setIsOpen(false);
      setOpenMode(null);
    }
  };

  // Handle open change (for outside clicks)
  const handleOpenChange = (open: boolean) => {
    if (!open && openMode === 'click') {
      setIsOpen(false);
      setOpenMode(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        ref={contentRef}
        className="w-80 p-0 border-border/50 shadow-xl z-50"
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={20}
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

