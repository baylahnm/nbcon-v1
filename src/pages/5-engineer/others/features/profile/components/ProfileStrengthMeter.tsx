import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

interface ProfileStrengthMeterProps {
  completionPercentage: number;
  profileData: any;
}

export function ProfileStrengthMeter({ completionPercentage, profileData }: ProfileStrengthMeterProps) {
  // Generate completion items from real data
  const completion = {
    percentage: completionPercentage,
    items: [
      { label: 'Profile photo', completed: !!profileData.avatar_url },
      { label: 'Professional bio', completed: !!profileData.bio },
      { label: `Skills added (${profileData.skills?.length || 0})`, completed: profileData.skills?.length >= 3 },
      { label: `Projects showcased (${profileData.portfolio?.length || 0})`, completed: profileData.portfolio?.length >= 1 },
      { label: 'Work experience', completed: false }, // Not tracked yet
      { label: 'Education added', completed: false }, // Not tracked yet
      { label: 'SCE license verified', completed: !!profileData.sce_license_number },
      { label: 'Add 2 more certifications', completed: profileData.certifications?.length >= 2 },
      { label: 'Request 3 recommendations', completed: profileData.reviews?.length >= 3 },
      { label: 'Complete contact info', completed: !!profileData.email && !!profileData.phone },
    ]
  };

  const completedCount = completion.items.filter(item => item.completed).length;
  const totalCount = completion.items.length;

  const getStrengthLabel = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (percentage >= 70) return { label: 'Strong', color: 'text-primary' };
    if (percentage >= 50) return { label: 'Good', color: 'text-blue-600' };
    return { label: 'Needs Work', color: 'text-amber-600' };
  };

  const strength = getStrengthLabel(completion.percentage);

  return (
    <Card className="gap-0 border-border/50 sticky top-6">
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Profile Strength</h3>
          <Badge 
            variant="outline" 
            className={`${strength.color} border-0 ring-1 ring-current/20 text-xs px-2.5 py-1`}
          >
            {strength.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 bg-background rounded-b-xl">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount} completed
            </span>
            <span className="text-sm font-bold text-primary">
              {completion.percentage}%
            </span>
          </div>
          <Progress value={completion.percentage} className="h-2" />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {completion.items.map((item, index) => (
            <div 
              key={index}
              className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors ${
                item.completed 
                  ? 'hover:bg-green-500/5' 
                  : 'hover:bg-amber-500/5'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              )}
              <span className={`text-xs ${
                item.completed 
                  ? 'text-muted-foreground line-through' 
                  : 'font-medium'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tip */}
        {completion.percentage < 100 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-primary mb-1">
                  Complete your profile to stand out!
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Profiles with 90%+ completion get 3x more views
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

