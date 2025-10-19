import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/pages/1-HomePage/others/components/ui/dialog';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { CommentReply } from '@/pages/1-HomePage/others/components/ui/comment-reply';
import { toast } from 'sonner';
import { 
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  Share2,
  Heart,
  Bookmark,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  FileText,
  Video,
  BookOpen
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

interface CoursePreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
  onWishlist?: (courseId: string) => void;
}

export function CoursePreviewModal({ 
  course, 
  isOpen, 
  onClose, 
  onEnroll,
  onWishlist 
}: CoursePreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Scroll shadow states
  const [overviewScrolled, setOverviewScrolled] = useState({ top: false, bottom: true });
  const [scriptScrolled, setScriptScrolled] = useState({ top: false, bottom: true });
  const [modulesScrolled, setModulesScrolled] = useState({ top: false, bottom: true });
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isPanelsCollapsed, setIsPanelsCollapsed] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overviewViewportRef = useRef<HTMLDivElement>(null);
  const scriptViewportRef = useRef<HTMLDivElement>(null);
  const modulesViewportRef = useRef<HTMLDivElement>(null);

  // Convert USD to SAR
  const convertToSAR = (usdPrice: number) => Math.round(usdPrice * 3.75);
  const sarPrice = course ? convertToSAR(course.price) : 0;
  const sarOriginalPrice = course?.originalPrice ? convertToSAR(course.originalPrice) : null;

  // Mock script data - in real app, this would come from the course data
  const scriptData = course ? [
    { time: 0, text: "Welcome to this comprehensive course on project management fundamentals." },
    { time: 30, text: "In this first section, we'll cover the basic principles of effective project management." },
    { time: 60, text: "Project management involves planning, organizing, and managing resources to achieve specific goals." },
    { time: 90, text: "Let's start by understanding the project lifecycle and key phases." },
    { time: 120, text: "The initiation phase is where we define the project scope and objectives." },
    { time: 150, text: "Next, we move to planning, which is crucial for project success." },
    { time: 180, text: "During execution, we implement the project plan and manage resources." },
    { time: 210, text: "Finally, we close the project and conduct a lessons learned session." },
    { time: 240, text: "Monitoring and controlling involves tracking progress and making adjustments." },
    { time: 270, text: "Risk management is essential to identify and mitigate potential issues." },
    { time: 300, text: "Stakeholder communication ensures everyone is aligned on project goals." },
    { time: 330, text: "Quality assurance processes ensure deliverables meet requirements." },
    { time: 360, text: "Resource allocation and team management are critical for project success." },
    { time: 390, text: "Budget tracking helps maintain financial control throughout the project." },
    { time: 420, text: "Change management processes handle scope adjustments effectively." },
    { time: 450, text: "Documentation practices ensure knowledge transfer and compliance." }
  ] : [];

  // Mock course modules
  const courseModules = course ? [
    { id: 1, title: "Introduction to Project Management", duration: "15:30", lectures: 5, isCompleted: true },
    { id: 2, title: "Project Planning Fundamentals", duration: "22:45", lectures: 8, isCompleted: false },
    { id: 3, title: "Resource Management", duration: "18:20", lectures: 6, isCompleted: false },
    { id: 4, title: "Risk Assessment", duration: "25:10", lectures: 7, isCompleted: false },
    { id: 5, title: "Project Execution", duration: "30:15", lectures: 10, isCompleted: false },
    { id: 6, title: "Monitoring and Control", duration: "20:30", lectures: 6, isCompleted: false },
    { id: 7, title: "Project Closure", duration: "12:45", lectures: 4, isCompleted: false }
  ] : [];

  // Cleaner scroll shadow handler - direct viewport control
  const handleScrollShadow = useCallback((element: HTMLElement | null, setter: typeof setOverviewScrolled) => {
    if (!element) return;
    
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isTop = scrollTop > 10;
    const isBottom = scrollTop + clientHeight < scrollHeight - 10;
    
    setter({ top: isTop, bottom: isBottom });
  }, []);

  // Attach scroll listeners directly to viewport refs
  useEffect(() => {
    if (!isOpen) return;

    const setupScrollListener = (viewportRef: React.RefObject<HTMLDivElement>, setter: typeof setOverviewScrolled) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      
      const handleScroll = () => handleScrollShadow(viewport, setter);
      viewport.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check after DOM is ready
      setTimeout(handleScroll, 100);
      
      return () => viewport.removeEventListener('scroll', handleScroll);
    };

    const cleanupOverview = setupScrollListener(overviewViewportRef, setOverviewScrolled);
    const cleanupScript = setupScrollListener(scriptViewportRef, setScriptScrolled);
    const cleanupModules = setupScrollListener(modulesViewportRef, setModulesScrolled);
    
    return () => {
      cleanupOverview?.();
      cleanupScript?.();
      cleanupModules?.();
    };
  }, [handleScrollShadow, isOpen, activeTab]);

  useEffect(() => {
    if (isOpen && course) {
      // Reset state when modal opens
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentScriptIndex(0);
      setOverviewScrolled({ top: false, bottom: true });
      setScriptScrolled({ top: false, bottom: true });
      setModulesScrolled({ top: false, bottom: true });
    }
  }, [isOpen, course]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Update script based on current time
      const currentScript = scriptData.find((script, index) => {
        const nextScript = scriptData[index + 1];
        return script.time <= videoRef.current!.currentTime && 
               (!nextScript || videoRef.current!.currentTime < nextScript.time);
      });
      
      if (currentScript) {
        const scriptIndex = scriptData.indexOf(currentScript);
        setCurrentScriptIndex(scriptIndex);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    setIsEnrolling(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEnrolling(false);
    
    if (onEnroll) {
      onEnroll(course.id);
    }
    
    toast.success(`Successfully enrolled in "${course.title}"!`);
    onClose();
  };

  const handleWishlist = () => {
    if (!course) return;
    
    if (onWishlist) {
      onWishlist(course.id);
    }
    toast.success(`Added "${course.title}" to wishlist`);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const togglePanels = () => {
    setIsPanelsCollapsed(!isPanelsCollapsed);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] h-auto min-h-[80vh] p-0 overflow-hidden [&>button:last-child]:hidden">
        <div className="flex flex-col md:flex-row h-full min-h-[80vh]">
          {/* Left Side - Video Player */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-3 sm:p-4 border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg sm:text-xl font-bold line-clamp-2 mb-2 pr-2">
                    {course.title}
                  </DialogTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-warning text-warning" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="hidden sm:inline">({course.students.toLocaleString()} students)</span>
                        <span className="sm:hidden">({course.students.toLocaleString()})</span>
                      </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={togglePanels} 
                  title={isPanelsCollapsed ? 'Show panels' : 'Hide panels'}
                  className="hidden md:flex"
                >
                  {isPanelsCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </DialogHeader>

            {/* Video Player */}
            <div className="bg-black relative w-full aspect-video max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={course.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={course.videoUrl || '/api/placeholder/video'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-black/70 hover:bg-black/80 text-white rounded-full p-4 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1"
                        onClick={handleMute}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-3 sm:p-4 border-t border-border/40">
              <CommentReply />
            </div>
          </div>

          {/* Right Side - Course Details & Script */}
          <div className={`md:border-l bg-background flex flex-col transition-all duration-300 ${isPanelsCollapsed ? 'hidden md:flex md:w-0 overflow-hidden' : 'w-full md:w-96'}`}>
            {/* Close Button Row */}
            <div className="flex-shrink-0 flex justify-end items-center p-3 sm:p-4 border-b border-border/40">
              <button 
                type="button" 
                onClick={onClose}
                className="ring-offset-background focus:ring-ring bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-6 w-6 p-0 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 gap-0">
              {/* Tabs Row */}
              <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border/40">
                <TabsList className="w-full grid grid-cols-3 rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg">
                  <TabsTrigger value="overview" className="h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="script" className="h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Script</TabsTrigger>
                  <TabsTrigger value="modules" className="h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Modules</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 min-h-0 relative">
                {/* Overview Tab */}
                <TabsContent value="overview" className="absolute inset-0 m-0 data-[state=inactive]:hidden">
                  <div className={`h-full flex flex-col modal-scroll-shadow ${overviewScrolled.top ? 'scrolled-top' : ''} ${overviewScrolled.bottom ? 'scrolled-bottom' : ''}`}>
          <div 
            ref={overviewViewportRef}
            className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-1 course-modal-scroll"
          >
                      <div className="space-y-6">
                        {/* Course Info */}
                        <div>
                        <h3 className="font-bold text-lg mb-3">About This Course</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* Instructor */}
                        <div>
                          <h4 className="font-semibold mb-3">Instructor</h4>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={course.instructor.avatar} />
                              <AvatarFallback>
                                {course.instructor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{course.instructor.name}</p>
                              <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-warning text-warning" />
                                <span className="text-xs">{course.instructor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* What You'll Learn */}
                        {course.whatYoullLearn && (
                          <div>
                            <h4 className="font-semibold mb-3">What You'll Learn</h4>
                            <ul className="space-y-2">
                              {course.whatYoullLearn.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Course Includes */}
                        {course.includes && (
                          <div>
                            <h4 className="font-semibold mb-3">This Course Includes</h4>
                            <ul className="space-y-2">
                              {course.includes.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                      
                    </div>
                  </div>
                </TabsContent>

                {/* Script Tab */}
                <TabsContent value="script" className="absolute inset-0 m-0 data-[state=inactive]:hidden">
                  <div className={`h-full flex flex-col modal-scroll-shadow ${scriptScrolled.top ? 'scrolled-top' : ''} ${scriptScrolled.bottom ? 'scrolled-bottom' : ''}`}>
                    <div 
                      ref={scriptViewportRef}
                      className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-16 course-modal-scroll"
                    >
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Course Transcript</h3>
                        
                        <div className="space-y-3">
                          {scriptData.map((script, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                index === currentScriptIndex
                                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                                  : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                              }`}
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.currentTime = script.time;
                                  setCurrentTime(script.time);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    index === currentScriptIndex
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {formatTime(script.time)}
                                  </div>
                                </div>
                                <p className="text-sm leading-relaxed">{script.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </TabsContent>

                {/* Modules Tab */}
                <TabsContent value="modules" className="absolute inset-0 m-0 data-[state=inactive]:hidden">
                  <div className={`h-full flex flex-col modal-scroll-shadow ${modulesScrolled.top ? 'scrolled-top' : ''} ${modulesScrolled.bottom ? 'scrolled-bottom' : ''}`}>
                    <div 
                      ref={modulesViewportRef}
                      className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-16 course-modal-scroll"
                    >
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Course Content</h3>
                        
                        <div className="space-y-2">
                          {courseModules.map((module, index) => (
                            <div
                              key={module.id}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {module.isCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-success" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{module.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>{module.duration}</span>
                                  <span>•</span>
                                  <span>{module.lectures} lectures</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom spacer to ensure last content is fully visible */}
                      <div className="h-8"></div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Pricing & Actions - Right Side */}
            <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border/40 bg-background">
              <div className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {sarOriginalPrice && sarOriginalPrice > sarPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {sarOriginalPrice} SAR
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      {sarPrice} SAR
                    </span>
                    {sarOriginalPrice && sarOriginalPrice > sarPrice && (
                      <Badge className="bg-primary/10 text-primary">
                        Save {sarOriginalPrice - sarPrice} SAR
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                      onClick={handleWishlist}
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Wishlist</span>
                      <span className="sm:hidden">Wish</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                      onClick={handleBookmark}
                    >
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Bookmark</span>
                      <span className="sm:hidden">Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
