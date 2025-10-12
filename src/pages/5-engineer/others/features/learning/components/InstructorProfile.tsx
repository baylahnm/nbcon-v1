import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import {
  Star,
  Users,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Globe,
  MessageSquare,
  Play,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Heart
} from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalReviews: number;
  joinDate: string;
  location: string;
  website?: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  specialties: string[];
  certifications: string[];
  education: string[];
  experience: string[];
  featuredCourses: Course[];
  achievements: Achievement[];
  isVerified: boolean;
  isTopInstructor: boolean;
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  rating: number;
  students: number;
  price: number;
  duration: string;
  level: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  year: string;
}

interface InstructorProfileProps {
  instructor: Instructor;
  onViewCourse: (courseId: string) => void;
  onFollowInstructor: (instructorId: string) => void;
  onContactInstructor: (instructorId: string) => void;
}

export function InstructorProfile({ 
  instructor, 
  onViewCourse, 
  onFollowInstructor, 
  onContactInstructor 
}: InstructorProfileProps) {
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instructor Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start lg:min-w-[300px]">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={instructor.avatar} alt={instructor.name} />
                <AvatarFallback className="text-2xl">
                  {instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{instructor.name}</h1>
                  {instructor.isVerified && (
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {instructor.isTopInstructor && (
                    <Badge className="bg-yellow-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Top Instructor
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-muted-foreground mb-3">{instructor.title}</p>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{instructor.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({instructor.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{instructor.location}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => onFollowInstructor(instructor.id)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onContactInstructor(instructor.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats and Info */}
            <div className="flex-1 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{instructor.totalStudents?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{instructor.totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">
                      {new Date().getFullYear() - new Date(instructor.joinDate).getFullYear()}
                    </p>
                    <p className="text-sm text-muted-foreground">Years Teaching</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {instructor.bio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {instructor.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={instructor.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {instructor.socialMedia.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={instructor.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {instructor.socialMedia.youtube && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={instructor.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-2" />
                      YouTube
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education & Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Education */}
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <ul className="space-y-1">
                  {instructor.education.map((edu, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Experience */}
              <div>
                <h4 className="font-medium mb-2">Professional Experience</h4>
                <ul className="space-y-1">
                  {instructor.experience.map((exp, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Certifications */}
              <div>
                <h4 className="font-medium mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructor.featuredCourses.map((course) => (
                  <div key={course.id} className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{course.students?.toLocaleString()}</span>
                        </div>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{course.price} SAR</span>
                          <Button size="sm" variant="outline" onClick={() => onViewCourse(course.id)}>
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {instructor.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{achievement.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teaching Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Teaching Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Student Satisfaction</span>
                  <span>{instructor.rating}/5</span>
                </div>
                <Progress value={(instructor.rating / 5) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Completion Rate</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Student Retention</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Joined {formatJoinDate(instructor.joinDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
