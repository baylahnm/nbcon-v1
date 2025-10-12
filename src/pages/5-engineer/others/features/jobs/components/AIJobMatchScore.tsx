import { useEffect } from "react";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../../1-HomePage/others/components/ui/card";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";

interface MatchCriteria {
  name: string;
  match: number; // 0-100
  weight: number; // importance weight
  status: "excellent" | "good" | "fair" | "poor";
}

interface AIJobMatchScoreProps {
  jobId: string;
  jobSkills: string[];
  userSkills?: string[];
  overallMatch?: number;
}

export function AIJobMatchScore({ 
  jobId, 
  jobSkills = [],
  userSkills = ["STAAD.Pro", "ETABS", "AutoCAD", "Structural Analysis"],
  overallMatch 
}: AIJobMatchScoreProps) {
  // Calculate match score based on skills overlap
  const calculateMatch = () => {
    if (!jobSkills || jobSkills.length === 0) return 85; // Default score if no skills provided
    
    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    return Math.round((matchedSkills.length / jobSkills.length) * 100);
  };

  const matchScore = overallMatch || calculateMatch();

  // Mock criteria breakdown
  const criteria: MatchCriteria[] = [
    { name: "Skills Match", match: matchScore, weight: 40, status: matchScore >= 80 ? "excellent" : matchScore >= 60 ? "good" : "fair" },
    { name: "Experience Level", match: 85, weight: 30, status: "excellent" },
    { name: "Location Preference", match: 70, weight: 15, status: "good" },
    { name: "Salary Expectations", match: 90, weight: 15, status: "excellent" }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-500/10 border-green-500/20";
    if (score >= 70) return "text-blue-600 bg-blue-500/10 border-blue-500/20";
    if (score >= 50) return "text-orange-600 bg-orange-500/10 border-orange-500/20";
    return "text-red-600 bg-red-500/10 border-red-500/20";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Good Match";
    if (score >= 50) return "Fair Match";
    return "Low Match";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "good": return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "fair": return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card 
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      className="gap-0"
    >
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${matchScore >= 70 ? 'bg-primary' : 'bg-orange-500'} h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">AI Match Score</div>
              <p className="text-xs text-muted-foreground mt-0.5">How well you match this job</p>
            </div>
          </div>
          <Badge variant="outline" className={`${getMatchColor(matchScore)} font-bold text-lg px-3 py-1`}>
            {matchScore}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{getMatchLabel(matchScore)}</span>
            {matchScore >= 70 && (
              <span className="text-green-600 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Recommended
              </span>
            )}
          </div>
          <Progress value={matchScore} className="h-2" />
        </div>

        {/* Criteria Breakdown */}
        <div className="space-y-2">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-1">
                {getStatusIcon(criterion.status)}
                <span className="text-muted-foreground">{criterion.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={criterion.match} className="h-1.5 w-16" />
                <span className="font-medium w-8 text-right">{criterion.match}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        {matchScore >= 70 && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400">
              <strong>AI Insight:</strong> Your profile is a strong match! Apply quickly as this opportunity aligns well with your skills and experience.
            </p>
          </div>
        )}

        {matchScore < 70 && matchScore >= 50 && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-xs text-orange-700 dark:text-orange-400">
              <strong>AI Tip:</strong> Consider highlighting your {userSkills[0]} experience in your application to improve your chances.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

