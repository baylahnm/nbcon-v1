import { useState } from 'react';
import { Briefcase, Building2, MapPin, Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

interface ExperienceSectionProps {
  isEditMode?: boolean;
}

interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'freelance';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  skillsUsed: string[];
}

export function ExperienceSection({ isEditMode = false }: ExperienceSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']));

  // Mock data
  const experiences: Experience[] = [
    {
      id: '1',
      jobTitle: 'Senior Structural Engineer',
      companyName: 'Saudi Aramco',
      location: 'Dhahran, Saudi Arabia',
      employmentType: 'full_time',
      startDate: '2020-03-01',
      endDate: undefined,
      isCurrent: true,
      description: 'Leading structural design and analysis for major infrastructure and industrial projects across Saudi Arabia.',
      achievements: [
        'Led design team for 15-story headquarters complex worth SAR 85M',
        'Reduced material costs by 12% through structural optimization',
        'Managed coordination with 6 international contractors',
        'Achieved zero safety incidents across 4 major projects'
      ],
      skillsUsed: ['Structural Analysis', 'AutoCAD', 'SAP2000', 'Project Management', 'Team Leadership']
    },
    {
      id: '2',
      jobTitle: 'Structural Engineer',
      companyName: 'Bechtel Corporation',
      location: 'Riyadh, Saudi Arabia',
      employmentType: 'full_time',
      startDate: '2017-06-15',
      endDate: '2020-02-28',
      isCurrent: false,
      description: 'Performed structural analysis and design for commercial and residential projects.',
      achievements: [
        'Designed foundations for 3 high-rise towers in King Abdullah Financial District',
        'Implemented BIM workflow reducing design errors by 35%',
        'Mentored 4 junior engineers in structural analysis techniques'
      ],
      skillsUsed: ['Revit BIM', 'ETABS', 'Foundation Design', 'Seismic Analysis']
    },
    {
      id: '3',
      jobTitle: 'Junior Structural Engineer',
      companyName: 'AECOM',
      location: 'Jeddah, Saudi Arabia',
      employmentType: 'full_time',
      startDate: '2015-09-01',
      endDate: '2017-05-31',
      isCurrent: false,
      description: 'Assisted senior engineers in structural calculations and drawing production.',
      achievements: [
        'Completed structural calculations for 12 residential villas',
        'Created detailed AutoCAD drawings meeting SCE standards',
        'Received "Outstanding Performance" award in 2016'
      ],
      skillsUsed: ['AutoCAD', 'Manual Calculations', 'Technical Drawing']
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const calculateDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const months = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const formatDateRange = (start: string, end?: string, isCurrent: boolean) => {
    const startFormatted = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endFormatted = isCurrent ? 'Present' : (end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present');
    return `${startFormatted} - ${endFormatted}`;
  };

  const employmentTypeLabels = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance'
  };

  return (
    <Card className="gap-0 group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/10 p-2.5 rounded-xl ring-1 ring-purple-500/20 group-hover:scale-110 transition-transform">
            <Briefcase className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">Work Experience</h2>
            <p className="text-xs text-muted-foreground">{experiences.length} positions</p>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Experience
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
        {/* Timeline */}
        <div className="relative">
          {experiences.map((exp, index) => {
            const isExpanded = expandedIds.has(exp.id);
            const duration = calculateDuration(exp.startDate, exp.endDate);

            return (
              <div key={exp.id} className="relative pl-8 pb-8 last:pb-0">
                {/* Timeline Line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-px bg-gradient-to-b from-primary/50 to-border/30" />
                )}

                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1.5 h-5 w-5 rounded-full ring-4 ring-card ${
                  exp.isCurrent 
                    ? 'bg-primary ring-primary/20' 
                    : 'bg-muted-foreground/50 ring-muted/50'
                }`} />

                {/* Experience Card */}
                <div className="group/exp p-5 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold">{exp.jobTitle}</h3>
                        {exp.isCurrent && (
                          <Badge className="bg-green-500/10 text-green-600 border-0 ring-1 ring-green-500/20 text-xs px-2 py-0 h-5">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="font-medium">{exp.companyName}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpanded(exp.id)}
                      className="h-7 w-7 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                      <span className="text-muted-foreground/60">• {duration}</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                      {employmentTypeLabels[exp.employmentType]}
                    </Badge>
                  </div>

                  {/* Description (Always visible) */}
                  <p className="text-sm leading-relaxed text-foreground/80 mb-3">
                    {exp.description}
                  </p>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-border/30">
                      {/* Achievements */}
                      {exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Key Achievements:</h4>
                          <ul className="space-y-1.5">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="text-primary mt-1">•</span>
                                <span className="flex-1">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills Used */}
                      {exp.skillsUsed.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skillsUsed.map((skill) => (
                              <Badge 
                                key={skill}
                                variant="outline" 
                                className="px-2.5 py-1 text-xs bg-muted hover:bg-muted/80 transition-colors"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

