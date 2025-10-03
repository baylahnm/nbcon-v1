import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Engineer } from "@/data/engineers";

interface PerformanceChartPopoverProps {
  engineer: Engineer;
  children: React.ReactNode;
}

export function PerformanceChartPopover({ engineer, children }: PerformanceChartPopoverProps) {
  const [open, setOpen] = useState(false);

  // Prepare chart data for 6-month ranking history
  const chartData = engineer.rankingHistory.map(item => ({
    month: item.month.split(' ')[0], // Just the month
    rank: item.rank
  })).reverse(); // Show chronological order

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {children}
      </PopoverTrigger>
       <PopoverContent 
         className="w-80 p-4 bg-background border-border" 
         align="center"
         onMouseEnter={() => setOpen(true)} 
         onMouseLeave={() => setOpen(false)}
       >
         <div className="space-y-3">
           <div className="text-center">
             <h4 className="font-semibold text-foreground">{engineer.name}</h4>
             <p className="text-sm text-muted-foreground">6-Month Ranking Performance</p>
           </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis reversed domain={[1, 20]} />
                <Tooltip 
                  formatter={(value: number) => [`#${value}`, 'Rank']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="rank" 
                  stroke={engineer.rankingChange >= 0 ? "#16a34a" : "#dc2626"} 
                  strokeWidth={2}
                  dot={{ fill: engineer.rankingChange >= 0 ? "#16a34a" : "#dc2626", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
           <div className="text-xs text-muted-foreground text-center">
             Best: #{Math.min(...engineer.rankingHistory.map(h => h.rank))} • 
             Avg: #{Math.round(engineer.rankingHistory.reduce((sum, h) => sum + h.rank, 0) / engineer.rankingHistory.length)}
           </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
