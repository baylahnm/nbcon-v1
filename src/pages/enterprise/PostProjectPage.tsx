import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { R } from '@/lib/routes';
import { SAUDI_CITIES, ENGINEERING_SPECIALIZATIONS, JOB_TYPES, BUDGET_RANGES } from '@/lib/constants';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  FileText, 
  Plus,
  X,
  Save,
  Send,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  duration: string;
  teamSize: string;
  startDate: string;
  endDate: string;
  requirements: ProjectRequirement[];
  skills: string[];
  attachments: File[];
}

const PostProjectPage: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    duration: '',
    teamSize: '',
    startDate: '',
    endDate: '',
    requirements: [],
    skills: [],
    attachments: []
  });

  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    priority: 'medium' as const
  });

  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)]
      }));
    }
  };

  const addRequirement = () => {
    if (newRequirement.title && newRequirement.description) {
      const requirement: ProjectRequirement = {
        id: Date.now().toString(),
        ...newRequirement
      };
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
      setNewRequirement({ title: '', description: '', priority: 'medium' });
    }
  };

  const removeRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
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

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: action === 'draft' ? 'Draft Saved' : 'Project Published',
        description: action === 'draft' 
          ? 'Your project has been saved as a draft.'
          : 'Your project has been successfully published and is now visible to engineers.',
      });

      if (action === 'publish') {
        // Redirect to team projects page
        window.location.href = R.enterprise.teamProjects;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2 pb-6 border-b border-sidebar-border"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Post New Project
        </h1>
        <p className="text-muted-foreground">
          Create a new project to find and hire qualified engineers for your enterprise needs.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Engineering Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_SPECIALIZATIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project scope, objectives, and deliverables..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAUDI_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range *</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
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
            </div>
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Timeline & Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 3 months, 6 weeks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size Required</Label>
                <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Individual (1 person)</SelectItem>
                    <SelectItem value="2-3">Small Team (2-3 people)</SelectItem>
                    <SelectItem value="4-6">Medium Team (4-6 people)</SelectItem>
                    <SelectItem value="7-10">Large Team (7-10 people)</SelectItem>
                    <SelectItem value="10+">Very Large Team (10+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              Project Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.requirements.map((requirement) => (
              <div key={requirement.id} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{requirement.title}</h4>
                    <Badge variant={requirement.priority === 'high' ? 'destructive' : requirement.priority === 'medium' ? 'default' : 'secondary'}>
                      {requirement.priority}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(requirement.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{requirement.description}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Add New Requirement</h4>
              <div className="space-y-3">
                <Input
                  placeholder="Requirement title"
                  value={newRequirement.title}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Requirement description"
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <Label>Priority:</Label>
                  <Select value={newRequirement.priority} onValueChange={(value: any) => setNewRequirement(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addRequirement} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              Required Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add required skill or expertise"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Project Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attachments">Upload Documents</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Upload project specifications, drawings, or other relevant documents (PDF, DOC, XLS formats)
              </p>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit('publish')}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Publishing...' : 'Publish Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PostProjectPage;
