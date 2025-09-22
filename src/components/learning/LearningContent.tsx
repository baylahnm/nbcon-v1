import { useState } from "react";
import { 
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Award,
  Play,
  BookmarkCheck,
  Bookmark,
  Calendar,
  Globe,
  Target,
  TrendingUp,
  ChevronRight,
  Download,
  CheckCircle,
  BarChart3,
  Settings,
  User,
  Building,
  ShieldCheck,
  Video,
  FileText,
  Zap,
  Brain,
  MapPin,
  Languages,
  PlayCircle,
  PlusCircle,
  Eye,
  RotateCcw,
  Trophy,
  Briefcase,
  Flame,
  Users2,
  User2,
  Timer,
  Sparkles
} from "lucide-react";
import { RecommendationsRow } from "./RecommendationsRow";
import { LearningFilters } from "./LearningFilters";
import { enhancedSampleCourses, generateRecommendations, sampleProviders } from "./LearningDataEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalHours: number;
  level: "beginner" | "intermediate" | "advanced";
  coursesCount: number;
  certificateAvailable: boolean;
  category: string;
  enrolledCount: number;
  completionRate: number;
  thumbnail: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  provider: string;
  progress: number;
  lastAccessed: string;
  estimatedCompletion: string;
  thumbnail: string;
}

interface Assessment {
  id: string;
  title: string;
  skill: string;
  duration: number;
  questions: number;
  passScore: number;
  attempts: number;
  lastScore?: number;
  passed: boolean;
  description: string;
}

interface LearningContentProps {
  onViewCourse: (courseId: string, title: string, fromPage?: 'discover' | 'paths' | 'my-learning' | 'assessments') => void;
  onStartCourse: (courseId: string, title: string, progress?: number, fromPage?: 'discover' | 'paths' | 'my-learning' | 'assessments') => void;
  onStartPath: (pathId: string, title: string) => void;
  onStartAssessment: (assessmentId: string, title: string) => void;
  onViewCertificate: (certificateId: string, title: string) => void;
}

const samplePaths: LearningPath[] = [
  {
    id: "path-1",
    title: "Saudi Megaproject Engineering Specialist",
    description: "Master the engineering skills needed for Saudi Arabia's Vision 2030 megaprojects",
    totalHours: 120,
    level: "intermediate",
    coursesCount: 4,
    certificateAvailable: true,
    category: "Megaprojects",
    enrolledCount: 856,
    completionRate: 87,
    thumbnail: "megaproject-path"
  }
];

const sampleEnrollments: Enrollment[] = [
  {
    id: "1",
    courseId: "course-1",
    courseName: "NEOM Smart City Infrastructure Design",
    provider: "NEOM Tech Institute",
    progress: 65,
    lastAccessed: "2024-12-29",
    estimatedCompletion: "2025-01-15",
    thumbnail: "smart-city"
  }
];

const sampleAssessments: Assessment[] = [
  {
    id: "assessment-1",
    title: "NEOM Smart City Infrastructure - Final Assessment",
    skill: "Smart City Design",
    duration: 90,
    questions: 25,
    passScore: 70,
    attempts: 2,
    lastScore: 68,
    passed: false,
    description: "Comprehensive assessment covering smart city design principles and NEOM project specifications."
  },
  {
    id: "assessment-2",
    title: "Process Safety Management - Aramco Standards",
    skill: "Safety Management",
    duration: 120,
    questions: 30,
    passScore: 80,
    attempts: 0,
    passed: false,
    description: "Assessment on process safety management principles following Saudi Aramco safety standards."
  }
];

export function LearningContent({ onViewCourse, onStartCourse, onStartPath, onStartAssessment, onViewCertificate }: LearningContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [isHijri, setIsHijri] = useState(false);
  const [userRole] = useState<"engineer" | "client" | "enterprise" | "admin">("engineer");
  const [userSpecialty] = useState("Structural Engineering");
  
  // Enhanced filtering state
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    level: "all",
    language: "all",
    provider: "all",
    duration: [0, 1000] as [number, number],
    price: [0, 5000] as [number, number],
    hasCertificate: false,
    hasHandsOn: false,
    cpdEligible: false,
    trending: false,
    newContent: false,
    saudiSpecific: false,
    minRating: 0
  });

  // Generate personalized recommendations
  const recommendations = generateRecommendations(userRole, userSpecialty);
  
  // Additional recommendation categories
  const thisWeekTopCourses = enhancedSampleCourses
    .filter(course => course.popularity > 90)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);
    
  const skillsYouFollow = enhancedSampleCourses
    .filter(course => course.skills.some(skill => 
      ['Smart City Design', 'Structural Analysis', 'BIM Modeling', 'Process Safety'].includes(skill)
    ))
    .slice(0, 6);
    
  const brushUpSkills = enhancedSampleCourses
    .filter(course => course.level === 'beginner' || course.level === 'intermediate')
    .slice(0, 6);
    
  const communityLearning = enhancedSampleCourses
    .filter(course => course.enrolledCount && course.enrolledCount > 1000)
    .slice(0, 6);
    
  const popularOnNbcon = enhancedSampleCourses
    .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
    .slice(0, 6);
    
  const thirtyMinutesOrLess = enhancedSampleCourses
    .filter(course => course.duration <= 30)
    .slice(0, 6);
    
  const newReleases = enhancedSampleCourses
    .filter(course => course.newContent)
    .slice(0, 6);
  
  // Filter options
  const filterOptions = {
    categories: Array.from(new Set(enhancedSampleCourses.map(course => course.category))),
    levels: ["beginner", "intermediate", "advanced"],
    languages: [
      { code: "all", name: "All Languages" },
      { code: "ar", name: "العربية" },
      { code: "en", name: "English" },
      { code: "both", name: "Arabic & English" }
    ],
    providers: Array.from(new Set(enhancedSampleCourses.map(course => course.provider.name))),
    duration: { min: 0, max: 1000 },
    price: { min: 0, max: 5000 }
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
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const filteredCourses = enhancedSampleCourses.filter(course => {
    // Search query
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !course.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    // Enhanced filters
    if (activeFilters.category !== "all" && course.category !== activeFilters.category) return false;
    if (activeFilters.level !== "all" && course.level !== activeFilters.level) return false;
    if (activeFilters.provider !== "all" && course.provider.name !== activeFilters.provider) return false;
    if (activeFilters.language !== "all") {
      if (activeFilters.language === "both" && course.language.length < 2) return false;
      if (activeFilters.language !== "both" && !course.language.includes(activeFilters.language)) return false;
    }
    
    // Feature filters
    if (activeFilters.hasCertificate && !course.hasCertificate) return false;
    if (activeFilters.hasHandsOn && !course.hasHandsOn) return false;
    if (activeFilters.cpdEligible && !course.cpd) return false;
    if (activeFilters.trending && !course.trending) return false;
    if (activeFilters.newContent && !course.newContent) return false;
    if (activeFilters.saudiSpecific && !course.saudiSpecific) return false;
    
    // Rating filter
    if (activeFilters.minRating > 0 && course.rating < activeFilters.minRating) return false;
    
    // Duration filter
    if (course.duration < activeFilters.duration[0] || course.duration > activeFilters.duration[1]) return false;
    
    // Price filter
    if (course.price < activeFilters.price[0] || course.price > activeFilters.price[1]) return false;
    
    // Legacy filters
    if (selectedCategory !== "all" && course.category !== selectedCategory) return false;
    if (selectedLevel !== "all" && course.level !== selectedLevel) return false;
    if (selectedLanguage !== "all") {
      if (selectedLanguage === "both" && course.language.length < 2) return false;
      if (selectedLanguage !== "both" && !course.language.includes(selectedLanguage)) return false;
    }
    if (showOnlyBookmarked && !course.isBookmarked) return false;
    
    return true;
  });

  const handleToggleBookmark = (courseId: string) => {
    // Update bookmark status in the enhanced courses array
    console.log(`Toggle bookmark for course ${courseId}`);
  };

  return (
    <div className="flex-1 bg-background p-6">
      {/* Header */}
      <div className="p-0 pb-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-xl font-medium text-foreground">Learning</h1>
            </div>
            <p className="text-sm text-muted-foreground">Advance your engineering skills with courses tailored for Saudi Arabia</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch 
                id="hijri" 
                checked={isHijri}
                onCheckedChange={setIsHijri}
              />
              <Label htmlFor="hijri" className="text-sm">Hijri Calendar</Label>
            </div>
            <LearningFilters
              options={filterOptions}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              resultsCount={filteredCourses.length}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 px-0 pb-0">
        <div className="w-full space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search courses, learning paths, and skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="my-learning">My Learning</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              {(userRole === "enterprise" || userRole === "admin") && (
                <TabsTrigger value="admin">Admin</TabsTrigger>
              )}
            </TabsList>

            {/* Discover Tab - Enhanced with Multiple Recommendation Sections */}
            <TabsContent value="discover" className="space-y-6">
              
              {/* Recommended for Engineers */}
              <RecommendationsRow
                title={`Recommended for Engineers (${userSpecialty})`}
                reason="Courses tailored to your role and specialty"
                courses={recommendations.forYou}
                icon={Briefcase}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* This Week's Top Courses */}
              <RecommendationsRow
                title="This week's top courses"
                reason="Most popular courses this week on nbcon Learning"
                courses={thisWeekTopCourses}
                icon={Flame}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* Because of Skills You Follow */}
              <RecommendationsRow
                title="Because of skills you follow"
                reason="Based on skills you've shown interest in"
                courses={skillsYouFollow}
                icon={Target}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* Brush Up Skills */}
              <RecommendationsRow
                title="Brush up on the skills on your nbcon profile"
                reason="Strengthen your existing skills with these courses"
                courses={brushUpSkills}
                icon={RotateCcw}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* Community Learning */}
              <RecommendationsRow
                title="See what your community is learning this week"
                reason="Popular among Saudi engineering professionals"
                courses={communityLearning}
                icon={Users2}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* Popular on nbcon Learning */}
              <RecommendationsRow
                title="Popular on nbcon Learning"
                reason="Most enrolled courses across all engineering disciplines"
                courses={popularOnNbcon}
                icon={TrendingUp}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* 30 Minutes or Less */}
              <RecommendationsRow
                title="30 minutes or less"
                reason="Quick learning sessions that fit into your busy schedule"
                courses={thirtyMinutesOrLess}
                icon={Clock}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

              {/* New Releases */}
              <RecommendationsRow
                title="New Releases"
                reason="Latest courses and content from top Saudi engineering institutes"
                courses={newReleases}
                icon={Sparkles}
                onViewCourse={onViewCourse}
                onStartCourse={onStartCourse}
                onToggleBookmark={handleToggleBookmark}
              />

            </TabsContent>

            {/* Learning Paths Tab */}
            <TabsContent value="paths" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Paths</CardTitle>
                  <p className="text-muted-foreground">
                    Structured learning journeys to master complete skill sets
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {samplePaths.map((path) => (
                      <Card key={path.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-card-foreground mb-2">{path.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{path.totalHours}h total</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{path.coursesCount} courses</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{path.enrolledCount} enrolled</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="w-4 h-4" />
                                  <span>{path.completionRate}% completion</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className={getLevelColor(path.level)}>
                                  {path.level}
                                </Badge>
                                <Button 
                                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                                  onClick={() => onStartPath(path.id, path.title)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Path
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Learning Tab */}
            <TabsContent value="my-learning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                  <p className="text-muted-foreground">
                    Pick up where you left off
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleEnrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gradient-primary rounded flex items-center justify-center">
                              <Video className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-card-foreground mb-1">{enrollment.courseName}</h3>
                              <p className="text-sm text-muted-foreground mb-2">by {enrollment.provider}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span>Last accessed: {enrollment.lastAccessed}</span>
                                <span>Est. completion: {enrollment.estimatedCompletion}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{enrollment.progress}%</span>
                                </div>
                                <Progress value={enrollment.progress} className="w-full" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                onClick={() => onStartCourse(enrollment.courseId, enrollment.courseName, enrollment.progress, 'my-learning')}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onViewCertificate('cert-1', enrollment.courseName)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Assessments</CardTitle>
                  <p className="text-muted-foreground">
                    Test your knowledge and earn certifications
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleAssessments.map((assessment) => (
                      <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-info/10 rounded flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-info" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">{assessment.title}</h3>
                                <p className="text-sm text-muted-foreground">{assessment.skill}</p>
                              </div>
                            </div>
                            {assessment.passed && (
                              <CheckCircle className="w-5 h-5 text-success" />
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">{assessment.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{assessment.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{assessment.questions} questions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>{assessment.passScore}% to pass</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <RotateCcw className="w-4 h-4" />
                              <span>{assessment.attempts} attempts</span>
                            </div>
                          </div>

                          {assessment.lastScore && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Last Score</span>
                                <span className={assessment.passed ? "text-success" : "text-destructive"}>
                                  {assessment.lastScore}%
                                </span>
                              </div>
                              <Progress 
                                value={assessment.lastScore} 
                                className={`w-full ${assessment.passed ? 'text-success' : 'text-destructive'}`} 
                              />
                            </div>
                          )}

                          <div className="flex gap-2">
                            {assessment.attempts === 0 ? (
                              <Button 
                                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
                                onClick={() => onStartAssessment(assessment.id, assessment.title)}
                              >
                                <Trophy className="w-4 h-4 mr-2" />
                                Start Assessment
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => onStartAssessment(assessment.id, assessment.title)}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Retake Assessment
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tab */}
            {(userRole === "enterprise" || userRole === "admin") && (
              <TabsContent value="admin" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Learning Administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Users className="w-8 h-8 text-info mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Manage Users</h3>
                          <p className="text-sm text-muted-foreground mb-3">Add and manage team members</p>
                          <Button variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Users
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Analytics</h3>
                          <p className="text-sm text-muted-foreground mb-3">View learning progress reports</p>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Reports
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Building className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Custom Content</h3>
                          <p className="text-sm text-muted-foreground mb-3">Create company-specific courses</p>
                          <Button variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Course
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

