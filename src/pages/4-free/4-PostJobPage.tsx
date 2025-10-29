import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { canCreateProject } from '@/shared/services/projectLimitService';
import { 
  Stepper, 
  StepperItem, 
  StepperTrigger, 
  StepperIndicator, 
  StepperSeparator, 
  StepperTitle, 
  StepperNav,
  StepperContent 
} from '../1-HomePage/others/components/ui/stepper';
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  FileText,
  Save,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface JobForm {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  experience: string;
  skills: string[];
  requirements: string[];
  deliverables: string[];
  isUrgent: boolean;
  isRemote: boolean;
}

// Mock data
const jobCategories = [
  'Structural Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Project Management',
  'Environmental Engineering',
  'Software Engineering'
];

const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Expert Level (10+ years)'
];

const timelineOptions = [
  'Less than 1 week',
  '1-2 weeks',
  '2-4 weeks',
  '1-2 months',
  '2-6 months',
  '6+ months'
];

const locations = [
  'Riyadh, Saudi Arabia',
  'Jeddah, Saudi Arabia',
  'Dammam, Saudi Arabia',
  'Mecca, Saudi Arabia',
  'Medina, Saudi Arabia',
  'Remote',
  'Hybrid'
];

export default function PostJobPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const { userPermissions, isAuthenticated } = usePortalAccess();
  const [projectLimitError, setProjectLimitError] = useState<string | null>(null);
  
  // Helper functions for step navigation
  const getStepNumber = (tab: string): number => {
    const stepMap: { [key: string]: number } = {
      'basic': 1,
      'details': 2,
      'requirements': 3,
      'review': 4
    };
    return stepMap[tab] || 1;
  };

  const getStepName = (step: number): string => {
    const nameMap: { [key: number]: string } = {
      1: 'basic',
      2: 'details',
      3: 'requirements',
      4: 'review'
    };
    return nameMap[step] || 'basic';
  };

  const [formData, setFormData] = useState<JobForm>({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: {
      min: 0,
      max: 0,
      currency: 'SAR'
    },
    timeline: '',
    experience: '',
    skills: [],
    requirements: [],
    deliverables: [],
    isUrgent: false,
    isRemote: false
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');

  const handleInputChange = (field: keyof JobForm, value: string | boolean | string[] | JobForm['budget']) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBudgetChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim() && !formData.deliverables.includes(newDeliverable.trim())) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (deliverable: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(d => d !== deliverable)
    }));
  };

  const isFormValid = () => {
    return formData.title && 
           formData.description && 
           formData.category && 
           formData.location && 
           formData.budget.min > 0 && 
           formData.timeline && 
           formData.experience;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    
    // Check project creation limits
    if (isAuthenticated) {
      const limitCheck = await canCreateProject(
        undefined, // Will use current user
        userPermissions.subscriptionTier
      );
      
      if (!limitCheck.allowed) {
        setProjectLimitError(limitCheck.message || 'Project limit reached');
        return;
      }
    }
    
    // Handle form submission
    console.log('Submitting job:', formData);
    setProjectLimitError(null);
    // Redirect or show success message
  };

  return (
    <FeatureGate
      requiredTier="basic"
      featureName="Post New Job"
      featureDescription="Create and publish job postings to find the perfect engineer for your project"
    >
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 space-y-4">
      
      {/* Project Limit Error */}
      {projectLimitError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-sm">Project Limit Reached</CardTitle>
            </div>
            <CardDescription className="text-destructive">
              {projectLimitError}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[18px] font-bold tracking-tight">Post New Job</h1>
            <p className="text-[14px] text-muted-foreground">Find the perfect engineer for your project</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-8 text-xs">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Preview
          </Button>
          <Button className="h-8 text-xs" disabled={!isFormValid()}>
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <Stepper 
        value={getStepNumber(activeTab)} 
        onValueChange={(step) => setActiveTab(getStepName(step))}
        className="w-full"
      >
        <StepperNav className="w-full">
          <StepperItem step={1} completed={getStepNumber(activeTab) > 1}>
            <StepperTrigger className="flex items-center gap-4">
              <StepperIndicator className="w-8 h-8 text-xs font-medium ring-2 transition-all data-[state=active]:ring-primary/30 data-[state=active]:shadow-md data-[state=completed]:ring-primary/30 data-[state=completed]:shadow-md data-[state=inactive]:ring-border/50">
                1
              </StepperIndicator>
              <StepperTitle className="text-xs">Basic Info</StepperTitle>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem step={2} completed={getStepNumber(activeTab) > 2}>
            <StepperTrigger className="flex items-center gap-4">
              <StepperIndicator className="w-8 h-8 text-xs font-medium ring-2 transition-all data-[state=active]:ring-primary/30 data-[state=active]:shadow-md data-[state=completed]:ring-primary/30 data-[state=completed]:shadow-md data-[state=inactive]:ring-border/50">
                2
              </StepperIndicator>
              <StepperTitle className="text-xs">Details</StepperTitle>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem step={3} completed={getStepNumber(activeTab) > 3}>
            <StepperTrigger className="flex items-center gap-4">
              <StepperIndicator className="w-8 h-8 text-xs font-medium ring-2 transition-all data-[state=active]:ring-primary/30 data-[state=active]:shadow-md data-[state=completed]:ring-primary/30 data-[state=completed]:shadow-md data-[state=inactive]:ring-border/50">
                3
              </StepperIndicator>
              <StepperTitle className="text-xs">Requirements</StepperTitle>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem step={4}>
            <StepperTrigger className="flex items-center gap-4">
              <StepperIndicator className="w-8 h-8 text-xs font-medium ring-2 transition-all data-[state=active]:ring-primary/30 data-[state=active]:shadow-md data-[state=completed]:ring-primary/30 data-[state=completed]:shadow-md data-[state=inactive]:ring-border/50">
                4
              </StepperIndicator>
              <StepperTitle className="text-xs">Review</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        </StepperNav>
        {/* Main Content */}
        <div className="space-y-4">
          {/* Basic Information Step */}
          <StepperContent value={1} className="space-y-4 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
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
              <Card className="bg-transparent border border-border/50">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">Job Title & Category</CardTitle>
                      <CardDescription className="text-xs">Basic information about your job posting</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div>
                  <label className="text-xs font-medium mb-2 block">Job Title *</label>
                  <Input
                    placeholder="e.g., Senior Structural Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Category *</label>
                   <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                     <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                       <SelectValue placeholder="Select a category" />
                     </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Location *</label>
                   <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                     <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                       <SelectValue placeholder="Select a location" />
                     </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              </Card>
            </div>

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
              <Card className="bg-transparent border border-border/50">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">Budget & Timeline</CardTitle>
                      <CardDescription className="text-xs">Set your budget range and project timeline</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div>
                  <label className="text-xs font-medium mb-2 block">Budget Range *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.budget.min || ''}
                      onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.budget.max || ''}
                      onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                    />
                     <Select 
                       value={formData.budget.currency} 
                       onValueChange={(value) => handleInputChange('budget', { ...formData.budget, currency: value })}
                     >
                       <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                         <SelectValue />
                       </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">SAR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Project Timeline *</label>
                   <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                     <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                       <SelectValue placeholder="Select timeline" />
                     </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map(timeline => (
                        <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Experience Level *</label>
                   <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                     <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                       <SelectValue placeholder="Select experience level" />
                     </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('details')}>
              Next: Project Details
            </Button>
          </div>
        </StepperContent>

        {/* Project Details Tab */}
        <StepperContent value={2} className="space-y-4 mt-0">
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
            <Card className="bg-transparent border border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Project Description</CardTitle>
                    <CardDescription className="text-xs">Describe your project in detail</CardDescription>
                  </div>
                </div>
              </CardHeader>
            <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
              <div>
                <label className="text-xs font-medium mb-2 block">Project Description *</label>
                <textarea
                  rows={6}
                  placeholder="Describe your project, objectives, and what you're looking for..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                />
              </div>
            </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('basic')}>
              Back
            </Button>
            <Button onClick={() => setActiveTab('requirements')}>
              Next: Requirements
            </Button>
          </div>
        </StepperContent>

        {/* Requirements Tab */}
        <StepperContent value={3} className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <Card className="bg-transparent border border-border/50">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">Required Skills</CardTitle>
                      <CardDescription className="text-xs">Technical skills needed</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div className="flex gap-4">
                  <Input
                    placeholder="Add skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-4">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1">×</button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
              </Card>
            </div>

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
              <Card className="bg-transparent border border-border/50">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">Requirements</CardTitle>
                      <CardDescription className="text-xs">Must-have requirements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div className="flex gap-4">
                  <Input
                    placeholder="Add requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button onClick={addRequirement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((requirement) => (
                    <div key={requirement} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{requirement}</span>
                      <button onClick={() => removeRequirement(requirement)} className="text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
            </div>

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
              <Card className="bg-transparent border border-border/50">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">Deliverables</CardTitle>
                      <CardDescription className="text-xs">Expected project outputs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div className="flex gap-4">
                  <Input
                    placeholder="Add deliverable"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDeliverable()}
                  />
                  <Button onClick={addDeliverable} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.deliverables.map((deliverable) => (
                    <div key={deliverable} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{deliverable}</span>
                      <button onClick={() => removeDeliverable(deliverable)} className="text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('details')}>
              Back
            </Button>
            <Button onClick={() => setActiveTab('review')}>
              Next: Review
            </Button>
          </div>
        </StepperContent>

        {/* Review Tab */}
        <StepperContent value={4} className="space-y-4 mt-0">
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
            <Card className="bg-transparent border border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Review Your Job Posting</CardTitle>
                    <CardDescription className="text-xs">Check all details before publishing</CardDescription>
                  </div>
                </div>
              </CardHeader>
            <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Timeline:</strong> {formData.timeline}</p>
                    <p><strong>Experience:</strong> {formData.experience}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2">Budget</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Range:</strong> {formData.budget.min.toLocaleString()} - {formData.budget.max.toLocaleString()} {formData.budget.currency}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold tracking-tight mb-2">Project Description</h3>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2">Skills ({formData.skills.length})</h3>
                  <div className="flex flex-wrap gap-4">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2">Requirements ({formData.requirements.length})</h3>
                  <ul className="text-sm space-y-1">
                    {formData.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-4">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2">Deliverables ({formData.deliverables.length})</h3>
                  <ul className="text-sm space-y-1">
                    {formData.deliverables.map((del) => (
                      <li key={del} className="flex items-start gap-4">
                        <FileText className="h-3 w-3 mt-0.5 text-primary" />
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('requirements')}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              <Send className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
          </StepperContent>
        </div>
      </Stepper>
      </div>
    </div>
    </FeatureGate>
  );
}

