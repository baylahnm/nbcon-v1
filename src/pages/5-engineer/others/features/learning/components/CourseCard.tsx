import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Clock, 
  Play, 
  Bookmark,
  Award,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';

interface Instructor {
  name: string;
  avatar: string;
  rating: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  rating: number;
  students: number; // Changed from studentCount to match the data
  price: number;
  originalPrice?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress?: number;
  isEnrolled?: boolean;
  category: string;
  tags: string[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  width?: string;
  layout?: 'default' | 'threeRow';
}

export function CourseCard({ course, onEnroll, onView, width, layout = 'default' }: CourseCardProps) {
  const navigate = useNavigate();
  
  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewCourse = () => {
    if (onView) {
      onView(course.id);
    } else {
      navigate(`/engineer/learning/course/${course.id}`);
    }
  };

  const Thumbnail = (
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Course Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {course.isTrending && (
            <Badge className="bg-orange-500 text-white text-[10px] px-2 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {course.isBestSeller && (
            <Badge className="bg-red-500 text-white text-[10px] px-2 py-1">
              <Award className="h-3 w-3 mr-1" />
              Best Seller
            </Badge>
          )}
          {course.isNew && (
            <Badge className="bg-blue-500 text-white text-[10px] px-2 py-1">
              New
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white text-[10px] px-2 py-1">
              {discountPercentage}% OFF
            </Badge>
          </div>
        )}

        {/* Progress Bar for Enrolled Courses */}
        {course.isEnrolled && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
            <div className="flex items-center justify-between text-white text-xs mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1" />
          </div>
        )}
      </div>
  );

  const Content = (
      <CardContent className={`p-4 pb-4 space-y-3 bg-muted/20 ${layout === 'threeRow' ? 'flex-1' : ''}`}>
        {/* Course Title */}
        <div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {course.description}
          </p>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={course.instructor.avatar} />
            <AvatarFallback className="text-[10px]">
              {course.instructor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
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
            <span>{course.students?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex items-center justify-between">
          <Badge className={`text-[10px] px-2 py-1 ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          
          {/* Completion Badge */}
          {course.isEnrolled && course.progress === 100 && (
            <Badge className="bg-green-100 text-green-800 text-[10px] px-2 py-1">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-[9px] px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 2 && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0.5">
                +{course.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Price and Actions (default layout keeps inside content) */}
        {layout === 'default' && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-xs text-muted-foreground line-through">
                ${course.originalPrice}
              </span>
            )}
            <span className="font-bold text-sm text-primary">
              ${course.price}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {course.isEnrolled ? (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0"
                  onClick={handleViewCourse}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px] px-2"
                  onClick={handleViewCourse}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0"
                  onClick={handleViewCourse}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0"
                >
                  <Bookmark className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-[10px] px-2 bg-gradient-primary"
                  onClick={() => onEnroll?.(course.id)}
                >
                  Enroll
                </Button>
              </>
            )}
          </div>
        </div>
        )}
      </CardContent>
  );

  const BottomBar = (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-card/60">
      <div className="flex items-center gap-2">
        {course.originalPrice && course.originalPrice > course.price && (
          <span className="text-xs text-muted-foreground line-through">
            ${course.originalPrice}
          </span>
        )}
        <span className="font-bold text-sm text-primary">
          ${course.price}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {course.isEnrolled ? (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0"
              onClick={handleViewCourse}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-[10px] px-2"
              onClick={handleViewCourse}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0"
              onClick={handleViewCourse}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0"
            >
              <Bookmark className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              className="h-7 text-[10px] px-2 bg-gradient-primary"
              onClick={() => onEnroll?.(course.id)}
            >
              Enroll
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30 overflow-hidden gap-0 flex-shrink-0 snap-center ${
        layout === 'threeRow' ? 'flex flex-col h-full' : ''
      }`}
      style={{ width: width || '320px' }}
    >
      {Thumbnail}
      <div className={layout === 'threeRow' ? 'flex-1 flex flex-col' : ''}>
        {Content}
      </div>
      {layout === 'threeRow' && BottomBar}
    </Card>
  );
}
