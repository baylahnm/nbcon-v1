import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Target,
  Award,
  Zap
} from "lucide-react";

interface WeeklySummaryProps {
  weekData?: {
    totalHours: number;
    daysWorked: number;
    overtimeHours: number;
    earnings: number;
    attendanceRate: number;
    streak: number;
  };
  monthData?: {
    totalHours: number;
    daysWorked: number;
    overtimeHours: number;
    earnings: number;
    attendanceRate: number;
  };
}

export function WeeklySummary({ weekData, monthData }: WeeklySummaryProps) {
  // Default mock data if not provided
  const defaultWeekData = {
    totalHours: 42.5,
    daysWorked: 5,
    overtimeHours: 2.5,
    earnings: 12750,
    attendanceRate: 100,
    streak: 8
  };

  const defaultMonthData = {
    totalHours: 176,
    daysWorked: 22,
    overtimeHours: 16,
    earnings: 52800,
    attendanceRate: 95.7
  };

  const week = weekData || defaultWeekData;
  const month = monthData || defaultMonthData;
  
  const thisWeekCardRef = useRef<HTMLDivElement>(null);
  const thisMonthCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupMouseTracking = (cardRef: React.RefObject<HTMLDivElement>) => {
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
    };

    const cleanup1 = setupMouseTracking(thisWeekCardRef);
    const cleanup2 = setupMouseTracking(thisMonthCardRef);

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* This Week Summary */}
      <div
        ref={thisWeekCardRef}
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
      <Card className="bg-transparent border-0 gap-0">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base font-bold">This Week</div>
                <p className="text-xs text-muted-foreground mt-0.5">Weekly performance summary</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Zap className="w-3 h-3 mr-1" />
              {week.streak} Day Streak
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Hours */}
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-600">
                {week.totalHours}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Hours</div>
            </div>

            {/* Days Worked */}
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">
                {week.daysWorked}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Days Worked</div>
            </div>

            {/* Overtime */}
            <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-600">
                {week.overtimeHours}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Overtime (h)</div>
            </div>

            {/* Earnings */}
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-600">
                {week.earnings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Earnings (SAR)</div>
            </div>

            {/* Attendance */}
            <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-600">
                {week.attendanceRate}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Attendance</div>
            </div>

            {/* Average Hours/Day */}
            <div className="text-center p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <div className="text-2xl font-bold text-pink-600">
                {(week.totalHours / week.daysWorked).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Avg. Hours/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* This Month Summary */}
      <div
        ref={thisMonthCardRef}
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
      <Card className="bg-transparent border-0 gap-0">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-3">
            <div className="bg-green-500 h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">This Month</div>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly performance overview</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Hours</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {month.totalHours}h
                </div>
                <Progress value={(month.totalHours / 200) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Days Worked</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  {month.daysWorked}
                </div>
                <Progress value={(month.daysWorked / 23) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Overtime</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  {month.overtimeHours}h
                </div>
                <div className="text-xs text-muted-foreground">
                  +{(month.overtimeHours * 450).toLocaleString()} SAR
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  {month.earnings.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +12% vs last month
                </div>
              </div>
            </div>

            {/* Attendance Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="text-sm font-semibold">{month.attendanceRate}%</span>
              </div>
              <Progress value={month.attendanceRate} className="h-3" />
              <div className="text-xs text-muted-foreground">
                {month.daysWorked} of 23 working days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

