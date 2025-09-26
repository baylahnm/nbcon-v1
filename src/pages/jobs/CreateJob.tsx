import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  AlertTriangle,
  Briefcase,
  ArrowLeft,
  Plus,
  Loader2
} from 'lucide-react';

const jobCategories = [
  'Structural Engineering', 'Civil Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management',
  'Building Inspection', 'Safety Assessment', 'Design Review'
];

const jobTypes = [
  { value: 'fixed', label: 'Fixed Price Project' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'milestone', label: 'Milestone-Based' }
];

const priorityLevels = [
  { value: 'low', label: 'Low Priority', color: 'text-muted-foreground' },
  { value: 'normal', label: 'Normal Priority', color: 'text-primary' },
  { value: 'high', label: 'High Priority', color: 'text-warning' },
  { value: 'emergency', label: 'Emergency', color: 'text-destructive' }
];

const saudiCities = [
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
  'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha', 'Najran', 'Jazan',
  'Yanbu', 'Al Jubail', 'Hail', 'Arar', 'Sakakah', 'Qatif', 'Taif'
];

export default function CreateJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    job_type: 'fixed' as 'fixed' | 'hourly' | 'milestone',
    budget_min: '',
    budget_max: '',
    location_address: '',
    location_city: '',
    location_region: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'emergency',
    start_date: '',
    end_date: '',
    estimated_duration: '',
    skills_required: [] as string[],
    additional_requirements: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills_required.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim() && formData.category;
      case 2:
        return formData.budget_min && formData.location_city;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to create a job.",
        variant: "destructive",
      });
      return;
    }

    if (!validateStep(1) || !validateStep(2)) {
      toast({
        title: "Invalid Data",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the actual Supabase user ID for RLS policy
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      const clientId = supabaseUser?.id || user.id;
      
      // Debug logging
      console.log('Supabase auth user:', supabaseUser);
      console.log('Auth error:', authError);
      console.log('Using client_id:', clientId);
      console.log('Mock user ID:', user.id);

      const jobData = {
        client_id: clientId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        job_type: formData.job_type,
        budget_min: parseFloat(formData.budget_min),
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        currency: 'SAR',
        location_address: formData.location_address,
        location_city: formData.location_city,
        location_region: formData.location_region || `${formData.location_city} Region`,
        priority: formData.priority,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
        skills_required: formData.skills_required,
        status: 'draft' as 'draft' | 'open' | 'quoted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed',
        metadata: {
          additional_requirements: formData.additional_requirements,
          created_via: 'web_form',
        }
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Job Created Successfully!",
        description: "Your job has been posted and engineers can now submit quotes.",
      });

      // Redirect to job details or jobs list
      navigate(`/client/myprojects`);

    } catch (error: any) {
      toast({
        title: "Error Creating Job",
        description: error.message || "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Briefcase className="h-4 w-4" />;
      case 2:
        return <MapPin className="h-4 w-4" />;
      case 3:
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/client/myprojects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Projects
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground">
            Post your engineering project and receive quotes from qualified professionals
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {getStepIcon(step)}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step ? 'text-primary' : 'text-muted-foreground'}`}>
                    Step {step}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step === 1 && 'Job Details'}
                    {step === 2 && 'Budget & Location'}
                    {step === 3 && 'Additional Info'}
                  </p>
                </div>
                {step < 3 && (
                  <Separator className={`ml-6 w-24 ${currentStep > step ? 'bg-primary' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Details
            </CardTitle>
            <CardDescription>
              Describe your engineering project requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Structural Assessment for Residential Building"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Engineering Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select engineering discipline" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your project, including scope, requirements, and any specific challenges..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 50 characters. Be specific about your requirements to attract the right engineers.
              </p>
            </div>

            <div>
              <Label>Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Budget & Location
            </CardTitle>
            <CardDescription>
              Set your budget and specify the project location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Job Type</Label>
              <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_min">Minimum Budget (SAR) *</Label>
                <Input
                  id="budget_min"
                  type="number"
                  placeholder="1000"
                  value={formData.budget_min}
                  onChange={(e) => handleInputChange('budget_min', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="budget_max">Maximum Budget (SAR)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  placeholder="5000"
                  value={formData.budget_max}
                  onChange={(e) => handleInputChange('budget_max', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="location_address">Project Address</Label>
              <Input
                id="location_address"
                placeholder="Building address or project site location"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_city">City *</Label>
                <Select value={formData.location_city} onValueChange={(value) => handleInputChange('location_city', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {saudiCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location_region">Region</Label>
                <Input
                  id="location_region"
                  placeholder="e.g., Riyadh Region"
                  value={formData.location_region}
                  onChange={(e) => handleInputChange('location_region', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline & Requirements
            </CardTitle>
            <CardDescription>
              Optional details to help engineers provide better quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Preferred Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="estimated_duration">Estimated Duration (days)</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  placeholder="14"
                  value={formData.estimated_duration}
                  onChange={(e) => handleInputChange('estimated_duration', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Required Skills</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills_required.map((skill) => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Type a skill and press Enter"
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="additional_requirements">Additional Requirements</Label>
              <Textarea
                id="additional_requirements"
                placeholder="Any special requirements, certifications needed, or additional project details..."
                value={formData.additional_requirements}
                onChange={(e) => handleInputChange('additional_requirements', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          {currentStep < 3 ? (
            <Button onClick={handleNext} className="bg-gradient-primary">
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-gradient-primary"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Job
            </Button>
          )}
        </div>
      </div>

      {/* Preview Card */}
      {currentStep === 3 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Job Preview</CardTitle>
            <CardDescription>
              This is how your job will appear to engineers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold">{formData.title}</h3>
              <Badge variant="outline" className="mt-1">{formData.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {formData.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formData.location_city}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  SAR {formData.budget_min}
                  {formData.budget_max && ` - ${formData.budget_max}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}