import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface StatsCardWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const StatsCardWidget: React.FC<StatsCardWidgetProps> = memo(({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  
  const value = config.value || '0';
  const label = config.label || 'Metric';
  const trend = config.trend || '+0%';
  const trendDirection = config.trendDirection || 'up';
  const description = config.description || '';

  const isPositiveTrend = trendDirection === 'up';
  const trendColor = isPositiveTrend ? 'text-success' : 'text-destructive';
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <div className="text-center space-y-2">
            {/* Value */}
            <div className="text-3xl font-bold text-foreground">
              {value}
            </div>
            
            {/* Label */}
            <div className="text-sm font-medium text-muted-foreground">
              {label}
            </div>
            
            {/* Trend */}
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <Badge 
                variant={isPositiveTrend ? 'default' : 'destructive'}
                className="text-xs"
              >
                {trend}
              </Badge>
            </div>
            
            {/* Description */}
            {description && (
              <div className="text-xs text-muted-foreground mt-2">
                {description}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </BaseWidget>
  );
});

StatsCardWidget.displayName = 'StatsCardWidget';

export default StatsCardWidget;
