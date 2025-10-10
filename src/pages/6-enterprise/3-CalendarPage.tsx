import React, { useState } from 'react';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { Switch } from '../1-HomePage/others/components/ui/switch';
import { Label } from '../1-HomePage/others/components/ui/label';
import CreateEventDialog from '../1-HomePage/others/components/calendar/CreateEventDialog';
import CalendarContent from '../1-HomePage/others/components/calendar/CreateEventDialog';
import CalendarMini from '../1-HomePage/others/components/calendar/CalendarMini';
import CalendarFilters from '../1-HomePage/others/components/calendar/CalendarFilters';
import { R, RH } from '../1-HomePage/others/lib/routes';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Globe, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
// import nasserAvatar from 'figma:asset/f2bc29563152738b3b8753fd7fa0f8faad491914.png';

type CalendarView = 'month' | 'week' | 'day' | 'agenda';
type UserRole = 'client' | 'engineer' | 'enterprise' | 'admin';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'project' | 'deadline' | 'task';
  color: string;
  participants?: string[];
  location?: string;
  description?: string;
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 25)); // September 25, 2025
  const [view, setView] = useState<CalendarView>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isHijri, setIsHijri] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('enterprise');

  // Sample events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Project Planning Discussion',
      start: new Date(2025, 8, 25, 10, 0),
      end: new Date(2025, 8, 25, 12, 0),
      type: 'meeting',
      color: 'bg-blue-500',
      participants: ['Nasser Baylah', 'Team Lead']
    },
    {
      id: '2',
      title: 'WRBM Smart City Infrastructure',
      start: new Date(2025, 8, 25, 14, 0),
      end: new Date(2025, 8, 25, 15, 0),
      type: 'project',
      color: 'bg-green-500',
      participants: ['Engineering Team']
    },
    {
      id: '3',
      title: 'Client Review Meeting',
      start: new Date(2025, 8, 25, 16, 0),
      end: new Date(2025, 8, 25, 17, 0),
      type: 'meeting',
      color: 'bg-purple-500',
      participants: ['Client', 'Project Manager']
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        if (view === 'month') {
          newDate.setMonth(prev.getMonth() - 1);
        } else if (view === 'week') {
          newDate.setDate(prev.getDate() - 7);
        } else {
          newDate.setDate(prev.getDate() - 1);
        }
      } else {
        if (view === 'month') {
          newDate.setMonth(prev.getMonth() + 1);
        } else if (view === 'week') {
          newDate.setDate(prev.getDate() + 7);
        } else {
          newDate.setDate(prev.getDate() + 1);
        }
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (date?: Date, time?: string) => {
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

  const handleSaveEvent = (eventData: any) => {
    console.log('Creating event:', eventData);
    setShowCreateDialog(false);
  };

  const exportICS = () => {
    try {
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//nbcon//enterprise-calendar//EN',
      ];
      events.forEach((e) => {
        const start = e.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const end = e.end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        lines.push(
          'BEGIN:VEVENT',
          `UID:enterprise-${e.id}@nbcon`,
          `SUMMARY:${e.title}`,
          `DTSTART:${start}`,
          `DTEND:${end}`,
          'END:VEVENT'
        );
      });
      lines.push('END:VCALENDAR');
      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enterprise-calendar.ics';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="p-6 mb-4 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
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
              onClick={() => console.log('Sync calendar')}
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
      <div className="p-0 border-b">
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
        <div className="flex-1 overflow-hidden">
          <CalendarContent onCreateEvent={handleCreateEvent} />
        </div>
        
        {/* Right Sidebar - Mini Calendar */}
        <div className="w-80 p-6 overflow-y-auto border-l">
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
        onSave={handleSaveEvent}
        initialDate={currentDate}
      />
    </div>
  );
}
