import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCalendarStore } from '../../../../5-engineer/others/stores/useCalendarStore';
import type { CalendarEvent } from '../../../../5-engineer/others/stores/useCalendarStore';
import { Building, DollarSign, MapPin, Clock, Plus } from 'lucide-react';

interface CalendarContentProps {
  onCreateEvent?: (date: Date, time?: string) => void;
}

export default function CalendarContent({ onCreateEvent }: CalendarContentProps) {
  const { currentDate, events, view } = useCalendarStore();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for the time indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

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

  // Get days for the current week view
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
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

  const getEventsForDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startDate && eventDate <= endDate;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getEventColor = (type: string) => {
    const colors = {
      job: 'bg-blue-500/10 text-blue-600 border-l-blue-600',
      milestone: 'bg-green-500/10 text-green-600 border-l-green-600',
      meeting: 'bg-purple-500/10 text-purple-600 border-l-purple-600',
      invoice: 'bg-emerald-500/10 text-emerald-600 border-l-emerald-600',
      deadline: 'bg-amber-500/10 text-amber-600 border-l-amber-600',
      visit: 'bg-pink-500/10 text-pink-600 border-l-pink-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-600 border-l-gray-600';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDateLong = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const monthDays = getMonthDays();

  // Day View
  if (view === 'day') {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);
    const isCurrentDay = isToday(currentDate);

    return (
      <div className="h-full overflow-auto p-4">
        <div className="space-y-4">
          {/* Day Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold">{formatDateLong(currentDate)}</h2>
              <p className="text-sm text-muted-foreground mt-1">{dayEvents.length} events scheduled</p>
            </div>
            {isCurrentDay && (
              <Badge className="bg-primary/10 text-primary border-primary/20">Today</Badge>
            )}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {hours.map((hour) => {
              const hourEvents = dayEvents.filter(event => {
                const eventHour = new Date(event.startTime).getHours();
                return eventHour === hour;
              });

              const isCurrentHour = isCurrentDay && currentTime.getHours() === hour;

              return (
                <div
                  key={hour}
                  className={`relative border-b border-border/40 min-h-[80px] hover:bg-accent/5 transition-colors ${
                    isCurrentHour ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    const clickDate = new Date(currentDate);
                    clickDate.setHours(hour, 0, 0, 0);
                    onCreateEvent?.(clickDate, `${hour.toString().padStart(2, '0')}:00`);
                  }}
                >
                  {/* Time Label */}
                  <div className="absolute left-0 top-2 w-20 text-right pr-4">
                    <span className={`text-xs font-medium ${isCurrentHour ? 'text-primary' : 'text-muted-foreground'}`}>
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="ml-24 p-2 space-y-2">
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type)} cursor-pointer hover:shadow-md transition-all`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{event.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs opacity-70">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}</span>
                              </div>
                              {event.client && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  <span>{event.client}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Time Indicator */}
                  {isCurrentHour && (
                    <div
                      className="absolute left-20 right-0 h-0.5 bg-primary z-10"
                      style={{
                        top: `${(currentTime.getMinutes() / 60) * 80 + 8}px`,
                      }}
                    >
                      <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Week View
  if (view === 'week') {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="h-full overflow-auto p-4">
        <div className="space-y-4">
          {/* Week Header */}
          <div className="grid grid-cols-8 gap-2 pb-4 border-b sticky top-0 bg-background z-10">
            <div className="w-20" />
            {weekDays.map((day, index) => {
              const isCurrentDay = isToday(day);
              const dayEvents = getEventsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`text-center p-3 rounded-lg transition-colors ${
                    isCurrentDay ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50'
                  }`}
                >
                  <p className={`text-xs font-medium uppercase ${isCurrentDay ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${isCurrentDay ? 'text-primary-foreground' : ''}`}>
                    {day.getDate()}
                  </p>
                  <p className={`text-[10px] mt-1 ${isCurrentDay ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {dayEvents.length} events
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="relative border-b border-border/40 min-h-[60px]">
                {/* Time Label */}
                <div className="absolute left-0 top-2 w-20 text-right pr-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 ml-24">
                  {weekDays.map((day, dayIndex) => {
                    const hourEvents = getEventsForDate(day).filter(event => {
                      const eventHour = new Date(event.startTime).getHours();
                      return eventHour === hour;
                    });

                    const isCurrentHour = isToday(day) && currentTime.getHours() === hour;

                    return (
                      <div
                        key={dayIndex}
                        className={`relative min-h-[60px] hover:bg-accent/5 transition-colors rounded ${
                          isCurrentHour ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          const clickDate = new Date(day);
                          clickDate.setHours(hour, 0, 0, 0);
                          onCreateEvent?.(clickDate, `${hour.toString().padStart(2, '0')}:00`);
                        }}
                      >
                        {hourEvents.map(event => (
                          <div
                            key={event.id}
                            className={`p-1 rounded border-l-2 ${getEventColor(event.type)} cursor-pointer hover:shadow-sm transition-all text-[10px] mb-1`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="font-semibold line-clamp-1">{event.title}</p>
                            <p className="opacity-70 line-clamp-1">{formatTime(new Date(event.startTime))}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Agenda View
  if (view === 'agenda') {
    const startDate = new Date(currentDate);
    startDate.setDate(1); // Start of month
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 1, 0); // End of month
    
    const agendaEvents = getEventsForDateRange(startDate, endDate);
    
    // Group events by date
    const groupedEvents = agendaEvents.reduce((acc, event) => {
      const dateKey = new Date(event.startTime).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
      <div className="h-full overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Agenda Header */}
          <div className="pb-4 border-b">
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{agendaEvents.length} total events</p>
          </div>

          {/* Events List */}
          {Object.keys(groupedEvents).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No events scheduled this month</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => onCreateEvent?.(new Date())}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
                const date = new Date(dateKey);
                const isCurrentDay = isToday(date);

                return (
                  <div key={dateKey} className="space-y-3">
                    {/* Date Header */}
                    <div className={`flex items-center gap-3 pb-2 border-b ${isCurrentDay ? 'border-primary' : ''}`}>
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg ${
                        isCurrentDay ? 'bg-primary text-primary-foreground' : 'bg-accent'
                      }`}>
                        <span className={`text-xs font-medium uppercase ${isCurrentDay ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-2xl font-bold">{date.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-sm text-muted-foreground">{dayEvents.length} events</p>
                      </div>
                      {isCurrentDay && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">Today</Badge>
                      )}
                    </div>

                    {/* Events for this date */}
                    <div className="space-y-2 ml-4 pl-4 border-l-2 border-border/40">
                      {dayEvents.map(event => (
                        <Card
                          key={event.id}
                          className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${getEventColor(event.type)}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-base">{event.title}</h4>
                                  <Badge variant="outline" className="text-[10px]">
                                    {event.type}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}</span>
                                  </div>
                                  
                                  {event.client && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Building className="h-4 w-4" />
                                      <span>{event.client}</span>
                                    </div>
                                  )}
                                  
                                  {event.location && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4" />
                                      <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                  )}
                                </div>

                                {event.description && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </div>
          </CardContent>
        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-4 mb-2">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {day.slice(0, 3)}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            const isInCurrentMonth = isCurrentMonth(date);
            const isHovered = hoveredDate && isSameDay(hoveredDate, date);

            return (
              <DateCardWrapper
                key={index}
                isCurrentDay={isCurrentDay}
                isInCurrentMonth={isInCurrentMonth}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                onDoubleClick={() => onCreateEvent?.(date)}
              >
                <CardHeader className="p-2 pb-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${
                      isCurrentDay ? 'text-primary' : isInCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {date.getDate()}
                    </span>
                    {isCurrentDay && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] bg-primary/10 text-primary border-primary/20">
                        Today
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1">
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`p-1.5 rounded border-l-2 ${getEventColor(event.type)} text-xs cursor-pointer hover:shadow-sm transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle event click
                          }}
                        >
                          <p className="font-semibold line-clamp-1 text-[10px] leading-tight">
                            {event.title}
                          </p>
                          {event.client && (
                            <div className="flex items-center gap-1 mt-0.5 opacity-70">
                              <Building className="h-2.5 w-2.5" />
                              <span className="text-[9px] line-clamp-1">{event.client}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-center text-primary font-medium pt-0.5">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  {dayEvents.length === 0 && isHovered && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-6 text-[9px] opacity-60 hover:opacity-100"
                      onClick={() => onCreateEvent?.(date)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Event
                    </Button>
                  )}
                </CardContent>
              </DateCardWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Animated hover wrapper component for date cards
interface DateCardWrapperProps {
  children: React.ReactNode;
  isCurrentDay: boolean;
  isInCurrentMonth: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDoubleClick: () => void;
}

function DateCardWrapper({
  children,
  isCurrentDay,
  isInCurrentMonth,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDoubleClick
}: DateCardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleX = (y - centerY) / centerY;
    const angleY = (centerX - x) / centerX;
    const angle = Math.atan2(angleY, angleX) * (180 / Math.PI);
    cardRef.current.style.setProperty('--rotation', `${angle}deg`);
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(var(--rotation, 135deg), hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
    >
      <Card
        className={`bg-transparent border-0 min-h-[120px] transition-all duration-300 cursor-pointer ${
          !isInCurrentMonth ? 'opacity-40' : ''
        } ${isHovered ? 'ring-2 ring-primary' : ''} ${
          isCurrentDay ? 'ring-2 ring-primary/40' : ''
        }`}
        style={{
          boxShadow: isHovered || isCurrentDay ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </Card>
    </div>
  );
}

