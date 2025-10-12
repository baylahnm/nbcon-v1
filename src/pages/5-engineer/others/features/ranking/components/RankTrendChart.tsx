import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Trophy, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

// Mock 12-month rank history
const mockRankHistory = [
  { month: 'Jan', rank: 72, score: 845 },
  { month: 'Feb', rank: 68, score: 852 },
  { month: 'Mar', rank: 65, score: 858 },
  { month: 'Apr', rank: 58, score: 867 },
  { month: 'May', rank: 52, score: 873 },
  { month: 'Jun', rank: 38, score: 890 }, // Best rank!
  { month: 'Jul', rank: 42, score: 885 },
  { month: 'Aug', rank: 45, score: 880 },
  { month: 'Sep', rank: 48, score: 878 },
  { month: 'Oct', rank: 52, score: 875 },
  { month: 'Nov', rank: 50, score: 885 },
  { month: 'Dec', rank: 47, score: 892 } // Current
];

export function RankTrendChart() {
  const bestRank = Math.min(...mockRankHistory.map(m => m.rank));
  const averageRank = Math.round(mockRankHistory.reduce((sum, m) => sum + m.rank, 0) / mockRankHistory.length);
  const currentRank = mockRankHistory[mockRankHistory.length - 1].rank;
  const yearChange = mockRankHistory[0].rank - currentRank;

  return (
    <Card 
      id="rank-trend-chart" 
      className="gap-0 group hover:shadow-lg transition-all duration-300 border-border/50"
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
    >
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Your Rank History</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months performance</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            12 Months
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 bg-background rounded-b-xl">
        {/* Chart */}
        <div className="h-[250px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRankHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                reversed={true}
                domain={[1, 100]}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Rank', angle: -90, position: 'insideLeft', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'rank') return [`#${value}`, 'Rank'];
                  return [value, 'Score'];
                }}
              />
              <ReferenceLine 
                y={bestRank} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="5 5"
                label={{ value: `Best: #${bestRank}`, fontSize: 10, fill: 'hsl(var(--primary))' }}
              />
              <ReferenceLine 
                y={averageRank} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3"
                label={{ value: `Avg: #${averageRank}`, fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="rank" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2.5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-3 w-3 text-green-600" />
              <span className="text-base font-bold text-green-600">#{bestRank}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Best Rank</p>
            <p className="text-[9px] text-muted-foreground">June 2024</p>
          </div>

          <div className="text-center p-2.5 rounded-lg bg-muted/50 border border-border/30">
            <span className="text-base font-bold">#{averageRank}</span>
            <p className="text-[10px] text-muted-foreground">Average</p>
            <p className="text-[9px] text-muted-foreground">12-month avg</p>
          </div>

          <div className="text-center p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-base font-bold text-primary">+{yearChange}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Year Change</p>
            <p className="text-[9px] text-muted-foreground">Improved!</p>
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-primary" />
            Performance Insights:
          </h4>
          <ul className="space-y-1 text-[10px] text-muted-foreground">
            <li>✅ Improved {yearChange} ranks over 12 months</li>
            <li>🏆 Best performance in June 2024 (Rank #{bestRank})</li>
            <li>📈 Upward trend from Jan to Jun (+34 positions)</li>
            <li>⚠️ Slight decline Jul-Oct, now recovering</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

