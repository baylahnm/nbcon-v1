import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="p-6">
        <CardContent className="flex flex-col items-center gap-3">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
