import { useState } from "react";
import { 
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  Globe,
  Award,
  BookOpen,
  CheckCircle,
  Download,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  MessageSquare,
  Calendar,
  Languages,
  Target,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CourseDetailContentProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onStartCourse: (courseId: string, title: string) => void;
}

// Mock course data - this would come from your API
const getCourseData = (courseId: string) => {
  const courses = {
    'course-1': {
      id: 'course-1',
      title: 'NEOM Smart City Infrastructure Design',
      instructor: 'Dr. Ahmad Al-Rashid',
      instructorTitle: 'Senior Civil Engineer, NEOM',
      rating: 4.8,
      reviewCount: 342,
      enrollmentCount: 1247,
      duration: '8 weeks',
      level: 'Intermediate',
      language: 'Arabic & English',
      certificate: 'NEOM Certified',
      price: 'SAR 2,499',
      description: 'Master the principles of smart city infrastructure design with hands-on experience in NEOM\'s revolutionary urban planning projects. Learn cutting-edge sustainable engineering practices.',
      whatYouLearn: [
        'Smart infrastructure planning and design',
        'Sustainable urban development principles',
        'Integration of renewable energy systems',
        'Advanced materials for desert construction',
        'IoT implementation in city infrastructure',
        'Environmental impact assessment'
      ],
      prerequisites: [
        'Bachelor\'s degree in Civil or Environmental Engineering',
        'Basic knowledge of AutoCAD and BIM software',
        'Understanding of Saudi building codes'
      ],
      curriculum: [
        {
          title: 'Introduction to NEOM Vision 2030',
          lessons: 4,
          duration: '2 hours',
          completed: false,
          lessons_detail: [
            { title: 'NEOM Project Overview', duration: '30 min', type: 'video' },
            { title: 'Vision 2030 Alignment', duration: '25 min', type: 'video' },
            { title: 'Site Analysis Exercise', duration: '45 min', type: 'assignment' },
            { title: 'Module 1 Quiz', duration: '20 min', type: 'quiz' }
          ]
        },
        {
          title: 'Smart Infrastructure Fundamentals',
          lessons: 6,
          duration: '3.5 hours',
          completed: false,
          lessons_detail: [
            { title: 'IoT Sensors in Infrastructure', duration: '40 min', type: 'video' },
            { title: 'Data Collection Systems', duration: '35 min', type: 'video' },
            { title: 'Smart Grid Integration', duration: '45 min', type: 'video' },
            { title: 'Case Study: Barcelona Smart City', duration: '30 min', type: 'reading' },
            { title: 'Hands-on Lab: Sensor Placement', duration: '60 min', type: 'lab' },
            { title: 'Assessment', duration: '20 min', type: 'quiz' }
          ]
        },
        {
          title: 'Sustainable Desert Construction',
          lessons: 5,
          duration: '4 hours',
          completed: false,
          lessons_detail: [
            { title: 'Climate-Adaptive Materials', duration: '50 min', type: 'video' },
            { title: 'Solar Integration in Buildings', duration: '40 min', type: 'video' },
            { title: 'Water Conservation Systems', duration: '45 min', type: 'video' },
            { title: 'NEOM Construction Standards', duration: '35 min', type: 'reading' },
            { title: 'Design Project: Green Building', duration: '90 min', type: 'project' }
          ]
        }
      ],
      reviews: [
        {
          name: 'Fatima Al-Zahra',
          title: 'Civil Engineer, SABIC',
          rating: 5,
          date: '2 weeks ago',
          comment: 'Excellent course! The practical examples from NEOM projects were incredibly valuable. The instructor\'s experience really shows.'
        },
        {
          name: 'Mohammed Hassan',
          title: 'Infrastructure Consultant',
          rating: 5,
          date: '1 month ago',
          comment: 'Perfect blend of theory and practice. The smart city concepts are explained clearly with real Saudi examples.'
        },
        {
          name: 'Sarah Abdullah',
          title: 'Environmental Engineer',
          rating: 4,
          date: '6 weeks ago',
          comment: 'Very comprehensive course. The sustainability focus aligns perfectly with Vision 2030 goals.'
        }
      ]
    },
    'course-2': {
      id: 'course-2',
      title: 'Aramco Process Safety Management',
      instructor: 'Eng. Khalid Al-Mutairi',
      instructorTitle: 'Safety Director, Saudi Aramco',
      rating: 4.9,
      reviewCount: 567,
      enrollmentCount: 2156,
      duration: '6 weeks',
      level: 'Advanced',
      language: 'Arabic & English',
      certificate: 'Aramco Certified PSM',
      price: 'SAR 3,299',
      description: 'Comprehensive process safety management training based on Aramco\'s world-class safety standards and practices.',
      whatYouLearn: [
        'Process hazard analysis techniques',
        'Risk assessment methodologies',
        'Safety instrumented systems',
        'Emergency response planning',
        'Incident investigation protocols',
        'Regulatory compliance (OSHA, EPA)'
      ],
      prerequisites: [
        'Chemical or Process Engineering degree',
        'Minimum 2 years industrial experience',
        'Basic safety training certification'
      ],
      curriculum: [
        {
          title: 'PSM Fundamentals',
          lessons: 5,
          duration: '3 hours',
          completed: false,
          lessons_detail: [
            { title: 'PSM Overview & Regulations', duration: '45 min', type: 'video' },
            { title: 'Aramco Safety Philosophy', duration: '30 min', type: 'video' },
            { title: 'Process Safety vs Occupational Safety', duration: '25 min', type: 'video' },
            { title: 'Case Study Analysis', duration: '40 min', type: 'case_study' },
            { title: 'Knowledge Check', duration: '20 min', type: 'quiz' }
          ]
        }
      ],
      reviews: [
        {
          name: 'Ahmed Al-Ghamdi',
          title: 'Process Engineer, SABIC',
          rating: 5,
          date: '1 week ago',
          comment: 'Outstanding course with real-world applications. The Aramco standards are the industry gold standard.'
        }
      ]
    }
  };
  
  return courses[courseId as keyof typeof courses] || courses['course-1'];
};

export function CourseDetailContent({ courseId, courseTitle, onBack, onStartCourse }: CourseDetailContentProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');
  
  const course = getCourseData(courseId);

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'reading': return <FileText className="w-4 h-4 text-green-600" />;
      case 'quiz': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'assignment': return <Target className="w-4 h-4 text-purple-600" />;
      case 'lab': return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'project': return <Award className="w-4 h-4 text-red-600" />;
      case 'case_study': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default: return <PlayCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          <div className="text-sm text-gray-500">
            Learning &gt; {course.title}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Hero */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-32 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">{course.title}</h1>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{course.rating}</span>
                        <span>({course.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{course.instructor}</div>
                    <div className="text-sm text-gray-500">{course.instructorTitle}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Details Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {course.prerequisites.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {course.curriculum.map((module, moduleIndex) => (
                  <Card key={moduleIndex}>
                    <CardHeader className="pb-3">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleModule(moduleIndex)}
                      >
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <div className="text-sm text-gray-500 mt-1">
                            {module.lessons} lessons • {module.duration}
                          </div>
                        </div>
                        {expandedModules.has(moduleIndex) ? 
                          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </CardHeader>
                    
                    {expandedModules.has(moduleIndex) && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {module.lessons_detail.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              {getLessonIcon(lesson.type)}
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{lesson.title}</div>
                                <div className="text-sm text-gray-500">{lesson.duration}</div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Play className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {course.reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium text-gray-900">{review.name}</div>
                            <div className="text-sm text-gray-500">•</div>
                            <div className="text-sm text-gray-500">{review.title}</div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.instructor}</h3>
                        <p className="text-gray-600 mb-3">{course.instructorTitle}</p>
                        <p className="text-gray-700 mb-4">
                          Leading expert in smart city infrastructure with over 15 years of experience in major Saudi development projects including NEOM, The Red Sea Project, and ROSHN.
                        </p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>2,500+ students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>4.8 instructor rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>12 courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{course.price}</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>
                
                <Button 
                  className="w-full mb-3"
                  onClick={() => onStartCourse(course.id, course.title)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Course
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>Level: {course.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span>Language: {course.language}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>Certificate: {course.certificate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span>Downloadable resources</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>Course includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-4 h-4 text-green-600" />
                    <span>18 hours of video content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>15 downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>Discussion forums</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-orange-600" />
                    <span>Completion certificate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>SCE credit hours eligible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}