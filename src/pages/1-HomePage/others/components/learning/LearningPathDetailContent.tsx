import { useState } from "react";
import { 
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle,
  BookOpen,
  Target,
  Calendar,
  BarChart3,
  ChevronRight,
  PlayCircle,
  FileText,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface LearningPathDetailContentProps {
  pathId: string;
  pathTitle: string;
  onBack: () => void;
  onStartCourse: (courseId: string, title: string) => void;
  onViewCourse: (courseId: string, title: string) => void;
}

const getPathData = (pathId: string) => {
  const paths = {
    'path-1': {
      id: 'path-1',
      title: 'Saudi Megaproject Engineering Specialist',
      description: 'Master the engineering skills needed for Saudi Arabia\'s Vision 2030 megaprojects including NEOM, The Red Sea Project, and QIDDIYA.',
      level: 'Intermediate to Advanced',
      duration: '16 weeks',
      totalHours: 120,
      enrollmentCount: 856,
      rating: 4.9,
      reviewCount: 178,
      completionRate: 87,
      certificate: 'Saudi Megaproject Engineering Specialist',
      skillsGained: [
        'Smart city infrastructure design',
        'Sustainable construction methods',
        'Project management for megaprojects',
        'Environmental impact assessment',
        'Advanced BIM and digital twin technologies',
        'Saudi regulatory compliance'
      ],
      prerequisites: [
        'Bachelor\'s degree in Engineering',
        'Minimum 2 years industry experience',
        'Basic knowledge of Saudi building codes',
        'English and Arabic proficiency'
      ],
      courses: [
        {
          id: 'course-1',
          title: 'NEOM Smart City Infrastructure Design',
          instructor: 'Dr. Ahmad Al-Rashid',
          duration: '8 weeks',
          hours: 32,
          rating: 4.8,
          description: 'Learn cutting-edge smart city design principles through NEOM project case studies.',
          status: 'not_started',
          order: 1,
          prerequisite: null
        },
        {
          id: 'course-2',
          title: 'The Red Sea Project: Sustainable Tourism Infrastructure',
          instructor: 'Eng. Maha Al-Johani',
          duration: '6 weeks',
          hours: 28,
          rating: 4.7,
          description: 'Explore sustainable engineering for luxury tourism developments.',
          status: 'locked',
          order: 2,
          prerequisite: 'course-1'
        },
        {
          id: 'course-3',
          title: 'QIDDIYA Entertainment Engineering',
          instructor: 'Dr. Khalid Bin Salman',
          duration: '4 weeks',
          hours: 24,
          rating: 4.9,
          description: 'Specialized engineering for entertainment and sports facilities.',
          status: 'locked',
          order: 3,
          prerequisite: 'course-2'
        },
        {
          id: 'course-4',
          title: 'Advanced Project Management for Megaprojects',
          instructor: 'Eng. Sarah Al-Dosari',
          duration: '6 weeks',
          hours: 36,
          rating: 4.8,
          description: 'Master project management techniques for large-scale developments.',
          status: 'locked',
          order: 4,
          prerequisite: 'course-3'
        }
      ],
      learningOutcomes: [
        'Design and implement smart city infrastructure systems',
        'Apply sustainable engineering practices in desert environments',
        'Manage complex megaproject engineering phases',
        'Navigate Saudi regulatory and compliance requirements',
        'Utilize advanced digital tools and BIM technologies',
        'Lead cross-cultural engineering teams effectively'
      ],
      timeline: {
        beginner: '20-24 weeks (5-6 hours/week)',
        intermediate: '16-20 weeks (6-8 hours/week)',
        advanced: '12-16 weeks (8-10 hours/week)'
      },
      careerPaths: [
        'Megaproject Engineering Manager',
        'Smart City Infrastructure Specialist',
        'Sustainable Development Consultant',
        'Project Director - Vision 2030 Projects',
        'Senior Engineering Consultant'
      ]
    }
  };
  
  return paths[pathId as keyof typeof paths] || paths['path-1'];
};

export function LearningPathDetailContent({ pathId, pathTitle, onBack, onStartCourse, onViewCourse }: LearningPathDetailContentProps) {
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'timeline'>('overview');
  
  const path = getPathData(pathId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'not_started':
        return <div className="w-5 h-5 border-2 border-info bg-info/10 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
        </div>;
      case 'locked':
        return <div className="w-5 h-5 border-2 border-sidebar-border rounded-full bg-gray-100"></div>;
      default:
        return <div className="w-5 h-5 border-2 border-sidebar-border rounded-full"></div>;
    }
  };

  return (
    <div className="flex-1 bg-muted/30 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          <div className="text-sm text-muted-foreground">
            Learning &gt; Learning Paths &gt; {path.title}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Path Hero */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-card-foreground mb-2">{path.title}</h1>
                    <p className="text-muted-foreground mb-4">{path.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="font-medium text-card-foreground">{path.rating}</span>
                        <span>({path.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{path.enrollmentCount} enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{path.totalHours} hours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{path.completionRate}% completion rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2 border-b">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'courses', label: 'Courses', icon: PlayCircle },
                    { id: 'timeline', label: 'Timeline', icon: Calendar }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveView(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeView === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Views */}
            {activeView === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {path.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-card-foreground">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills you'll gain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {path.skillsGained.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Career paths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {path.careerPaths.map((career, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="font-medium text-card-foreground">{career}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {path.prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          <span className="text-card-foreground">{prerequisite}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === 'courses' && (
              <div className="space-y-4">
                {path.courses.map((course, index) => (
                  <Card key={course.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2">
                          {getStatusIcon(course.status)}
                          {index < path.courses.length - 1 && (
                            <div className="w-px h-12 bg-border" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Course {course.order}</div>
                              <h3 className="text-lg font-semibold text-card-foreground mb-2">{course.title}</h3>
                              <p className="text-muted-foreground mb-3">{course.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {course.instructor.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{course.instructor}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-warning fill-current" />
                                  <span>{course.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {course.status === 'not_started' && (
                                <>
                                  <Button 
                                    onClick={() => onStartCourse(course.id, course.title)}
                                    className="w-32"
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Course
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => onViewCourse(course.id, course.title)}
                                    className="w-32"
                                  >
                                    View Details
                                  </Button>
                                </>
                              )}
                              {course.status === 'locked' && (
                                <div className="text-center">
                                  <div className="text-sm text-muted-foreground mb-2">Locked</div>
                                  <div className="text-xs text-muted-foreground/70">
                                    Complete previous course to unlock
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {course.prerequisite && (
                            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                              Prerequisite: Complete previous course
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeView === 'timeline' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(path.timeline).map(([level, duration]) => (
                        <div key={level} className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{level}</div>
                          <div className="font-semibold text-card-foreground">{duration}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {path.courses.map((course, index) => (
                        <div key={course.id} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-medium">{course.order}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-card-foreground">{course.title}</div>
                            <div className="text-sm text-muted-foreground">{course.duration} • {course.hours} hours</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Path Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-card-foreground mb-1">Start Learning Path</div>
                  <div className="text-sm text-muted-foreground">Begin your journey to become a megaproject specialist</div>
                </div>
                
                <Button 
                  className="w-full mb-3 bg-primary hover:bg-primary-dark text-primary-foreground"
                  onClick={() => onStartCourse(path.courses[0].id, path.courses[0].title)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Path
                </Button>
                
                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{path.duration} total duration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{path.courses.length} courses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>Level: {path.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>Certificate: {path.certificate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    <span>SCE credits eligible</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="w-full" />
                  
                  <div className="text-sm text-muted-foreground text-center">
                    0 of {path.courses.length} courses completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Path Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{path.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Rating</span>
                    <span className="font-medium">{path.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Enrolled</span>
                    <span className="font-medium">{path.enrollmentCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Hours</span>
                    <span className="font-medium">{path.totalHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

