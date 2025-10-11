import { useRef, useEffect } from 'react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Briefcase, FileText, DollarSign, User, TrendingUp, TrendingDown } from 'lucide-react';

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
      className="relative overflow-hidden transition-all duration-300"
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
      <Card 
        className="cursor-pointer bg-transparent border-0"
        onClick={onClick}
      >
        <CardContent className="p-5">
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

interface OverviewStatsProps {
  activeProjects?: number;
  pendingInvoices?: number;
  pendingInvoicesAmount?: string;
  monthlyRevenue?: string;
  profileCompletion?: number;
  onStatClick?: (stat: string) => void;
}

export function OverviewStats({
  activeProjects = 6,
  pendingInvoices = 3,
  pendingInvoicesAmount = '45,000 SAR',
  monthlyRevenue = '52,800 SAR',
  profileCompletion = 85,
  onStatClick
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Briefcase}
        label="Active Projects"
        value={activeProjects}
        color="blue"
        onClick={() => onStatClick?.('projects')}
      />
      
      <StatCard
        icon={FileText}
        label="Pending Invoices"
        value={`${pendingInvoices} • ${pendingInvoicesAmount}`}
        color="amber"
        onClick={() => onStatClick?.('invoices')}
      />
      
      <StatCard
        icon={DollarSign}
        label="This Month Revenue"
        value={monthlyRevenue}
        trend={{ value: 12, isPositive: true }}
        color="green"
        onClick={() => onStatClick?.('revenue')}
      />
      
      <StatCard
        icon={User}
        label="Profile Completion"
        value={`${profileCompletion}%`}
        color="purple"
        onClick={() => onStatClick?.('profile')}
      />
    </div>
  );
}

