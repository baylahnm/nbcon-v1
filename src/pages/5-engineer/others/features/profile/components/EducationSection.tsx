import { GraduationCap, Plus, MapPin, Calendar, Building2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

interface EducationSectionProps {
  isEditMode?: boolean;
}

interface Education {
  id: string;
  degreeType: string;
  major: string;
  universityName: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  thesisTitle?: string;
  relevantCourses: string[];
}

export function EducationSection({ isEditMode = false }: EducationSectionProps) {
  // Mock data
  const education: Education[] = [
    {
      id: '1',
      degreeType: 'Master of Science',
      major: 'Structural Engineering',
      universityName: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      location: 'Dhahran, Saudi Arabia',
      startDate: '2015-09-01',
      endDate: '2017-06-15',
      gpa: '3.9/4.0',
      honors: ['Dean\'s List', 'Outstanding Graduate'],
      thesisTitle: 'Seismic Analysis of High-Rise Buildings in Saudi Arabia',
      relevantCourses: ['Advanced Structural Analysis', 'Finite Element Analysis', 'Seismic Design', 'Foundation Engineering']
    },
    {
      id: '2',
      degreeType: 'Bachelor of Science',
      major: 'Civil Engineering',
      universityName: 'King Saud University',
      location: 'Riyadh, Saudi Arabia',
      startDate: '2011-09-01',
      endDate: '2015-06-20',
      gpa: '3.7/4.0',
      honors: ['Honor Roll'],
      relevantCourses: ['Structural Engineering', 'Concrete Design', 'Steel Design', 'Engineering Mathematics']
    }
  ];

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const years = endDate.getFullYear() - startDate.getFullYear();
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const formatDateRange = (start: string, end: string) => {
    const startYear = new Date(start).getFullYear();
    const endYear = new Date(end).getFullYear();
    return `${startYear} - ${endYear}`;
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2.5 rounded-xl ring-1 ring-cyan-500/20 group-hover:scale-110 transition-transform">
            <GraduationCap className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">Education</h2>
            <p className="text-xs text-muted-foreground">{education.length} degrees</p>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Plus className="h-3 w-3 mr-1.5" />
            Add Education
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id} className="relative">
            {/* Timeline connector */}
            {index !== education.length - 1 && (
              <div className="absolute left-2.5 top-12 bottom-0 w-px bg-gradient-to-b from-primary/50 to-border/30" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-0 top-3 h-5 w-5 rounded-full bg-primary ring-4 ring-card" />

            {/* Education Card */}
            <div className="ml-8 p-5 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
              {/* Header */}
              <div className="mb-3">
                <h3 className="text-base font-semibold mb-1">{edu.degreeType}</h3>
                <p className="text-sm text-primary font-medium mb-2">{edu.major}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="font-medium">{edu.universityName}</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  <span>{edu.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
                  <span className="text-muted-foreground/60">• {calculateDuration(edu.startDate, edu.endDate)}</span>
                </div>
              </div>

              {/* GPA & Honors */}
              {(edu.gpa || edu.honors) && (
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {edu.gpa && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">GPA: </span>
                      <span className="font-bold text-primary">{edu.gpa}</span>
                    </div>
                  )}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {edu.honors.map((honor) => (
                        <Badge 
                          key={honor}
                          variant="outline" 
                          className="text-xs px-2 py-0 h-5 bg-amber-500/10 text-amber-600 border-amber-500/20"
                        >
                          {honor}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Thesis */}
              {edu.thesisTitle && (
                <div className="mb-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Thesis:</p>
                  <p className="text-sm font-medium italic">"{edu.thesisTitle}"</p>
                </div>
              )}

              {/* Relevant Courses */}
              {edu.relevantCourses.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Relevant Coursework:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.relevantCourses.map((course) => (
                      <Badge 
                        key={course}
                        variant="outline" 
                        className="text-xs px-2 py-0 h-5 bg-muted/50"
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

