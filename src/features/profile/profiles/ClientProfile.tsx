import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { getUserDisplayName, getUserInitials } from "@/lib/userUtils";
import { 
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Shield,
  Award,
  GraduationCap,
  Briefcase,
  Star,
  Download,
  Upload,
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  FileText,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    city: string;
    province: string;
    bio: string;
    profileImage?: string;
  };
  professionalInfo: {
    title: string;
    company: string;
    experience: string;
    specialization: string[];
    sceNumber: string;
    sceStatus: "verified" | "pending" | "expired";
    licenses: License[];
    certifications: Certification[];
    languages: Language[];
  };
  portfolio: {
    projects: PortfolioProject[];
    skills: Skill[];
    achievements: Achievement[];
    reviews: Review[];
  };
  settings: {
    profileVisibility: "public" | "professional" | "private";
    showPhone: boolean;
    showEmail: boolean;
    jobNotifications: boolean;
    marketingEmails: boolean;
  };
}

interface License {
  id: string;
  name: string;
  issuer: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expired" | "pending";
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

interface Language {
  language: string;
  proficiency: "native" | "fluent" | "intermediate" | "basic";
}

interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  value: string;
  duration: string;
  status: "completed" | "ongoing" | "planning";
  images: string[];
  skills: string[];
}

interface Skill {
  name: string;
  level: number;
  category: "technical" | "software" | "management" | "communication";
  verified: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  type: "award" | "certification" | "recognition" | "milestone";
}

interface Review {
  id: string;
  clientName: string;
  projectName: string;
  rating: number;
  comment: string;
  date: string;
}

const sampleProfileData: ProfileData = {
  personalInfo: {
    firstName: "Nasser",
    lastName: "Baylah",
    email: "nasser.baylah@nbcon.sa",
    phone: "+966 55 123 4567",
    dateOfBirth: "1988-03-15",
    nationality: "Saudi Arabian",
    city: "Riyadh",
    province: "Riyadh Province",
    bio: "Experienced structural engineer with 12+ years in large-scale infrastructure projects across Saudi Arabia. Specialized in seismic design, high-rise buildings, and mega-project development. Proven track record with NEOM, Aramco, and Red Sea Development projects.",
    profileImage: undefined
  },
  professionalInfo: {
    title: "Senior Structural Engineer",
    company: "Independent Consultant",
    experience: "12+ years",
    specialization: ["Structural Engineering", "Seismic Design", "High-Rise Buildings", "Infrastructure"],
    sceNumber: "SCE-SE-2024-789456",
    sceStatus: "verified",
    licenses: [
      {
        id: "1",
        name: "Professional Engineer License",
        issuer: "Saudi Council of Engineers",
        number: "PE-2024-789456",
        issueDate: "2024-01-15",
        expiryDate: "2026-01-15",
        status: "active"
      }
    ],
    certifications: [
      {
        id: "1",
        name: "ETABS Advanced Analysis",
        issuer: "Computers & Structures Inc.",
        issueDate: "2023-11-10",
        credentialId: "CSI-ETABS-2023-1567"
      }
    ],
    languages: [
      { language: "Arabic", proficiency: "native" },
      { language: "English", proficiency: "fluent" },
      { language: "French", proficiency: "intermediate" }
    ]
  },
  portfolio: {
    projects: [
      {
        id: "1",
        name: "NEOM Smart City Infrastructure",
        description: "Structural design and analysis for Phase 1 smart city infrastructure including residential towers, commercial complexes, and transportation hubs.",
        client: "NEOM Development Company",
        location: "NEOM, Tabuk Province",
        value: "1,250,000 SAR",
        duration: "18 months",
        status: "completed",
        images: [],
        skills: ["Structural Design", "ETABS", "Seismic Analysis", "Project Management"]
      }
    ],
    skills: [
      { name: "Structural Analysis", level: 95, category: "technical", verified: true },
      { name: "ETABS", level: 90, category: "software", verified: true },
      { name: "AutoCAD", level: 88, category: "software", verified: true },
      { name: "Seismic Design", level: 92, category: "technical", verified: true },
      { name: "Project Management", level: 85, category: "management", verified: true }
    ],
    achievements: [
      {
        id: "1",
        title: "Excellence in Structural Engineering Award",
        description: "Recognized for outstanding contribution to NEOM Smart City project structural design innovations.",
        date: "2024-10-15",
        issuer: "Saudi Council of Engineers",
        type: "award"
      }
    ],
    reviews: [
      {
        id: "1",
        clientName: "Nasser Baylah",
        projectName: "NEOM Smart City Infrastructure",
        rating: 5,
        comment: "Exceptional structural analysis and design work. Nasser's attention to detail and innovative solutions exceeded our expectations. Highly recommended for complex infrastructure projects.",
        date: "2024-09-28"
      }
    ]
  },
  settings: {
    profileVisibility: "professional",
    showPhone: true,
    showEmail: false,
    jobNotifications: true,
    marketingEmails: false
  }
};

export function ClientProfile() {
  const { profile, updateUser } = useAuthStore();
  
  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);
  
  const [profileData, setProfileData] = useState<ProfileData>(sampleProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
      case "ongoing":
        return "bg-warning/10 text-warning border-warning/20";
      case "expired":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "native":
        return "bg-success/10 text-success";
      case "fluent":
        return "bg-info/10 text-info";
      case "intermediate":
        return "bg-warning/10 text-warning";
      case "basic":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-warning text-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your public profile and professional information
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profileData.personalInfo.firstName[0]}{profileData.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2>{profileData.personalInfo.firstName} {profileData.personalInfo.lastName}</h2>
                    <Badge className={getStatusColor(profileData.professionalInfo.sceStatus)}>
                      <Shield className="w-3 h-3 mr-1" />
                      SCE {profileData.professionalInfo.sceStatus === "verified" ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{profileData.professionalInfo.title}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.personalInfo.city}, {profileData.personalInfo.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.professionalInfo.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.professionalInfo.company}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData.professionalInfo.specialization.slice(0, 4).map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                  {profileData.professionalInfo.specialization.length > 4 && (
                    <Badge variant="outline">
                      +{profileData.professionalInfo.specialization.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {isEditing ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <div className="text-sm text-muted-foreground">
                  Profile: {profileData.settings.profileVisibility}
                  {profileData.settings.profileVisibility === "public" && <Eye className="w-4 h-4 inline ml-1" />}
                  {profileData.settings.profileVisibility === "private" && <EyeOff className="w-4 h-4 inline ml-1" />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-sidebar-border mb-6">
            <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
              <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                <TabsTrigger value="basic" className="flex items-center gap-2 px-4 py-3 min-w-fit">Basic Information</TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2 px-4 py-3 min-w-fit">Professional Details</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2 px-4 py-3 min-w-fit">Portfolio & Skills</TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.personalInfo.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.personalInfo.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.personalInfo.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.personalInfo.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.personalInfo.bio}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about your professional background and expertise..."
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, bio: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={profileData.settings.profileVisibility}
                      onValueChange={(value: any) => setProfileData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, profileVisibility: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="professional">Professional - Visible to verified clients</SelectItem>
                        <SelectItem value="private">Private - Only visible to direct contacts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show Phone Number</Label>
                        <p className="text-sm text-muted-foreground">Allow clients to see your phone number</p>
                      </div>
                      <Switch
                        checked={profileData.settings.showPhone}
                        onCheckedChange={(checked) => setProfileData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showPhone: checked }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">Allow clients to see your email</p>
                      </div>
                      <Switch
                        checked={profileData.settings.showEmail}
                        onCheckedChange={(checked) => setProfileData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showEmail: checked }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Details Tab */}
          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profileData.professionalInfo.title}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, title: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={profileData.professionalInfo.company}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, company: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={profileData.professionalInfo.experience}
                      onValueChange={(value) => setProfileData(prev => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, experience: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2 years">0-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="6-10 years">6-10 years</SelectItem>
                        <SelectItem value="10-15 years">10-15 years</SelectItem>
                        <SelectItem value="15+ years">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialization Areas</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.professionalInfo.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {spec}
                          {isEditing && (
                            <button
                              onClick={() => {
                                const newSpecs = profileData.professionalInfo.specialization.filter((_, i) => i !== index);
                                setProfileData(prev => ({
                                  ...prev,
                                  professionalInfo: { ...prev.professionalInfo, specialization: newSpecs }
                                }));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profileData.professionalInfo.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{lang.language}</span>
                        <Badge className={getProficiencyColor(lang.proficiency)}>
                          {lang.proficiency}
                        </Badge>
                      </div>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio & Skills Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Professional Skills</CardTitle>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(
                    profileData.portfolio.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {} as Record<string, Skill[]>)
                  ).map(([category, skills]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium capitalize">{category}</h4>
                      <div className="space-y-3">
                        {skills.map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{skill.name}</span>
                                {skill.verified && (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Portfolio Projects</CardTitle>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profileData.portfolio.projects.map((project) => (
                    <div key={project.id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{project.client} • {project.location}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p className="font-medium text-lg text-foreground">{project.value}</p>
                          <p>{project.duration}</p>
                        </div>
                      </div>

                      <p className="text-sm mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.portfolio.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('en-SA')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{review.comment}</p>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium">{review.clientName}</p>
                          <p>{review.projectName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Awards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.portfolio.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{achievement.issuer}</span>
                            <span>{new Date(achievement.date).toLocaleDateString('en-SA')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}