import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../1-HomePage/others/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Award, 
  Clock,
  Target,
  Flame
} from "lucide-react";

interface CheckInAnalyticsProps {
  showStreaks?: boolean;
}

export function CheckInAnalytics({ showStreaks = true }: CheckInAnalyticsProps) {
  // Mock data for charts
  const weeklyHoursData = [
    { day: "Mon", hours: 8.5, overtime: 0.5 },
    { day: "Tue", hours: 8.0, overtime: 0 },
    { day: "Wed", hours: 9.0, overtime: 1.0 },
    { day: "Thu", hours: 8.2, overtime: 0.2 },
    { day: "Fri", hours: 8.8, overtime: 0.8 },
    { day: "Sat", hours: 0, overtime: 0 },
    { day: "Sun", hours: 0, overtime: 0 }
  ];

  const monthlyTrendData = [
    { week: "Week 1", hours: 42, earnings: 12750 },
    { week: "Week 2", hours: 40, earnings: 12000 },
    { week: "Week 3", hours: 44, earnings: 13500 },
    { week: "Week 4", hours: 42.5, earnings: 12950 }
  ];

  const projectDistributionData = [
    { name: "NEOM Smart City", hours: 85, value: 48 },
    { name: "Aramco Refinery", hours: 56, value: 32 },
    { name: "Red Sea Marina", hours: 35, value: 20 }
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const currentStreak = 8;
  const longestStreak = 15;
  const averageHoursPerDay = 8.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Weekly Hours Chart */}
          <TabsContent value="weekly" className="space-y-4">
            {showStreaks && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>

                <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{longestStreak}</div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>

                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{averageHoursPerDay}</div>
                  <div className="text-xs text-muted-foreground">Avg Hours/Day</div>
                </div>
              </div>
            )}

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="hours" fill="#3b82f6" name="Regular Hours" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overtime" fill="#f59e0b" name="Overtime" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Monthly Trends */}
          <TabsContent value="trends" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Hours Worked"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Earnings (SAR)"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Peak Week</div>
                <div className="text-lg font-bold">Week 3 - 44 hours</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Most Productive Day</div>
                <div className="text-lg font-bold">Wednesday (9.2h avg)</div>
              </div>
            </div>
          </TabsContent>

          {/* Project Distribution */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Project Breakdown */}
              <div className="space-y-3">
                {projectDistributionData.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <span className="font-bold">{project.hours}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all" 
                          style={{ 
                            width: `${project.value}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{project.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Most Time Spent</div>
                <div className="font-bold text-blue-600">NEOM Smart City</div>
                <div className="text-xs text-muted-foreground">85 hours (48%)</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Active Projects</div>
                <div className="font-bold text-green-600">3 Projects</div>
                <div className="text-xs text-muted-foreground">176 total hours</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

