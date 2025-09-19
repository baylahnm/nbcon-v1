import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User,
  Camera,
  MapPin,
  Briefcase,
  DollarSign,
  Award,
  Clock,
  Plus,
  X,
  Save,
  Loader2,
  Star,
  CheckCircle2
} from 'lucide-react';

const ENGINEERING_SPECIALIZATIONS = [
  'Civil Engineering', 'Structural Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management',
  'Project Management', 'Building Services Engineering', 'Fire Safety Engineering'
];

const SAUDI_CITIES = [
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
  'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha', 'Najran', 'Jazan',
  'Yanbu', 'Al Jubail', 'Hail', 'Arar', 'Sakakah', 'Qatif', 'Taif'
];

const CLIENT_TYPES = [
  { value: 'individual', label: 'Individual Property Owner' },
  { value: 'business', label: 'Small/Medium Business' },
  { value: 'enterprise', label: 'Large Corporation' },
];

const BUDGET_RANGES = [
  'SAR 500 - 2,000', 'SAR 2,000 - 5,000', 'SAR 5,000 - 15,000',
  'SAR 15,000 - 50,000', 'SAR 50,000+'
];

export default function ProfilePage() {
  const { profile, user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Basic profile data
  const [basicData, setBasicData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    location_city: profile?.location_city || '',
    location_region: profile?.location_region || '',
    avatar_url: profile?.avatar_url || '',
  });

  // Engineer-specific data
  const [engineerData, setEngineerData] = useState({
    sce_license_number: '',
    specializations: [] as string[],
    years_experience: 0,
    hourly_rate: 0,
    daily_rate: 0,
    service_radius: 50,
    availability_status: 'available',
    certifications: [],
    portfolio_summary: '',
  });

  // Client-specific data
  const [clientData, setClientData] = useState({
    client_type: 'individual',
    budget_range: '',
    preferred_payment_method: '',
  });

  const [newSkill, setNewSkill] = useState('');

  const handleBasicUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile(basicData);
      toast({
        title: "Profile Updated",
        description: "Your basic information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSpecificUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (profile?.role === 'engineer') {
        const { error } = await supabase
          .from('engineer_profiles')
          .upsert({
            user_id: user.id,
            ...engineerData,
          });
        if (error) throw error;
      } else if (profile?.role === 'client') {
        const { error } = await supabase
          .from('client_profiles')
          .upsert({
            user_id: user.id,
            ...clientData,
          });
        if (error) throw error;
      }

      toast({
        title: "Professional Profile Updated",
        description: "Your professional information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update professional profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to Supabase Storage
      toast({
        title: "Avatar Upload",
        description: "Avatar upload functionality will be implemented soon.",
      });
    }
  };

  const addSpecialization = (spec: string) => {
    if (spec && !engineerData.specializations.includes(spec)) {
      setEngineerData({
        ...engineerData,
        specializations: [...engineerData.specializations, spec]
      });
    }
  };

  const removeSpecialization = (spec: string) => {
    setEngineerData({
      ...engineerData,
      specializations: engineerData.specializations.filter(s => s !== spec)
    });
  };

  const getInitials = () => {
    const firstName = basicData.first_name || profile?.first_name || '';
    const lastName = basicData.last_name || profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: User },
    { id: 'professional', label: 'Professional Details', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio & Skills', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your public profile and professional information
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <div className="border-b">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Profile Preview */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={basicData.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {basicData.first_name} {basicData.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile?.role}
                  </p>
                  {basicData.location_city && (
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {basicData.location_city}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9">
            {/* Basic Information */}
            <TabsContent value="basic" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={basicData.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button onClick={handleAvatarUpload} variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={basicData.first_name}
                        onChange={(e) => setBasicData({ ...basicData, first_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={basicData.last_name}
                        onChange={(e) => setBasicData({ ...basicData, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about your experience and expertise..."
                      value={basicData.bio}
                      onChange={(e) => setBasicData({ ...basicData, bio: e.target.value })}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      {basicData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select 
                        value={basicData.location_city} 
                        onValueChange={(value) => setBasicData({ ...basicData, location_city: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {SAUDI_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        placeholder="e.g., Riyadh Region"
                        value={basicData.location_region}
                        onChange={(e) => setBasicData({ ...basicData, location_region: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button onClick={handleBasicUpdate} disabled={isLoading} className="bg-gradient-primary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Basic Information
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Details */}
            <TabsContent value="professional" className="mt-0">
              <div className="space-y-6">
                {/* Engineer Professional Details */}
                {profile?.role === 'engineer' && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Engineering Credentials</CardTitle>
                        <CardDescription>
                          Your professional qualifications and licensing information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sce_license">SCE License Number</Label>
                          <div className="flex gap-2">
                            <Input
                              id="sce_license"
                              placeholder="Your Saudi Council of Engineers license"
                              value={engineerData.sce_license_number}
                              onChange={(e) => setEngineerData({ ...engineerData, sce_license_number: e.target.value })}
                            />
                            <Badge variant="outline" className="whitespace-nowrap">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                              id="experience"
                              type="number"
                              min="0"
                              value={engineerData.years_experience}
                              onChange={(e) => setEngineerData({ ...engineerData, years_experience: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate (SAR)</Label>
                            <Input
                              id="hourly_rate"
                              type="number"
                              min="0"
                              value={engineerData.hourly_rate}
                              onChange={(e) => setEngineerData({ ...engineerData, hourly_rate: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="service_radius">Service Radius (km)</Label>
                            <Input
                              id="service_radius"
                              type="number"
                              min="1"
                              value={engineerData.service_radius}
                              onChange={(e) => setEngineerData({ ...engineerData, service_radius: parseInt(e.target.value) || 50 })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Availability Status</Label>
                          <Select 
                            value={engineerData.availability_status} 
                            onValueChange={(value) => setEngineerData({ ...engineerData, availability_status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available Now</SelectItem>
                              <SelectItem value="busy">Busy</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Specializations</CardTitle>
                        <CardDescription>
                          Select your areas of engineering expertise
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {engineerData.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary" className="cursor-pointer">
                              {spec}
                              <X 
                                className="h-3 w-3 ml-1" 
                                onClick={() => removeSpecialization(spec)}
                              />
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {ENGINEERING_SPECIALIZATIONS.map((spec) => (
                            <label key={spec} className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 cursor-pointer">
                              <Checkbox
                                checked={engineerData.specializations.includes(spec)}
                                onCheckedChange={() => {
                                  if (engineerData.specializations.includes(spec)) {
                                    removeSpecialization(spec);
                                  } else {
                                    addSpecialization(spec);
                                  }
                                }}
                              />
                              <span className="text-sm">{spec}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Client Professional Details */}
                {profile?.role === 'client' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Information</CardTitle>
                      <CardDescription>
                        Your preferences and project requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Client Type</Label>
                        <Select 
                          value={clientData.client_type} 
                          onValueChange={(value) => setClientData({ ...clientData, client_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CLIENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Typical Budget Range</Label>
                        <Select 
                          value={clientData.budget_range} 
                          onValueChange={(value) => setClientData({ ...clientData, budget_range: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUDGET_RANGES.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment_method">Preferred Payment Method</Label>
                        <Input
                          id="payment_method"
                          placeholder="e.g., Bank transfer, Credit card"
                          value={clientData.preferred_payment_method}
                          onChange={(e) => setClientData({ ...clientData, preferred_payment_method: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleRoleSpecificUpdate} disabled={isLoading} className="bg-gradient-primary">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Professional Details
                </Button>
              </div>
            </TabsContent>

            {/* Portfolio & Skills */}
            <TabsContent value="portfolio" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio & Skills</CardTitle>
                  <CardDescription>
                    Showcase your work and highlight your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_summary">Portfolio Summary</Label>
                    <Textarea
                      id="portfolio_summary"
                      placeholder="Describe your key projects and achievements..."
                      value={engineerData.portfolio_summary}
                      onChange={(e) => setEngineerData({ ...engineerData, portfolio_summary: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Portfolio Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Project galleries, certifications, and file uploads will be available in a future update.
                    </p>
                  </div>

                  <Button onClick={handleRoleSpecificUpdate} disabled={isLoading} className="bg-gradient-primary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Portfolio Information
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}