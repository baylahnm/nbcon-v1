import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { aiClient } from '../api/aiClient';

interface HijriBadgeProps {
  date: string;
  showIcon?: boolean;
  isCompact?: boolean;
}

interface HijriDate {
  hijri: string;
  gregorian: string;
  day: number;
  month: number;
  year: number;
  monthName: string;
}

export function HijriBadge({ date, showIcon = true, isCompact = false }: HijriBadgeProps) {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const convertDate = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await aiClient.convertToHijri(date);
        setHijriDate(result);
      } catch (err) {
        console.error('Failed to convert to Hijri:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    convertDate();
  }, [date]);

  if (loading) {
    return (
      <Badge variant="outline" className="text-xs">
        {showIcon && <Calendar className="w-3 h-3 mr-1" />}
        <span className="animate-pulse">...</span>
      </Badge>
    );
  }

  if (error || !hijriDate) {
    return null;
  }

  const formatHijriDate = () => {
    if (isCompact) {
      return `${hijriDate.day}/${hijriDate.month}/${hijriDate.year}`;
    }
    return `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year}`;
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${isCompact ? 'text-xs' : 'text-xs'}`}
      title={`Hijri: ${hijriDate.hijri}`}
    >
      {showIcon && <Calendar className="w-3 h-3 mr-1" />}
      <span>(هجري)</span>
      <span className="ml-1">{formatHijriDate()}</span>
    </Badge>
  );
}
