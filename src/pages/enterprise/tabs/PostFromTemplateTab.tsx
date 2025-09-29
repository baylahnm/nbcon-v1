import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useProjectStore } from '@/hooks/useProjectStore';
import { useCurrency } from '@/hooks/useCurrency';
import { usePostProjectRouting } from '@/hooks/usePostProjectRouting';
import { PreviewTemplateButton, UseTemplateButton } from '@/components/PostProjectButtonHandler';
import { ProjectTemplate } from '@/types/project';
import { MOCK_TEMPLATES, CATEGORIES, COMPLEXITY_LEVELS, INDUSTRIES, MOCK_PROJECT_ALIASES } from '@/data/mockData';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Calendar,
  Building2,
  Clock,
  Users,
  FileText,
  Plus,
  Eye,
  CheckCircle,
  X,
  MapPin,
  DollarSign,
  Globe,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PostFromTemplateTab: React.FC = () => {
  const { loadFromTemplate } = useProjectStore();
  const { formatAmount } = useCurrency();
  const { handleUseTemplate, handlePreviewTemplate, setViewMode, clearFilters, handleQuickFilter } = usePostProjectRouting();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<ProjectTemplate | null>(null);

  // Filter templates based on search and filters
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || template.category === selectedCategory;
      const matchesComplexity = !selectedComplexity || selectedComplexity === 'all' || template.complexity === selectedComplexity;
      const matchesIndustry = !selectedIndustry || selectedIndustry === 'all' || template.industry === selectedIndustry;
      
      return matchesSearch && matchesCategory && matchesComplexity && matchesIndustry;
    });
  }, [searchTerm, selectedCategory, selectedComplexity, selectedIndustry]);

  const handleTemplateUse = (template: ProjectTemplate) => {
    handleUseTemplate(template);
  };

  const handleTemplatePreview = (template: ProjectTemplate) => {
    setPreviewTemplate(template);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedComplexity('all');
    setSelectedIndustry('all');
    clearFilters();
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    setViewMode(mode);
  };

  const handleQuickFilterClick = (aliasId: string) => {
    setSelectedAlias(selectedAlias === aliasId ? '' : aliasId);
    handleQuickFilter(aliasId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Choose from Your Templates
          </CardTitle>
          <p className="text-muted-foreground">
            Select from your saved templates or create a new project from scratch
          </p>
        </CardHeader>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MOCK_PROJECT_ALIASES.map((alias) => (
              <Button
                key={alias.id}
                variant={selectedAlias === alias.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickFilterClick(alias.id)}
                className="flex items-center gap-2"
              >
                <Building2 className="h-3 w-3" />
                {alias.name}
                <Badge variant="secondary" className="ml-1">
                  {alias.useCount}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates by name, category, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Complexity</Label>
                <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All complexity levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All complexity levels</SelectItem>
                    {COMPLEXITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All industries</SelectItem>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>View Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || (selectedCategory && selectedCategory !== 'all') || (selectedComplexity && selectedComplexity !== 'all') || (selectedIndustry && selectedIndustry !== 'all')) && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      )}>
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {template.industry}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {template.downloads} downloads
                  </div>
                  {template.lastUsed && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Last used: {new Date(template.lastUsed).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {template.data.basics && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      Duration: {template.data.basics.duration.weeks} weeks
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Urgency: {template.data.basics.urgency}
                    </div>
                    {template.data.basics.budget && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          Budget: {formatAmount(template.data.basics.budget.min)} - {formatAmount(template.data.basics.budget.max)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {template.author && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {template.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{template.author.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">{template.author.rating}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTemplatePreview(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTemplateUse(template)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or create a new template
                </p>
              </div>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Template */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create Custom Template</h3>
              <p className="text-muted-foreground">
                Build a reusable template from your current project or start from scratch
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => handleUseTemplate({} as ProjectTemplate)}>
                Create from Current Project
              </Button>
              <Button onClick={() => handleUseTemplate({} as ProjectTemplate)}>
                Create New Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl h-[100vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Template Preview: {previewTemplate.name}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 pr-4 h-0 min-h-0">
              <div className="space-y-6 p-1">
                {/* Template Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{previewTemplate.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{previewTemplate.category}</Badge>
                          <Badge className={getComplexityColor(previewTemplate.complexity)}>
                            {previewTemplate.complexity}
                          </Badge>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{previewTemplate.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {previewTemplate.data.scope?.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Project Basics Preview */}
                {previewTemplate.data.basics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Project Basics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Category</Label>
                          <p className="text-sm">{previewTemplate.data.basics.category}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Location</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{previewTemplate.data.basics.location}</span>
                            {previewTemplate.data.basics.isRemote && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Duration</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              {previewTemplate.data.basics.duration.weeks} weeks
                              {previewTemplate.data.basics.duration.flexible && ' (flexible)'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Urgency</Label>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm capitalize">{previewTemplate.data.basics.urgency}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Language</Label>
                          <p className="text-sm">{previewTemplate.data.basics.language}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Budget Range</Label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm">
                              {formatAmount(previewTemplate.data.basics.budget.min)} - {formatAmount(previewTemplate.data.basics.budget.max)} {previewTemplate.data.basics.budget.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scope & Deliverables Preview */}
                {previewTemplate.data.scope && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Scope & Deliverables
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {previewTemplate.data.scope.deliverables && previewTemplate.data.scope.deliverables.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Deliverables</Label>
                          <div className="space-y-2">
                            {previewTemplate.data.scope.deliverables.map((deliverable, index) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{deliverable.title}</h4>
                                  {deliverable.isRequired && (
                                    <Badge variant="secondary">Required</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                                {deliverable.dueDate && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewTemplate.data.scope.technicalRequirements && previewTemplate.data.scope.technicalRequirements.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Technical Requirements</Label>
                          <div className="flex flex-wrap gap-2">
                            {previewTemplate.data.scope.technicalRequirements.map((req, index) => (
                              <Badge key={index} variant="outline">{req}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Requirements Preview */}
                {previewTemplate.data.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Engineer Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Experience Level</Label>
                          <p className="text-sm">{previewTemplate.data.requirements.experience}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Requirements</Label>
                          <div className="space-y-1">
                            {previewTemplate.data.requirements.portfolio && (
                              <Badge variant="secondary">Portfolio Required</Badge>
                            )}
                            {previewTemplate.data.requirements.interviews && (
                              <Badge variant="secondary">Technical Interviews</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {previewTemplate.data.requirements.skills && previewTemplate.data.requirements.skills.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Required Skills</Label>
                          <div className="flex flex-wrap gap-2">
                            {previewTemplate.data.requirements.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewTemplate.data.requirements.certifications && previewTemplate.data.requirements.certifications.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Certifications</Label>
                          <div className="flex flex-wrap gap-2">
                            {previewTemplate.data.requirements.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Timeline Preview */}
                {previewTemplate.data.timeline && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Project Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Start Date</Label>
                          <p className="text-sm">
                            {new Date(previewTemplate.data.timeline.startDate).toLocaleDateString()}
                            {previewTemplate.data.timeline.flexibleStart && ' (flexible)'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">End Date</Label>
                          <p className="text-sm">
                            {new Date(previewTemplate.data.timeline.endDate).toLocaleDateString()}
                            {previewTemplate.data.timeline.flexibleEnd && ' (flexible)'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Timezone</Label>
                          <p className="text-sm">{previewTemplate.data.timeline.workingHours?.timezone}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Hours per Week</Label>
                          <p className="text-sm">{previewTemplate.data.timeline.workingHours?.hoursPerWeek}</p>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium">Preferred Schedule</Label>
                          <p className="text-sm">{previewTemplate.data.timeline.workingHours?.preferredSchedule}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Preview */}
                {previewTemplate.data.compliance && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance & Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium">Saudi Compliance</h4>
                          <div className="space-y-2">
                            {previewTemplate.data.compliance.sceRequired && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">SCE certification required</span>
                              </div>
                            )}
                            {previewTemplate.data.compliance.hseRequired && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">HSE compliance required</span>
                              </div>
                            )}
                            {previewTemplate.data.compliance.insuranceNeeded && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Professional insurance required</span>
                              </div>
                            )}
                            {previewTemplate.data.compliance.securityClearance && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Security clearance required</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">Additional Requirements</h4>
                          {previewTemplate.data.compliance.additionalRequirements && previewTemplate.data.compliance.additionalRequirements.length > 0 ? (
                            <ul className="space-y-1">
                              {previewTemplate.data.compliance.additionalRequirements.map((req, index) => (
                                <li key={index} className="text-sm text-muted-foreground">• {req}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No additional requirements</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
              <Button onClick={() => {
                handleTemplateUse(previewTemplate);
                setPreviewTemplate(null);
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PostFromTemplateTab;
