import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground">nb</span>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">nbcon</h1>
            <p className="text-muted-foreground">Engineering Excellence Platform</p>
          </div>
        )}
        
        <Card className="border-0 shadow-large">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2 auth-layout-title">{title}</h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
