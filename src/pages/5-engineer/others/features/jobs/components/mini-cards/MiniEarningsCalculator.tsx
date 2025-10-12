import { Calculator, TrendingUp, Wallet } from 'lucide-react';
import { Badge } from '../../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../../1-HomePage/others/components/ui/button';

interface MiniEarningsCalculatorProps {
  onOpenCalculator?: () => void;
}

export function MiniEarningsCalculator({ onOpenCalculator }: MiniEarningsCalculatorProps) {
  return (
    <div className="w-80 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 h-8 w-8 flex items-center justify-center rounded-lg">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Earnings Calculator</h4>
            <p className="text-xs text-muted-foreground">Quick Estimate</p>
          </div>
        </div>
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          Full-time
        </Badge>
      </div>

      {/* Quick Results */}
      <div className="space-y-3 p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Earnings</span>
          <span className="font-bold">51,960 SAR</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contract Total</span>
          <span className="font-bold text-blue-600">155,880 SAR</span>
        </div>
        <div className="border-t pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>- Expenses (15%)</span>
            <span>-23,382 SAR</span>
          </div>
          <div className="flex items-center justify-between font-bold border-t pt-2">
            <span className="flex items-center gap-1 text-sm">
              <Wallet className="w-3 h-3 text-green-600" />
              Net Earnings
            </span>
            <span className="text-green-600">132,498 SAR</span>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="p-2 rounded-lg border bg-green-500/10 border-green-500/20">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">vs. Job Offer</span>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            +224.8%
          </Badge>
        </div>
      </div>

      {/* Action */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onOpenCalculator}
      >
        Open Full Calculator →
      </Button>
    </div>
  );
}

