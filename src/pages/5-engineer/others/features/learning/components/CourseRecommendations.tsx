import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { CourseCard } from './CourseCard';
import {
  TrendingUp,
  Star,
  Users,
  Clock,
  Sparkles,
  Target,
  BookOpen,
  Award,
  Zap,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  matchScore?: number;
  recommendationReason: string;
  skillsGap: string[];
}

interface RecommendationSection {
  title: string;
  description: string;
  courses: RecommendedCourse[];
  icon: string;
  type: 'trending' | 'personalized' | 'similar' | 'completion' | 'skill-gap';
}

interface CourseRecommendationsProps {
  recommendations: RecommendationSection[];
  onEnrollCourse: (courseId: string) => void;
  onViewCourse: (courseId: string) => void;
  onViewAllCourses: (type: string) => void;
}

export function CourseRecommendations({ 
  recommendations, 
  onEnrollCourse, 
  onViewCourse,
  onViewAllCourses 
}: CourseRecommendationsProps) {
  const getSectionIcon = (icon: string) => {
    switch (icon) {
      case 'trending': return <TrendingUp className="h-5 w-5" />;
      case 'personalized': return <Sparkles className="h-5 w-5" />;
      case 'similar': return <Target className="h-5 w-5" />;
      case 'completion': return <BookOpen className="h-5 w-5" />;
      case 'skill-gap': return <Zap className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'trending': return 'bg-orange-500';
      case 'personalized': return 'bg-purple-500';
      case 'similar': return 'bg-blue-500';
      case 'completion': return 'bg-green-500';
      case 'skill-gap': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <p className="text-muted-foreground">
          Discover courses tailored to your learning goals and interests
        </p>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${getSectionColor(section.type)} p-2 rounded-lg`}>
                {getSectionIcon(section.icon)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewAllCourses(section.type)}
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.courses.map((course) => (
              <Card key={course.id} className="overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {course.isTrending && (
                      <Badge className="bg-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                    {course.isBestSeller && (
                      <Badge className="bg-red-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Best Seller
                      </Badge>
                    )}
                    {course.isNew && (
                      <Badge className="bg-blue-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Match Score */}
                  {course.matchScore && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        {course.matchScore}% Match
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Course Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge 
                        variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {course.level}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-base line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                      <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground">
                      {course.instructor.name}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.students?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  {course.recommendationReason && (
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        {course.recommendationReason}
                      </p>
                    </div>
                  )}

                  {/* Skills Gap */}
                  {course.skillsGap.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Skills you'll gain:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.skillsGap.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-[9px] px-1.5 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                        {course.skillsGap.length > 3 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">
                            +{course.skillsGap.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {course.originalPrice} SAR
                        </span>
                      )}
                      <span className="font-bold text-sm text-primary">
                        {course.price} SAR
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0"
                        onClick={() => onViewCourse(course.id)}
                      >
                        <Search className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 text-[10px] px-2 bg-gradient-primary"
                        onClick={() => onEnrollCourse(course.id)}
                      >
                        Enroll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Personalized Learning Path */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Ready to Start Your Learning Journey?</h3>
              <p className="text-muted-foreground mb-4">
                Get personalized course recommendations based on your career goals and current skills.
              </p>
              <div className="flex gap-3">
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  Get Personalized Recommendations
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse All Courses
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
