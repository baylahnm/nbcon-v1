import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Percent,
  Wallet
} from "lucide-react";

interface EarningsCalculatorProps {
  jobSalary?: { min: number; max: number; currency: string };
  jobBudget?: number;
  jobType: string;
  estimatedDuration?: number; // in months
}

export function EarningsCalculator({ 
  jobSalary,
  jobBudget,
  jobType,
  estimatedDuration = 3
}: EarningsCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(300);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [contractDuration, setContractDuration] = useState(estimatedDuration);
  const [taxRate, setTaxRate] = useState(0); // Saudi has no income tax for individuals
  const [expenseRate, setExpenseRate] = useState(15); // 15% for expenses

  const calculateEarnings = () => {
    const weeklyEarnings = hourlyRate * hoursPerWeek;
    const monthlyEarnings = weeklyEarnings * 4.33; // Average weeks per month
    const totalEarnings = monthlyEarnings * contractDuration;
    const expenses = totalEarnings * (expenseRate / 100);
    const taxes = totalEarnings * (taxRate / 100);
    const netEarnings = totalEarnings - expenses - taxes;

    return {
      weekly: weeklyEarnings,
      monthly: monthlyEarnings,
      total: totalEarnings,
      expenses,
      taxes,
      net: netEarnings
    };
  };

  const earnings = calculateEarnings();

  // Calculate average from job salary if provided
  const jobAverage = jobSalary 
    ? (jobSalary.min + jobSalary.max) / 2 
    : jobBudget || 0;

  const comparison = jobAverage > 0 
    ? ((earnings.monthly - jobAverage) / jobAverage * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Earnings Calculator
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            {jobType === 'freelance' || jobType === 'contract' ? 'Contract' : 'Full-time'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-xs">Hourly Rate (SAR)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursPerWeek" className="text-xs">Hours/Week</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="hoursPerWeek"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-xs">Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              value={contractDuration}
              onChange={(e) => setContractDuration(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses" className="text-xs">Expenses (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="expenses"
                type="number"
                value={expenseRate}
                onChange={(e) => setExpenseRate(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weekly Earnings</span>
            <span className="font-bold">{earnings.weekly.toLocaleString()} SAR</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Earnings</span>
            <span className="font-bold">{earnings.monthly.toLocaleString()} SAR</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Contract Total ({contractDuration} months)</span>
            <span className="font-bold text-blue-600">{earnings.total.toLocaleString()} SAR</span>
          </div>

          <div className="border-t pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>- Expenses ({expenseRate}%)</span>
              <span>-{earnings.expenses.toLocaleString()} SAR</span>
            </div>
            
            <div className="flex items-center justify-between font-bold border-t pt-2">
              <span className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-green-600" />
                Net Earnings
              </span>
              <span className="text-lg text-green-600">
                {earnings.net.toLocaleString()} SAR
              </span>
            </div>
          </div>
        </div>

        {/* Comparison with Job Offer */}
        {jobAverage > 0 && (
          <div className={`p-3 rounded-lg border ${
            Number(comparison) >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">vs. Job Offer</span>
              <Badge 
                variant="outline"
                className={Number(comparison) >= 0 
                  ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                  : 'bg-red-500/10 text-red-600 border-red-500/20'
                }
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {Number(comparison) >= 0 ? '+' : ''}{comparison}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Job offers {jobAverage.toLocaleString()} SAR/month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

