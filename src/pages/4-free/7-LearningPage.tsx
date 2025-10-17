import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { CourseCard } from '@/pages/5-engineer/others/features/learning/components/CourseCard';
import { HorizontalScrollCards } from '@/pages/5-engineer/others/features/learning/components/HorizontalScrollCards';
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
  Briefcase
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

  const categories = ['all', 'Project Management', 'Engineering Basics', 'Finance', 'Quality Management', 'Safety'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCourseView = (courseId: string) => {
    console.log('View course:', courseId);
  };

  const handleCourseEnroll = (courseId: string) => {
    console.log('Enroll in course:', courseId);
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
            icon: BookOpen,
            label: 'Enrolled Courses',
            value: mockCourses.length,
            trend: '+12%'
          },
          {
            icon: CheckCircle2,
            label: 'Completed',
            value: mockCourses.filter(c => c.completed).length,
            trend: '+8%'
          },
          {
            icon: Award,
            label: 'Certifications',
            value: '2',
            trend: '+5%'
          },
          {
            icon: TrendingUp,
            label: 'Avg. Progress',
            value: '72%',
            trend: '+3%'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden transition-all duration-300"
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
          </div>
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
                    <Briefcase className="h-8 w-8 text-blue-600" />
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
    </div>
  );
}
