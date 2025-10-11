import { Star, MapPin, Briefcase, UserPlus, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar } from '../../../../../1-HomePage/others/components/ui/avatar';

export function SimilarEngineers() {
  // Mock data
  const similarEngineers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Civil Engineer',
      company: 'Bechtel Corporation',
      location: 'Jeddah',
      rating: 4.8,
      totalProjects: 89,
      yearsExperience: 6,
      avatarUrl: null
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      title: 'Structural Engineer',
      company: 'AECOM',
      location: 'Riyadh',
      rating: 4.9,
      totalProjects: 124,
      yearsExperience: 7,
      avatarUrl: null
    },
    {
      id: '3',
      name: 'Fatima Al-Rashid',
      title: 'Project Engineer',
      company: 'Saudi Aramco',
      location: 'Dhahran',
      rating: 4.7,
      totalProjects: 67,
      yearsExperience: 5,
      avatarUrl: null
    }
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <h3 className="text-base font-bold">Similar Engineers</h3>
        <p className="text-xs text-muted-foreground">Based on your specialization</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {similarEngineers.map((engineer) => (
          <div 
            key={engineer.id}
            className="group/eng p-3 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                {engineer.avatarUrl ? (
                  <img src={engineer.avatarUrl} alt={engineer.name} />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    {engineer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{engineer.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{engineer.title}</p>
                <p className="text-[10px] text-muted-foreground/80 truncate">{engineer.company}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-3 text-xs">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium">{engineer.rating}</span>
              </div>
              <div className="h-3 w-px bg-border/40" />
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                <span>{engineer.totalProjects} projects</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span>{engineer.location}</span>
              <span className="text-muted-foreground/60">•</span>
              <span>{engineer.yearsExperience} years exp</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-7"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button 
                size="sm"
                className="flex-1 shadow-sm hover:shadow-md transition-all text-xs h-7"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

