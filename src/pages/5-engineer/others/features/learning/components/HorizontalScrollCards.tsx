import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollCardsProps {
  children: React.ReactNode;
  className?: string;
  cardWidth?: string;
  gap?: string;
  cardsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

export const HorizontalScrollCards: React.FC<HorizontalScrollCardsProps> = ({
  children,
  className = '',
  cardWidth = '320px',
  gap = '1rem',
  cardsPerView = {
    mobile: 1.2,    // Show 1.2 cards on mobile (partial view of next)
    tablet: 2.2,    // Show 2.2 cards on tablet
    desktop: 3.2,   // Show 3.2 cards on desktop
    wide: 4.2       // Show 4.2 cards on wide screens
  }
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentCardsPerView, setCurrentCardsPerView] = useState(cardsPerView.desktop || 3.2);
  const [dynamicCardWidth, setDynamicCardWidth] = useState(cardWidth);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // Show left arrow if not at the beginning
      setShowLeftArrow(scrollLeft > 10);
      
      // Show right arrow if not at the end
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = parseInt(dynamicCardWidth) + parseInt(gap);
      scrollContainerRef.current.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = parseInt(dynamicCardWidth) + parseInt(gap);
      scrollContainerRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // Calculate responsive card width and cards per view
  const calculateResponsiveLayout = () => {
    const width = window.innerWidth;
    let cardsPerViewValue = cardsPerView.desktop || 3.2;
    
    if (width >= 1536) { // 2xl
      cardsPerViewValue = cardsPerView.wide || 4.2;
    } else if (width >= 1280) { // xl
      cardsPerViewValue = cardsPerView.desktop || 3.2;
    } else if (width >= 1024) { // lg
      cardsPerViewValue = cardsPerView.desktop || 3.2;
    } else if (width >= 768) { // md
      cardsPerViewValue = cardsPerView.tablet || 2.2;
    } else { // sm and below
      cardsPerViewValue = cardsPerView.mobile || 1.2;
    }

    // Calculate dynamic card width based on container width and cards per view
    const containerWidth = scrollContainerRef.current?.clientWidth || width;
    const gapPixels = parseInt(gap) || 16;
    const totalGaps = (cardsPerViewValue - 1) * gapPixels;
    const availableWidth = containerWidth - totalGaps - 32; // 32px for padding
    const calculatedCardWidth = Math.floor(availableWidth / cardsPerViewValue);
    
    setCurrentCardsPerView(cardsPerViewValue);
    setDynamicCardWidth(`${calculatedCardWidth}px`);
  };

  useEffect(() => {
    // Calculate responsive layout on mount
    calculateResponsiveLayout();
    
    // Check initial scroll position
    handleScroll();
    
    // Add scroll event listener to the container
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      calculateResponsiveLayout();
      // Recheck scrollability after resize
      setTimeout(handleScroll, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardsPerView]);

  // Check if we need arrows on mount and when children change
  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowRightArrow(scrollWidth > clientWidth);
      }
    };

    // Check after a short delay to ensure layout is complete
    const timeoutId = setTimeout(checkScrollability, 100);
    return () => clearTimeout(timeoutId);
  }, [children, dynamicCardWidth]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg border-border/50 hover:bg-background/95"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="horizontal-scroll-container flex gap-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          gap: gap,
        }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              width: dynamicCardWidth 
            } as any);
          }
          return child;
        })}
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg border-border/50 hover:bg-background/95"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
