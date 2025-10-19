import { useState } from 'react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { toast } from 'sonner';
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
  Eye,
  BookmarkCheck,
  ChevronRight,
  Heart,
  Share2,
  Download
} from 'lucide-react';

interface Instructor {
  name: string;
  avatar: string;
  title: string;
  rating: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  rating: number;
  students: number;
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
  videoUrl?: string;
  script?: string;
  whatYoullLearn?: string[];
  requirements?: string[];
  includes?: string[];
}

interface EnhancedCourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onPreview?: (course: Course) => void;
  onWishlist?: (courseId: string) => void;
  width?: string;
  layout?: 'default' | 'compact' | 'featured';
}

export function EnhancedCourseCard({ 
  course, 
  onEnroll, 
  onPreview, 
  onWishlist,
  width, 
  layout = 'default' 
}: EnhancedCourseCardProps) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert USD to SAR (approximate conversion rate: 1 USD = 3.75 SAR)
  const convertToSAR = (usdPrice: number) => Math.round(usdPrice * 3.75);
  const sarPrice = convertToSAR(course.price);
  const sarOriginalPrice = course.originalPrice ? convertToSAR(course.originalPrice) : null;
  
  const discountPercentage = sarOriginalPrice 
    ? Math.round(((sarOriginalPrice - sarPrice) / sarOriginalPrice) * 100)
    : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(course);
    } else {
      navigate(`/free/learning/course/${course.id}`);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (isBookmarked) {
      toast.info(`Removed "${course.title}" from bookmarks`);
    } else {
      toast.success(`Saved "${course.title}" to bookmarks`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlist) {
      onWishlist(course.id);
    }
    toast.success(`Added "${course.title}" to wishlist`);
  };

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
      toast.success(`Enrolling in "${course.title}"...`);
    } else {
      setIsEnrolling(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnrolling(false);
      toast.success(`Successfully enrolled in "${course.title}"!`);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Course link copied to clipboard');
    }
  };

  const Thumbnail = (
    <div 
      className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50 cursor-pointer group/thumbnail"
      onClick={handlePreview}
    >
      <img 
        src={course.thumbnail} 
        alt={course.title}
        className="w-full h-full object-cover group-hover/thumbnail:scale-105 transition-transform duration-500"
      />
      
      {/* Play Button Overlay - Enhanced */}
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300 bg-foreground/20"
        onClick={handlePreview}
      >
        <div className="bg-foreground/80 backdrop-blur-sm rounded-full p-4 hover:scale-110 transition-transform duration-200 shadow-2xl">
          <Play className="h-8 w-8 text-background fill-background" />
        </div>
      </div>

      {/* Course Badges - Enhanced positioning */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {course.isTrending && (
          <Badge className="bg-warning text-warning-foreground text-[10px] px-2 py-1 shadow-lg border-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        )}
        {course.isBestSeller && (
          <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2 py-1 shadow-lg border-0">
            <Award className="h-3 w-3 mr-1" />
            Bestseller
          </Badge>
        )}
        {course.isNew && (
          <Badge className="bg-info text-info-foreground text-[10px] px-2 py-1 shadow-lg border-0">
            New
          </Badge>
        )}
      </div>

      {/* Discount Badge - Enhanced */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-1 shadow-lg border-0">
            {discountPercentage}% OFF
          </Badge>
        </div>
      )}

      {/* Progress Bar for Enrolled Courses */}
      {course.isEnrolled && course.progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 bg-foreground/50 backdrop-blur-sm p-2">
          <div className="flex items-center justify-between text-background text-xs mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1" />
        </div>
      )}

      {/* Hover Overlay with Quick Actions */}
      <div className="absolute inset-0 bg-black/0 group-hover/thumbnail:bg-black/10 transition-all duration-300 flex items-end justify-end p-3">
        <div className="opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/95 hover:bg-background backdrop-blur-sm shadow-md"
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 text-foreground" />
            )}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/95 hover:bg-background backdrop-blur-sm shadow-md"
            onClick={handleWishlist}
          >
            <Heart className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/95 hover:bg-background backdrop-blur-sm shadow-md"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );

  const Content = (
    <CardContent className={`p-4 space-y-3 ${layout === 'compact' ? 'p-3' : ''}`}>
      {/* Course Title - Enhanced typography */}
      <div>
        <h3 className={`font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors ${
          layout === 'compact' ? 'text-sm' : 'text-base'
        }`}>
          {course.title}
        </h3>
        <p className={`text-muted-foreground line-clamp-2 mt-1 ${
          layout === 'compact' ? 'text-xs' : 'text-sm'
        }`}>
          {course.description}
        </p>
      </div>

      {/* Instructor - Enhanced with title */}
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={course.instructor.avatar} />
          <AvatarFallback className="text-[10px]">
            {course.instructor.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <span className={`text-muted-foreground truncate block ${
            layout === 'compact' ? 'text-xs' : 'text-sm'
          }`}>
            {course.instructor.name}
          </span>
          {layout !== 'compact' && (
            <span className="text-xs text-muted-foreground/70">
              {course.instructor.title}
            </span>
          )}
        </div>
      </div>

      {/* Course Stats - Enhanced layout */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span className="font-medium">{course.rating}</span>
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

      {/* Level Badge and Tags */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge className={`text-[10px] px-2 py-1 border ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          
          {/* Completion Badge */}
          {course.isEnrolled && course.progress === 100 && (
            <Badge className="bg-success/10 text-success text-[10px] px-2 py-1 border-success/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        
        {/* Hover Hint - Moved here to avoid covering text */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50 shadow-sm">
            Click to preview
          </span>
        </div>
      </div>

      {/* Tags - Enhanced display */}
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

      {/* Price and Actions - Enhanced with SAR */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {sarOriginalPrice && sarOriginalPrice > sarPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {sarOriginalPrice} SAR
            </span>
          )}
          <span className="font-bold text-sm text-primary">
            {sarPrice} SAR
          </span>
          {sarOriginalPrice && sarOriginalPrice > sarPrice && (
            <Badge className="bg-primary/10 text-primary border-0 text-[9px] px-1.5 py-0.5">
              Save {sarOriginalPrice - sarPrice} SAR
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {course.isEnrolled ? (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0"
                onClick={handlePreview}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-[10px] px-2"
                onClick={handlePreview}
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
                onClick={handlePreview}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                className="h-7 text-[10px] px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll'}
              </Button>
            </>
          )}
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card 
      className={`group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-border/50 hover:border-primary/30 overflow-hidden cursor-pointer ${
        layout === 'compact' ? 'w-64' : 'w-80'
      } ${isHovered ? 'shadow-xl -translate-y-0.5' : ''}`}
      style={{ width: width || (layout === 'compact' ? '256px' : '320px') }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePreview}
    >
      {Thumbnail}
      {Content}
    </Card>
  );
}
