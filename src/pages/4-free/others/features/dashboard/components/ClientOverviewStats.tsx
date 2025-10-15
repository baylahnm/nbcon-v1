import { useRef, useEffect } from 'react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Briefcase, Users, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

// Liquid Wave Animation Component
const LiquidWaveAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave 1 - Primary (Front) */}
      <svg 
        className="absolute bottom-0 w-[200%] h-full animate-wave" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ 
          animationDuration: '8s',
          animationTimingFunction: 'ease-in-out'
        }}
      >
        <path 
          fill="hsl(var(--primary) / 0.12)" 
          d="M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60 L1200,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60 L1200,120 L0,120 Z;
              M0,60 C150,40 350,80 600,60 C850,40 1050,80 1200,60 L1200,120 L0,120 Z;
              M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Wave 2 - Secondary (Middle) */}
      <svg 
        className="absolute bottom-0 w-[200%] h-full animate-wave-delayed" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ 
          animationDuration: '10s',
          animationTimingFunction: 'ease-in-out'
        }}
      >
        <path 
          fill="hsl(var(--primary) / 0.08)" 
          d="M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,120 L0,120 Z;
              M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 L1200,120 L0,120 Z;
              M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Wave 3 - Tertiary (Back) */}
      <svg 
        className="absolute bottom-0 w-[200%] h-full animate-wave-slow" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ 
          animationDuration: '12s',
          animationTimingFunction: 'ease-in-out'
        }}
      >
        <path 
          fill="hsl(var(--primary) / 0.05)" 
          d="M0,80 C250,100 450,60 600,80 C750,100 950,60 1200,80 L1200,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,80 C250,100 450,60 600,80 C750,100 950,60 1200,80 L1200,120 L0,120 Z;
              M0,80 C250,60 450,100 600,80 C750,60 950,100 1200,80 L1200,120 L0,120 Z;
              M0,80 C250,100 450,60 600,80 C750,100 950,60 1200,80 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5" />
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'amber' | 'green' | 'purple';
  onClick?: () => void;
}

function StatCard({ icon: Icon, label, value, trend, color = 'blue', onClick }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colors = {
    blue: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    amber: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    green: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    purple: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
  };

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden transition-all duration-300"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      {/* Liquid Wave Animation - Behind Content */}
      <LiquidWaveAnimation />
      
      <Card 
        className="cursor-pointer bg-transparent border-0 relative z-10"
        onClick={onClick}
      >
        <CardContent className="p-5 relative z-20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`${colors[color].bg} h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${colors[color].icon}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs mt-1.5 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ClientOverviewStatsProps {
  activeProjects?: number;
  totalEngineers?: number;
  pendingQuotes?: number;
  totalSpent?: string;
  onStatClick?: (stat: string) => void;
}

export function ClientOverviewStats({
  activeProjects = 6,
  totalEngineers = 24,
  pendingQuotes = 8,
  totalSpent = '1,245,000 SAR',
  onStatClick
}: ClientOverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Briefcase}
        label="Active Projects"
        value={activeProjects}
        trend={{ value: 15, isPositive: true }}
        color="blue"
        onClick={() => onStatClick?.('projects')}
      />
      
      <StatCard
        icon={Users}
        label="Total Engineers"
        value={totalEngineers}
        trend={{ value: 8, isPositive: true }}
        color="blue"
        onClick={() => onStatClick?.('engineers')}
      />
      
      <StatCard
        icon={Clock}
        label="Pending Quotes"
        value={pendingQuotes}
        color="amber"
        onClick={() => onStatClick?.('quotes')}
      />
      
      <StatCard
        icon={DollarSign}
        label="Total Spent (YTD)"
        value={totalSpent}
        trend={{ value: 22, isPositive: true }}
        color="green"
        onClick={() => onStatClick?.('finance')}
      />
    </div>
  );
}

export default ClientOverviewStats;

