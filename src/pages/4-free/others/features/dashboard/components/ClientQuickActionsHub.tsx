import { useRef, useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../../1-HomePage/others/components/ui/popover';
import XScroll from '../../../../../1-HomePage/others/components/ui/x-scroll';
import {
  Zap, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ClipboardCheck, Target, Columns, AirVent, MapPin, ShieldCheck, Plane, Wrench, FlaskConical
} from 'lucide-react';
import { SERVICE_MODE_CONFIG, type ServiceMode } from '../../ai/services/config';

interface ClientQuickActionsHubProps {
  userRole?: string;
}

export const ClientQuickActionsHub = memo(function ClientQuickActionsHub({ userRole = 'client' }: ClientQuickActionsHubProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Service mode agent items with specialist roles
  const agentActions = [
    { 
      mode: 'site-inspection' as ServiceMode, 
      label: 'Civil Engineer', 
      icon: ClipboardCheck, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'electrical-design' as ServiceMode, 
      label: 'Electrical Engineer', 
      icon: Zap, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'structural-analysis' as ServiceMode, 
      label: 'Structural Engineer', 
      icon: Columns, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'hvac-design' as ServiceMode, 
      label: 'Mechanical Engineer', 
      icon: AirVent, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'surveying' as ServiceMode, 
      label: 'Survey Engineer', 
      icon: MapPin, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'hse-consulting' as ServiceMode, 
      label: 'HSE Engineer', 
      icon: ShieldCheck, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'drone-surveying' as ServiceMode, 
      label: 'Drone Survey Engineer', 
      icon: Plane, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'equipment-maintenance' as ServiceMode, 
      label: 'Maintenance Engineer', 
      icon: Wrench, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
    { 
      mode: 'soil-testing' as ServiceMode, 
      label: 'Geotechnical Engineer', 
      icon: FlaskConical, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10', 
      ringColor: 'ring-primary/20' 
    },
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
      <Card className="bg-transparent border border-border/50 gap-0">
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Quick Actions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Common tasks and shortcuts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-primary-gradient text-primary-foreground border-0 shadow-sm shadow-primary/50 h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">{agentActions.length}</Badge>
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
          <CardContent className="p-4 bg-background rounded-b-xl">
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
                  {agentActions.map((action) => {
                    const config = SERVICE_MODE_CONFIG[action.mode];
                    return (
                      <Popover key={action.mode}>
                        <PopoverTrigger asChild>
                          <div className="min-w-[100px] shrink-0 snap-start">
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="h-auto min-w-[100px] p-4 flex flex-col items-center gap-4 bg-background hover:bg-background hover:scale-105 transition-transform cursor-pointer"
                            >
                              <div className={`${action.bgColor} h-[30px] w-[30px] flex items-center justify-center rounded-lg ring-1 ${action.ringColor} transition-transform`}>
                                <action.icon className={`h-4 w-4 ${action.color}`} />
                              </div>
                              <span className="text-xs font-medium text-foreground leading-tight text-center">
                                {action.label}
                              </span>
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="center" sideOffset={12} className="w-80 border border-border/40">
                          <div className="space-y-3 p-3">
                            {/* Header */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold">{action.label}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {config.summary}
                              </p>
                            </div>

                            {/* Capabilities */}
                            <div className="flex flex-wrap gap-1.5">
                              {config.tools.map((tool, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0">
                                  {tool.label}
                                </Badge>
                              ))}
                            </div>

                            {/* Workflow Stages */}
                            <div className="rounded-md border border-dashed border-muted-foreground/20 p-2.5">
                              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                                Workflow
                              </p>
                              <div className="grid gap-0.5 text-xs text-muted-foreground">
                                {config.workflow.map((stage, index) => (
                                  <div key={stage.id} className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-semibold text-primary">{index + 1}.</span>
                                    <span>{stage.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              </XScroll>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
});

export default ClientQuickActionsHub;

