import { useRef, useEffect } from 'react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { 
  Briefcase, Users, DollarSign, FileText, Building2, TrendingUp, 
  TrendingDown, Target, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'amber' | 'green' | 'purple' | 'indigo' | 'emerald';
  onClick?: () => void;
  subtitle?: string;
}

function StatCard({ icon: Icon, label, value, trend, color = 'blue', onClick, subtitle }: StatCardProps) {
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
      bg: 'bg-blue-500/10', 
      icon: 'text-blue-600', 
      ring: 'ring-blue-500/20',
      gradient: 'from-blue-500/10 to-transparent'
    },
    amber: { 
      bg: 'bg-amber-500/10', 
      icon: 'text-amber-600', 
      ring: 'ring-amber-500/20',
      gradient: 'from-amber-500/10 to-transparent'
    },
    green: { 
      bg: 'bg-green-500/10', 
      icon: 'text-green-600', 
      ring: 'ring-green-500/20',
      gradient: 'from-green-500/10 to-transparent'
    },
    purple: { 
      bg: 'bg-purple-500/10', 
      icon: 'text-purple-600', 
      ring: 'ring-purple-500/20',
      gradient: 'from-purple-500/10 to-transparent'
    },
    indigo: { 
      bg: 'bg-indigo-500/10', 
      icon: 'text-indigo-600', 
      ring: 'ring-indigo-500/20',
      gradient: 'from-indigo-500/10 to-transparent'
    },
    emerald: { 
      bg: 'bg-emerald-500/10', 
      icon: 'text-emerald-600', 
      ring: 'ring-emerald-500/20',
      gradient: 'from-emerald-500/10 to-transparent'
    },
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-0.5"
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
        className="cursor-pointer bg-transparent border-0 h-full"
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`${colors[color].bg} h-[32px] w-[32px] flex items-center justify-center rounded-lg ring-1 ${colors[color].ring} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${colors[color].icon}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
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

interface EnterpriseOverviewStatsProps {
  activeProjects?: number;
  teamMembers?: number;
  monthlyRevenue?: string;
  pendingApprovals?: number;
  vendorPartnerships?: number;
  onStatClick?: (stat: string) => void;
}

export function EnterpriseOverviewStats({
  activeProjects = 24,
  teamMembers = 156,
  monthlyRevenue = '2,450,000 SAR',
  pendingApprovals = 8,
  vendorPartnerships = 42,
  onStatClick
}: EnterpriseOverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        icon={Briefcase}
        label="Active Projects"
        value={activeProjects}
        color="blue"
        onClick={() => onStatClick?.('projects')}
        subtitle="Across all departments"
      />
      
      <StatCard
        icon={Users}
        label="Team Members"
        value={teamMembers}
        color="indigo"
        onClick={() => onStatClick?.('team')}
        subtitle="Active employees"
      />
      
      <StatCard
        icon={DollarSign}
        label="Monthly Revenue"
        value={monthlyRevenue}
        trend={{ value: 18, isPositive: true }}
        color="green"
        onClick={() => onStatClick?.('finance')}
        subtitle="This month"
      />
      
      <StatCard
        icon={FileText}
        label="Pending Approvals"
        value={pendingApprovals}
        color="amber"
        onClick={() => onStatClick?.('analytics')}
        subtitle="Require attention"
      />
      
      <StatCard
        icon={Building2}
        label="Vendor Partners"
        value={vendorPartnerships}
        color="purple"
        onClick={() => onStatClick?.('vendors')}
        subtitle="Active partnerships"
      />
    </div>
  );
}
