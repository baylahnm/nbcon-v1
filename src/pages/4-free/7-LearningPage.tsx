import { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { toast } from 'sonner';
import { CourseCard } from '@/pages/5-engineer/others/features/learning/components/CourseCard';
import { HorizontalScrollCards } from '@/pages/5-engineer/others/features/learning/components/HorizontalScrollCards';
import { useOutsideClick } from '@/pages/1-HomePage/others/hooks/use-outside-click';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Search, 
  ChevronRight,
  Download,
  CheckCircle2,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Briefcase,
  X,
  Video,
  FileText,
  BarChart3
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
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  progress?: number;
  completed?: boolean;
  category: string;
  tags: string[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalCourses: number;
  completedCourses: number;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  progress: number;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Project Management for Clients',
    description: 'Learn how to effectively manage engineering projects from a client perspective',
    instructor: { 
      name: 'Sarah Johnson', 
      avatar: '/api/placeholder/40/40',
      title: 'Project Management Expert',
      rating: 4.7
    },
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 1847,
    price: 199,
    originalPrice: 249,
    thumbnail: '/e-learning/Project Management/Project Management Fundamentals.jpg',
    progress: 60,
    category: 'Project Management',
    tags: ['PM', 'Planning', 'Leadership'],
    isBestSeller: true
  },
  {
    id: '2',
    title: 'Understanding Engineering Drawings',
    description: 'Learn to read and interpret engineering drawings and specifications',
    instructor: { 
      name: 'Dr. Ahmed Al-Rashid', 
      avatar: '/api/placeholder/40/40',
      title: 'Professor of Structural Engineering',
      rating: 4.8
    },
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.5,
    students: 2156,
    price: 149,
    thumbnail: '/e-learning/Software/Engineering Drawing Standards.jpg',
    completed: true,
    category: 'Engineering Basics',
    tags: ['Drawings', 'Specifications', 'CAD'],
    isTrending: true
  },
  {
    id: '3',
    title: 'Budget Planning for Construction',
    description: 'Master the art of budget planning and cost estimation for construction projects',
    instructor: { 
      name: 'Mohammed Al-Zahrani', 
      avatar: '/api/placeholder/40/40',
      title: 'Financial Consultant',
      rating: 4.8
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.8,
    students: 892,
    price: 299,
    originalPrice: 399,
    thumbnail: '/e-learning/Project Management/Cost Estimation and Control.jpg',
    progress: 25,
    category: 'Finance',
    tags: ['Budget', 'Cost Estimation', 'Finance'],
    isTrending: true,
    isBestSeller: true
  },
  {
    id: '4',
    title: 'Contract Management Essentials',
    description: 'Understand construction contracts and manage them effectively',
    instructor: { 
      name: 'Lisa Chen', 
      avatar: '/api/placeholder/40/40',
      title: 'Contract Specialist',
      rating: 4.6
    },
    duration: '5 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 1234,
    price: 229,
    thumbnail: '/e-learning/Project Management/Contract Administration.jpg',
    category: 'Project Management',
    tags: ['Contracts', 'Legal', 'Management'],
    isBestSeller: true
  },
  {
    id: '5',
    title: 'Quality Control in Construction',
    description: 'Learn quality assurance and control processes for construction projects',
    instructor: { 
      name: 'Ahmed Al-Ghamdi', 
      avatar: '/api/placeholder/40/40',
      title: 'Quality Assurance Expert',
      rating: 4.7
    },
    duration: '6 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 1567,
    price: 199,
    thumbnail: '/e-learning/Safety/Risk Assessment Techniques.jpg',
    category: 'Quality Management',
    tags: ['Quality', 'Control', 'Standards'],
    isTrending: true
  },
  {
    id: '6',
    title: 'Construction Safety Basics',
    description: 'Essential safety protocols and best practices for construction sites',
    instructor: { 
      name: 'Jennifer Kim', 
      avatar: '/api/placeholder/40/40',
      title: 'Safety Consultant',
      rating: 4.8
    },
    duration: '3 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 2890,
    price: 99,
    originalPrice: 149,
    thumbnail: '/e-learning/Safety/Construction Safety Management.jpg',
    category: 'Safety',
    tags: ['Safety', 'Compliance', 'Site Management'],
    isBestSeller: true,
    isNew: true
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Client Success Path',
    description: 'Complete guide to becoming a successful project client',
    totalCourses: 8,
    completedCourses: 5,
    estimatedDuration: '4 months',
    difficulty: 'Intermediate',
    thumbnail: '/api/placeholder/300/200',
    progress: 63
  },
  {
    id: '2',
    title: 'Construction Project Management',
    description: 'Learn to manage construction projects effectively',
    totalCourses: 6,
    completedCourses: 2,
    estimatedDuration: '3 months',
    difficulty: 'Beginner',
    thumbnail: '/api/placeholder/300/200',
    progress: 33
  }
];

export default function LearningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCourse, setExpandedCourse] = useState<Course | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const expandedStatRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const statId = useId();

  const categories = ['all', 'Project Management', 'Engineering Basics', 'Finance', 'Quality Management', 'Safety'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle expanded course interactions
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedCourse(null);
        setExpandedStat(null);
      }
    }

    if (expandedCourse || expandedStat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedCourse, expandedStat]);

  useOutsideClick(expandedRef, () => {
    setExpandedCourse(null);
  });

  useOutsideClick(expandedStatRef, () => {
    setExpandedStat(null);
  });

  const handleCourseView = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setExpandedCourse(course);
    }
  };

  const handlePreview = (courseId: string) => {
    // Navigate to full course page for preview
    navigate(`/free/learning/course/${courseId}`);
    setExpandedCourse(null);
  };

  const handleCourseEnroll = async (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;

    setIsEnrolling(true);
    
    // Simulate enrollment process (API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsEnrolling(false);
    
    // Show success toast
    toast.success(`Successfully enrolled in "${course.title}"!`);
    
    // Navigate to course page to start learning immediately
    navigate(`/free/learning/course/${courseId}`);
    
    // Close modal
    setExpandedCourse(null);
  };

  return (
    <div className="w-full max-w-full p-4 space-y-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-gradient-to-t from-primary to-primary-dark h-10 w-10 flex items-center justify-center rounded-xl shadow-sm shadow-primary/50 flex-shrink-0">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[18px] font-bold tracking-tight">Learning Center</h1>
            <p className="text-[14px] text-muted-foreground">Master project management and client skills</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Certificates
          </Button>
          <Button className="h-8 text-xs bg-gradient-primary">
            <Target className="h-3.5 w-3.5 mr-1.5" />
            Learning Goals
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            id: 'enrolled',
            icon: BookOpen,
            label: 'Enrolled Courses',
            value: mockCourses.length,
            trend: '+12%'
          },
          {
            id: 'completed',
            icon: CheckCircle2,
            label: 'Completed',
            value: mockCourses.filter(c => c.completed).length,
            trend: '+8%'
          },
          {
            id: 'certifications',
            icon: Award,
            label: 'Certifications',
            value: '2',
            trend: '+5%'
          },
          {
            id: 'progress',
            icon: TrendingUp,
            label: 'Avg. Progress',
            value: '72%',
            trend: '+3%'
          }
        ].map((stat) => (
          <motion.div
            key={stat.id}
            layoutId={`stat-${stat.id}-${statId}`}
            onClick={() => setExpandedStat(stat.id)}
            className="relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-t from-primary to-primary-dark p-2.5 rounded-lg shadow-sm shadow-primary/50">
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Browse Categories */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Browse Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSelectedCategory('all')}
          >
            All Courses
          </Button>
          {categories.slice(1).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Trending Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Trending Courses</h2>
        </div>
        <HorizontalScrollCards 
          className="w-full"
          cardsPerView={{
            mobile: 1.1,
            tablet: 2.1,
            desktop: 3,
            wide: 3
          }}
        >
          {mockCourses.filter(course => course.isTrending).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onView={handleCourseView}
              layout="threeRow"
            />
          ))}
        </HorizontalScrollCards>
      </div>

      {/* Best Seller Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Best Sellers</h2>
        </div>
        <HorizontalScrollCards 
          className="w-full"
          cardsPerView={{
            mobile: 1.1,
            tablet: 2.1,
            desktop: 3,
            wide: 3
          }}
        >
          {mockCourses.filter(course => course.isBestSeller).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onView={handleCourseView}
              layout="threeRow"
            />
          ))}
        </HorizontalScrollCards>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
        <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
          <TabsTrigger value="courses" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">My Courses</TabsTrigger>
          <TabsTrigger value="paths" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Learning Paths</TabsTrigger>
          <TabsTrigger value="certifications" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Certifications</TabsTrigger>
          <TabsTrigger value="browse" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Browse All</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="mt-4 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.completed && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                  {course.progress && !course.completed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                    </div>
                    <h3 className="font-bold text-base line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 h-8 text-xs">
                        {course.completed ? 'Review' : course.progress ? 'Continue' : 'Start'}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={path.thumbnail} 
                    alt={path.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={path.difficulty === 'Beginner' ? 'default' : path.difficulty === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                        {path.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{path.completedCourses}/{path.totalCourses} courses</span>
                      </div>
                      <Progress value={path.progress} />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {path.estimatedDuration}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full h-8 text-xs">
                      Continue Path
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm">Project Management Certificate</h3>
                      <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Completed: Jan 15, 2024</p>
                    <p className="text-xs text-muted-foreground">Credential ID: PMC-2024-001234</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm">Construction Management</h3>
                      <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Completed: Dec 20, 2023</p>
                    <p className="text-xs text-muted-foreground">Credential ID: CMC-2023-001234</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm">Budget Planning</h3>
                      <Badge variant="secondary" className="text-xs">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Progress: 65%</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" className="w-full h-8 text-xs">
                    Continue Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold mb-2">Browse All Courses</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Discover courses designed specifically for project clients
              </p>
              <Button className="h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Explore Course Catalog
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expanded Course Modal */}
      <AnimatePresence>
        {expandedCourse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
              <motion.div
                ref={expandedRef}
                layoutId={`course-${expandedCourse.id}-${id}`}
                className="w-full max-w-5xl bg-card rounded-xl shadow-2xl my-8 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="relative">
                  {/* Course Thumbnail */}
                  <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                      src={expandedCourse.thumbnail}
                      alt={expandedCourse.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setExpandedCourse(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors backdrop-blur-sm"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>

                    {/* Course Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {expandedCourse.isBestSeller && (
                        <Badge className="bg-red-500 text-white text-xs px-2.5 py-1">
                          <Award className="h-3 w-3 mr-1" />
                          Best Seller
                        </Badge>
                      )}
                      {expandedCourse.isTrending && (
                        <Badge className="bg-orange-500 text-white text-xs px-2.5 py-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {expandedCourse.isNew && (
                        <Badge className="bg-blue-500 text-white text-xs px-2.5 py-1">
                          New
                        </Badge>
                      )}
                    </div>

                    {/* Course Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {expandedCourse.title}
                      </h1>
                      <p className="text-sm text-white/90 mb-4 line-clamp-2">
                        {expandedCourse.description}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white/30">
                          <AvatarImage src={expandedCourse.instructor.avatar} />
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {expandedCourse.instructor.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {expandedCourse.instructor.name}
                          </p>
                          <p className="text-xs text-white/80">
                            {expandedCourse.instructor.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 bg-background/80 max-h-[60vh] overflow-y-auto">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{expandedCourse.rating}</p>
                      <p className="text-xs text-muted-foreground">Course Rating</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{expandedCourse.students.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{expandedCourse.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{expandedCourse.level}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      About This Course
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {expandedCourse.description}
                    </p>
                  </div>

                  {/* What You'll Learn */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Master key concepts and methodologies',
                        'Apply practical techniques to real projects',
                        'Understand industry best practices',
                        'Develop professional skills and expertise',
                        'Gain hands-on experience through exercises',
                        'Prepare for industry certifications'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Tags */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm">Course Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {expandedCourse.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="border-t border-border/40 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        {expandedCourse.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ${expandedCourse.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-primary">
                          ${expandedCourse.price}
                        </span>
                        {expandedCourse.originalPrice && (
                          <Badge className="ml-2 bg-primary/10 text-primary border-0">
                            Save ${expandedCourse.originalPrice - expandedCourse.price}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(expandedCourse.id);
                          }}
                          disabled={isEnrolling}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseEnroll(expandedCourse.id);
                          }}
                          disabled={isEnrolling}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Expanded Stat Modals */}
      <AnimatePresence>
        {expandedStat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
              <motion.div
                ref={expandedStatRef}
                layoutId={`stat-${expandedStat}-${statId}`}
                className="w-full max-w-3xl bg-card rounded-xl shadow-2xl my-8"
              >
                {/* Enrolled Courses Modal */}
                {expandedStat === 'enrolled' && (
                  <div>
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <BookOpen className="h-8 w-8" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Enrolled Courses</h2>
                            <p className="text-blue-100 mt-1">Your active learning journey</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStat(null)}
                          className="text-white hover:bg-white/20"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{mockCourses.length}</p>
                          <p className="text-xs text-muted-foreground mt-1">Total Courses</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{mockCourses.filter(c => c.completed).length}</p>
                          <p className="text-xs text-muted-foreground mt-1">Completed</p>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                          <p className="text-2xl font-bold text-amber-600">{mockCourses.filter(c => !c.completed).length}</p>
                          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                        </div>
                      </div>

                      {/* Course List */}
                      <div>
                        <h3 className="font-bold text-base mb-4">Your Courses</h3>
                        <div className="space-y-3">
                          {mockCourses.slice(0, 6).map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setExpandedStat(null);
                                navigate(`/free/learning/course/${course.id}`);
                              }}
                            >
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm line-clamp-1">{course.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{course.instructor.name}</p>
                                {course.progress !== undefined && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Progress value={course.progress} className="h-1.5 flex-1" />
                                    <span className="text-xs font-medium text-primary">{course.progress}%</span>
                                  </div>
                                )}
                              </div>
                              <Badge className={course.completed ? "bg-green-500/10 text-green-600 border-0" : "bg-blue-500/10 text-blue-600 border-0"}>
                                {course.completed ? 'Complete' : 'In Progress'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setExpandedStat(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Courses Modal */}
                {expandedStat === 'completed' && (
                  <div>
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <CheckCircle2 className="h-8 w-8" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Completed Courses</h2>
                            <p className="text-green-100 mt-1">Achievements & certificates</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStat(null)}
                          className="text-white hover:bg-white/20"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Completed Course List */}
                      <div className="space-y-3">
                        {mockCourses.filter(c => c.completed).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="bg-green-500/10 p-3 rounded-xl">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{course.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{course.instructor.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Award className="h-3 w-3 text-amber-600" />
                                <span className="text-xs text-muted-foreground">Certificate earned</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStat(null);
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setExpandedStat(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications Modal */}
                {expandedStat === 'certifications' && (
                  <div>
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <Award className="h-8 w-8" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Certifications</h2>
                            <p className="text-purple-100 mt-1">Your professional achievements</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStat(null)}
                          className="text-white hover:bg-white/20"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Certification List */}
                      <div className="space-y-4">
                        {/* Certificate 1 */}
                        <Card className="border-purple-200">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="bg-purple-500/10 p-3 rounded-xl shrink-0">
                                <Award className="h-8 w-8 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-base">Project Management Professional (PMP)</h4>
                                <p className="text-sm text-muted-foreground mt-1">Issued by: PMI • Earned: Jan 2024</p>
                                <div className="flex items-center gap-2 mt-3">
                                  <Badge className="bg-green-500/10 text-green-600 border-0">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Credential ID: PMP-2024-001234</span>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Certificate 2 */}
                        <Card className="border-purple-200">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="bg-purple-500/10 p-3 rounded-xl shrink-0">
                                <Award className="h-8 w-8 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-base">Renewable Energy Systems</h4>
                                <p className="text-sm text-muted-foreground mt-1">Issued by: NBCON Learning • Earned: Feb 2024</p>
                                <div className="flex items-center gap-2 mt-3">
                                  <Badge className="bg-green-500/10 text-green-600 border-0">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Credential ID: NBC-REN-2024-5678</span>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setExpandedStat(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Avg. Progress Modal */}
                {expandedStat === 'progress' && (
                  <div>
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <TrendingUp className="h-8 w-8" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Learning Progress</h2>
                            <p className="text-amber-100 mt-1">Track your course completion</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStat(null)}
                          className="text-white hover:bg-white/20"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Overall Progress */}
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                        <CardContent className="p-5">
                          <div className="text-center space-y-3">
                            <p className="text-4xl font-bold text-amber-600">72%</p>
                            <p className="text-sm text-muted-foreground">Average Course Progress</p>
                            <Progress value={72} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progress Breakdown */}
                      <div>
                        <h3 className="font-bold text-base mb-4">Course Progress Breakdown</h3>
                        <div className="space-y-3">
                          {mockCourses.slice(0, 6).map((course) => (
                            <div
                              key={course.id}
                              className="p-4 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm line-clamp-1 flex-1">{course.title}</h4>
                                <span className="text-sm font-bold text-primary ml-2">{course.progress || 0}%</span>
                              </div>
                              <Progress value={course.progress || 0} className="h-2" />
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {course.progress === 100 ? 'Completed' : `${Math.round((course.progress || 0) / 10)} of 10 lessons`}
                                </span>
                                {course.progress === 100 && (
                                  <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px]">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Done
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setExpandedStat(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
