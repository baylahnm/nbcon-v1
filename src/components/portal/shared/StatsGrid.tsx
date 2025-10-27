/**
 * Stats Grid Component
 * 
 * Displays statistics cards with Bauhaus gradient borders, hover effects,
 * and trend indicators. Supports 2-4 column responsive layout.
 * 
 * Follows design system: Bauhaus gradient borders, bg-primary icon containers,
 * text-xl numbers, hover effects.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo, useState, useRef } from 'react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

/**
 * Stat item configuration
 */
export interface StatItem {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * Label text
   */
  label: string;
  
  /**
   * Primary value/number
   */
  value: string | number;
  
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Icon color (uses CSS variable)
   */
  iconColor?: string;
  
  /**
   * Trend indicator (optional)
   */
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  
  /**
   * Click handler (optional)
   */
  onClick?: () => void;
}

/**
 * Stats Grid Props
 */
export interface StatsGridProps {
  /**
   * Array of stat items
   */
  stats: StatItem[];
  
  /**
   * Grid columns (responsive)
   */
  columns?: 2 | 3 | 4;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Stats Grid Component
 * 
 * Displays statistics with Bauhaus gradient borders and hover effects.
 * 
 * @example
 * ```tsx
 * <StatsGrid
 *   columns={4}
 *   stats={[
 *     {
 *       id: '1',
 *       label: 'Active Projects',
 *       value: '12',
 *       icon: Briefcase,
 *       trend: { value: '+8%', direction: 'up' }
 *     },
 *     // ...more stats
 *   ]}
 * />
 * ```
 */
export const StatsGrid = memo(function StatsGrid({
  stats,
  columns = 4,
  className = '',
}: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }[columns];
  
  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
});

/**
 * Individual Stat Card with Bauhaus gradient border
 */
const StatCard = memo(function StatCard({ stat }: { stat: StatItem }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(4.2);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleRad = Math.atan2(y - centerY, x - centerX);
    setRotation(angleRad);
  };
  
  const Icon = stat.icon;
  const iconColor = stat.iconColor || 'hsl(var(--primary))';
  
  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onClick={stat.onClick}
      className={`group ${stat.onClick ? 'cursor-pointer' : ''}`}
      style={{
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(calc(var(--rotation, ${rotation}rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        ['--rotation' as string]: `${rotation}rad`,
      }}
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardContent className="p-5">
          <div className="space-y-3">
            {/* Icon + Label */}
            <div className="flex items-center gap-3">
              <div 
                className="h-[32px] w-[32px] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: iconColor }}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
            
            {/* Value + Trend */}
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold tracking-tight">{stat.value}</span>
              {stat.trend && (
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.trend.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

