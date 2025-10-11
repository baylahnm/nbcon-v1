import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, BarChart3, Star, Briefcase, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';

interface YourRankCardProps {
  currentRank: number;
  previousRank: number;
  allTimeBestRank: number;
  totalEngineers: number;
  currentScore: number;
  nextTier: {
    name: string;
    rankCutoff: number;
    prize: string;
  };
}

export function YourRankCard({
  currentRank,
  previousRank,
  allTimeBestRank,
  totalEngineers,
  currentScore,
  nextTier
}: YourRankCardProps) {
  const rankChange = previousRank - currentRank; // Positive = moved up
  const percentile = ((1 - currentRank / totalEngineers) * 100).toFixed(1);
  const ranksToClimb = currentRank - nextTier.rankCutoff;
  const progressToNextTier = Math.max(0, Math.min(100, (1 - ranksToClimb / currentRank) * 100));

  // Mock improvement tips based on current performance
  const improvementTips = [
    { 
      label: 'Maintain 4.8+ average rating',
      current: 4.6,
      target: 4.8,
      status: 'warning' as const,
      icon: Star
    },
    {
      label: 'Complete 5 more projects this quarter',
      current: 12,
      target: 17,
      status: 'warning' as const,
      icon: Briefcase
    },
    {
      label: 'Get 3 client recommendations',
      current: 2,
      target: 5,
      status: 'warning' as const,
      icon: Award
    },
    {
      label: 'Add 2 certifications',
      current: 1,
      target: 3,
      status: 'warning' as const,
      icon: Award
    }
  ];

  const getTrendIcon = () => {
    if (rankChange > 0) return { Icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-500/10', text: `Up ${rankChange}` };
    if (rankChange < 0) return { Icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-500/10', text: `Down ${Math.abs(rankChange)}` };
    return { Icon: Minus, color: 'text-gray-600', bg: 'bg-gray-500/10', text: 'No change' };
  };

  const trend = getTrendIcon();
  const TrendIcon = trend.Icon;

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold">Your Ranking</h2>
            <p className="text-xs text-muted-foreground">Personal performance tracker</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rank Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Current Rank */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Current Rank</p>
            <div className="text-3xl font-bold text-primary tracking-tight">#{currentRank}</div>
            <div className={`flex items-center justify-center gap-1 mt-2 text-xs ${trend.color}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="font-medium">{trend.text}</span>
            </div>
          </div>

          {/* Last Month */}
          <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/40">
            <p className="text-xs text-muted-foreground mb-2">Last Month</p>
            <div className="text-3xl font-bold tracking-tight">#{previousRank}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {rankChange > 0 ? 'Improved!' : rankChange < 0 ? 'Dropped' : 'Stable'}
            </p>
          </div>

          {/* All-Time Best */}
          <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/40">
            <p className="text-xs text-muted-foreground mb-2">All-Time Best</p>
            <div className="text-3xl font-bold tracking-tight">#{allTimeBestRank}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {allTimeBestRank === currentRank ? 'Current best!' : 'Jun 2024'}
            </p>
          </div>
        </div>

        {/* Percentile */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary">
          <p className="text-sm font-semibold mb-1">
            You're in the <span className="text-primary text-lg">Top {percentile}%</span> of {totalEngineers.toLocaleString()} engineers
          </p>
          <p className="text-xs text-muted-foreground">
            Score: {currentScore}/1000 points
          </p>
        </div>

        {/* Next Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold">Next Goal: {nextTier.name}</h3>
            </div>
            <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-purple-500/10 text-purple-600 border-purple-500/20">
              Rank #{nextTier.rankCutoff} or higher
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress to {nextTier.name}</span>
              <span className="font-medium">
                {ranksToClimb > 0 ? `Need to climb ${ranksToClimb} ranks` : 'Achieved! 🎉'}
              </span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>

          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs font-medium text-purple-900">
              {nextTier.prize}
            </p>
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold">How to Improve Your Rank:</h3>
          </div>

          <div className="space-y-2">
            {improvementTips.map((tip, index) => {
              const TipIcon = tip.icon;
              const isComplete = tip.current >= tip.target;
              
              return (
                <div 
                  key={index}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border transition-colors ${
                    isComplete 
                      ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10' 
                      : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">
                      {tip.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={(tip.current / tip.target) * 100} className="h-1 flex-1" />
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {tip.current}/{tip.target}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border/30">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              document.getElementById('rank-trend-chart')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-8"
          >
            <BarChart3 className="h-3 w-3 mr-1.5" />
            View Analytics
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              const event = new CustomEvent('openRankingModal');
              window.dispatchEvent(event);
            }}
            className="flex-1 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs h-8"
          >
            <Lightbulb className="h-3 w-3 mr-1.5" />
            See Formula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

