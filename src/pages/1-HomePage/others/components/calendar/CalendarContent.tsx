import { useState } from 'react';
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

  const monthDays = getMonthDays();

  if (view === 'week' || view === 'day' || view === 'agenda') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-sm">
              {view.charAt(0).toUpperCase() + view.slice(1)} view coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
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
        <div className="grid grid-cols-7 gap-4">
          {monthDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            const isInCurrentMonth = isCurrentMonth(date);
            const isHovered = hoveredDate && isSameDay(hoveredDate, date);

            return (
              <Card
                key={index}
                className={`min-h-[120px] transition-all duration-300 cursor-pointer ${
                  !isInCurrentMonth ? 'opacity-40' : ''
                } ${isHovered ? 'ring-2 ring-primary' : ''} ${
                  isCurrentDay ? 'ring-2 ring-primary/40' : 'border-border/50'
                }`}
                style={{
                  boxShadow: isHovered || isCurrentDay ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
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
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

