import { useState } from "react";
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName, getUserInitials } from "../../../../../1-HomePage/others/lib/userUtils";
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
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../1-HomePage/others/components/ui/avatar";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { Textarea } from "../../../../../1-HomePage/others/components/ui/textarea";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../1-HomePage/others/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { Switch } from "../../../../../1-HomePage/others/components/ui/switch";
import { Separator } from "../../../../../1-HomePage/others/components/ui/separator";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { ScrollArea } from "../../../../../1-HomePage/others/components/ui/scroll-area";

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
    email: "info@nbcon.app",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-sm shadow-primary/50 flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold tracking-tight">Profile</h1>
              <p className="text-[14px] text-muted-foreground">
                Manage your public profile and professional information
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary-gradient text-primary-foreground border-0"
          >
            {isEditing ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {profileData.personalInfo.firstName[0]}{profileData.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-7 w-7 p-0 rounded-full shadow-md"
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold">{profileData.personalInfo.firstName} {profileData.personalInfo.lastName}</h2>
                    <Badge className={`text-xs ${getStatusColor(profileData.professionalInfo.sceStatus)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      SCE {profileData.professionalInfo.sceStatus === "verified" ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{profileData.professionalInfo.title}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{profileData.personalInfo.city}, {profileData.personalInfo.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{profileData.professionalInfo.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{profileData.professionalInfo.company}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData.professionalInfo.specialization.slice(0, 4).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {profileData.professionalInfo.specialization.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{profileData.professionalInfo.specialization.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {profileData.settings.profileVisibility === "public" && <Eye className="h-3.5 w-3.5" />}
                {profileData.settings.profileVisibility === "private" && <EyeOff className="h-3.5 w-3.5" />}
                <span className="capitalize">{profileData.settings.profileVisibility}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border p-1 gap-1 shadow-lg">
            <TabsTrigger 
              value="basic" 
              className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 text-xs"
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger 
              value="professional" 
              className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 text-xs"
            >
              Professional Details
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 text-xs"
            >
              Portfolio & Skills
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Personal Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs">First Name</Label>
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
                      <Label htmlFor="lastName" className="text-xs">Last Name</Label>
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
              </div>

              {/* Privacy Settings */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Privacy Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={profileData.settings.profileVisibility}
                      onValueChange={(value: "public" | "professional" | "private") => setProfileData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, profileVisibility: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
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
            </div>
          </TabsContent>

          {/* Professional Details Tab */}
          <TabsContent value="professional" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Professional Information */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Professional Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
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
                      <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
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
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Languages */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Globe className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Languages</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-background rounded-b-xl">
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
                      <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Language
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </TabsContent>

          {/* Portfolio & Skills Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            {/* Skills */}
            <div
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
              <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Professional Skills</CardTitle>
                  </div>
                  {isEditing && (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-background rounded-b-xl">
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
            </div>

            {/* Portfolio Projects */}
            <div
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
              <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Portfolio Projects</CardTitle>
                  </div>
                  {isEditing && (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add Project
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-background rounded-b-xl">
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
            </div>

            {/* Reviews & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Client Reviews */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Client Reviews</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-background rounded-b-xl">
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
              </div>

              {/* Achievements */}
              <div
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
                <Card className="bg-transparent border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-8 w-8 flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold">Achievements & Awards</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-background rounded-b-xl">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
