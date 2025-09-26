import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  Bookmark,
  BookmarkCheck,
  Download,
  MessageSquare,
  FileText,
  List,
  X,
  ChevronDown,
  ChevronUp,
  PenTool,
  Clock,
  CheckCircle,
  PlayCircle,
  Target,
  Award,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CoursePlayerContentProps {
  courseId: string;
  courseTitle: string;
  progress: number;
  onBack: () => void;
}

// Mock course data with detailed lesson structure
const getCoursePlayerData = (courseId: string) => {
  return {
    id: courseId,
    title: 'NEOM Smart City Infrastructure Design',
    currentLesson: {
      id: 'lesson-1',
      title: 'NEOM Project Overview',
      videoUrl: '/placeholder-video.mp4',
      duration: 1800, // 30 minutes in seconds
      transcript: [
        { time: 0, text: "Welcome to the NEOM Smart City Infrastructure Design course." },
        { time: 15, text: "In this comprehensive program, we'll explore the revolutionary urban planning concepts being implemented in NEOM." },
        { time: 45, text: "NEOM represents a new model for sustainable living, powered by renewable energy and cutting-edge technology." },
        { time: 90, text: "The project spans 26,500 square kilometers in the northwest of Saudi Arabia." }
      ],
      resources: [
        { name: 'NEOM Master Plan.pdf', size: '15.2 MB', type: 'pdf' },
        { name: 'Sustainability Guidelines.docx', size: '2.1 MB', type: 'doc' },
        { name: 'Construction Templates.dwg', size: '8.7 MB', type: 'dwg' }
      ]
    },
    curriculum: [
      {
        title: 'Introduction to NEOM Vision 2030',
        lessons: [
          { id: 'lesson-1', title: 'NEOM Project Overview', duration: '30 min', completed: false, current: true },
          { id: 'lesson-2', title: 'Vision 2030 Alignment', duration: '25 min', completed: false, current: false },
          { id: 'lesson-3', title: 'Site Analysis Exercise', duration: '45 min', completed: false, current: false },
          { id: 'lesson-4', title: 'Module 1 Quiz', duration: '20 min', completed: false, current: false }
        ]
      },
      {
        title: 'Smart Infrastructure Fundamentals',
        lessons: [
          { id: 'lesson-5', title: 'IoT Sensors in Infrastructure', duration: '40 min', completed: false, current: false },
          { id: 'lesson-6', title: 'Data Collection Systems', duration: '35 min', completed: false, current: false },
          { id: 'lesson-7', title: 'Smart Grid Integration', duration: '45 min', completed: false, current: false }
        ]
      },
      {
        title: 'Sustainable Desert Construction',
        lessons: [
          { id: 'lesson-8', title: 'Climate-Adaptive Materials', duration: '50 min', completed: false, current: false },
          { id: 'lesson-9', title: 'Solar Integration in Buildings', duration: '40 min', completed: false, current: false }
        ]
      }
    ],
    overallProgress: 15,
    notes: [
      { id: 1, timestamp: 245, content: 'Key point about renewable energy integration', time: '4:05' },
      { id: 2, timestamp: 520, content: 'Remember to review the sustainability metrics', time: '8:40' }
    ]
  };
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video': return <PlayCircle className="w-4 h-4 text-blue-600" />;
    case 'quiz': return <MessageSquare className="w-4 h-4 text-orange-600" />;
    case 'assignment': return <Target className="w-4 h-4 text-purple-600" />;
    case 'lab': return <ShieldCheck className="w-4 h-4 text-primary" />;
    case 'project': return <Award className="w-4 h-4 text-red-600" />;
    default: return <PlayCircle className="w-4 h-4 text-muted-foreground" />;
  }
};

export function CoursePlayerContent({ courseId, courseTitle, progress, onBack }: CoursePlayerContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(progress || 0);
  const [duration, setDuration] = useState(1800);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [newNote, setNewNote] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [bookmarked, setBookmarked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const course = getCoursePlayerData(courseId);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        // Auto-save progress logic would go here
        console.log('Auto-saving progress:', currentTime);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const addNote = () => {
    if (newNote.trim()) {
      // Add note logic would go here
      console.log('Adding note:', newNote, 'at time:', currentTime);
      setNewNote('');
    }
  };

  const jumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'mr-80' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <div className="text-muted-foreground text-sm">
              Learning &gt; {course.title}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              className="text-muted-foreground hover:text-foreground"
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-primary relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-card flex items-center justify-center">
              {/* Video placeholder - in real implementation, this would be a video element */}
              <div className="text-center text-muted-foreground">
                <PlayCircle className="w-24 h-24 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">{course.currentLesson.title}</h3>
                <p className="text-muted-foreground/70">Video content would play here</p>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-transparent p-4">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipBackward}
                    className="text-primary-foreground hover:text-muted-foreground"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-primary-foreground hover:text-muted-foreground"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipForward}
                    className="text-primary-foreground hover:text-muted-foreground"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-primary-foreground hover:text-muted-foreground"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Playback Speed */}
                  <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
                    <SelectTrigger className="w-20 h-8 bg-transparent border-sidebar-border text-primary-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-primary-foreground hover:text-muted-foreground"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground font-medium">Course Progress</span>
            <span className="text-muted-foreground">{course.overallProgress}% Complete</span>
          </div>
          <Progress value={course.overallProgress} className="w-full" />
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-full sm:w-96 md:w-80 lg:w-96 xl:w-[28rem] bg-background border-l flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-foreground">{course.currentLesson.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Module 1 of 8</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-sidebar-border m-4">
              <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                <div className="flex items-center w-full overflow-x-auto">
                  <TabsTrigger value="curriculum" className="flex items-center gap-2 px-4 py-3 min-w-fit">Content</TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2 px-4 py-3 min-w-fit">Notes</TabsTrigger>
                  <TabsTrigger value="transcript" className="flex items-center gap-2 px-4 py-3 min-w-fit">Script</TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2 px-4 py-3 min-w-fit">Files</TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent value="curriculum" className="flex-1 m-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {course.curriculum.map((module, moduleIndex) => (
                    <Card key={moduleIndex}>
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleModule(moduleIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{module.title}</CardTitle>
                          {expandedModules.has(moduleIndex) ? 
                            <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          }
                        </div>
                      </CardHeader>
                      
                      {expandedModules.has(moduleIndex) && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lessonIndex} 
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                                  lesson.current ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                                }`}
                              >
                                {lesson.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : lesson.current ? (
                                  <PlayCircle className="w-4 h-4 text-primary" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded-full" />
                                )}
                                <div className="flex-1">
                                  <div className={`text-sm ${lesson.current ? 'font-medium text-primary' : 'text-foreground'}`}>
                                    {lesson.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 m-0 flex flex-col">
              <div className="p-4 border-b">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note at current time..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={addNote} size="sm" className="w-full">
                    <PenTool className="w-4 h-4 mr-2" />
                    Add Note ({formatTime(currentTime)})
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {course.notes.map((note) => (
                    <Card key={note.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <button
                            onClick={() => jumpToTimestamp(note.timestamp)}
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            {note.time}
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="transcript" className="flex-1 m-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {course.currentLesson.transcript.map((entry, index) => (
                    <div 
                      key={index}
                      className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => jumpToTimestamp(entry.time)}
                    >
                      <span className="text-xs text-primary font-medium min-w-[50px]">
                        {formatTime(entry.time)}
                      </span>
                      <p className="text-sm text-muted-foreground">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resources" className="flex-1 m-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {course.currentLesson.resources.map((resource, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-foreground">{resource.name}</div>
                              <div className="text-sm text-muted-foreground">{resource.size}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}