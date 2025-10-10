import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Search, 
  Filter,
  ChevronRight,
  Download,
  CheckCircle2,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  progress?: number;
  completed?: boolean;
  category: string;
  tags: string[];
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
    instructor: 'Sarah Johnson',
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 1847,
    price: 199,
    thumbnail: '/api/placeholder/300/200',
    progress: 60,
    category: 'Project Management',
    tags: ['PM', 'Planning', 'Leadership']
  },
  {
    id: '2',
    title: 'Understanding Engineering Drawings',
    description: 'Learn to read and interpret engineering drawings and specifications',
    instructor: 'Dr. Ahmed Al-Rashid',
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.5,
    students: 2156,
    price: 149,
    thumbnail: '/api/placeholder/300/200',
    completed: true,
    category: 'Engineering Basics',
    tags: ['Drawings', 'Specifications', 'CAD']
  },
  {
    id: '3',
    title: 'Budget Planning for Construction',
    description: 'Master the art of budget planning and cost estimation for construction projects',
    instructor: 'Mohammed Al-Zahrani',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.8,
    students: 892,
    price: 299,
    thumbnail: '/api/placeholder/300/200',
    progress: 25,
    category: 'Finance',
    tags: ['Budget', 'Cost Estimation', 'Finance']
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
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Project Management', 'Engineering Basics', 'Finance', 'Communication'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Learning Center
          </h1>
          <p className="text-muted-foreground">Enhance your project management and client skills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Certificates
          </Button>
          <Button size="sm">
            <Target className="h-4 w-4 mr-2" />
            Set Learning Goals
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockCourses.length}</p>
                <p className="text-xs text-muted-foreground">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{mockCourses.filter(c => c.completed).length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">2</p>
                <p className="text-xs text-muted-foreground">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">72%</p>
                <p className="text-xs text-muted-foreground">Avg. Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.completed && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                  {course.progress && !course.completed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
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
                      <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {course.level}
                      </Badge>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    <h3 className="font-semibold">{course.title}</h3>
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
                      <Button size="sm" className="flex-1">
                        {course.completed ? 'Review' : course.progress ? 'Continue' : 'Start'}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button size="sm" variant="outline">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
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
                      <Badge variant={path.difficulty === 'Beginner' ? 'default' : path.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{path.completedCourses}/{path.totalCourses} courses</span>
                      </div>
                      <Progress value={path.progress} />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {path.estimatedDuration}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">Project Management Certificate</h3>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Completed: Jan 15, 2024</p>
                    <p className="text-xs text-muted-foreground">Credential ID: PMC-2024-001234</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">Construction Management</h3>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Completed: Dec 20, 2023</p>
                    <p className="text-xs text-muted-foreground">Credential ID: CMC-2023-001234</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">Budget Planning</h3>
                      <Badge variant="secondary">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">nbcon Learning Center</p>
                    <p className="text-xs text-muted-foreground">Progress: 65%</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" className="w-full">
                    Continue Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-4">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Browse All Courses</h3>
            <p className="text-muted-foreground mb-4">Discover courses designed specifically for project clients</p>
            <Button>
              Explore Course Catalog
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

