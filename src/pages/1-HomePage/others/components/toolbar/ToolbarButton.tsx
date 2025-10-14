import React from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  variant = 'ghost',
  size = 'sm'
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      case 'icon': return 'h-10 w-10';
      default: return 'h-10 w-10';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={`
              ${getSizeClass()} p-0 rounded-md transition-all duration-200
              ${isActive 
                ? 'bg-primary/20 text-primary border-primary/30' 
                : variant === 'default' 
                  ? 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
