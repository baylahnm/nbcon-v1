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
  };

  return (
    <Card 
      className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-border/50 overflow-hidden relative"
      onClick={onClick}
      style={{
        backgroundImage: `linear-gradient(135deg, ${colors[color].gradient})`,
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`${colors[color].bg} p-3 rounded-xl ring-1 ${colors[color].ring} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-5 w-5 ${colors[color].icon}`} />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold tracking-tight">{value}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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

