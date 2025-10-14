import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, 
  MoreHorizontal, Eye, BarChart3, Calendar, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface FinancialMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const mockFinancialMetrics: FinancialMetric[] = [
  {
    id: '1',
    label: 'Monthly Revenue',
    value: '2,450,000 SAR',
    change: 18.5,
    isPositive: true,
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: '2',
    label: 'Pending Payments',
    value: '450,000 SAR',
    change: -5.2,
    isPositive: false,
    icon: CreditCard,
    color: 'text-amber-600'
  },
  {
    id: '3',
    label: 'Total Budget',
    value: '15,200,000 SAR',
    change: 12.3,
    isPositive: true,
    icon: BarChart3,
    color: 'text-blue-600'
  },
  {
    id: '4',
    label: 'Expenses',
    value: '1,850,000 SAR',
    change: 8.7,
    isPositive: false,
    icon: TrendingDown,
    color: 'text-red-600'
  }
];

interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  daysOverdue?: number;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    client: 'NEOM Authority',
    amount: '125,000 SAR',
    status: 'paid',
    dueDate: '2024-01-15'
  },
  {
    id: '2',
    client: 'Saudi Aramco',
    amount: '85,000 SAR',
    status: 'pending',
    dueDate: '2024-01-20'
  },
  {
    id: '3',
    client: 'SABIC',
    amount: '45,000 SAR',
    status: 'overdue',
    dueDate: '2024-01-10',
    daysOverdue: 5
  },
  {
    id: '4',
    client: 'Red Sea Global',
    amount: '200,000 SAR',
    status: 'pending',
    dueDate: '2024-01-25'
  }
];

export function FinancialOverviewWidget() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-600 ring-green-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 ring-amber-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-600 ring-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 ring-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
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
      <Card className="bg-transparent border-0 h-full">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 h-[40px] w-[40px] flex items-center justify-center rounded-xl ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Financial Overview</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track revenue, expenses, and cash flow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                Q1 2024
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {mockFinancialMetrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <div key={metric.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${metric.color}`} />
                        <span className="text-xs text-muted-foreground">{metric.label}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.isPositive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span>{metric.isPositive ? '+' : ''}{metric.change}%</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-foreground">{metric.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent Invoices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Recent Invoices</h4>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              
              {mockInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status);
                return (
                  <div key={invoice.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-medium text-foreground truncate">{invoice.client}</h5>
                        <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{invoice.amount}</span>
                        <span>•</span>
                        <span>Due: {invoice.dueDate}</span>
                        {invoice.daysOverdue && (
                          <>
                            <span>•</span>
                            <span className="text-red-600">{invoice.daysOverdue} days overdue</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Budget Utilization</h4>
                <span className="text-xs text-muted-foreground">78% used</span>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Used: 11.8M SAR</span>
                <span>Total: 15.2M SAR</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                View Reports
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                All Invoices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
