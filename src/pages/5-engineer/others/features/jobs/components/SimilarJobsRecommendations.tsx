import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { 
  Sparkles, 
  MapPin, 
  DollarSign,
  Clock,
  ArrowRight,
  Star,
  TrendingUp
} from "lucide-react";

interface SimilarJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: { min: number; max: number };
  matchScore: number;
  skills: string[];
  rating: number;
  type: string;
}

interface SimilarJobsRecommendationsProps {
  currentJobId: string;
  currentJobSkills: string[];
  currentJobCategory: string;
}

export function SimilarJobsRecommendations({ 
  currentJobId, 
  currentJobSkills,
  currentJobCategory 
}: SimilarJobsRecommendationsProps) {
  // Mock similar jobs data
  const similarJobs: SimilarJob[] = [
    {
      id: "sim-1",
      title: "Lead Structural Engineer",
      company: "Bechtel Corporation",
      location: "Dammam, Saudi Arabia",
      salary: { min: 18000, max: 28000 },
      matchScore: 92,
      skills: ["STAAD.Pro", "AutoCAD", "Project Management"],
      rating: 4.7,
      type: "full-time"
    },
    {
      id: "sim-2",
      title: "Senior Bridge Engineer",
      company: "Parsons",
      location: "Jeddah, Saudi Arabia",
      salary: { min: 16000, max: 24000 },
      matchScore: 88,
      skills: ["Structural Analysis", "ETABS", "Bridge Design"],
      rating: 4.5,
      type: "contract"
    },
    {
      id: "sim-3",
      title: "Structural Consultant",
      company: "AECOM",
      location: "Riyadh, Saudi Arabia",
      salary: { min: 14000, max: 22000 },
      matchScore: 85,
      skills: ["Design", "Structural Engineering", "Consulting"],
      rating: 4.8,
      type: "freelance"
    }
  ];

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
      <CardHeader className="p-4 border-b border-border/40">
        <CardTitle className="flex items-center gap-3">
          <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-base font-bold">Similar Jobs You May Like</div>
            <p className="text-xs text-muted-foreground mt-0.5">AI-powered recommendations</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
        <div className="space-y-3">
          {similarJobs.map((job) => (
            <div 
              key={job.id}
              className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {job.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs"
                    >
                      {job.matchScore}% match
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} SAR
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {job.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="sm" variant="ghost" className="ml-2">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          <Sparkles className="w-4 h-4 mr-2" />
          See More AI Recommendations
        </Button>
      </CardContent>
    </Card>
  );
}

