import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
}

const variantStyles = {
  default: "border-sidebar-border",
  primary: "border-primary/20 bg-primary/5",
  accent: "border-accent/20 bg-accent/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  className,
  variant = 'default' 
}: KPICardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center justify-between mt-1">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
