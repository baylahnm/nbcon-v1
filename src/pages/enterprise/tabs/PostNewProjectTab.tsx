import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectStore } from '@/hooks/useProjectStore';
import { useCurrency } from '@/hooks/useCurrency';
import { usePostProjectRouting } from '@/hooks/usePostProjectRouting';
import { 
  FileText, 
  Building2, 
  Users, 
  Calendar, 
  Shield,
  Plus,
  X,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  AlertTriangle,
  CheckCircle,
  Upload,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PostNewProjectTab: React.FC = () => {
  const { 
    projectData, 
    updateProjectData, 
    formState, 
    validateSection,
    currentSection,
    setCurrentSection 
  } = useProjectStore();
  const { formatAmount } = useCurrency();
  const { navigateToSection } = usePostProjectRouting();

  const [newDeliverable, setNewDeliverable] = useState({ title: '', description: '', dueDate: '', isRequired: false });
  const [newMilestone, setNewMilestone] = useState({ name: '', description: '', valuePercentage: 0, dueDate: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newTechRequirement, setNewTechRequirement] = useState('');

  const sections = [
    { id: 'basics', label: 'Project Basics', icon: FileText, completed: !!(projectData.basics?.title && projectData.basics?.category) },
    { id: 'scope', label: 'Scope & Deliverables', icon: Building2, completed: !!(projectData.scope?.description && projectData.scope?.deliverables?.length) },
    { id: 'requirements', label: 'Engineer Requirements', icon: Users, completed: !!(projectData.requirements?.experience && projectData.requirements?.skills?.length) },
    { id: 'timeline', label: 'Project Timeline', icon: Calendar, completed: !!(projectData.timeline?.startDate && projectData.timeline?.endDate) },
    { id: 'compliance', label: 'Compliance', icon: Shield, completed: true }
  ];

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId as any);
    navigateToSection(sectionId as any);
  };

  const handleBasicsChange = (field: string, value: any) => {
    updateProjectData('basics', { ...projectData.basics, [field]: value });
    validateSection('basics');
  };

  const handleScopeChange = (field: string, value: any) => {
    updateProjectData('scope', { ...projectData.scope, [field]: value });
    validateSection('scope');
  };

  const handleRequirementsChange = (field: string, value: any) => {
    updateProjectData('requirements', { ...projectData.requirements, [field]: value });
    validateSection('requirements');
  };

  const handleTimelineChange = (field: string, value: any) => {
    updateProjectData('timeline', { ...projectData.timeline, [field]: value });
    validateSection('timeline');
  };

  const handleComplianceChange = (field: string, value: any) => {
    updateProjectData('compliance', { ...projectData.compliance, [field]: value });
    validateSection('compliance');
  };

  const addDeliverable = () => {
    if (newDeliverable.title) {
      const deliverables = [...(projectData.scope?.deliverables || []), {
        id: Date.now().toString(),
        ...newDeliverable
      }];
      handleScopeChange('deliverables', deliverables);
      setNewDeliverable({ title: '', description: '', dueDate: '', isRequired: false });
    }
  };

  const removeDeliverable = (id: string) => {
    const deliverables = (projectData.scope?.deliverables || []).filter(d => d.id !== id);
    handleScopeChange('deliverables', deliverables);
  };

  const addMilestone = () => {
    if (newMilestone.name) {
      const milestones = [...(projectData.scope?.milestones || []), {
        id: Date.now().toString(),
        ...newMilestone
      }];
      handleScopeChange('milestones', milestones);
      setNewMilestone({ name: '', description: '', valuePercentage: 0, dueDate: '' });
    }
  };

  const removeMilestone = (id: string) => {
    const milestones = (projectData.scope?.milestones || []).filter(m => m.id !== id);
    handleScopeChange('milestones', milestones);
  };

  const addSkill = () => {
    if (newSkill) {
      const skills = [...(projectData.requirements?.skills || []), newSkill];
      handleRequirementsChange('skills', skills);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const skills = (projectData.requirements?.skills || []).filter(s => s !== skill);
    handleRequirementsChange('skills', skills);
  };

  const addCertification = () => {
    if (newCertification) {
      const certifications = [...(projectData.requirements?.certifications || []), newCertification];
      handleRequirementsChange('certifications', certifications);
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    const certifications = (projectData.requirements?.certifications || []).filter(c => c !== cert);
    handleRequirementsChange('certifications', certifications);
  };

  const addTechRequirement = () => {
    if (newTechRequirement) {
      const techRequirements = [...(projectData.scope?.technicalRequirements || []), newTechRequirement];
      handleScopeChange('technicalRequirements', techRequirements);
      setNewTechRequirement('');
    }
  };

  const removeTechRequirement = (req: string) => {
    const techRequirements = (projectData.scope?.technicalRequirements || []).filter(r => r !== req);
    handleScopeChange('technicalRequirements', techRequirements);
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete each section to build your comprehensive project posting
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSectionChange(section.id)}
                className="flex items-center gap-2 justify-start h-auto p-3"
              >
                <section.icon className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">{section.label}</div>
                  {section.completed && (
                    <CheckCircle className="h-3 w-3 text-green-500 mt-1" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Content */}
      <Tabs value={currentSection} onValueChange={handleSectionChange} className="space-y-6">
        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Basics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Define the core information about your project
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectData.basics?.title || ''}
                    onChange={(e) => handleBasicsChange('title', e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={projectData.basics?.category || ''}
                    onValueChange={(value) => handleBasicsChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                      <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="software-development">Software Development</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={projectData.basics?.subcategory || ''}
                    onChange={(e) => handleBasicsChange('subcategory', e.target.value)}
                    placeholder="Enter subcategory"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={projectData.basics?.location || ''}
                      onChange={(e) => handleBasicsChange('location', e.target.value)}
                      placeholder="Enter location"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote"
                        checked={projectData.basics?.isRemote || false}
                        onCheckedChange={(checked) => handleBasicsChange('isRemote', checked)}
                      />
                      <Label htmlFor="remote" className="text-sm">Remote</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Select
                    value={projectData.basics?.language || ''}
                    onValueChange={(value) => handleBasicsChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="bilingual">Bilingual (English/Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency *</Label>
                  <Select
                    value={projectData.basics?.urgency || ''}
                    onValueChange={(value) => handleBasicsChange('urgency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Range
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-min">Minimum Budget</Label>
                    <Input
                      id="budget-min"
                      type="number"
                      value={projectData.basics?.budget?.min || ''}
                      onChange={(e) => handleBasicsChange('budget', { 
                        ...projectData.basics?.budget, 
                        min: parseFloat(e.target.value) || 0 
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget-max">Maximum Budget</Label>
                    <Input
                      id="budget-max"
                      type="number"
                      value={projectData.basics?.budget?.max || ''}
                      onChange={(e) => handleBasicsChange('budget', { 
                        ...projectData.basics?.budget, 
                        max: parseFloat(e.target.value) || 0 
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget-currency">Currency</Label>
                    <Select
                      value={projectData.basics?.budget?.currency || 'USD'}
                      onValueChange={(value) => handleBasicsChange('budget', { 
                        ...projectData.basics?.budget, 
                        currency: value 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="SAR">SAR (﷼)</SelectItem>
                        <SelectItem value="AED">AED (د.إ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Project Duration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration-weeks">Duration (weeks)</Label>
                    <Input
                      id="duration-weeks"
                      type="number"
                      value={projectData.basics?.duration?.weeks || ''}
                      onChange={(e) => handleBasicsChange('duration', { 
                        ...projectData.basics?.duration, 
                        weeks: parseInt(e.target.value) || 0 
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id="duration-flexible"
                      checked={projectData.basics?.duration?.flexible || false}
                      onCheckedChange={(checked) => handleBasicsChange('duration', { 
                        ...projectData.basics?.duration, 
                        flexible: checked 
                      })}
                    />
                    <Label htmlFor="duration-flexible">Flexible duration</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Scope & Deliverables
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Define what needs to be delivered and the technical requirements
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={projectData.scope?.description || ''}
                  onChange={(e) => handleScopeChange('description', e.target.value)}
                  placeholder="Describe the project scope, objectives, and expected outcomes..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Deliverables</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDeliverable}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Deliverable
                  </Button>
                </div>

                <div className="space-y-4">
                  {projectData.scope?.deliverables?.map((deliverable) => (
                    <Card key={deliverable.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{deliverable.title}</h5>
                            {deliverable.isRequired && (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                          {deliverable.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliverable(deliverable.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  <Card className="p-4 border-dashed">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="new-deliverable-title">Title</Label>
                          <Input
                            id="new-deliverable-title"
                            value={newDeliverable.title}
                            onChange={(e) => setNewDeliverable({ ...newDeliverable, title: e.target.value })}
                            placeholder="Enter deliverable title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-deliverable-due">Due Date</Label>
                          <Input
                            id="new-deliverable-due"
                            type="date"
                            value={newDeliverable.dueDate}
                            onChange={(e) => setNewDeliverable({ ...newDeliverable, dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-deliverable-desc">Description</Label>
                        <Textarea
                          id="new-deliverable-desc"
                          value={newDeliverable.description}
                          onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
                          placeholder="Describe the deliverable..."
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-deliverable-required"
                          checked={newDeliverable.isRequired}
                          onCheckedChange={(checked) => setNewDeliverable({ ...newDeliverable, isRequired: !!checked })}
                        />
                        <Label htmlFor="new-deliverable-required" className="text-sm">Required deliverable</Label>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Technical Requirements</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTechRequirement}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Requirement
                  </Button>
                </div>

                <div className="space-y-2">
                  {projectData.scope?.technicalRequirements?.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">{req}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechRequirement(req)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newTechRequirement}
                      onChange={(e) => setNewTechRequirement(e.target.value)}
                      placeholder="Enter technical requirement"
                      onKeyPress={(e) => e.key === 'Enter' && addTechRequirement()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTechRequirement}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Engineer Requirements
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Define the qualifications and skills required for this project
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select
                    value={projectData.requirements?.experience || ''}
                    onValueChange={(value) => handleRequirementsChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="expert">Expert Level (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Additional Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="portfolio-required"
                        checked={projectData.requirements?.portfolio || false}
                        onCheckedChange={(checked) => handleRequirementsChange('portfolio', checked)}
                      />
                      <Label htmlFor="portfolio-required">Portfolio Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="interviews-required"
                        checked={projectData.requirements?.interviews || false}
                        onCheckedChange={(checked) => handleRequirementsChange('interviews', checked)}
                      />
                      <Label htmlFor="interviews-required">Technical Interviews</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Required Skills</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-2">
                  {projectData.requirements?.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary">{skill}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter required skill"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSkill}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Certifications</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Certification
                  </Button>
                </div>

                <div className="space-y-2">
                  {projectData.requirements?.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">{cert}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Enter certification"
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCertification}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set the project schedule and working arrangements
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={projectData.timeline?.startDate || ''}
                    onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={projectData.timeline?.endDate || ''}
                    onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select
                    value={projectData.timeline?.workingHours?.timezone || ''}
                    onValueChange={(value) => handleTimelineChange('workingHours', { 
                      ...projectData.timeline?.workingHours, 
                      timezone: value 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours-per-week">Hours per Week</Label>
                  <Input
                    id="hours-per-week"
                    type="number"
                    value={projectData.timeline?.workingHours?.hoursPerWeek || ''}
                    onChange={(e) => handleTimelineChange('workingHours', { 
                      ...projectData.timeline?.workingHours, 
                      hoursPerWeek: parseInt(e.target.value) || 0 
                    })}
                    placeholder="40"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Schedule Preferences</h4>
                <div className="space-y-2">
                  <Label htmlFor="preferred-schedule">Preferred Working Schedule</Label>
                  <Select
                    value={projectData.timeline?.workingHours?.preferredSchedule || ''}
                    onValueChange={(value) => handleTimelineChange('workingHours', { 
                      ...projectData.timeline?.workingHours, 
                      preferredSchedule: value 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard business hours (9 AM - 5 PM)</SelectItem>
                      <SelectItem value="flexible">Flexible hours</SelectItem>
                      <SelectItem value="evening">Evening hours (6 PM - 10 PM)</SelectItem>
                      <SelectItem value="weekend">Weekend availability</SelectItem>
                      <SelectItem value="custom">Custom schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flexible-start"
                      checked={projectData.timeline?.flexibleStart || false}
                      onCheckedChange={(checked) => handleTimelineChange('flexibleStart', checked)}
                    />
                    <Label htmlFor="flexible-start">Flexible start date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flexible-end"
                      checked={projectData.timeline?.flexibleEnd || false}
                      onCheckedChange={(checked) => handleTimelineChange('flexibleEnd', checked)}
                    />
                    <Label htmlFor="flexible-end">Flexible end date</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance & Requirements
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Specify compliance requirements and document uploads
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Saudi Compliance Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sce-required"
                      checked={projectData.compliance?.sceRequired || false}
                      onCheckedChange={(checked) => handleComplianceChange('sceRequired', checked)}
                    />
                    <Label htmlFor="sce-required">SCE Certification Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hse-required"
                      checked={projectData.compliance?.hseRequired || false}
                      onCheckedChange={(checked) => handleComplianceChange('hseRequired', checked)}
                    />
                    <Label htmlFor="hse-required">HSE Compliance Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance-needed"
                      checked={projectData.compliance?.insuranceNeeded || false}
                      onCheckedChange={(checked) => handleComplianceChange('insuranceNeeded', checked)}
                    />
                    <Label htmlFor="insurance-needed">Professional Insurance Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="security-clearance"
                      checked={projectData.compliance?.securityClearance || false}
                      onCheckedChange={(checked) => handleComplianceChange('securityClearance', checked)}
                    />
                    <Label htmlFor="security-clearance">Security Clearance Required</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Document Upload</h4>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload compliance documents, project specifications, or other required files
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Additional Requirements</h4>
                <Textarea
                  value={projectData.compliance?.additionalRequirements?.join('\n') || ''}
                  onChange={(e) => handleComplianceChange('additionalRequirements', e.target.value.split('\n').filter(r => r.trim()))}
                  placeholder="Enter any additional compliance requirements or special instructions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostNewProjectTab;