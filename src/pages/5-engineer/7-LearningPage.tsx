import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Progress } from '../1-HomePage/others/components/ui/progress';
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
  Calendar
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

interface Certification {
  id: string;
  title: string;
  issuer: string;
  status: 'completed' | 'in-progress' | 'not-started';
  completionDate?: string;
  expiryDate?: string;
  credentialId?: string;
  thumbnail: string;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Structural Analysis',
    description: 'Master advanced techniques in structural analysis and design',
    instructor: 'Dr. Ahmed Al-Rashid',
    duration: '8 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1247,
    price: 299,
    thumbnail: '/api/placeholder/300/200',
    progress: 75,
    category: 'Structural Engineering',
    tags: ['Analysis', 'Design', 'Software']
  },
  {
    id: '2',
    title: 'Project Management Fundamentals',
    description: 'Learn essential project management skills for engineers',
    instructor: 'Sarah Johnson',
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.6,
    students: 2156,
    price: 199,
    thumbnail: '/api/placeholder/300/200',
    completed: true,
    category: 'Project Management',
    tags: ['PM', 'Planning', 'Leadership']
  },
  {
    id: '3',
    title: 'Renewable Energy Systems',
    description: 'Comprehensive guide to renewable energy technologies',
    instructor: 'Dr. Mohammed Al-Zahrani',
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 892,
    price: 399,
    thumbnail: '/api/placeholder/300/200',
    progress: 30,
    category: 'Energy Engineering',
    tags: ['Solar', 'Wind', 'Sustainability']
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Senior Engineer Path',
    description: 'Complete path to become a senior engineer',
    totalCourses: 12,
    completedCourses: 8,
    estimatedDuration: '6 months',
    difficulty: 'Advanced',
    thumbnail: '/api/placeholder/300/200',
    progress: 67
  },
  {
    id: '2',
    title: 'Project Management Certification',
    description: 'Prepare for PMP certification',
    totalCourses: 8,
    completedCourses: 3,
    estimatedDuration: '4 months',
    difficulty: 'Intermediate',
    thumbnail: '/api/placeholder/300/200',
    progress: 38
  }
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    title: 'Professional Engineer (PE) License',
    issuer: 'Saudi Council of Engineers',
    status: 'completed',
    completionDate: '2023-08-15',
    credentialId: 'PE-2023-001234',
    thumbnail: '/api/placeholder/100/100'
  },
  {
    id: '2',
    title: 'PMP Certification',
    issuer: 'Project Management Institute',
    status: 'in-progress',
    thumbnail: '/api/placeholder/100/100'
  },
  {
    id: '3',
    title: 'Autodesk Certified Professional',
    issuer: 'Autodesk',
    status: 'not-started',
    thumbnail: '/api/placeholder/100/100'
  }
];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Structural Engineering', 'Project Management', 'Energy Engineering', 'Software'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Learning Center
          </h1>
          <p className="text-xs text-muted-foreground">Advance your engineering career with expert-led courses</p>
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
                <p className="text-sm font-medium">{mockCertifications.filter(c => c.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">85%</p>
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
            {mockCertifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <img 
                        src={cert.thumbnail} 
                        alt={cert.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{cert.title}</h3>
                        <Badge 
                          variant={
                            cert.status === 'completed' ? 'default' : 
                            cert.status === 'in-progress' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {cert.status === 'completed' ? 'Completed' : 
                           cert.status === 'in-progress' ? 'In Progress' : 
                           'Not Started'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{cert.issuer}</p>
                      {cert.completionDate && (
                        <p className="text-xs text-muted-foreground">Completed: {cert.completionDate}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="w-full">
                      {cert.status === 'completed' ? 'View Certificate' : 
                       cert.status === 'in-progress' ? 'Continue' : 
                       'Start Certification'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-4">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Browse All Courses</h3>
            <p className="text-muted-foreground mb-4">Discover thousands of engineering courses from top instructors</p>
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
