import { Target, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../../1-HomePage/others/components/ui/progress';
import { Button } from '../../../../../../1-HomePage/others/components/ui/button';

interface MiniSkillsGapProps {
  matchPercentage?: number;
  onViewFull?: () => void;
}

export function MiniSkillsGap({ matchPercentage = 0, onViewFull }: MiniSkillsGapProps) {
  const missingSkills = [
    { name: 'Project Management', level: 'required' },
    { name: 'Renewable Energy', level: 'preferred' },
  ];

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 h-8 w-8 flex items-center justify-center rounded-lg">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Skills Gap Analysis</h4>
            <p className="text-xs text-muted-foreground">Missing Skills</p>
          </div>
        </div>
        <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
          0 / 4 skills
        </Badge>
      </div>

      {/* Skills Match */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Skills Match</span>
          <span className="font-semibold">{matchPercentage}%</span>
        </div>
        <Progress value={matchPercentage} className="h-2" />
      </div>

      {/* Missing Skills */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold flex items-center gap-2 text-orange-600">
          <AlertTriangle className="w-3 h-3" />
          Top Missing Skills
        </h5>
        <div className="space-y-2">
          {missingSkills.map((skill, index) => (
            <div 
              key={index}
              className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium">{skill.name}</span>
                </div>
                <Badge className={`text-xs ${
                  skill.level === 'required' 
                    ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                    : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                }`}>
                  {skill.level}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onViewFull}
      >
        See All Gaps & Courses →
      </Button>
    </div>
  );
}

