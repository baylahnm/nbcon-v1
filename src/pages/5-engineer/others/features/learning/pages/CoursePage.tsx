import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';
import { seedCourse, type Course, calculateCourseProgress } from '../data/courseData';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Users, 
  ChevronRight,
  Download,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course] = useState<Course>(seedCourse); // For now, always show the seed course
  const [loading, setLoading] = useState(false);

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // In real app, this would make an API call
  };

  const handleContinueLearning = (courseId: string, lectureId: string) => {
    console.log('Continuing learning:', courseId, lectureId);
    // In real app, this would navigate to the lecture
  };

  const getLevelBadgeVariant = (level: Course['level']) => {
    switch (level) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-lg font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/engineer/learning')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Center
          </Button>
        </div>
      </div>
    );
  }

  const totalLectures = course.curriculum?.reduce((acc, section) => acc + (section.lectures?.length || 0), 0) || 0;
  const completedLectures = course.curriculum?.reduce((acc, section) => 
    acc + (section.lectures?.filter(lecture => lecture.isCompleted).length || 0), 0
  ) || 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        {/* Header */}
        <div className="bg-background border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/engineer/learning')}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
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
              {course.isEnrolled && (
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
              )}
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

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <div className="relative">
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Course Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {course.isTrending && (
                      <Badge className="bg-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                    {course.isBestSeller && (
                      <Badge className="bg-red-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Best Seller
                      </Badge>
                    )}
                    {course.isNew && (
                      <Badge className="bg-blue-500 text-white border-0 shadow-lg flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={() => setShowDetailView(true)}
                      className="h-20 w-20 rounded-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm shadow-2xl"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>

                  {/* Course Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                    <div className="flex items-center gap-4 text-white/90">
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
              </div>

              {/* Course Details */}
              <div className="space-y-6">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
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
                        <div className="space-y-4">
                          {(course.curriculum || []).map((section, sectionIndex) => (
                            <div key={section.id} className="border border-border/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-sm">{section.title}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {section.lectures?.length || 0} lectures • {section.duration}
                                  </p>
                                </div>
                                <Badge variant={section.completed ? "default" : "secondary"} className="text-xs">
                                  {section.completed ? "Completed" : "In Progress"}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {(section.lectures || []).map((lecture, lectureIndex) => (
                                  <div
                                    key={lecture.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                      lecture.isCompleted
                                        ? 'bg-green-50 border border-green-200'
                                        : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => setShowDetailView(true)}
                                  >
                                    <div className="flex-shrink-0">
                                      {lecture.isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : lecture.isPreview ? (
                                        <Play className="h-4 w-4 text-blue-500" />
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="border-border/50 sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-primary">
                      {course.price} SAR
                      {course.originalPrice && (
                        <span className="text-xl text-muted-foreground line-through ml-2">
                          {course.originalPrice} SAR
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <Badge className="bg-green-500 text-white">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    <div className="space-y-2">
                      {course.isEnrolled ? (
                        <Button 
                          className="w-full" 
                          onClick={() => setShowDetailView(true)}
                        >
                          Continue Learning
                          <Play className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleEnroll(course.id)}>
                          Enroll Now
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Course Includes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Access on mobile and desktop</span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Tags */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Course Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{course.category}</Badge>
                    <Badge variant={getLevelBadgeVariant(course.level)} className="text-xs">
                      {course.level}
                    </Badge>
                    {(course.tags || []).slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail View Modal */}
      {showDetailView && (
        <CourseDetailView
          course={course}
          onClose={() => setShowDetailView(false)}
          onEnroll={handleEnroll}
          onContinueLearning={handleContinueLearning}
        />
      )}
    </>
  );
}
