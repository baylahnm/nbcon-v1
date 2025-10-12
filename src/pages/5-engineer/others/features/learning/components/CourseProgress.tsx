import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import {
  Play,
  CheckCircle2,
  Clock,
  Award,
  Download,
  Star,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';

interface CourseProgressData {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  totalDuration: string;
  completedDuration: string;
  lastAccessed: string;
  nextLesson: {
    id: string;
    title: string;
    duration: string;
  };
  certificate?: {
    id: string;
    issuedDate: string;
    downloadUrl: string;
  };
  streak: number;
  estimatedCompletion: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: 'milestone' | 'streak' | 'completion' | 'speed';
}

interface CourseProgressProps {
  courses: CourseProgressData[];
  onContinueLearning: (courseId: string, lessonId: string) => void;
  onDownloadCertificate: (certificateId: string) => void;
}

export function CourseProgress({ courses, onContinueLearning, onDownloadCertificate }: CourseProgressProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getProgressText = (progress: number) => {
    if (progress >= 100) return 'Completed';
    if (progress >= 75) return 'Almost Done';
    if (progress >= 50) return 'In Progress';
    return 'Getting Started';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-orange-500';
    if (streak >= 3) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Courses</p>
                <p className="text-xl font-bold">{courses.filter(c => c.progress > 0 && c.progress < 100).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-xl font-bold">{courses.filter(c => c.progress === 100).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-xl font-bold">{Math.max(...courses.map(c => c.streak), 0)} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Certificates</p>
                <p className="text-xl font-bold">{courses.filter(c => c.certificate).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Cards */}
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Course Thumbnail */}
              <div className="lg:w-64 relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 lg:h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="secondary" 
                    className={`${course.progress === 100 ? 'bg-green-500 text-white' : 'bg-white/90 text-black'}`}
                  >
                    {getProgressText(course.progress)}
                  </Badge>
                </div>
                {course.progress === 100 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Certificate
                    </Badge>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{course.instructor.name}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress 
                        value={course.progress} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.completedLectures} of {course.totalLectures} lessons</span>
                        <span>{course.completedDuration} of {course.totalDuration}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last accessed {course.lastAccessed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className={`h-4 w-4 ${getStreakColor(course.streak)}`} />
                        <span>{course.streak} day streak</span>
                      </div>
                      {course.estimatedCompletion && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Est. completion: {course.estimatedCompletion}</span>
                        </div>
                      )}
                    </div>

                    {/* Achievements */}
                    {course.achievements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Recent Achievements</p>
                        <div className="flex gap-2">
                          {course.achievements.slice(0, 3).map((achievement) => (
                            <Badge key={achievement.id} variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {achievement.title}
                            </Badge>
                          ))}
                          {course.achievements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.achievements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    {course.progress === 100 ? (
                      <>
                        <Button 
                          className="w-full"
                          onClick={() => onDownloadCertificate(course.certificate!.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Review Course
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          className="w-full"
                          onClick={() => onContinueLearning(course.id, course.nextLesson.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                        <div className="text-xs text-muted-foreground text-center">
                          Next: {course.nextLesson.title}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complete 3 courses this month</span>
                <Badge variant="outline">2/3</Badge>
              </div>
              <Progress value={66.67} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maintain 7-day learning streak</span>
                <Badge className="bg-orange-500 text-white">5/7</Badge>
              </div>
              <Progress value={71.43} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
