import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import XScroll from '../../../../../1-HomePage/others/components/ui/x-scroll';
import {
  Briefcase, MapPin, Upload, MessageSquare, Calendar, User,
  FileText, DollarSign, Bell, ClipboardList, Zap, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';

interface QuickActionsHubProps {
  userRole?: string;
}

export function QuickActionsHub({ userRole = 'engineer' }: QuickActionsHubProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Quick action items for engineer
  const engineerActions = [
    { id: 'quote', label: 'Create Quote', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-500/10', ringColor: 'ring-blue-500/20', to: '/engineer/quotes/new' },
    { id: 'report', label: 'New Inspection', icon: ClipboardList, color: 'text-green-600', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/20', to: '/engineer/reports/new' },
    { id: 'deliverable', label: 'Upload Deliverable', icon: Upload, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20', to: '/engineer/job/upload' },
    { id: 'invoice', label: 'Send Invoice', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', ringColor: 'ring-emerald-500/20', to: '/engineer/finance' },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-500/10', ringColor: 'ring-purple-500/20', to: '/engineer/jobs' },
    { id: 'checkin', label: 'Check-In', icon: MapPin, color: 'text-amber-600', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/20', to: '/engineer/checkin' },
    { id: 'upload', label: 'Upload Files', icon: Upload, color: 'text-pink-600', bgColor: 'bg-pink-500/10', ringColor: 'ring-pink-500/20', to: '/engineer/job/upload' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-cyan-600', bgColor: 'bg-cyan-500/10', ringColor: 'ring-cyan-500/20', to: '/engineer/messages' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-500/10', ringColor: 'ring-indigo-500/20', to: '/engineer/calendar' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-orange-600', bgColor: 'bg-orange-500/10', ringColor: 'ring-orange-500/20', to: '/engineer/profile' },
    { id: 'alerts', label: 'Alerts', icon: Bell, color: 'text-red-600', bgColor: 'bg-red-500/10', ringColor: 'ring-red-500/20', to: '/engineer/notifications' },
    { id: 'more', label: 'More', icon: Plus, color: 'text-gray-600', bgColor: 'bg-gray-500/10', ringColor: 'ring-gray-500/20', to: '/engineer/settings' },
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40">
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
          <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">{engineerActions.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="relative">
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
              className="flex gap-4 pt-1 px-1 pb-4"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
              }}
            >
              {engineerActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.to}
                  className="min-w-[100px] shrink-0 snap-start"
                >
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-auto min-w-[100px] p-3 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50"
                  >
                    <div className={`${action.bgColor} h-[30px] w-[30px] flex items-center justify-center rounded-lg ring-1 ${action.ringColor} transition-transform group-hover:scale-110`}>
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
    </Card>
  );
}

