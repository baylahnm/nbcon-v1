import { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent, UserRole } from '../../stores/useCalendarStore';
import { CalendarEventCard } from './CalendarEventCard';
import { useThemeStore } from '../../stores/theme';

interface CalendarMiniProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
  isHijri: boolean;
  userRole: UserRole;
  onEventSelect: (event: CalendarEvent) => void;
}

export default function CalendarMini({
  currentDate,
  onDateSelect,
  events,
  isHijri,
  userRole,
  onEventSelect
}: CalendarMiniProps) {
  const { applied: themeTokens } = useThemeStore();

  const [miniDate, setMiniDate] = useState(new Date(currentDate));

  const formatMonthYear = (date: Date, hijri: boolean) => {
    if (hijri) {
      // Simplified Hijri formatting - in a real app, you'd use a proper Hijri library
      const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
        'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
      ];
      const year = date.getFullYear() - 579; // Approximate Hijri year
      const month = hijriMonths[date.getMonth()];
      return `${month} ${year}`;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(miniDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setMiniDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const getMonthDays = () => {
    const year = miniDate.getFullYear();
    const month = miniDate.getMonth();
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

  const hasEventsOnDate = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    });
  };

  const getAllDayEvents = () => {
    return events.filter(event => event.allDay);
  };

  const getActiveJobsCount = () => {
    return events.filter(event => 
      event.type === 'job' && 
      (event.status === 'open' || event.status === 'in-progress')
    ).length;
  };

  const getPendingInvoicesCount = () => {
    return events.filter(event => 
      event.type === 'invoice' && 
      event.status === 'open'
    ).length;
  };

  const getThisMonthCount = () => {
    const monthStart = new Date(miniDate.getFullYear(), miniDate.getMonth(), 1);
    const monthEnd = new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= monthStart && eventDate <= monthEnd;
    }).length;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      job: 'bg-info/10 text-info border-info/20',
      milestone: 'bg-success/10 text-success border-success/20',
      visit: 'bg-warning/10 text-warning border-warning/20',
      invoice: 'bg-destructive/10 text-destructive border-destructive/20',
      call: 'bg-primary/10 text-primary border-primary/20',
      payout: 'bg-info/10 text-info border-info/20'
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground border-sidebar-border';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const monthDays = getMonthDays();
  const allDayEvents = getAllDayEvents();

  return (
    <div 
      className="rounded-lg p-4 border"
      style={{
        backgroundColor: `hsl(${themeTokens['--card'] || '0 0% 100%'})`,
        borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
      }}
    >
      {/* Mini Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">
          {formatMonthYear(miniDate, isHijri)}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Day Names Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div 
            key={day} 
            className="text-xs text-center font-medium"
            style={{
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
            }}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Date Grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === miniDate.getMonth();
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, currentDate);
          const hasEvents = hasEventsOnDate(date);
          
          return (
            <button
              key={index}
              className={`h-8 w-8 text-xs rounded flex items-center justify-center relative font-medium ${
                !isCurrentMonth 
                  ? '' 
                  : isSelected 
                    ? '' 
                    : isToday 
                      ? ''
                      : ''
              }`}
              style={{
                backgroundColor: !isCurrentMonth 
                  ? 'transparent'
                  : isSelected 
                    ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                    : isToday 
                      ? `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.1)`
                      : 'transparent',
                color: !isCurrentMonth 
                  ? `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'} / 0.5)`
                  : isSelected 
                    ? `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'})`
                    : isToday 
                      ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                      : `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`,
              }}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
              {hasEvents && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="h-1 w-1 rounded-full"
                    style={{
                      backgroundColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                    }}
                  ></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Stats Section */}
      <div 
        className="pt-4 mt-4 space-y-3 border-t"
        style={{
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <div className="flex items-center justify-between">
          <span 
            className="text-sm"
            style={{
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
            }}
          >
            Active Jobs:
          </span>
          <span 
            className="text-sm font-medium"
            style={{
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            {getActiveJobsCount()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span 
            className="text-sm"
            style={{
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
            }}
          >
            Pending Invoices:
          </span>
          <span 
            className="text-sm font-medium"
            style={{
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            {getPendingInvoicesCount()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span 
            className="text-sm"
            style={{
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
            }}
          >
            This Month:
          </span>
          <span 
            className="text-sm font-medium"
            style={{
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            {getThisMonthCount()}
          </span>
        </div>
      </div>

      {/* All Day Events Section */}
      {allDayEvents.length > 0 && (
        <div className="mt-4">
          <h3 
            className="text-sm font-medium mb-3"
            style={{
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            All Day Events
          </h3>
          <div className="space-y-2">
            {allDayEvents.slice(0, 3).map(event => (
              <CalendarEventCard
                key={event.id}
                event={event}
                isCompact={true}
                onEventSelect={onEventSelect}
                getEventTypeColor={getEventTypeColor}
                formatCurrency={formatCurrency}
              />
            ))}
            {allDayEvents.length > 3 && (
              <div 
                className="text-xs cursor-pointer"
                style={{
                  color: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                }}
              >
                +{allDayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div 
        className="flex items-center gap-3 mt-4 pt-4 border-t"
        style={{
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback 
            style={{
              backgroundColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`,
              color: `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'})`
            }}
          >
            NB
          </AvatarFallback>
        </Avatar>
        <div>
          <div 
            className="font-medium text-sm"
            style={{
              color: `hsl(${themeTokens['--foreground'] || '0 0% 9%'})`
            }}
          >
            Nasser Baylah
          </div>
          <div 
            className="text-xs capitalize"
            style={{
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
            }}
          >
            {userRole}
          </div>
        </div>
      </div>
    </div>
  );
}
