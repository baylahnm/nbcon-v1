import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';
import { Input } from '../../../../../1-HomePage/others/components/ui/input';
import { Textarea } from '../../../../../1-HomePage/others/components/ui/textarea';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import { ScrollArea } from '../../../../../1-HomePage/others/components/ui/scroll-area';
import {
  seedCourse,
  seedResources,
  seedQAThreads,
  seedTranscript,
  formatTime,
  formatDuration,
  calculateCourseProgress,
  type Course,
  type Lesson,
  type Note,
  type Resource
} from '../data/courseData';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Repeat,
  Share2,
  Bookmark,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Star,
  Users,
  Award,
  BookOpen,
  PlayCircle,
  PictureInPicture,
  Subtitles,
  ThumbsUp,
  MoreHorizontal,
  Menu,
  X
} from 'lucide-react';

export function NewCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showCaptions, setShowCaptions] = useState(true);
  const [selectedCaption, setSelectedCaption] = useState('en');
  
  // Course state
  const [course] = useState<Course>(seedCourse);
  const [currentLessonId, setCurrentLessonId] = useState(course.lastWatchedLessonId || 'lesson-1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  
  // Get current lesson
  const currentLesson = course.sections
    .flatMap(s => s.lessons)
    .find(l => l.id === currentLessonId) || course.sections[0]?.lessons[0];
  
  // Calculate progress
  const progress = calculateCourseProgress(course.sections);
  
  // Video player handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0] / 100;
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };
  
  // Lesson navigation
  const goToNextLesson = () => {
    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };
  
  const goToPreviousLesson = () => {
    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(100, volume * 100 + 10)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume * 100 - 10)]);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'c':
          e.preventDefault();
          setShowCaptions(!showCaptions);
          break;
        case '>':
          e.preventDefault();
          changeSpeed(Math.min(2, playbackSpeed + 0.25));
          break;
        case '<':
          e.preventDefault();
          changeSpeed(Math.max(0.5, playbackSpeed - 0.25));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume, playbackSpeed, showCaptions]);
  
  // Add note at current time
  const addNote = () => {
    if (newNote.trim() && currentLesson) {
      const note = {
        id: `note-${Date.now()}`,
        courseId: course.id,
        lessonId: currentLesson.id,
        t: Math.floor(currentTime),
        text: newNote,
        createdAt: new Date().toISOString()
      };
      setNotes([...notes, note]);
      setNewNote('');
    }
  };
  
  // Filter lessons by search
  const filteredSections = course.sections.map(section => ({
    ...section,
    lessons: section.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.lessons.length > 0);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/engineer/learning')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm md:text-base font-bold truncate">{course.title}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{progress.percentage}% complete</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">{progress.completed} of {progress.total} lessons</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {course.enrolled ? (
              <Button size="sm" className="h-8 text-xs hidden md:inline-flex">
                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                Resume
              </Button>
            ) : (
              <Button size="sm" className="h-8 text-xs">
                Enroll Now
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content - 3 Column Layout */}
      <div className="flex">
        {/* Left Sidebar - Contents (Collapsible) */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 border-r border-border/50 bg-card flex-shrink-0 overflow-hidden`}
        >
          <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            
            {/* Course Progress */}
            <div className="p-4 border-b border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Course Progress</span>
                <span className="text-muted-foreground">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress.completed} of {progress.total} lessons completed
              </p>
            </div>
            
            {/* Lessons List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {filteredSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{section.title}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {section.lessons.length} lessons
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (!lesson.locked) {
                              setCurrentLessonId(lesson.id);
                              setCurrentTime(lesson.progressSec || 0);
                            }
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            lesson.id === currentLessonId
                              ? 'bg-primary/10 border border-primary/30'
                              : lesson.locked
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-muted/50'
                          }`}
                          disabled={lesson.locked}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {lesson.locked ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : lesson.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : lesson.isPreview ? (
                                <PlayCircle className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDuration(lesson.durationSec)}
                                </span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                                    Preview
                                  </Badge>
                                )}
                                {lesson.progressSec && lesson.progressSec > 0 && !lesson.isCompleted && (
                                  <div className="flex-1 max-w-[60px]">
                                    <Progress 
                                      value={(lesson.progressSec / lesson.durationSec) * 100} 
                                      className="h-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
        
        {/* Center - Video Player + Tabs */}
        <main className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              src={currentLesson?.videoUrl}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Overlay Controls */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6"
              onMouseMove={() => setShowControls(true)}
            >
              {/* Top Bar - Lesson Title */}
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="font-medium text-sm md:text-base">{currentLesson?.title}</h2>
                  <p className="text-xs text-white/70">
                    Lesson {currentLesson?.order} of {progress.total}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Center - Play Button */}
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-20 w-20 rounded-full bg-black/50 hover:bg-black/70 text-white p-0"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
                </Button>
              </div>
              
              {/* Bottom Controls */}
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="relative group">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary group-hover:[&::-webkit-slider-thumb]:scale-125 transition-transform"
                  />
                  {/* Chapter Markers */}
                  {currentLesson?.chapters?.map((chapter) => (
                    <div
                      key={chapter.title}
                      className="absolute top-0 w-0.5 h-2 bg-white/60"
                      style={{ left: `${(chapter.start / duration) * 100}%` }}
                      title={chapter.title}
                    />
                  ))}
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    {/* Previous/Next */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={goToPreviousLesson}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={goToNextLesson}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    
                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        onClick={toggleMute}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={(e) => handleVolumeChange([Number(e.target.value)])}
                        className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer hidden md:block [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                    
                    {/* Time */}
                    <span className="text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Captions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 text-white hover:bg-white/20 ${showCaptions ? 'bg-white/20' : ''}`}
                      onClick={() => setShowCaptions(!showCaptions)}
                    >
                      <Subtitles className="h-4 w-4" />
                    </Button>
                    
                    {/* Settings (Speed & Quality) */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      {showSettings && (
                        <Card className="absolute bottom-10 right-0 w-48 z-50">
                          <CardContent className="p-3 space-y-3">
                            <div>
                              <p className="text-xs font-medium mb-2">Playback Speed</p>
                              <div className="grid grid-cols-3 gap-1">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                  <Button
                                    key={speed}
                                    variant={playbackSpeed === speed ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => changeSpeed(speed)}
                                  >
                                    {speed}x
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <p className="text-xs font-medium mb-2">Quality</p>
                              <div className="space-y-1">
                                {['Auto', '1080p', '720p', '480p'].map((q) => (
                                  <Button
                                    key={q}
                                    variant={quality === q.toLowerCase() ? 'default' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start h-7 text-xs"
                                    onClick={() => setQuality(q.toLowerCase())}
                                  >
                                    {q}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* PiP */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 hidden md:inline-flex"
                    >
                      <PictureInPicture className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Below Video */}
          <div className="p-4 md:p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 gap-0">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notebook">Notebook</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.learningOutcomes?.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Skills you'll gain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notebook Tab */}
              <TabsContent value="notebook" className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">My Notes</CardTitle>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Note */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a note at current timestamp..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1 min-h-[80px] text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="h-auto px-4"
                      >
                        Add Note
                      </Button>
                    </div>
                    
                    {/* Notes List */}
                    <div className="space-y-3">
                      {notes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notes yet. Add your first note above!</p>
                        </div>
                      ) : (
                        notes.map((note) => (
                          <Card key={note.id} className="border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-primary"
                                  onClick={() => handleSeek(note.t)}
                                >
                                  {formatTime(note.t)}
                                </Button>
                                <div className="flex-1">
                                  <p className="text-sm">{note.text}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Transcript Tab */}
              <TabsContent value="transcript" className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Transcript</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download VTT
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search transcript..."
                        value={transcriptSearch}
                        onChange={(e) => setTranscriptSearch(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                    
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {seedTranscript
                          .filter(line => 
                            transcriptSearch === '' || 
                            line.text.toLowerCase().includes(transcriptSearch.toLowerCase())
                          )
                          .map((line, index) => (
                            <button
                              key={index}
                              onClick={() => handleSeek(line.t)}
                              className={`w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                                currentTime >= line.t && currentTime < line.t + line.d
                                  ? 'bg-primary/10 border border-primary/30'
                                  : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <span className="text-xs font-mono text-primary flex-shrink-0">
                                  {formatTime(line.t)}
                                </span>
                                <p className="text-sm">{line.text}</p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {seedResources.map((resource) => (
                        <div
                          key={resource.id}
                          className={`flex items-center justify-between p-4 rounded-lg border border-border/50 ${
                            resource.locked ? 'opacity-60' : 'hover:bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {resource.locked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{resource.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {resource.type.toUpperCase()} • {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            disabled={resource.locked}
                          >
                            {resource.locked ? (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Upgrade
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Q&A Tab */}
              <TabsContent value="qa" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-base">Course Discussions</h3>
                  <Button size="sm" className="h-8 text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Ask Question
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {seedQAThreads.map((thread) => (
                    <Card key={thread.id} className="border-border/50">
                      <CardContent className="p-4">
                        {/* Question */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={thread.author.avatar} />
                            <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{thread.author.name}</span>
                              <span className="text-xs text-muted-foreground">• {thread.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium mb-2">{thread.question}</p>
                            {thread.lessonId && (
                              <Badge variant="outline" className="text-[10px]">
                                Lesson {course.sections.flatMap(s => s.lessons).find(l => l.id === thread.lessonId)?.order}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Answers */}
                        {thread.answers.map((answer) => (
                          <div key={answer.id} className="ml-11 pl-4 border-l-2 border-border/50 space-y-2 mb-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={answer.author.avatar} />
                                <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">{answer.author.name}</span>
                                  {answer.isInstructor && (
                                    <Badge className="bg-primary/10 text-primary border-0 text-[9px] px-1.5 py-0">
                                      Instructor
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">• {answer.timestamp}</span>
                                </div>
                                <p className="text-sm leading-relaxed">{answer.answer}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Helpful ({answer.helpful})
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {thread.replies > thread.answers.length && (
                          <Button variant="ghost" size="sm" className="ml-11 text-xs h-7">
                            View {thread.replies - thread.answers.length} more replies
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        {/* Right Sidebar - Related & Meta */}
        <aside className="w-80 border-l border-border/50 bg-card hidden xl:block flex-shrink-0">
          <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="p-6 space-y-6">
              {/* Instructor */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={instructor.avatar} />
                        <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{instructor.name}</p>
                        <p className="text-xs text-muted-foreground">{instructor.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{instructor.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{instructor.students?.toLocaleString()} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Course Meta */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(course.totalDurationSec)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{progress.total} lessons in {course.sections.length} sections</span>
                  </div>
                  {course.certificate?.available && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Certificate included</p>
                        <p className="text-xs text-muted-foreground">{course.certificate.note}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Related Courses */}
              <div>
                <h3 className="font-medium text-base mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {course.related.slice(0, 4).map((relatedCourse) => (
                    <Card
                      key={relatedCourse.id}
                      className="border-border/50 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/engineer/learning/course/${relatedCourse.id}`)}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={relatedCourse.thumbnail}
                              alt={relatedCourse.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              {relatedCourse.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{relatedCourse.rating}</span>
                              </div>
                              <span>•</span>
                              <span className="font-medium text-primary">${relatedCourse.price}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

