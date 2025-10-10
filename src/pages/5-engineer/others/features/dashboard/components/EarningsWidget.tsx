import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';
import { DollarSign, TrendingUp, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

interface EarningsWidgetProps {
  weeklyEarnings?: string;
  monthlyEarnings?: string;
  monthlyGrowth?: number;
}

export function EarningsWidget({
  weeklyEarnings = '12,750 SAR',
  monthlyEarnings = '52,800 SAR',
  monthlyGrowth = 12
}: EarningsWidgetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');

  // Chart data for last 6 months
  const earningsData = [
    { month: 'Jul', earnings: 38500 },
    { month: 'Aug', earnings: 41200 },
    { month: 'Sep', earnings: 45800 },
    { month: 'Oct', earnings: 47100 },
    { month: 'Nov', earnings: 51200 },
    { month: 'Dec', earnings: 52800 },
  ];

  // Payment status data
  const paymentStatus = [
    { status: 'Paid', count: 3, amount: '42,000 SAR', color: 'text-green-600', bgColor: 'bg-green-500/10', icon: CheckCircle2 },
    { status: 'Pending', count: 2, amount: '18,500 SAR', color: 'text-amber-600', bgColor: 'bg-amber-500/10', icon: Clock },
    { status: 'Overdue', count: 1, amount: '8,200 SAR', color: 'text-red-600', bgColor: 'bg-red-500/10', icon: FileText },
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2.5 rounded-xl ring-1 ring-green-500/20">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Earnings Overview</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your financial summary
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link to="/engineer/finance">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Details
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* This Week/Month Toggle */}
        <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as 'week' | 'month')}>
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4 mt-4">
            {/* Weekly Earnings */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Total Earned</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">
                  Weekly
                </Badge>
              </div>
              <p className="text-xl font-bold tracking-tight">{weeklyEarnings}</p>
              <p className="text-xs text-muted-foreground mt-1">
                From ongoing projects
              </p>
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-4 mt-4">
            {/* Monthly Earnings */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Total Earned</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{monthlyGrowth}%
                </Badge>
              </div>
              <p className="text-xl font-bold tracking-tight">{monthlyEarnings}</p>
              <p className="text-xs text-muted-foreground mt-1">
                vs last month: {Math.round(parseFloat(monthlyEarnings.replace(/[^\d.]/g, '')) / (1 + monthlyGrowth / 100)).toLocaleString()} SAR
              </p>
            </div>

            {/* Earnings Chart */}
            <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-3">Last 6 Months Trend</p>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} SAR`, 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Status */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2.5">Payment Status</p>
          <div className="space-y-2">
            {paymentStatus.map((payment) => (
              <div
                key={payment.status}
                className={`${payment.bgColor} rounded-lg p-3 flex items-center justify-between border border-border/30`}
              >
                <div className="flex items-center gap-2.5">
                  <payment.icon className={`h-4 w-4 ${payment.color}`} />
                  <div>
                    <p className="text-sm font-medium">{payment.status}</p>
                    <p className="text-xs text-muted-foreground">{payment.count} invoice{payment.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${payment.color}`}>{payment.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

