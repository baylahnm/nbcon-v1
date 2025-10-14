import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Briefcase, 
  Target, AlertTriangle, CheckCircle, Video, Phone, Globe,
  Building2, FileText, Presentation, Plus, MoreHorizontal
} from 'lucide-react';
import type { CalendarEvent } from '../../../../../5-engineer/others/stores/useCalendarStore';

interface EnterpriseCalendarMiniProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
  isHijri: boolean;
  userRole: string;
  onEventSelect: (event: CalendarEvent) => void;
}

export default function EnterpriseCalendarMini({
  currentDate,
  onDateSelect,
  events,
  isHijri,
  userRole,
  onEventSelect
}: EnterpriseCalendarMiniProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      case 'meeting': return 'bg-blue-500/10 text-blue-600';
      case 'project': return 'bg-green-500/10 text-green-600';
      case 'deadline': return 'bg-red-500/10 text-red-600';
      case 'task': return 'bg-purple-500/10 text-purple-600';
      case 'conference': return 'bg-indigo-500/10 text-indigo-600';
      case 'presentation': return 'bg-amber-500/10 text-amber-600';
      case 'client-meeting': return 'bg-emerald-500/10 text-emerald-600';
      case 'team-meeting': return 'bg-cyan-500/10 text-cyan-600';
      case 'review': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-gray-500/10 text-gray-600';
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
    setSelectedDate(date);
    onDateSelect(date);
  };

  const days = getMonthDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayEvents = getEventsForDate(new Date());
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Mini Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const isSelected = selectedDate && isSameDay(selectedDate, date);

              return (
                <button
                  key={index}
                  className={`w-8 h-8 text-xs rounded transition-colors ${
                    isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                  } ${isTodayDate ? 'bg-primary text-primary-foreground font-bold' : ''} ${
                    isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-muted'
                  } ${dayEvents.length > 0 ? 'font-semibold' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {todayEvents.length === 0 ? (
            <div className="text-center py-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No events today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.slice(0, 5).map((event) => {
                const EventIcon = getEventTypeIcon(event.type || 'meeting');
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onEventSelect(event)}
                  >
                    <div className={`p-1 rounded ${getEventTypeColor(event.type || 'meeting')}`}>
                      <EventIcon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(new Date(event.startTime))}
                      </p>
                    </div>
                  </div>
                );
              })}
              {todayEvents.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View {todayEvents.length - 5} more events
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {selectedDateEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type || 'meeting');
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onEventSelect(event)}
                  >
                    <div className={`p-1 rounded ${getEventTypeColor(event.type || 'meeting')}`}>
                      <EventIcon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            <Button size="sm" className="w-full text-xs justify-start" variant="outline">
              <Users className="h-3 w-3 mr-2" />
              Schedule Meeting
            </Button>
            <Button size="sm" className="w-full text-xs justify-start" variant="outline">
              <Briefcase className="h-3 w-3 mr-2" />
              Project Review
            </Button>
            <Button size="sm" className="w-full text-xs justify-start" variant="outline">
              <Target className="h-3 w-3 mr-2" />
              Set Deadline
            </Button>
            <Button size="sm" className="w-full text-xs justify-start" variant="outline">
              <Video className="h-3 w-3 mr-2" />
              Video Conference
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Meetings</span>
              <Badge variant="outline" className="text-xs">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Project Reviews</span>
              <Badge variant="outline" className="text-xs">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Deadlines</span>
              <Badge variant="outline" className="text-xs">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Team Events</span>
              <Badge variant="outline" className="text-xs">8</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
