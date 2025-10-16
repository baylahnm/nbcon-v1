import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import XScroll from '../../../../../1-HomePage/others/components/ui/x-scroll';
import {
  Briefcase, Users, MapPin, MessageSquare, Calendar, FileText,
  DollarSign, Settings, Zap, ChevronLeft, ChevronRight, Plus, 
  ChevronUp, ChevronDown, Search, Building2
} from 'lucide-react';

interface ClientQuickActionsHubProps {
  userRole?: string;
}

export function ClientQuickActionsHub({ userRole = 'client' }: ClientQuickActionsHubProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Quick action items for client
  const clientActions = [
    { id: 'post-job', label: 'Post New Job', icon: Briefcase, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/job/new' },
    { id: 'browse', label: 'Find Engineers', icon: Users, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/browse' },
    { id: 'projects', label: 'My Projects', icon: Building2, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/myprojects' },
    { id: 'quotes', label: 'View Quotes', icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/quotes' },
    { id: 'payments', label: 'Finance', icon: DollarSign, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/finance' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/messages' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/calendar' },
    { id: 'tracking', label: 'Track Progress', icon: MapPin, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/myprojects' },
    { id: 'search', label: 'Search Jobs', icon: Search, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/jobs' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/free/settings' },
  ];

  // Handle scroll event to update arrow visibility
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll to next/previous actions
  const scrollToActions = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const actionWidth = 100 + 16; // action width + gap
    const scrollAmount = direction === 'left' ? -actionWidth : actionWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      <Card className="bg-transparent border-0 gap-0">
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Quick Actions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Common tasks and shortcuts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">{clientActions.length}</Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="py-5 px-0 bg-background rounded-b-xl">
            <div className="relative">
              {/* Left fade/blur effect */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              
              {/* Right fade/blur effect */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              {/* Left Arrow */}
              {showLeftArrow && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/98 backdrop-blur-md shadow-lg border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  onClick={() => scrollToActions('left')}
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </Button>
              )}

              {/* Right Arrow */}
              {showRightArrow && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/98 backdrop-blur-md shadow-lg border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  onClick={() => scrollToActions('right')}
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </Button>
              )}

              <XScroll>
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-4 pt-4 px-5 pb-4"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                  }}
                >
                  {clientActions.map((action) => (
                    <Link
                      key={action.id}
                      to={action.to}
                      className="min-w-[100px] shrink-0 snap-start"
                    >
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-auto min-w-[100px] p-3 flex flex-col items-center gap-2 bg-background hover:bg-background hover:scale-105 transition-transform"
                      >
                        <div className={`${action.bgColor} h-[30px] w-[30px] flex items-center justify-center rounded-lg ring-1 ${action.ringColor} transition-transform`}>
                          <action.icon className={`h-4 w-4 ${action.color}`} />
                        </div>
                        <span className="text-xs font-medium text-foreground leading-tight">
                          {action.label}
                        </span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </XScroll>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default ClientQuickActionsHub;

