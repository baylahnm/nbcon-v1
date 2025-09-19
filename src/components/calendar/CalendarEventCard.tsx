import { CalendarEvent } from '@/stores/useCalendarStore';

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
  const handleClick = () => {
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const defaultEventTypeColor = (type: string) => {
    const colors = {
      job: 'bg-blue-100 text-blue-800 border-blue-200',
      milestone: 'bg-green-100 text-green-800 border-green-200',
      visit: 'bg-orange-100 text-orange-800 border-orange-200',
      invoice: 'bg-red-100 text-red-800 border-red-200',
      call: 'bg-purple-100 text-purple-800 border-purple-200',
      payout: 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const defaultFormatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const eventColorClass = getEventTypeColor ? getEventTypeColor(event.type) : defaultEventTypeColor(event.type);
  const formattedAmount = formatCurrency ? formatCurrency(event.amount) : defaultFormatCurrency(event.amount);

  if (isCompact) {
    return (
      <div
        className={`p-2 rounded cursor-pointer hover:shadow-sm ${eventColorClass}`}
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
      className={`p-3 rounded-lg cursor-pointer hover:shadow-sm border ${eventColorClass}`}
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
