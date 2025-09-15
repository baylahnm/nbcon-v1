import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuthStore, type UserRole } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, DollarSign, Briefcase, Building2 } from 'lucide-react';

const engineeringSpecializations = [
  'Civil Engineering', 'Structural Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management',
  'Project Management', 'Building Services Engineering', 'Fire Safety Engineering'
];

const clientTypes = [
  { value: 'individual', label: 'Individual Property Owner' },
  { value: 'business', label: 'Small/Medium Business' },
  { value: 'enterprise', label: 'Large Corporation' },
];

const budgetRanges = [
  'SAR 500 - 2,000', 'SAR 2,000 - 5,000', 'SAR 5,000 - 15,000',
  'SAR 15,000 - 50,000', 'SAR 50,000+'
];

export default function ProfileSetup() {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, updateProfile, getCurrentProfile } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location_city: '',
    location_region: '',
    // Engineer specific
    sce_license_number: '',
    specializations: [] as string[],
    years_experience: '',
    hourly_rate: '',
    daily_rate: '',
    service_radius: '50',
    // Client specific  
    client_type: 'individual',
    budget_range: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/phone');
      return;
    }

    if (profile && profile.role !== role) {
      // User already has a different role
      navigate(`/${profile.role}`);
      return;
    }

    // Pre-fill with existing data
    if (profile) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        location_city: profile.location_city || '',
        location_region: profile.location_region || '',
      }));
    }
  }, [user, profile, role, navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !role) return;

    // Basic validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (role === 'engineer' && formData.specializations.length === 0) {
      toast({
        title: "Missing Specializations",
        description: "Please select at least one engineering specialization.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update main profile
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        location_city: formData.location_city,
        location_region: formData.location_region,
      });

      // Create role-specific profile
      if (role === 'engineer') {
        const { error } = await supabase
          .from('engineer_profiles')
          .upsert({
            user_id: user.id,
            sce_license_number: formData.sce_license_number,
            specializations: formData.specializations,
            years_experience: parseInt(formData.years_experience) || 0,
            hourly_rate: parseFloat(formData.hourly_rate) || null,
            daily_rate: parseFloat(formData.daily_rate) || null,
            service_radius: parseInt(formData.service_radius) || 50,
          });

        if (error) throw error;
      } else if (role === 'client') {
        const { error } = await supabase
          .from('client_profiles')
          .upsert({
            user_id: user.id,
            client_type: formData.client_type,
            budget_range: formData.budget_range,
          });

        if (error) throw error;
      }

      toast({
        title: "Profile Complete!",
        description: "Welcome to nbcon. Your profile has been set up successfully.",
      });

      // Refresh profile and redirect to dashboard
      await getCurrentProfile();
      navigate(`/${role}`);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleInfo = () => {
    switch (role) {
      case 'engineer':
        return {
          title: 'Complete Your Engineer Profile',
          description: 'Set up your professional profile to start receiving project opportunities.',
          icon: <Briefcase className="h-6 w-6" />
        };
      case 'client':
        return {
          title: 'Complete Your Client Profile', 
          description: 'Tell us about your needs so we can connect you with the right engineers.',
          icon: <Building2 className="h-6 w-6" />
        };
      default:
        return {
          title: 'Complete Your Profile',
          description: 'Set up your profile to get started.',
          icon: <Briefcase className="h-6 w-6" />
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <AuthLayout title={roleInfo.title} subtitle={roleInfo.description} showLogo={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {roleInfo.icon}
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder={`Tell us about your ${role === 'engineer' ? 'engineering experience and expertise' : 'projects and requirements'}...`}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  placeholder="Riyadh"
                  value={formData.location_city}
                  onChange={(e) => handleInputChange('location_city', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="location_region">Region</Label>
                <Input
                  id="location_region"
                  placeholder="Riyadh Region"
                  value={formData.location_region}
                  onChange={(e) => handleInputChange('location_region', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engineer-specific fields */}
        {role === 'engineer' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Details</CardTitle>
                <CardDescription>
                  Information about your engineering credentials and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sce_license">SCE License Number</Label>
                  <Input
                    id="sce_license"
                    placeholder="Your Saudi Council of Engineers license number"
                    value={formData.sce_license_number}
                    onChange={(e) => handleInputChange('sce_license_number', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label>Engineering Specializations *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {engineeringSpecializations.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50">
                        <Checkbox
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationToggle(spec)}
                          disabled={isLoading}
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange('years_experience', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (SAR)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      placeholder="150"
                      value={formData.hourly_rate}
                      onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service_radius">Service Radius (km)</Label>
                    <Input
                      id="service_radius"
                      type="number"
                      min="1"
                      max="200"
                      value={formData.service_radius}
                      onChange={(e) => handleInputChange('service_radius', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Client-specific fields */}
        {role === 'client' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Preferences</CardTitle>
              <CardDescription>
                Help us understand your typical project needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Client Type</Label>
                <div className="grid gap-2 mt-2">
                  {clientTypes.map((type) => (
                    <label key={type.value} className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                      <input
                        type="radio"
                        name="client_type"
                        value={type.value}
                        checked={formData.client_type === type.value}
                        onChange={(e) => handleInputChange('client_type', e.target.value)}
                        disabled={isLoading}
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Typical Budget Range</Label>
                <div className="grid gap-2 mt-2">
                  {budgetRanges.map((range) => (
                    <label key={range} className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                      <input
                        type="radio"
                        name="budget_range"
                        value={range}
                        checked={formData.budget_range === range}
                        onChange={(e) => handleInputChange('budget_range', e.target.value)}
                        disabled={isLoading}
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          disabled={isLoading}
          size="lg"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Setup & Continue
        </Button>
      </form>
    </AuthLayout>
  );
}