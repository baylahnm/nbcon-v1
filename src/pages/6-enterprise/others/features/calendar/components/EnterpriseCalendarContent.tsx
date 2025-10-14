import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { useCalendarStore } from '../../../../../5-engineer/others/stores/useCalendarStore';
import type { CalendarEvent } from '../../../../../5-engineer/others/stores/useCalendarStore';
import { 
  Building2, DollarSign, MapPin, Clock, Plus, Users, Briefcase, 
  Target, AlertTriangle, CheckCircle, Calendar as CalendarIcon,
  Video, Phone, Globe, FileText, Presentation
} from 'lucide-react';

interface EnterpriseCalendarContentProps {
  onCreateEvent?: (date: Date, time?: string) => void;
}

export default function EnterpriseCalendarContent({ onCreateEvent }: EnterpriseCalendarContentProps) {
  const { currentDate, events, view } = useCalendarStore();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Get days for the current month view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return Users;
      case 'project': return Briefcase;
      case 'deadline': return Target;
      case 'task': return CheckCircle;
      case 'conference': return Video;
      case 'presentation': return Presentation;
      case 'client-meeting': return Building2;
      case 'team-meeting': return Users;
      case 'review': return FileText;
      default: return CalendarIcon;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'project': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'deadline': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'task': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'conference': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'presentation': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'client-meeting': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'team-meeting': return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDateClick = (date: Date) => {
    if (onCreateEvent) {
      onCreateEvent(date);
    }
  };

  const handleDateDoubleClick = (date: Date) => {
    if (onCreateEvent) {
      onCreateEvent(date);
    }
  };

  if (view === 'month') {
    const days = getMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="h-full flex flex-col">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isHovered = hoveredDate && isSameDay(hoveredDate, date);

            return (
              <div
                key={index}
                className={`border-r border-b last:border-r-0 p-2 min-h-[120px] cursor-pointer transition-colors ${
                  isCurrentMonthDay ? 'bg-background' : 'bg-muted/30'
                } ${isTodayDate ? 'bg-primary/5' : ''} ${
                  isHovered ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleDateClick(date)}
                onDoubleClick={() => handleDateDoubleClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                  } ${isTodayDate ? 'text-primary font-bold' : ''}`}>
                    {date.getDate()}
                  </span>
                  {isTodayDate && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const EventIcon = getEventTypeIcon(event.type || 'meeting');
                    return (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventTypeColor(event.type || 'meeting')} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <EventIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate font-medium">{event.title}</span>
                        </div>
                        <div className="text-xs opacity-75 mt-0.5">
                          {formatTime(new Date(event.startTime))}
                        </div>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground p-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week view
  if (view === 'week') {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="h-full flex flex-col">
        {/* Week day headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 text-center text-sm font-medium text-muted-foreground border-r">
            Time
          </div>
          {weekDays.map((date) => (
            <div key={date.toDateString()} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
              <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={`text-lg font-bold ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-xs text-muted-foreground border-r text-center">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map((date) => {
                const dayEvents = getEventsForDate(date).filter(event => {
                  const eventHour = new Date(event.startTime).getHours();
                  return eventHour === hour;
                });

                return (
                  <div
                    key={date.toDateString()}
                    className="border-r last:border-r-0 p-1 min-h-[60px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleDateClick(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour))}
                    onDoubleClick={() => handleDateDoubleClick(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour))}
                  >
                    {dayEvents.map((event) => {
                      const EventIcon = getEventTypeIcon(event.type || 'meeting');
                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border mb-1 ${getEventTypeColor(event.type || 'meeting')} cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            <EventIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate font-medium">{event.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Day view
  if (view === 'day') {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="h-full flex flex-col">
        {/* Day header */}
        <div className="p-4 border-b text-center">
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        {/* Day grid */}
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = new Date(event.startTime).getHours();
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex border-b">
                <div className="w-20 p-3 text-xs text-muted-foreground border-r text-center">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div
                  className="flex-1 p-3 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour))}
                  onDoubleClick={() => handleDateDoubleClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour))}
                >
                  {hourEvents.map((event) => {
                    const EventIcon = getEventTypeIcon(event.type || 'meeting');
                    return (
                      <div
                        key={event.id}
                        className={`text-sm p-2 rounded border mb-2 ${getEventTypeColor(event.type || 'meeting')} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <EventIcon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-xs opacity-75">
                              {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                            </div>
                            {event.location && (
                              <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Agenda view
  if (view === 'agenda') {
    const upcomingEvents = events
      .filter(event => new Date(event.startTime) >= new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 20);

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">Next 20 events across all projects</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-4">Create your first event to get started</p>
              <Button onClick={() => onCreateEvent?.(new Date())}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type || 'meeting');
                const eventDate = new Date(event.startTime);
                const isTodayEvent = isToday(eventDate);
                
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type || 'meeting')}`}>
                          <EventIcon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {eventDate.toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    month: 'long', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })} at {formatTime(eventDate)}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isTodayEvent && (
                                <Badge variant="outline" className="text-xs">
                                  Today
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getEventTypeColor(event.type || 'meeting')}`}>
                                {event.type || 'meeting'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
