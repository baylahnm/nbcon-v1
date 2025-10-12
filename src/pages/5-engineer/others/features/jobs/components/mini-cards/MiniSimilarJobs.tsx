import { TrendingUp, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { Badge } from '../../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../../1-HomePage/others/components/ui/button';

interface SimilarJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  matchPercentage: number;
}

interface MiniSimilarJobsProps {
  onViewAll?: () => void;
}

export function MiniSimilarJobs({ onViewAll }: MiniSimilarJobsProps) {
  const similarJobs: SimilarJob[] = [
    {
      title: 'Lead Structural Engineer',
      company: 'Bechtel Corporation',
      location: 'Dammam',
      salary: '18,000 - 28,000 SAR',
      matchPercentage: 92
    },
    {
      title: 'Senior Bridge Engineer',
      company: 'Parsons',
      location: 'Jeddah',
      salary: '16,000 - 24,000 SAR',
      matchPercentage: 88
    }
  ];

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="bg-purple-500 h-8 w-8 flex items-center justify-center rounded-lg">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Similar Jobs</h4>
          <p className="text-xs text-muted-foreground">AI-powered picks</p>
        </div>
      </div>

      {/* Similar Jobs List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {similarJobs.map((job, index) => (
          <div 
            key={index}
            className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors flex-1">
                {job.title}
              </h4>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs ml-2">
                {job.matchPercentage}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.salary}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onViewAll}
      >
        <Sparkles className="w-3 h-3 mr-2" />
        View All Recommendations →
      </Button>
    </div>
  );
}

