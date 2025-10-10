import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Target, 
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  Award,
  AlertTriangle
} from "lucide-react";

interface SkillAnalysis {
  skill: string;
  hasSkill: boolean;
  proficiency?: number; // 0-100 if user has it
  importance: "required" | "preferred" | "nice-to-have";
  learningTime?: string; // e.g., "2 weeks", "3 months"
}

interface SkillsGapAnalysisProps {
  jobSkills: string[];
  userSkills?: string[];
}

export function SkillsGapAnalysis({ 
  jobSkills,
  userSkills = ["STAAD.Pro", "ETABS", "AutoCAD", "Structural Analysis", "Python"]
}: SkillsGapAnalysisProps) {
  // Analyze skills gap
  const analyzeSkills = (): SkillAnalysis[] => {
    return jobSkills.map((skill) => {
      const hasSkill = userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      );

      return {
        skill,
        hasSkill,
        proficiency: hasSkill ? Math.floor(Math.random() * 30) + 70 : undefined,
        importance: Math.random() > 0.7 ? "required" : Math.random() > 0.5 ? "preferred" : "nice-to-have",
        learningTime: !hasSkill ? ["1-2 weeks", "1 month", "2-3 months"][Math.floor(Math.random() * 3)] : undefined
      };
    });
  };

  const skillsAnalysis = analyzeSkills();
  const matchedSkills = skillsAnalysis.filter(s => s.hasSkill);
  const missingSkills = skillsAnalysis.filter(s => !s.hasSkill);
  const matchPercentage = (matchedSkills.length / skillsAnalysis.length) * 100;

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "required": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "preferred": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      }
    };
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 20px hsl(var(--primary) / 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Skills Gap Analysis
          </div>
          <Badge 
            variant="outline"
            className={matchPercentage >= 70 
              ? "bg-green-500/10 text-green-600 border-green-500/20" 
              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
            }
          >
            {matchedSkills.length} / {skillsAnalysis.length} skills
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skills Match</span>
            <span className="font-semibold">{matchPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={matchPercentage} className="h-2" />
        </div>

        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-semibold flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              You Have ({matchedSkills.length})
            </h5>
            <div className="space-y-2">
              {matchedSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded">
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getImportanceColor(skill.importance)}`}
                    >
                      {skill.importance}
                    </Badge>
                  </div>
                  {skill.proficiency && (
                    <div className="flex items-center gap-2">
                      <Progress value={skill.proficiency} className="h-1.5 w-16" />
                      <span className="text-xs font-medium w-8 text-right">{skill.proficiency}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-semibold flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              Skills to Learn ({missingSkills.length})
            </h5>
            <div className="space-y-2">
              {missingSkills.map((skill, index) => (
                <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">{skill.skill}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getImportanceColor(skill.importance)}`}
                    >
                      {skill.importance}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Est. learning time: {skill.learningTime}
                    </span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs">
                      Find Course →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {missingSkills.length > 0 && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-semibold text-sm text-blue-600 mb-1">Recommendation</h5>
                <p className="text-xs text-muted-foreground">
                  {missingSkills.some(s => s.importance === "required") 
                    ? "This job requires skills you don't have yet. Consider taking courses before applying, or highlight transferable skills in your application."
                    : "You meet the core requirements! The missing skills are preferred but not essential. Emphasize your strengths in your application."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Perfect Match */}
        {missingSkills.length === 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600">
              <Award className="w-5 h-5" />
              <span className="font-semibold text-sm">Perfect Skills Match!</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You have all the required skills for this position. Apply now!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

