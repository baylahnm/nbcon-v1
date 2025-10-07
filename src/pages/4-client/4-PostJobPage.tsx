import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
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

  const handleInputChange = (field: string, value: any) => {
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

  const handleSubmit = () => {
    if (isFormValid()) {
      // Handle form submission
      console.log('Submitting job:', formData);
      // Redirect or show success message
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary" />
            Post New Job
          </h1>
          <p className="text-muted-foreground">Find the perfect engineer for your project</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" disabled={!isFormValid()}>
            <Send className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            activeTab === 'basic' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            1
          </div>
          <span className={`text-sm ${activeTab === 'basic' ? 'font-medium' : 'text-muted-foreground'}`}>
            Basic Info
          </span>
        </div>
        <div className="w-8 h-px bg-muted" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            activeTab === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            2
          </div>
          <span className={`text-sm ${activeTab === 'details' ? 'font-medium' : 'text-muted-foreground'}`}>
            Details
          </span>
        </div>
        <div className="w-8 h-px bg-muted" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            activeTab === 'requirements' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            3
          </div>
          <span className={`text-sm ${activeTab === 'requirements' ? 'font-medium' : 'text-muted-foreground'}`}>
            Requirements
          </span>
        </div>
        <div className="w-8 h-px bg-muted" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            activeTab === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            4
          </div>
          <span className={`text-sm ${activeTab === 'review' ? 'font-medium' : 'text-muted-foreground'}`}>
            Review
          </span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="hidden">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="review">Review & Submit</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Title & Category</CardTitle>
                <CardDescription>Basic information about your job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Title *</label>
                  <Input
                    placeholder="e.g., Senior Structural Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select a category</option>
                    {jobCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select a location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget & Timeline</CardTitle>
                <CardDescription>Set your budget range and project timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range *</label>
                  <div className="grid grid-cols-3 gap-2">
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
                    <select
                      value={formData.budget.currency}
                      onChange={(e) => handleInputChange('budget', { ...formData.budget, currency: e.target.value })}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Timeline *</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map(timeline => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience Level *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('details')}>
              Next: Project Details
            </Button>
          </div>
        </TabsContent>

        {/* Project Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Description</CardTitle>
              <CardDescription>Describe your project in detail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Description *</label>
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

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('basic')}>
              Back
            </Button>
            <Button onClick={() => setActiveTab('requirements')}>
              Next: Requirements
            </Button>
          </div>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
                <CardDescription>Technical skills needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
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
                <div className="flex flex-wrap gap-1">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1">×</button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
                <CardDescription>Must-have requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deliverables</CardTitle>
                <CardDescription>Expected project outputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
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

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('details')}>
              Back
            </Button>
            <Button onClick={() => setActiveTab('review')}>
              Next: Review
            </Button>
          </div>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Your Job Posting</CardTitle>
              <CardDescription>Check all details before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Timeline:</strong> {formData.timeline}</p>
                    <p><strong>Experience:</strong> {formData.experience}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Budget</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Range:</strong> {formData.budget.min.toLocaleString()} - {formData.budget.max.toLocaleString()} {formData.budget.currency}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Project Description</h3>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Skills ({formData.skills.length})</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Requirements ({formData.requirements.length})</h3>
                  <ul className="text-sm space-y-1">
                    {formData.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Deliverables ({formData.deliverables.length})</h3>
                  <ul className="text-sm space-y-1">
                    {formData.deliverables.map((del) => (
                      <li key={del} className="flex items-start gap-2">
                        <FileText className="h-3 w-3 mt-0.5 text-blue-600" />
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('requirements')}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              <Send className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
