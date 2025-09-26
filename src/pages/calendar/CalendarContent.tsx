import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { 
  Users, 
  MapPin, 
  Clock, 
  DollarSign
} from 'lucide-react';
import { useCalendarStore, EventType, EventStatus } from '@/stores/useCalendarStore';
import { useThemeStore } from '@/stores/theme';

export default function CalendarContent() {
  const {
    currentDate,
    view,
    selectedEvent,
    events,
    setSelectedEvent,
    getEventsForDate,
    getEventsForWeek,
    getEventsForMonth,
    getEventTypeColor,
    getStatusColor,
    formatCurrency
  } = useCalendarStore();

  const { applied: themeTokens } = useThemeStore();

  const getWeekDays = () => {
    const startDate = new Date(currentDate);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    const sunday = new Date(startDate.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return date;
    });
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push({
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        display: hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`
      });
    }
    return slots;
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays();
    const monthEvents = getEventsForMonth(currentDate);
    
    return (
      <div 
        className="grid grid-cols-7 gap-px rounded-lg overflow-hidden"
        style={{
          backgroundColor: `hsl(${themeTokens['--muted'] || '0 0% 96%'})`
        }}
      >
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div 
            key={day} 
            className="p-3 text-center font-medium text-sm"
            style={{
              backgroundColor: `hsl(${themeTokens['--muted'] || '0 0% 96%'})`,
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            {day}
          </div>
        ))}
        
        {/* Days */}
        {monthDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`p-2 min-h-[120px] ${isToday ? 'border-2' : ''}`}
              style={{
                backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
                borderColor: isToday ? `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.3)` : 'transparent'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{
                    color: !isCurrentMonth 
                      ? `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'} / 0.5)`
                      : isToday 
                        ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                        : `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
                  }}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="truncate font-medium">{event.title}</div>
                    <div className="text-xs opacity-75">
                      {event.allDay ? 'All Day' : event.startTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div 
                    className="text-xs"
                    style={{
                      color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
                    }}
                  >
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const weekEvents = getEventsForWeek(weekDays[0]);
    const timeSlots = getTimeSlots();
    
    return (
      <div className="flex flex-col">
        {/* All Day Events */}
        {weekEvents.filter(event => event.allDay).length > 0 && (
          <div 
            className="pb-4 mb-4 border-b"
            style={{
              borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
            }}
          >
            <div 
              className="text-sm font-medium mb-2"
              style={{
                color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
              }}
            >
              All Day Events
            </div>
            <div className="space-y-1">
              {weekEvents.filter(event => event.allDay).map(event => (
                <div
                  key={event.id}
                  className={`p-2 rounded cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs font-medium">{formatCurrency(event.amount)}</div>
                  </div>
                  <div className="text-xs opacity-75">{event.client} • {event.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Time Grid */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-16 flex-shrink-0">
            <div className="h-12"></div>
            {timeSlots.map(slot => (
              <div 
                key={slot.hour} 
                className="h-16 text-xs pr-2 text-right"
                style={{
                  color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
                }}
              >
                {slot.display}
              </div>
            ))}
          </div>
          
          {/* Days */}
          <div 
            className="flex-1 grid grid-cols-7 gap-px"
            style={{
              backgroundColor: `hsl(${themeTokens['--muted'] || '0 0% 96%'})`
            }}
          >
            {weekDays.map((date, dayIndex) => {
              const dayEvents = weekEvents.filter(event => {
                const eventDate = new Date(event.startTime);
                return eventDate.toDateString() === date.toDateString() && !event.allDay;
              });
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={dayIndex} 
                  style={{
                    backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
                  }}
                >
                  {/* Day Header */}
                  <div 
                    className="p-2 text-center border-b"
                    style={{
                      backgroundColor: isToday 
                        ? `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.1)`
                        : 'transparent',
                      borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
                    }}
                  >
                    <div 
                      className="text-sm font-medium"
                      style={{
                        color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
                      }}
                    >
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div 
                      className={`text-lg ${isToday ? 'font-bold' : ''}`}
                      style={{
                        color: isToday 
                          ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                          : `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
                      }}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                  
                  {/* Time Slots */}
                  <div className="relative">
                    {timeSlots.map(slot => (
                      <div 
                        key={slot.hour} 
                        className="h-16 border-b"
                        style={{
                          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'} / 0.5)`
                        }}
                      ></div>
                    ))}
                    
                    {/* Events */}
                    {dayEvents.map(event => {
                      const startHour = event.startTime.getHours();
                      const startMinute = event.startTime.getMinutes();
                      const endHour = event.endTime.getHours();
                      const endMinute = event.endTime.getMinutes();
                      
                      const top = ((startHour - 6) * 64) + (startMinute / 60) * 64;
                      const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60) * 64;
                      
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 p-1 rounded text-xs cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75 truncate">
                            {event.startTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })} - {event.endTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
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
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const timeSlots = getTimeSlots();
    
    return (
      <div className="flex">
        {/* Time Column */}
        <div className="w-16 flex-shrink-0">
          <div className="h-12"></div>
          {timeSlots.map(slot => (
            <div key={slot.hour} className="h-16 text-xs text-gray-500 pr-2 text-right">
              {slot.display}
            </div>
          ))}
        </div>
        
        {/* Day Column */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg">
          {/* Day Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="text-lg font-medium">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-sm text-gray-600">
              {dayEvents.length} events scheduled
            </div>
          </div>
          
          {/* Time Slots */}
          <div className="relative">
            {timeSlots.map(slot => (
              <div key={slot.hour} className="h-16 border-b border-sidebar-border"></div>
            ))}
            
            {/* Events */}
            {dayEvents.map(event => {
              const startHour = event.startTime.getHours();
              const startMinute = event.startTime.getMinutes();
              const endHour = event.endTime.getHours();
              const endMinute = event.endTime.getMinutes();
              
              const top = ((startHour - 6) * 64) + (startMinute / 60) * 64;
              const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60) * 64;
              
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 p-2 rounded cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium text-sm">{event.title}</div>
                  <div className="text-xs opacity-75">
                    {event.startTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })} - {event.endTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                  <div className="text-xs opacity-75">{event.client}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const groupedEvents = sortedEvents.reduce((groups, event) => {
      const date = event.startTime.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {} as Record<string, typeof events>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date}>
            <div className="text-lg font-medium text-gray-900 mb-4">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="space-y-3">
              {dayEvents.map(event => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })} - {event.endTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.client}
                          </div>
                          {event.amount > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(event.amount)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex -space-x-2 ml-4">
                        {event.assignees.slice(0, 3).map(assignee => (
                          <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                              {assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {event.assignees.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              +{event.assignees.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar View */}
      <div 
        className="flex-1 p-0 overflow-auto"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
        }}
      >
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'agenda' && renderAgendaView()}
      </div>

      {/* Event Details Drawer */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>{selectedEvent?.title}</SheetTitle>
            <SheetDescription>
              {selectedEvent?.description}
            </SheetDescription>
          </SheetHeader>
          
          {selectedEvent && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
                <Badge className={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {selectedEvent.startTime.toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{selectedEvent.client}</span>
                </div>
                
                {selectedEvent.amount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatCurrency(selectedEvent.amount)}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Assignees</div>
                <div className="flex -space-x-2">
                  {selectedEvent.assignees.map(assignee => (
                    <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                        {assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
