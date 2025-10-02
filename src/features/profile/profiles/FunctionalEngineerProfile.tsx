import { useState, useRef } from "react";
import { useAuthStore } from "@/stores/auth";
import { useProfile } from "@/hooks/useProfile";
import { getUserDisplayName, getUserInitials } from "@/lib/userUtils";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { SkillDialog } from "@/components/profile/SkillDialog";
import { ProjectDialog } from "@/components/profile/ProjectDialog";
import { AchievementDialog } from "@/components/profile/AchievementDialog";
import { 
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Shield,
  Award,
  Star,
  Download,
  Upload,
  Edit,
  Plus,
  Trash2,
  Eye,
  Camera,
  FileText,
  Globe,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  User,
  Users,
  DollarSign,
  Link,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Save,
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Zap,
  Timer,
  Percent,
  Image as ImageIcon,
  Video,
  File,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Loader2,
  Wrench,
  Cog,
  BarChart3,
  PieChart
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export function FunctionalEngineerProfile() {
  const { profile } = useAuthStore();
  const {
    profileData,
    isLoading,
    isSaving,
    error,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateSettings,
    uploadProfileImage,
    addSpecialization,
    removeSpecialization,
    addLanguage,
    removeLanguage
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [tempData, setTempData] = useState<any>(null);
  
  // Dialog states
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);

  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);

  const handleEdit = () => {
    if (profileData) {
      setTempData(JSON.parse(JSON.stringify(profileData))); // Deep copy
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!tempData) return;

    try {
      // Save personal info
      await updatePersonalInfo(tempData.personalInfo);
      
      // Save professional info
      await updateProfessionalInfo(tempData.professionalInfo);
      
      // Save settings
      await updateSettings(tempData.settings);

      setIsEditing(false);
      setTempData(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setTempData(null);
    setIsEditing(false);
  };


  const handleAddSpecialization = () => {
    const newSpec = prompt('Enter specialization:');
    if (newSpec && tempData) {
      const updatedSpecs = [...tempData.professionalInfo.specialization, newSpec];
      setTempData({
        ...tempData,
        professionalInfo: {
          ...tempData.professionalInfo,
          specialization: updatedSpecs
        }
      });
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    if (tempData) {
      const updatedSpecs = tempData.professionalInfo.specialization.filter((_: any, i: number) => i !== index);
      setTempData({
        ...tempData,
        professionalInfo: {
          ...tempData.professionalInfo,
          specialization: updatedSpecs
        }
      });
    }
  };

  const handleAddLanguage = () => {
    const language = prompt('Enter language:');
    const proficiency = prompt('Enter proficiency (native/fluent/intermediate/basic):');
    
    if (language && proficiency && ['native', 'fluent', 'intermediate', 'basic'].includes(proficiency) && tempData) {
      const newLanguage = { language, proficiency: proficiency as any };
      const updatedLanguages = [...tempData.professionalInfo.languages, newLanguage];
      setTempData({
        ...tempData,
        professionalInfo: {
          ...tempData.professionalInfo,
          languages: updatedLanguages
        }
      });
    }
  };

  const handleRemoveLanguage = (index: number) => {
    if (tempData) {
      const updatedLanguages = tempData.professionalInfo.languages.filter((_: any, i: number) => i !== index);
      setTempData({
        ...tempData,
        professionalInfo: {
          ...tempData.professionalInfo,
          languages: updatedLanguages
        }
      });
    }
  };

  // Portfolio management functions
  const handleAddSkill = (skill: any) => {
    if (tempData) {
      const updatedSkills = [...currentData.portfolio.skills, skill];
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, skills: updatedSkills }
      });
    }
  };

  const handleEditSkill = (skill: any) => {
    if (tempData) {
      const updatedSkills = currentData.portfolio.skills.map((s: any, index: number) => 
        index === editingSkill ? skill : s
      );
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, skills: updatedSkills }
      });
    }
    setEditingSkill(null);
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (tempData) {
      const updatedSkills = currentData.portfolio.skills.filter((_: any, index: number) => index !== skillIndex);
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, skills: updatedSkills }
      });
    }
  };

  const handleAddProject = (project: any) => {
    if (tempData) {
      const updatedProjects = [...currentData.portfolio.projects, project];
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, projects: updatedProjects }
      });
    }
  };

  const handleEditProject = (project: any) => {
    if (tempData) {
      const updatedProjects = currentData.portfolio.projects.map((p: any) => 
        p.id === editingProject.id ? project : p
      );
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, projects: updatedProjects }
      });
    }
    setEditingProject(null);
  };

  const handleRemoveProject = (projectId: string) => {
    if (tempData) {
      const updatedProjects = currentData.portfolio.projects.filter((p: any) => p.id !== projectId);
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, projects: updatedProjects }
      });
    }
  };

  const handleAddAchievement = (achievement: any) => {
    if (tempData) {
      const updatedAchievements = [...currentData.portfolio.achievements, achievement];
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, achievements: updatedAchievements }
      });
    }
  };

  const handleEditAchievement = (achievement: any) => {
    if (tempData) {
      const updatedAchievements = currentData.portfolio.achievements.map((a: any) => 
        a.id === editingAchievement.id ? achievement : a
      );
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, achievements: updatedAchievements }
      });
    }
    setEditingAchievement(null);
  };

  const handleRemoveAchievement = (achievementId: string) => {
    if (tempData) {
      const updatedAchievements = currentData.portfolio.achievements.filter((a: any) => a.id !== achievementId);
      setTempData({
        ...tempData,
        portfolio: { ...tempData.portfolio, achievements: updatedAchievements }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
      case "completed":
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "pending":
      case "ongoing":
      case "busy":
        return "bg-warning/10 text-warning border-warning/20";
      case "expired":
      case "unavailable":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
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

  if (isLoading) {
    return (
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 overflow-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex-1 p-6 overflow-auto">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>No profile data found. Please refresh the page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Use temp data when editing, otherwise use profile data
  const currentData = isEditing && tempData ? tempData : profileData;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
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
             <div className="flex items-start gap-6 sm:flex-row flex-col">
               <ProfileImageUpload
                 currentImage={currentData.personalInfo.profileImage}
                 firstName={currentData.personalInfo.firstName}
                 lastName={currentData.personalInfo.lastName}
                 onImageUpload={uploadProfileImage}
                 size="xl"
                 showUploadButton={isEditing}
                 disabled={!isEditing}
               />

              <div className="flex-1 space-y-3 sm:mt-0 mt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <h2 className="text-base sm:text-lg">{currentData.personalInfo.firstName} {currentData.personalInfo.lastName}</h2>
                    <Badge className={`${getStatusColor(currentData.professionalInfo.sceStatus)} text-[10px] px-1.5 py-0`}>
                      <Shield className="w-3 h-3 mr-1" />
                      SCE {currentData.professionalInfo.sceStatus === "verified" ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">{currentData.professionalInfo.title}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span className="line-clamp-2 sm:line-clamp-1">{currentData.personalInfo.city}, {currentData.personalInfo.province}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span>{currentData.professionalInfo.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span className="line-clamp-2 sm:line-clamp-1">{currentData.professionalInfo.company}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentData.professionalInfo.specialization.slice(0, 4).map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                  {currentData.professionalInfo.specialization.length > 4 && (
                    <Badge variant="outline">
                      +{currentData.professionalInfo.specialization.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="sm:text-right text-left sm:space-y-2 space-y-1 sm:self-auto self-stretch sm:pt-0 pt-2 border-t sm:border-0">
                {isEditing ? (
                  <div className="flex gap-2 sm:justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      variant="default"
                      className="bg-primary hover:bg-primary/90 h-8 text-xs px-3 sm:h-9 sm:text-sm sm:px-4"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                      className="h-8 text-xs px-3 sm:h-9 sm:text-sm sm:px-4"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="h-8 text-xs px-3 sm:h-9 sm:text-sm sm:px-4 sm:w-auto w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Profile: {currentData.settings.profileVisibility}
                  {currentData.settings.profileVisibility === "public" && <Eye className="w-4 h-4 inline ml-1" />}
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
          <TabsContent value="basic" className="space-y-6" style={{ marginTop: '18px' }}>
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
                        value={currentData.personalInfo.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, firstName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={currentData.personalInfo.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, lastName: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentData.personalInfo.email}
                      disabled={true} // Email should not be editable from profile
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={currentData.personalInfo.phone}
                      disabled={!isEditing}
                      onChange={(e) => setTempData({
                        ...tempData,
                        personalInfo: { ...tempData.personalInfo, phone: e.target.value }
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={currentData.personalInfo.dateOfBirth}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, dateOfBirth: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={currentData.personalInfo.nationality}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, nationality: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={currentData.personalInfo.city}
                        onValueChange={(value) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, city: value }
                        })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Riyadh">Riyadh</SelectItem>
                          <SelectItem value="Jeddah">Jeddah</SelectItem>
                          <SelectItem value="Dammam">Dammam</SelectItem>
                          <SelectItem value="Mecca">Mecca</SelectItem>
                          <SelectItem value="Medina">Medina</SelectItem>
                          <SelectItem value="NEOM">NEOM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Select
                        value={currentData.personalInfo.province}
                        onValueChange={(value) => setTempData({
                          ...tempData,
                          personalInfo: { ...tempData.personalInfo, province: value }
                        })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Riyadh Province">Riyadh Province</SelectItem>
                          <SelectItem value="Makkah Province">Makkah Province</SelectItem>
                          <SelectItem value="Eastern Province">Eastern Province</SelectItem>
                          <SelectItem value="Tabuk Province">Tabuk Province</SelectItem>
                          <SelectItem value="Al Madinah Province">Al Madinah Province</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={currentData.personalInfo.bio}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about your professional background and expertise..."
                      onChange={(e) => setTempData({
                        ...tempData,
                        personalInfo: { ...tempData.personalInfo, bio: e.target.value }
                      })}
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
                      value={currentData.settings.profileVisibility}
                      onValueChange={(value) => setTempData({
                        ...tempData,
                        settings: { ...tempData.settings, profileVisibility: value }
                      })}
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
                        checked={currentData.settings.showPhone}
                        onCheckedChange={(checked) => setTempData({
                          ...tempData,
                          settings: { ...tempData.settings, showPhone: checked }
                        })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">Allow clients to see your email</p>
                      </div>
                      <Switch
                        checked={currentData.settings.showEmail}
                        onCheckedChange={(checked) => setTempData({
                          ...tempData,
                          settings: { ...tempData.settings, showEmail: checked }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Job Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for new job opportunities</p>
                      </div>
                      <Switch
                        checked={currentData.settings.jobNotifications}
                        onCheckedChange={(checked) => setTempData({
                          ...tempData,
                          settings: { ...tempData.settings, jobNotifications: checked }
                        })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                      </div>
                      <Switch
                        checked={currentData.settings.marketingEmails}
                        onCheckedChange={(checked) => setTempData({
                          ...tempData,
                          settings: { ...tempData.settings, marketingEmails: checked }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Details Tab */}
          <TabsContent value="professional" className="space-y-6" style={{ marginTop: '18px' }}>
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
                      value={currentData.professionalInfo.title}
                      disabled={!isEditing}
                      onChange={(e) => setTempData({
                        ...tempData,
                        professionalInfo: { ...tempData.professionalInfo, title: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={currentData.professionalInfo.company}
                      disabled={!isEditing}
                      onChange={(e) => setTempData({
                        ...tempData,
                        professionalInfo: { ...tempData.professionalInfo, company: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={currentData.professionalInfo.experience}
                      onValueChange={(value) => setTempData({
                        ...tempData,
                        professionalInfo: { ...tempData.professionalInfo, experience: value }
                      })}
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
                      {currentData.professionalInfo.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {spec}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSpecialization(index)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={handleAddSpecialization}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SCE Registration Number</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={currentData.professionalInfo.sceNumber}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({
                          ...tempData,
                          professionalInfo: { ...tempData.professionalInfo, sceNumber: e.target.value }
                        })}
                      />
                      <Badge className={getStatusColor(currentData.professionalInfo.sceStatus)}>
                        {currentData.professionalInfo.sceStatus}
                      </Badge>
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
                    {currentData.professionalInfo.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{lang.language}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getProficiencyColor(lang.proficiency)}>
                            {lang.proficiency}
                          </Badge>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveLanguage(index)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline" className="w-full" onClick={handleAddLanguage}>
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
          <TabsContent value="portfolio" className="space-y-6" style={{ marginTop: '18px' }}>
            {/* Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Professional Skills</CardTitle>
                  {isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setSkillDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(
                    currentData.portfolio.skills.reduce((acc: any, skill: any) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, skills]: [string, any]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium capitalize">{category}</h4>
                      <div className="space-y-3">
                        {skills.map((skill: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{skill.name}</span>
                                {skill.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {skill.yearsOfExperience > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    ({skill.yearsOfExperience}y)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                                {isEditing && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingSkill(index);
                                        setSkillDialogOpen(true);
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveSkill(index)}
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
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
                    <Button size="sm" variant="outline" onClick={() => setProjectDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentData.portfolio.projects.map((project: any) => (
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
                        {project.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveProject(project.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      )}
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
                    {currentData.portfolio.reviews.map((review: any) => (
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
                  <div className="flex items-center justify-between">
                    <CardTitle>Achievements & Awards</CardTitle>
                    {isEditing && (
                      <Button size="sm" variant="outline" onClick={() => setAchievementDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Achievement
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.portfolio.achievements.map((achievement: any) => (
                      <div key={achievement.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{achievement.issuer}</span>
                            <span>{new Date(achievement.date).toLocaleDateString('en-SA')}</span>
                          </div>
                          {isEditing && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingAchievement(achievement);
                                  setAchievementDialogOpen(true);
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveAchievement(achievement.id)}
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          )}
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

      {/* Dialogs */}
      <SkillDialog
        isOpen={skillDialogOpen}
        onClose={() => {
          setSkillDialogOpen(false);
          setEditingSkill(null);
        }}
        onSave={editingSkill !== null ? handleEditSkill : handleAddSkill}
        skill={editingSkill !== null ? currentData.portfolio.skills[editingSkill] : null}
        title={editingSkill !== null ? "Edit Skill" : "Add Skill"}
      />

      <ProjectDialog
        isOpen={projectDialogOpen}
        onClose={() => {
          setProjectDialogOpen(false);
          setEditingProject(null);
        }}
        onSave={editingProject ? handleEditProject : handleAddProject}
        project={editingProject}
        title={editingProject ? "Edit Project" : "Add Project"}
      />

      <AchievementDialog
        isOpen={achievementDialogOpen}
        onClose={() => {
          setAchievementDialogOpen(false);
          setEditingAchievement(null);
        }}
        onSave={editingAchievement ? handleEditAchievement : handleAddAchievement}
        achievement={editingAchievement}
        title={editingAchievement ? "Edit Achievement" : "Add Achievement"}
      />
    </div>
  );
}
