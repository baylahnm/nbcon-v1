import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import CalendarContent from './CalendarContent';
import CalendarMini from '@/components/calendar/CalendarMini';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import CreateEventDialog from '@/components/calendar/CreateEventDialog';
import { useCalendarStore, CalendarView, UserRole } from '@/stores/useCalendarStore';
import { useThemeStore } from '@/stores/theme';
import { useToast } from '@/components/ui/use-toast';

export default function CalendarPage() {
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

  const handleEventSelect = (event: any) => {
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

  const handleCreateEvent = async (eventData: any) => {
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

  const exportICS = () => {
    try {
      const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//nbcon//Calendar//EN'
      ];
      events.forEach((evt: any, idx: number) => {
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </h1>
            <p className="text-muted-foreground">Manage your engineering projects and milestones</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-2">
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
          </div>
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
                placeholder="Search projects, clients, locations..."
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
                <SelectItem value="mine">My Items</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="company">Company</SelectItem>
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
          <CalendarContent />
        </div>
        
        {/* Right Sidebar - Mini Calendar */}
        <div 
          className="w-80 p-6 overflow-y-auto border-l"
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
    </div>
  );
}
