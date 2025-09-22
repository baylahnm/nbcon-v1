import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Video, Play, Star, Clock, Languages, Award, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  provider: {
    name: string;
    verified: boolean;
  };
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  rating: number;
  ratingCount: number;
  language: string[];
  hasCertificate: boolean;
  hasHandsOn: boolean;
  cpd: boolean;
  thumbnail: string;
  description: string;
  tags: string[];
  price: number;
  isBookmarked: boolean;
  popularity: number;
  skills?: string[];
  enrolledCount?: number;
  trending?: boolean;
  newContent?: boolean;
  saudiSpecific?: boolean;
}

interface RecommendationsRowProps {
  title: string;
  reason: string;
  courses: Course[];
  icon: LucideIcon;
  onViewCourse: (courseId: string, title: string, fromPage?: string) => void;
  onStartCourse: (courseId: string, title: string, progress?: number, fromPage?: string) => void;
  onToggleBookmark: (courseId: string) => void;
}

export function RecommendationsRow({ 
  title, 
  reason, 
  courses, 
  icon: Icon, 
  onViewCourse, 
  onStartCourse, 
  onToggleBookmark 
}: RecommendationsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [courses]);

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.floor(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    // give time for smooth scroll then update
    setTimeout(updateScrollButtons, 300);
  };
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-[hsl(var(--success)_/_0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)_/_0.3)]";
      case "intermediate":
        return "bg-[hsl(var(--warning)_/_0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)_/_0.3)]";
      case "advanced":
        return "bg-[hsl(var(--destructive)_/_0.12)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)_/_0.3)]";
      default:
        return "bg-muted text-foreground border-sidebar-border";
    }
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByAmount('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-sidebar-border bg-background/80 backdrop-blur p-2 shadow ${canScrollLeft ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByAmount('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-sidebar-border bg-background/80 backdrop-blur p-2 shadow ${canScrollRight ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Courses */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="overflow-x-auto scroll-smooth"
        >
          <div className="flex gap-4 snap-x snap-mandatory">
            {courses.map((course) => (
              <div key={course.id} className="flex-none basis-full sm:basis-1/2 lg:basis-1/3 snap-start">
                <Card className="group hover:shadow-lg transition-all duration-200 border-sidebar-border hover:border-primary h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleBookmark(course.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {course.isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        )}
                      </Button>
                    </div>
                    {/* Provider Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{course.provider.name}</span>
                      {course.provider.verified && (
                        <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {/* Video Thumbnail */}
                    <div className="relative mb-3 rounded-lg overflow-hidden bg-muted aspect-video group cursor-pointer">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <button 
                            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white hover:scale-110 focus:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartCourse(course.id, course.title, 0, 'discover');
                            }}
                            aria-label="Play video"
                            type="button"
                          >
                            <Play className="w-6 h-6 text-primary ml-0.5" />
                          </button>
                        </div>
                        <Video className="w-8 h-8 text-primary/50" />
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white border-none">
                          {formatDuration(course.duration)}
                        </Badge>
                      </div>
                      {(course.trending || course.newContent) && (
                        <div className="absolute top-2 left-2">
                          {course.trending && (
                            <Badge variant="secondary" className="text-xs bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border-none mb-1">
                              Trending
                            </Badge>
                          )}
                          {course.newContent && (
                            <Badge variant="secondary" className="text-xs bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-none">
                              New
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="mb-2 line-clamp-2 text-sm font-medium">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(course.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[hsl(var(--warning))] fill-[hsl(var(--warning))]" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        {course.language.join(", ")}
                      </div>
                    </div>
                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {course.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                        {course.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 text-muted-foreground">
                            +{course.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      {course.hasCertificate && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Certificate
                        </Badge>
                      )}
                      {course.cpd && (
                        <Badge variant="secondary" className="text-xs">
                          CPD
                        </Badge>
                      )}
                      {course.saudiSpecific && (
                        <Badge variant="secondary" className="text-xs bg-[hsl(var(--success)_/_0.12)] text-[hsl(var(--success))]">
                          Saudi
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-primary text-sm">{course.price.toLocaleString()} SAR</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewCourse(course.id, course.title, 'discover')}
                          className="text-xs px-2 py-1 h-7"
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-2 py-1 h-7"
                          onClick={() => onStartCourse(course.id, course.title, 0, 'discover')}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

