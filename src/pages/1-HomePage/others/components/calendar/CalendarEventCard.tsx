import { CalendarEvent } from '../../stores/useCalendarStore';
import { useThemeStore } from '../../stores/theme';

interface CalendarEventCardProps {
  event: CalendarEvent;
  isCompact?: boolean;
  onEventSelect?: (event: CalendarEvent) => void;
  getEventTypeColor?: (type: string) => string;
  formatCurrency?: (amount: number) => string;
}

export function CalendarEventCard({
  event,
  isCompact = false,
  onEventSelect,
  getEventTypeColor,
  formatCurrency
}: CalendarEventCardProps) {
  const { applied: themeTokens } = useThemeStore();
  const handleClick = () => {
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const defaultEventTypeColor = (type: string) => {
    const colors = {
      job: {
        backgroundColor: `hsl(${themeTokens['--info'] || '217 92% 55%'} / 0.1)`,
        color: `hsl(${themeTokens['--info'] || '217 92% 55%'})`,
        borderColor: `hsl(${themeTokens['--info'] || '217 92% 55%'} / 0.2)`
      },
      milestone: {
        backgroundColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.1)`,
        color: `hsl(${themeTokens['--success'] || '156 68% 37%'})`,
        borderColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.2)`
      },
      visit: {
        backgroundColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.1)`,
        color: `hsl(${themeTokens['--warning'] || '32 100% 42%'})`,
        borderColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.2)`
      },
      invoice: {
        backgroundColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.1)`,
        color: `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`,
        borderColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.2)`
      },
      call: {
        backgroundColor: `hsl(270 70% 50% / 0.1)`,
        color: `hsl(270 70% 50%)`,
        borderColor: `hsl(270 70% 50% / 0.2)`
      },
      payout: {
        backgroundColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.1)`,
        color: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`,
        borderColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.2)`
      }
    };
    return colors[type as keyof typeof colors] || {
      backgroundColor: `hsl(${themeTokens['--muted'] || '0 0% 96%'})`,
      color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`,
      borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
    };
  };

  const defaultFormatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const eventColors = getEventTypeColor ? { className: getEventTypeColor(event.type) } : defaultEventTypeColor(event.type);
  const formattedAmount = formatCurrency ? formatCurrency(event.amount) : defaultFormatCurrency(event.amount);

  // Type guard to check if eventColors has className property
  const hasClassName = 'className' in eventColors;

  if (isCompact) {
    return (
      <div
        className={`p-2 rounded cursor-pointer hover:shadow-sm ${hasClassName ? eventColors.className : ''}`}
        style={hasClassName ? {} : {
          backgroundColor: eventColors.backgroundColor,
          color: eventColors.color,
          borderColor: eventColors.borderColor,
          border: '1px solid'
        }}
        onClick={handleClick}
      >
        <div className="font-medium truncate text-xs">{event.title}</div>
        <div className="text-xs opacity-75 flex items-center justify-between mt-1">
          <span className="truncate">{event.client}</span>
          {event.amount > 0 && (
            <span className="font-medium">{formattedAmount}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer hover:shadow-sm border ${hasClassName ? eventColors.className : ''}`}
      style={hasClassName ? {} : {
        backgroundColor: eventColors.backgroundColor,
        color: eventColors.color,
        borderColor: eventColors.borderColor
      }}
      onClick={handleClick}
    >
      <div className="font-medium text-sm mb-1">{event.title}</div>
      <div className="text-xs opacity-75 mb-2">{event.description}</div>
      <div className="flex items-center justify-between text-xs">
        <span>{event.client} • {event.location}</span>
        {event.amount > 0 && (
          <span className="font-medium">{formattedAmount}</span>
        )}
      </div>
    </div>
  );
}
