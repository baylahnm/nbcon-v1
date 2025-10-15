import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface ChartWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const chartType = config.chartType || 'line';
  const showLegend = config.showLegend !== false;
  const showGrid = config.showGrid !== false;

  // Mock chart data
  const chartData = [
    { name: 'Jan', value: 400, target: 350 },
    { name: 'Feb', value: 300, target: 400 },
    { name: 'Mar', value: 500, target: 450 },
    { name: 'Apr', value: 450, target: 500 },
    { name: 'May', value: 600, target: 550 },
    { name: 'Jun', value: 550, target: 600 }
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.value, d.target)));

  const renderLineChart = () => (
    <div className="space-y-4">
      {/* Chart Area */}
      <div className="relative h-32">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid Lines */}
          {showGrid && (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={`${ratio * 100}%`}
                  x2="100%"
                  y2={`${ratio * 100}%`}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={`${ratio * 100}%`}
                  y1="0"
                  x2={`${ratio * 100}%`}
                  y2="100%"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </>
          )}

          {/* Data Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100;
              const y = 100 - (d.value / maxValue) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Target Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="5,5"
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100;
              const y = 100 - (d.target / maxValue) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Data Points */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 100;
            const y = 100 - (d.value / maxValue) * 100;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {chartData.map((d, i) => (
          <span key={i}>{d.name}</span>
        ))}
      </div>
    </div>
  );

  const renderBarChart = () => (
    <div className="space-y-4">
      {/* Chart Area */}
      <div className="relative h-32">
        <div className="flex items-end justify-between h-full gap-1">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center space-y-1">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${(d.value / maxValue) * 100}%`, minHeight: '4px' }}
                />
                <div
                  className="w-full bg-success/50 rounded-t"
                  style={{ height: `${(d.target / maxValue) * 100}%`, minHeight: '2px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {chartData.map((d, i) => (
          <span key={i}>{d.name}</span>
        ))}
      </div>
    </div>
  );

  const renderPieChart = () => (
    <div className="flex items-center justify-center h-32">
      <div className="relative w-24 h-24">
        <svg width="100%" height="100%" className="transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 40 * 0.7} ${2 * Math.PI * 40}`}
            strokeDashoffset="0"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">70%</span>
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Performance</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {chartType.toUpperCase()}
          </Badge>
        </div>

        {/* Chart */}
        <div className="flex-1">
          {renderChart()}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 pt-3 border-t border-sidebar-border">
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success/50 rounded"></div>
                <span>Target</span>
              </div>
            </div>
          </div>
        )}

        {/* Chart Controls */}
        <div className="mt-4 pt-3 border-t border-sidebar-border">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs flex-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="text-xs flex-1">
              <Activity className="w-3 h-3 mr-1" />
              Details
            </Button>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default ChartWidget;

