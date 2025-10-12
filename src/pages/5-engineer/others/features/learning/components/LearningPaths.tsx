import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import {
  Map,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Play,
  ChevronRight,
  Target,
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  Lock
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  totalCourses: number;
  completedCourses: number;
  totalDuration: string;
  estimatedCompletion: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  isEnrolled: boolean;
  isCompleted: boolean;
  category: string;
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
  instructors: Instructor[];
  courses: PathCourse[];
  certificate?: {
    id: string;
    title: string;
    description: string;
  };
  price: number;
  originalPrice?: number;
  isPopular: boolean;
  isNew: boolean;
}

interface Instructor {
  name: string;
  avatar: string;
  title: string;
}

interface PathCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: string;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
  instructor: Instructor;
  skills: string[];
}

interface LearningPathsProps {
  paths: LearningPath[];
  onStartPath: (pathId: string) => void;
  onContinuePath: (pathId: string, courseId: string) => void;
  onViewPath: (pathId: string) => void;
}

export function LearningPaths({ paths, onStartPath, onContinuePath, onViewPath }: LearningPathsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-yellow-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Learning Paths</h2>
        <p className="text-muted-foreground">
          Structured learning journeys designed by industry experts
        </p>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paths.map((path) => (
          <Card key={path.id} className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Path Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={path.thumbnail}
                alt={path.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {path.isPopular && (
                  <Badge className="bg-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
                {path.isNew && (
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    New
                  </Badge>
                )}
              </div>

              {/* Progress */}
              {path.isEnrolled && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {path.isCompleted ? (
                  <Badge className="bg-green-500 text-white border-0 shadow-lg">
                    <Award className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                ) : path.isEnrolled ? (
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                    <Play className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="border-0 shadow-lg">
                    <Lock className="h-3 w-3 mr-1" />
                    Not Started
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Path Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {path.category}
                  </Badge>
                  <Badge 
                    className={`${getDifficultyColor(path.difficulty)} text-white text-xs`}
                  >
                    {path.difficulty}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold line-clamp-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {path.description}
                </p>
              </div>

              {/* Instructors */}
              <div>
                <p className="text-sm font-medium mb-2">Instructors</p>
                <div className="flex -space-x-2">
                  {(path.instructors || []).slice(0, 3).map((instructor, index) => (
                    <Avatar key={index} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={instructor.avatar} alt={instructor.name} />
                      <AvatarFallback className="text-xs">
                        {instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {(path.instructors || []).length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">
                        +{(path.instructors || []).length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{path.completedCourses}/{path.totalCourses}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{path.totalDuration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{(path.skills || []).length}</p>
                  <p className="text-xs text-muted-foreground">Skills</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Skills You'll Learn</p>
                <div className="flex flex-wrap gap-1">
                  {(path.skills || []).slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {(path.skills || []).length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(path.skills || []).length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Course Preview */}
              {(path.courses || []).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Path Courses</p>
                  <div className="space-y-2">
                    {(path.courses || []).slice(0, 3).map((course, index) => (
                      <div key={course.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0">
                          {course.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : course.isLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.duration}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {course.order + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(path.courses || []).length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{(path.courses || []).length - 3} more courses
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  {path.originalPrice && path.originalPrice > path.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {path.originalPrice} SAR
                    </span>
                  )}
                  <span className="text-lg font-bold text-primary">
                    {path.price} SAR
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewPath(path.id)}
                  >
                    View Details
                  </Button>
                  {path.isEnrolled ? (
                    <Button 
                      size="sm"
                      onClick={() => onContinuePath(path.id, (path.courses || []).find(c => !c.isCompleted && !c.isLocked)?.id || '')}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => onStartPath(path.id)}
                    >
                      Start Path
                      <Play className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Map className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Ready to Start Your Learning Journey?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a learning path tailored to your career goals and start building the skills you need to advance in your engineering career.
            </p>
            <Button size="lg">
              <Target className="h-5 w-5 mr-2" />
              Browse All Learning Paths
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
