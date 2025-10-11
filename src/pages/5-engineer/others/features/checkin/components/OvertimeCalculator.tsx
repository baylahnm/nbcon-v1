import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { Alert, AlertDescription } from "../../../../../1-HomePage/others/components/ui/alert";
import { 
  Clock, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Award,
  Calendar
} from "lucide-react";

interface OvertimeData {
  regularHours: number;
  overtimeHours: number;
  regularRate: number; // SAR per hour
  overtimeRate: number; // SAR per hour (usually 1.5x)
  totalEarnings: number;
  weeklyLimit: number; // Max allowed overtime per week
}

interface OvertimeCalculatorProps {
  checkInTime?: string;
  checkOutTime?: string;
  shiftStart?: string;
  shiftEnd?: string;
}

export function OvertimeCalculator({ 
  checkInTime, 
  checkOutTime,
  shiftStart = "07:00",
  shiftEnd = "15:00"
}: OvertimeCalculatorProps) {
  // Calculate hours worked
  const calculateHours = () => {
    if (!checkInTime || !checkOutTime) {
      return { total: 0, regular: 0, overtime: 0 };
    }

    // For demo, using mock data
    const totalHours = 9.5; // Worked 9.5 hours
    const regularHours = 8; // Standard 8-hour shift
    const overtimeHours = totalHours - regularHours;

    return { total: totalHours, regular: regularHours, overtime: Math.max(0, overtimeHours) };
  };

  const hours = calculateHours();

  const overtimeData: OvertimeData = {
    regularHours: hours.regular,
    overtimeHours: hours.overtime,
    regularRate: 300, // SAR per hour
    overtimeRate: 450, // 1.5x SAR per hour
    totalEarnings: (hours.regular * 300) + (hours.overtime * 450),
    weeklyLimit: 12 // Max 12 hours overtime per week
  };

  // Mock weekly overtime total
  const weeklyOvertimeUsed = 6.5;
  const overtimePercentage = (weeklyOvertimeUsed / overtimeData.weeklyLimit) * 100;
  const remainingOvertime = overtimeData.weeklyLimit - weeklyOvertimeUsed;

  const overtimeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = overtimeCardRef.current;
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

  return (
    <div
      ref={overtimeCardRef}
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
            <div className="bg-orange-500 h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">Overtime Calculator</div>
              <p className="text-xs text-muted-foreground mt-0.5">Track extra hours and earnings</p>
            </div>
          </div>
          {overtimeData.overtimeHours > 0 && (
            <Badge className="bg-orange-600">
              <Award className="w-3 h-3 mr-1" />
              +{overtimeData.overtimeHours}h OT
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
        {/* Today's Hours Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Regular Hours</div>
                <div className="text-lg font-bold">{overtimeData.regularHours}h</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">@{overtimeData.regularRate} SAR/h</div>
              <div className="text-lg font-bold text-blue-600">
                {(overtimeData.regularHours * overtimeData.regularRate).toLocaleString()} SAR
              </div>
            </div>
          </div>

          {overtimeData.overtimeHours > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Overtime Hours</div>
                  <div className="text-lg font-bold text-orange-600">{overtimeData.overtimeHours}h</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">@{overtimeData.overtimeRate} SAR/h (1.5x)</div>
                <div className="text-lg font-bold text-orange-600">
                  {(overtimeData.overtimeHours * overtimeData.overtimeRate).toLocaleString()} SAR
                </div>
              </div>
            </div>
          )}

          {/* Total Today */}
          <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border-2 border-green-500/20">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Total Today</div>
                <div className="text-2xl font-bold text-green-600">
                  {overtimeData.totalEarnings.toLocaleString()} SAR
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-xl font-bold">{hours.total}h</div>
            </div>
          </div>
        </div>

        {/* Weekly Overtime Limit */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Overtime Used</span>
            <span className="text-sm font-bold">
              {weeklyOvertimeUsed}h / {overtimeData.weeklyLimit}h
            </span>
          </div>
          
          <Progress value={overtimePercentage} className="h-2" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {remainingOvertime}h remaining this week
            </span>
            <Badge 
              variant="outline"
              className={
                overtimePercentage >= 90 
                  ? "bg-red-500/10 text-red-600 border-red-500/20" 
                  : overtimePercentage >= 70
                  ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                  : "bg-green-500/10 text-green-600 border-green-500/20"
              }
            >
              {overtimePercentage.toFixed(0)}% Used
            </Badge>
          </div>
        </div>

        {/* Overtime Alert */}
        {overtimePercentage >= 90 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're approaching your weekly overtime limit. Additional overtime may require manager approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Earnings Forecast */}
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">This Week Forecast</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Regular</div>
              <div className="font-bold">40h × 300 = 12,000 SAR</div>
            </div>
            <div>
              <div className="text-muted-foreground">Overtime</div>
              <div className="font-bold text-orange-600">{weeklyOvertimeUsed}h × 450 = {(weeklyOvertimeUsed * 450).toLocaleString()} SAR</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/20">
            <div className="flex items-center justify-between font-bold">
              <span>Projected Total</span>
              <span className="text-lg text-green-600">
                {(12000 + (weeklyOvertimeUsed * 450)).toLocaleString()} SAR
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

