import { Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '../../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../../1-HomePage/others/components/ui/progress';
import { Button } from '../../../../../../1-HomePage/others/components/ui/button';

interface MiniAIMatchScoreProps {
  score: number;
  onViewFull?: () => void;
}

export function MiniAIMatchScore({ score, onViewFull }: MiniAIMatchScoreProps) {
  const getMatchLevel = (score: number) => {
    if (score >= 80) return { text: 'Excellent Match', color: 'text-green-600', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' };
    if (score >= 60) return { text: 'Good Match', color: 'text-blue-600', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' };
    return { text: 'Fair Match', color: 'text-orange-600', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' };
  };

  const matchLevel = getMatchLevel(score);

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 flex items-center justify-center rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">AI Match Score</h4>
            <p className="text-xs text-muted-foreground">Quick Analysis</p>
          </div>
        </div>
        <Badge className={`${matchLevel.bgColor} ${matchLevel.color} ${matchLevel.borderColor} font-bold`}>
          {score}%
        </Badge>
      </div>

      {/* Match Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{matchLevel.text}</span>
          <span className={`flex items-center gap-1 ${matchLevel.color}`}>
            <TrendingUp className="w-3 h-3" />
            Recommended
          </span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      {/* Key Metrics */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-muted-foreground">Key Factors</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Skills Match</span>
            </div>
            <span className="font-medium">85%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Experience Level</span>
            </div>
            <span className="font-medium">85%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-blue-600" />
              <span>Location Match</span>
            </div>
            <span className="font-medium">70%</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onViewFull}
      >
        View Full Analysis →
      </Button>
    </div>
  );
}

