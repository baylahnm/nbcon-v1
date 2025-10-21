/**
 * Styled Card Component - Enterprise Standard
 * 
 * Provides consistent, theme-aware card styling with gradient borders
 * for all popovers, dialogs, and drawer cards across the application.
 * 
 * Usage:
 * ```tsx
 * <StyledCard>
 *   <StyledCardHeader icon={<Sparkles />} title="Title" description="Description" />
 *   <StyledCardContent>Content here</StyledCardContent>
 * </StyledCard>
 * ```
 * 
 * @version 1.0.0
 * @status Production Ready - Enterprise Standard
 */

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

interface StyledCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface StyledCardHeaderProps {
  icon?: React.ReactNode;
  iconClassName?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  className?: string;
}

interface StyledCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * StyledCard - Main card container with gradient border effect
 */
export function StyledCard({ children, className, ...props }: StyledCardProps) {
  return (
    <Card
      className={cn("gap-0", className)}
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

/**
 * StyledCardHeader - Consistent header with icon and title
 */
export function StyledCardHeader({
  icon,
  iconClassName,
  title,
  description,
  badge,
  className,
}: StyledCardHeaderProps) {
  return (
    <CardHeader className={cn("p-4 border-b border-border/40", className)}>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn(
              "bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50",
              iconClassName
            )}>
              {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, {
                className: "w-6 h-6 text-primary-foreground"
              }) : icon}
            </div>
          )}
          <div>
            <div className="text-base font-bold">{title}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {badge && <div>{badge}</div>}
      </CardTitle>
    </CardHeader>
  );
}

/**
 * StyledCardContent - Consistent content area styling
 */
export function StyledCardContent({ children, className, ...props }: StyledCardContentProps) {
  return (
    <CardContent className={cn("p-4 space-y-4 bg-background rounded-b-xl", className)} {...props}>
      {children}
    </CardContent>
  );
}

/**
 * StyledSectionHeader - For headers within dialog/drawer content areas
 */
export function StyledSectionHeader({
  icon,
  iconColor = "bg-primary-gradient",
  title,
  className,
}: {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon && (
        <div className={cn("h-6 w-6 flex items-center justify-center rounded-lg", iconColor)}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, {
            className: "w-4 h-4 text-white"
          }) : icon}
        </div>
      )}
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

