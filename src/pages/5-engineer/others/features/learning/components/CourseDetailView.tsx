import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';
import { Slider } from '../../../../../1-HomePage/others/components/ui/slider';
import { Switch } from '../../../../../1-HomePage/others/components/ui/switch';
import {
  Play,
  Star,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  BookOpen,
  Award,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  PlayCircle,
  X,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  RotateCcw,
  MoreHorizontal,
  Info,
  Keyboard,
  Flag,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock
} from 'lucide-react';

interface Instructor {
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  students: number;
  courses: number;
  specialties: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: Instructor;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  videoUrl: string;
  progress?: number;
  completed?: boolean;
  category: string;
  tags: string[];
  isEnrolled?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  curriculum: CourseSection[];
  requirements: string[];
  learningOutcomes: string[];
  reviews: CourseReview[];
}

interface CourseSection {
  id: string;
  title: string;
  duration: string;
  lectures: CourseLecture[];
  completed: boolean;
}

interface CourseLecture {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted: boolean;
  videoUrl: string;
}

interface CourseReview {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified: boolean;
}

interface CourseDetailViewProps {
  course: Course;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
  onContinueLearning?: (courseId: string, lectureId: string) => void;
}

export function CourseDetailView({ course, onClose, onEnroll, onContinueLearning }: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([course.curriculum?.[0]?.id || '']));
  const videoRef = useRef<HTMLVideoElement>(null);

  const getLevelBadgeVariant = (level: Course['level']) => {
    switch (level) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'default';
    }
  };

  const totalLectures = course.curriculum?.reduce((acc, section) => acc + (section.lectures?.length || 0), 0) || 0;
  const completedLectures = course.curriculum?.reduce((acc, section) => 
    acc + (section.lectures?.filter(lecture => lecture.isCompleted).length || 0), 0
  ) || 0;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? [50] : [0]);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-6xl bg-background z-50 flex shadow-2xl">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-background border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold line-clamp-1">{course.title}</h1>
                  <p className="text-xs text-muted-foreground">By {course.instructor.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Your progress</span>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="flex-1 bg-black relative">
          {/* Udemy-style Video Player */}
          <div className="relative w-full h-full">
            {/* Video Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              {/* Course Title Slide */}
              <div className="text-center text-white max-w-4xl px-8">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{course.title}</h2>
                  <p className="text-xl md:text-2xl text-white/80 mb-6">{course.category}</p>
                  <div className="flex items-center justify-center gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{course.students?.toLocaleString() || '0'} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="h-20 w-20 rounded-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm shadow-2xl"
                >
                  <PlayCircle className="h-12 w-12" />
                </Button>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="h-10 w-10 p-0 text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-mono">1x</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatTime(currentTime)}</span>
                      <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-200" 
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                      <Slider
                        value={isMuted ? [0] : volume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 text-white hover:bg-white/20 bg-black/50 rounded-full"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 text-white hover:bg-white/20 bg-black/50 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Course Content Below Video */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">

                {/* Course Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg ring-1 ring-blue-500/20">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-xs text-muted-foreground">{course.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-lg ring-1 ring-green-500/20">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Lectures</p>
                          <p className="text-xs text-muted-foreground">{totalLectures} lessons</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-lg ring-1 ring-purple-500/20">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Students</p>
                          <p className="text-xs text-muted-foreground">{course.students?.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Course Description */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {course.longDescription || course.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Learning Outcomes */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(course.learningOutcomes || []).map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(course.requirements || []).map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Course Curriculum</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {completedLectures} of {totalLectures} lectures completed
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(completedLectures / totalLectures) * 100} className="mb-6" />
                    <div className="space-y-3">
                      {(course.curriculum || []).map((section, sectionIndex) => (
                        <div key={section.id} className="border border-border/50 rounded-lg overflow-hidden">
                          <div 
                            className="p-4 bg-muted/30 border-b border-border/40 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleSection(section.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  {expandedSections.has(section.id) ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </Button>
                                <div>
                                  <h4 className="font-medium text-sm">{section.title}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {section.lectures?.length || 0} lectures • {section.duration}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={section.completed ? "default" : "secondary"} className="text-xs">
                                {section.completed ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                          </div>
                          {expandedSections.has(section.id) && (
                            <div className="p-4 space-y-3">
                              {(section.lectures || []).map((lecture, lectureIndex) => (
                                <div
                                  key={lecture.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                    lecture.isCompleted
                                      ? 'bg-green-50 border border-green-200'
                                      : selectedLecture === lecture.id
                                      ? 'bg-primary/10 border border-primary/20'
                                      : 'hover:bg-muted/50'
                                  }`}
                                  onClick={() => setSelectedLecture(lecture.id)}
                                >
                                  <div className="flex-shrink-0">
                                    {lecture.isCompleted ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : lecture.isPreview ? (
                                      <Play className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{lecture.title}</p>
                                    <p className="text-xs text-muted-foreground">{lecture.duration}</p>
                                  </div>
                                  {lecture.isPreview && (
                                    <Badge variant="outline" className="text-xs">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{course.instructor.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {course.instructor.students?.toLocaleString()} students
                          </span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {course.instructor.courses} courses
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                          {course.instructor.bio}
                        </p>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {(course.instructor.specialties || []).map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Student Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({course.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(course.reviews || []).map((review) => (
                    <Card key={review.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user.avatar} alt={review.user.name} />
                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{review.user.name}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{review.date}</p>
                            <p className="text-sm leading-relaxed">{review.content}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Udemy-style Sidebar */}
      <div className="w-80 bg-background border-l border-border/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Course content</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Course Progress */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Course progress</span>
            <span className="font-medium">{Math.round((completedLectures / totalLectures) * 100)}%</span>
          </div>
          <Progress value={(completedLectures / totalLectures) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLectures} of {totalLectures} lectures completed
          </p>
        </div>

        {/* Course Content Sections */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {(course.curriculum || []).map((section, sectionIndex) => (
              <div key={section.id} className="border border-border/50 rounded-lg overflow-hidden">
                <div 
                  className="p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                      <div>
                        <h4 className="font-medium text-sm">{section.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {section.lectures?.length || 0} lectures • {section.duration}
                        </p>
                      </div>
                    </div>
                    <Badge variant={section.completed ? "default" : "secondary"} className="text-xs">
                      {section.completed ? "✓" : "0/3"}
                    </Badge>
                  </div>
                </div>
                {expandedSections.has(section.id) && (
                  <div className="p-3 pt-0 space-y-2">
                    {(section.lectures || []).map((lecture, lectureIndex) => (
                      <div
                        key={lecture.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          lecture.isCompleted
                            ? 'bg-green-50 border border-green-200'
                            : selectedLecture === lecture.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedLecture(lecture.id)}
                      >
                        <div className="flex-shrink-0">
                          {lecture.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : lecture.isPreview ? (
                            <Play className="h-4 w-4 text-blue-500" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lecture.title}</p>
                          <p className="text-xs text-muted-foreground">{lecture.duration}</p>
                        </div>
                        {lecture.isPreview && (
                          <Badge variant="outline" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer - Pricing & Actions */}
        <div className="p-4 border-t border-border/50 space-y-4">
          {/* Pricing */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {course.price} SAR
              {course.originalPrice && (
                <span className="text-lg text-muted-foreground line-through ml-2">
                  {course.originalPrice} SAR
                </span>
              )}
            </div>
            {course.originalPrice && (
              <Badge className="bg-green-500 text-white text-xs mt-1">
                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {course.isEnrolled ? (
              <Button 
                className="w-full" 
                onClick={() => onContinueLearning?.(course.id, course.curriculum?.[0]?.lectures?.[0]?.id || '')}
              >
                Continue Learning
                <Play className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="w-full" onClick={() => onEnroll?.(course.id)}>
                Enroll Now
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Course Includes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Course Includes</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Play className="h-3 w-3" />
                <span>{course.duration} on-demand video</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Downloadable resources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Access on mobile and desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
