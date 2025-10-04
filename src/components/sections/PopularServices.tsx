import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export const PopularServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'engineers' | 'enterprises'>('clients');
  
  // Ref for horizontal scroll container
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  // State for arrow visibility
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Function to update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    if (!cardsContainerRef.current) return;
    
    const container = cardsContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Show left arrow if not at the beginning
    setShowLeftArrow(scrollLeft > 0);
    
    // Show right arrow if not at the end (with small tolerance for floating point precision)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // useEffect for cards container scroll tracking
  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowVisibility();

    // Add scroll event listener
    container.addEventListener('scroll', updateArrowVisibility);
    
    // Add resize event listener to handle window size changes
    const handleResize = () => {
      setTimeout(updateArrowVisibility, 100); // Small delay to ensure layout has updated
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateArrowVisibility]);

  // Function to handle horizontal scrolling with arrow buttons
  const scrollCards = (direction: 'left' | 'right') => {
    if (!cardsContainerRef.current) return;
    
    const container = cardsContainerRef.current;
    const cardWidth = 324; // 300px minWidth + 24px gap
    const scrollAmount = cardWidth;
    
    if (direction === 'left') {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    // Update arrow visibility after scrolling
    setTimeout(updateArrowVisibility, 300); // Wait for smooth scroll to complete
  };

  return (
    <section id="features" className="py-16 px-6 md:py-[200px] md:px-0 bg-muted/30">
      <div className="container mx-auto px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Are We For?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">A high-performing marketplace connecting certified engineers, clients, and enterprises—with transparent pricing, milestone payments, and built-in compliance.</p>
        </div>
        
        {/* Role Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-card rounded-lg p-1 border">
            <Button 
              variant={activeTab === 'clients' ? 'default' : 'ghost'} 
              className="px-8 py-3"
              onClick={() => setActiveTab('clients')}
            >
              Clients
            </Button>
            <Button 
              variant={activeTab === 'engineers' ? 'default' : 'ghost'} 
              className="px-8 py-3"
              onClick={() => setActiveTab('engineers')}
            >
              Engineers
            </Button>
            <Button 
              variant={activeTab === 'enterprises' ? 'default' : 'ghost'} 
              className="px-8 py-3"
              onClick={() => setActiveTab('enterprises')}
            >
              Enterprises
            </Button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {/* Clients Tab Content */}
          {activeTab === 'clients' && (
            <>
              <div className="text-center mb-0 pb-3">
                <p className="text-lg text-muted-foreground">Instant access to verified engineers, transparent pricing, milestone-based payments, and quality assurance.</p>
              </div>
            
              {/* Mobile: Horizontal Scrollable Cards, Desktop: Grid */}
              <div className="relative">
                {/* Arrow Navigation - Mobile Only */}
                <div className="md:hidden flex justify-between items-center mb-4">
                  <div className="w-10">
                    {showLeftArrow && (
                      <button 
                        onClick={() => scrollCards('left')}
                        className="p-2 bg-background border border-border rounded-full hover:bg-muted transition-all duration-200 shadow-sm opacity-100"
                        aria-label="Scroll left"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Swipe or use arrows</span>
                  <div className="w-10 flex justify-end">
                    {showRightArrow && (
                      <button 
                        onClick={() => scrollCards('right')}
                        className="p-2 bg-background border border-border rounded-full hover:bg-muted transition-all duration-200 shadow-sm opacity-100"
                        aria-label="Scroll right"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Cards Container */}
                <div 
                  ref={cardsContainerRef}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none"
                  style={{
                    scrollBehavior: 'smooth'
                  }}
                >
                  {/* Browse Engineers */}
                  <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 snap-center flex-shrink-0 md:flex-shrink md:snap-none" style={{minWidth: '300px'}}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Browse Engineers</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Verified</span>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search engineers..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    {/* Placeholder content - simplified for component */}
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <p>Engineer browsing interface would go here</p>
                    </div>
                  </Card>
                  
                  {/* Additional cards would be added here */}
                </div>
              </div>
            </>
          )}

          {/* Engineers Tab Content */}
          {activeTab === 'engineers' && (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Engineers tab content would go here</p>
            </div>
          )}

          {/* Enterprises Tab Content */}
          {activeTab === 'enterprises' && (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Enterprises tab content would go here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
