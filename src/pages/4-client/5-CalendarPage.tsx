import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/pages/1-HomePage/others/components/ui/dialog';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Switch } from '@/pages/1-HomePage/others/components/ui/switch';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/pages/1-HomePage/others/components/ui/select';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Download,
  Globe,
  Plus
} from 'lucide-react';
import CalendarContent from '../calendar/CalendarContent';
import CalendarMini from '@/components/calendar/CalendarMini';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import CreateEventDialog from '@/components/calendar/CreateEventDialog';
import { useCalendarStore, CalendarView, UserRole } from "./others/stores/useCalendarStore";
import type { CalendarEvent } from "./others/stores/useCalendarStore";
import { useTeamStore } from '@/hooks/useTeamStore';
import { useThemeStore } from "./others/stores/theme";
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';

export default function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getProjectsWithDetails } = useTeamStore();
  const projectOptions = getProjectsWithDetails().map(project => ({ id: project.id, name: project.name }));

  const { 
    showFilters, 
    setShowFilters,
    currentDate,
    setCurrentDate,
    events,
    isHijri,
    userRole,
    setSelectedEvent,
    view,
    setView,
    setUserRole,
    setIsHijri,
    updateFilters,
    addEvent
  } = useCalendarStore();

  const { applied: themeTokens } = useThemeStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(() => searchParams.get('project') ?? 'all');

  // Mobile toolbar horizontal scroll controls
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;

    const updateArrows = () => {
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollWidth - el.clientWidth - el.scrollLeft <= 1;
      setIsAtStart(atStart);
      setIsAtEnd(atEnd);
    };

    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows as EventListener);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  const scrollToSnap = (direction: 'left' | 'right') => {
    const container = toolbarRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const currentLeft = container.scrollLeft;
    const getChildLeft = (el: HTMLElement) => el.offsetLeft;

    if (direction === 'right') {
      const next = children.find((child) => getChildLeft(child) > currentLeft + 1);
      (next ?? children[children.length - 1]).scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    } else {
      // left
      const prevCandidates = children.filter((child) => getChildLeft(child) < currentLeft - 1);
      const prev = prevCandidates.length ? prevCandidates[prevCandidates.length - 1] : children[0];
      prev.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  useEffect(() => {
    const projectParam = searchParams.get('project');

    if (projectParam) {
      if (selectedProjectId !== projectParam) {
        setSelectedProjectId(projectParam);
      }
      updateFilters({ projectIds: [projectParam] });
    } else {
      if (selectedProjectId !== 'all') {
        setSelectedProjectId('all');
      }
      updateFilters({ projectIds: [] });
    }
  }, [searchParams, selectedProjectId, updateFilters]);

  // Debounce search updates to filters
  useEffect(() => {
    const t = setTimeout(() => {
      updateFilters({ searchTerm });
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, updateFilters]);

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const step = direction === 'prev' ? -1 : 1;
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + step);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + step * 7);
    } else {
      // day and agenda
      newDate.setDate(newDate.getDate() + step);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ searchTerm: value });
  };

  const handleProjectSelect = (value: string) => {
    setSelectedProjectId(value);
    const nextParams = new URLSearchParams(searchParams);

    if (value === 'all') {
      updateFilters({ projectIds: [] });
      nextParams.delete('project');
    } else {
      updateFilters({ projectIds: [value] });
      nextParams.set('project', value);
    }

    setSearchParams(nextParams);
  };

  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      // optimistic add to local store
      addEvent(eventData);
      setShowCreateDialog(false);
      toast({ title: 'Event created', description: 'Your event has been added to the calendar.' });
      // TODO: persist to backend here and handle errors/rollback if needed
    } catch (e) {
      toast({ title: 'Failed to create event', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDoubleClickCreateEvent = (date: Date, time?: string) => {
    if (date) {
      // Set the initial date and time for the event
      const eventDate = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
      }
      setCurrentDate(eventDate);
    }
    setShowCreateDialog(true);
  };

  const exportICS = () => {
    try {
      const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//nbcon//Calendar//EN'
      ];
      events.forEach((evt, idx) => {
        const uid = `nbcon-${idx}-${Date.now()}@nbcon`;
        const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const toICS = (d: Date) => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${dtStamp}`);
        lines.push(`DTSTART:${toICS(evt.startTime)}`);
        lines.push(`DTEND:${toICS(evt.endTime)}`);
        lines.push(`SUMMARY:${(evt.title || '').replace(/\n/g, ' ')}`);
        if (evt.location) lines.push(`LOCATION:${String(evt.location).replace(/\n/g, ' ')}`);
        if (evt.description) lines.push(`DESCRIPTION:${String(evt.description).replace(/\n/g, ' ')}`);
        lines.push('END:VEVENT');
      });
      lines.push('END:VCALENDAR');
      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nbcon-calendar.ics';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Downloaded nbcon-calendar.ics' });
    } catch {
      toast({ title: 'Export failed', description: 'Could not generate ICS file.', variant: 'destructive' });
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{
        backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
      }}
    >
      {/* Header Section */}
      <div 
        className="p-6 mb-4 border-b"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Project Calendar
            </h1>
            <p className="text-muted-foreground">Manage your project timelines and milestones</p>
          </div>
        </div>
        
        <div className="flex items-center sm:justify-between mt-4 mb-4">
          {/* Mobile left arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`sm:hidden mr-2 ${isAtStart ? 'invisible' : 'visible'}`}
            aria-label="Scroll left"
            onClick={() => scrollToSnap('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div ref={toolbarRef} className="flex items-center overflow-x-auto snap-x snap-mandatory flex-nowrap gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1">
          <div className="flex items-center gap-4 shrink-0 snap-start">
            <div className="text-lg font-medium">
              {formatDate(currentDate)}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')} aria-label={`Previous ${view}`}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday} aria-label="Go to today">
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')} aria-label={`Next ${view}`}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 snap-start">
            <div className="flex items-center gap-2">
              <Switch id="hijri-switch" checked={isHijri} onCheckedChange={setIsHijri} />
              <Label htmlFor="hijri-switch" className="text-sm">Hijri</Label>
            </div>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={view} onValueChange={(value) => setView(value as CalendarView)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" aria-label="Export calendar" onClick={exportICS}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Sync calendar"
              onClick={() => toast({ title: 'Connect Calendar', description: 'Calendar sync requires connecting Google or Microsoft. Coming soon.' })}
            >
              <Globe className="h-4 w-4 mr-2" />
              Sync
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary"
              onClick={() => setShowCreateDialog(true)}
              aria-label="Create event"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
            {/* Mobile: open sidebar as dialog */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowSidebarMobile(true)}
              aria-label="Open details"
            >
              Details
            </Button>
          </div>
          </div>

          {/* Mobile right arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`sm:hidden ml-2 ${isAtEnd ? 'invisible' : 'visible'}`}
            aria-label="Scroll right"
            onClick={() => scrollToSnap('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div 
        className="p-0 border-b"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4 p-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, engineers, milestones..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="mine">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mine">My Projects</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectOptions.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="riyadh">Riyadh</SelectItem>
                <SelectItem value="jeddah">Jeddah</SelectItem>
                <SelectItem value="dammam">Dammam</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Main Area - Calendar Grid */}
        <div 
          className="flex-1 overflow-hidden"
          style={{
            backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
          }}
        >
          <CalendarContent onCreateEvent={handleDoubleClickCreateEvent} />
        </div>
        
        {/* Right Sidebar - Mini Calendar (hidden on mobile) */}
        <div 
          className="hidden lg:block w-80 p-6 overflow-y-auto border-l"
          style={{
            backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
            borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
          }}
        >
          <CalendarMini
            currentDate={currentDate}
            onDateSelect={handleDateSelect}
            events={events}
            isHijri={isHijri}
            userRole={userRole}
            onEventSelect={handleEventSelect}
          />
        </div>
      </div>
      
      {/* Filters Modal */}
      <CalendarFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
      />
      
      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleCreateEvent}
        initialDate={currentDate}
      />

      {/* Mobile Sidebar Dialog */}
      <Dialog open={showSidebarMobile} onOpenChange={setShowSidebarMobile}>
        <DialogContent position="bottom" className="sm:inset-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-md sm:rounded-lg sm:p-6 sm:-translate-x-1/2 sm:-translate-y-1/2">
          <DialogHeader className="gap-1">
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          <CalendarMini
            currentDate={currentDate}
            onDateSelect={(d) => { handleDateSelect(d); setShowSidebarMobile(false); }}
            events={events}
            isHijri={isHijri}
            userRole={userRole}
            onEventSelect={(e) => { handleEventSelect(e); setShowSidebarMobile(false); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

