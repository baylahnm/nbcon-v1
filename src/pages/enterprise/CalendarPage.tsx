import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CreateEventDialog from '@/components/calendar/CreateEventDialog';
import { R, RH } from '@/lib/routes';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Target,
  MoreHorizontal
} from 'lucide-react';
// import nasserAvatar from 'figma:asset/f2bc29563152738b3b8753fd7fa0f8faad491914.png';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number; // in hours
  type: 'meeting' | 'project' | 'deadline' | 'task';
  color: string;
  participants?: string[];
}

interface TimeSlot {
  time: string;
  events: CalendarEvent[];
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 25)); // September 25, 2025
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Sample events data
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Project Planning Discussion',
      time: '10:00',
      duration: 2,
      type: 'meeting',
      color: 'bg-blue-500',
      participants: ['Nasser Baylah', 'Team Lead']
    },
    {
      id: '2',
      title: 'WRBM Smart City Infrastructure',
      time: '14:00',
      duration: 1,
      type: 'project',
      color: 'bg-green-500',
      participants: ['Engineering Team']
    },
    {
      id: '3',
      title: 'Client Review Meeting',
      time: '16:00',
      duration: 1,
      type: 'meeting',
      color: 'bg-purple-500',
      participants: ['Client', 'Project Manager']
    }
  ];

  // Generate time slots for the day
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      const timeString = `${hour}:00`;
      const events = sampleEvents.filter(event => event.time === `${hour}:00`);
      slots.push({
        time: timeString,
        events
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Week days for the current week
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const exportICS = () => {
    // Minimal ICS export for visible sample events
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//nbcon//enterprise-calendar//EN',
    ];
    sampleEvents.forEach((e) => {
      // Use current date for DTSTART fallback
      const dt = new Date(currentDate);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const start = `${yyyy}${mm}${dd}T${e.time.replace(':','')}00`;
      lines.push(
        'BEGIN:VEVENT',
        `UID:enterprise-${e.id}@nbcon`,
        `SUMMARY:${e.title}`,
        `DTSTART:${start}`,
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <p className="text-sm text-muted-foreground">
                Manage your engineering projects and milestones
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={exportICS} aria-label="Export calendar">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.location.assign(`${R.enterprise.settings}#integrations`)}
            aria-label="Sync calendar"
          >
            <RefreshCw className="h-4 w-4" />
            Sync
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)} aria-label="Create event">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Calendar Area */}
        <div className="col-span-9 space-y-4">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-medium">
                  {formatMonthYear(currentDate)}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Badge variant="outline">Today</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, clients, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(true)} aria-label="Open filters">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>No items</span>
              <span>All clear</span>
            </div>
          </div>

          {/* Week View Calendar */}
          <Card>
            <CardContent className="p-0">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 text-sm font-medium text-muted-foreground">
                  Time
                </div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="p-4 text-center border-l first:border-l-0"
                  >
                    <div className="text-sm font-medium">
                      {formatDate(day)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="max-h-96 overflow-y-auto">
                {timeSlots.map((slot, slotIndex) => (
                  <motion.div
                    key={slotIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: slotIndex * 0.02 }}
                    className="grid grid-cols-8 border-b border-border/50 hover:bg-muted/20"
                  >
                    <div className="p-4 text-sm text-muted-foreground border-r">
                      {slot.time}
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="p-2 border-l first:border-l-0 min-h-16 relative"
                      >
                        {/* Show events for this time slot and day */}
                        {slot.events.map((event, eventIndex) => (
                          <motion.div
                            key={event.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: eventIndex * 0.1 }}
                            className={`
                              ${event.color} text-white text-xs p-2 rounded mb-1 
                              cursor-pointer hover:shadow-md transition-shadow
                            `}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="opacity-90">{event.time}</div>
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-4">
          {/* Mini Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">September 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Deadlines</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Key Targets</span>
                <Badge variant="secondary">16</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Template */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Meeting Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-600">
                  Technical Approval Discussion
                </div>
                <div className="text-xs text-muted-foreground">
                  Review technical specifications and approval workflow
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-green-600">
                  WRBM Smart City Infrastructure
                </div>
                <div className="text-xs text-muted-foreground">
                  Infrastructure planning and implementation review
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Day Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                All Day Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>NB</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Nasser Baylah</p>
                  <p className="text-xs text-muted-foreground">Engineering Lead</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.location.assign(RH.enterprise.calendarEvent('1'))}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={() => setShowCreate(false)}
        initialDate={selectedDate || currentDate}
      />

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine events by type, team, and participants.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 text-sm text-muted-foreground">
            {/* TODO: Implement enterprise-specific filters; persist to query string */}
            Coming soon: enterprise calendar filters.
          </div>
        </SheetContent>
      </Sheet>

      {/* Event Quick View Sheet */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>{selectedEvent?.title}</SheetTitle>
            <SheetDescription>
              {selectedEvent ? `${selectedEvent.time} • ${selectedEvent.type}` : ''}
            </SheetDescription>
          </SheetHeader>
          {selectedEvent && (
            <div className="mt-4 space-y-3">
              <div className="text-sm">Duration: {selectedEvent.duration}h</div>
              <div className="text-sm">Participants: {(selectedEvent.participants || []).join(', ') || '—'}</div>
              <div className="pt-4 flex gap-2">
                <Button size="sm" onClick={() => window.location.assign(RH.enterprise.calendarEvent(selectedEvent.id))}>Open full page</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowCreate(true); }}>Edit</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}