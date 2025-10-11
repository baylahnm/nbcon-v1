import { X, Star, Briefcase, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';

interface HowRankingWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowRankingWorksModal({ isOpen, onClose }: HowRankingWorksModalProps) {
  if (!isOpen) return null;

  const criteria = [
    {
      icon: Star,
      category: 'Client Satisfaction',
      weight: 40,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      ringColor: 'ring-amber-500/20',
      subcriteria: [
        { label: 'Average Rating (0-5.0)', points: 300, description: 'Based on all client reviews' },
        { label: 'Response Time', points: 50, description: '< 2 hours = 50pts, < 4 hours = 30pts' },
        { label: 'Total Reviews', points: 50, description: '100+ reviews = 50pts (max)' }
      ]
    },
    {
      icon: Briefcase,
      category: 'Project Performance',
      weight: 30,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      ringColor: 'ring-blue-500/20',
      subcriteria: [
        { label: 'Projects Completed', points: 150, description: '75+ projects = 150pts (max)' },
        { label: 'Success Rate', points: 100, description: '% of projects completed on time' },
        { label: 'Repeat Clients', points: 50, description: '% of clients who hired you again' }
      ]
    },
    {
      icon: Award,
      category: 'Professional Growth',
      weight: 20,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      ringColor: 'ring-purple-500/20',
      subcriteria: [
        { label: 'Certifications', points: 80, description: '4+ certs = 80pts (SCE, PMP, PE, LEED)' },
        { label: 'Years Experience', points: 70, description: '14+ years = 70pts (max)' },
        { label: 'Profile Completion', points: 50, description: '100% profile = 50pts' }
      ]
    },
    {
      icon: Users,
      category: 'Platform Engagement',
      weight: 10,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      ringColor: 'ring-green-500/20',
      subcriteria: [
        { label: 'Activity Level', points: 50, description: 'Daily login = 50pts' },
        { label: 'Community Help', points: 30, description: 'Endorsements given to peers' },
        { label: 'Forum Participation', points: 20, description: 'Helpful answers & posts' }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary/20">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b-2 border-primary/20 p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">How Ranking Works</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Transparent scoring formula (1000 points total)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Overview */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h3 className="text-sm font-bold mb-3">Ranking Formula</h3>
              <p className="text-xs leading-relaxed text-muted-foreground mb-4">
                Every engineer receives a <strong>total score out of 1000 points</strong>, calculated from 4 main categories. 
                Rankings are updated daily at midnight (Saudi Arabia Time).
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-xs px-2 py-0.5">Updated Daily</Badge>
                <Badge variant="outline" className="text-xs px-2 py-0.5">Transparent</Badge>
                <Badge variant="outline" className="text-xs px-2 py-0.5">Fair</Badge>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-5">
              {criteria.map((criterion, index) => {
                const CriterionIcon = criterion.icon;
                
                return (
                  <div key={index} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`${criterion.bgColor} p-2 rounded-lg ring-1 ${criterion.ringColor}`}>
                          <CriterionIcon className={`h-4 w-4 ${criterion.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{criterion.category}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {criterion.subcriteria.reduce((sum, sub) => sum + sub.points, 0)} points maximum
                          </p>
                        </div>
                      </div>
                      <Badge className={`${criterion.bgColor} ${criterion.color} border-0 text-xs px-2.5 py-1 font-bold`}>
                        {criterion.weight}%
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={criterion.weight * 2.5} className="h-2" />

                    {/* Subcriteria */}
                    <div className="pl-4 space-y-2">
                      {criterion.subcriteria.map((sub, subIndex) => (
                        <div 
                          key={subIndex}
                          className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-medium mb-1">{sub.label}</p>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">
                                {sub.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold whitespace-nowrap">
                              {sub.points} pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Example Calculation */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                Example: Top-Ranked Engineer
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Client Satisfaction</p>
                  <p className="font-bold text-green-600">395/400</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Project Performance</p>
                  <p className="font-bold text-green-600">295/300</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Professional Growth</p>
                  <p className="font-bold text-green-600">195/200</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Platform Engagement</p>
                  <p className="font-bold text-green-600">100/100</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-500/20">
                <p className="text-sm font-bold text-green-600">Total Score: 985/1000 → Rank #1 🏆</p>
              </div>
            </div>

            {/* Update Frequency */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
              <h4 className="text-xs font-semibold mb-2">Update Schedule:</h4>
              <ul className="space-y-1 text-[10px] text-muted-foreground">
                <li>• <strong>Daily</strong> at 00:00 (Saudi Time) - Full rank recalculation</li>
                <li>• <strong>Every 6 hours</strong> - Score updates for new reviews/projects</li>
                <li>• <strong>Real-time</strong> - Notifications for rank changes {'>'}  5 positions</li>
                <li>• <strong>Monthly</strong> - Historical data archived for trend analysis</li>
              </ul>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="p-6 border-t border-border/30 bg-muted/20 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Fair Play Policy: Anti-cheating measures in place
            </p>
            <Button onClick={onClose} size="sm" className="shadow-md hover:shadow-xl transition-all text-xs h-9">
              Got It!
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

