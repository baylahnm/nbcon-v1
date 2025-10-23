import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator';
import { ArrowLeft, Presentation, Download, Copy, RefreshCw, Sparkles, CheckCircle, AlertCircle, Clock, User, Building, Calendar, DollarSign, BarChart3, FileText, MessageSquare, Bot, Plus, Trash2, Edit, Eye, Send, Archive, Image, Video, File, Link } from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'chart' | 'image' | 'conclusion';
  order: number;
}

interface PresentationData {
  title: string;
  subtitle: string;
  presenter: string;
  date: string;
  audience: string;
  projectName: string;
  objective: string;
  keyPoints: string;
  data: string;
  conclusion: string;
  nextSteps: string;
  contactInfo: string;
}

const presentationTypes = [
  { value: 'project-overview', label: 'Project Overview' },
  { value: 'progress-report', label: 'Progress Report' },
  { value: 'budget-review', label: 'Budget Review' },
  { value: 'milestone-celebration', label: 'Milestone Celebration' },
  { value: 'stakeholder-update', label: 'Stakeholder Update' },
  { value: 'risk-assessment', label: 'Risk Assessment' },
  { value: 'quality-review', label: 'Quality Review' },
  { value: 'safety-meeting', label: 'Safety Meeting' },
  { value: 'change-order', label: 'Change Order' },
  { value: 'closeout-presentation', label: 'Closeout Presentation' }
];

const slideTypes = [
  { value: 'title', label: 'Title Slide', icon: Presentation },
  { value: 'content', label: 'Content Slide', icon: FileText },
  { value: 'chart', label: 'Chart/Data Slide', icon: BarChart3 },
  { value: 'image', label: 'Image Slide', icon: Image },
  { value: 'conclusion', label: 'Conclusion Slide', icon: CheckCircle }
];

const PresentationDeckTool: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useParams<{ project: string }>();
  const { sendMessage } = useAiStore();
  
  // Mock AI response function for now
  const generateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response based on the prompt
    if (prompt.includes('presentation')) {
      return `# Presentation Deck - ${presentationData.title || 'Project Presentation'}

## Slide 1: Title Slide
**${presentationData.title || 'Project Presentation'}**
${presentationData.subtitle || 'Project Overview and Status'}
Presented by: ${presentationData.presenter || 'Project Manager'}
Date: ${presentationData.date || new Date().toISOString().split('T')[0]}

## Slide 2: Executive Summary
- Project Status: On Track
- Budget: Within Allocated Limits
- Timeline: On Schedule
- Quality: Meeting Standards

## Slide 3: Project Overview
- **Project Name**: ${presentationData.title || 'Project Name'}
- **Duration**: ${presentationData.duration || '12 months'}
- **Budget**: ${presentationData.budget || '$1,000,000'}
- **Team Size**: ${presentationData.teamSize || '15 members'}

## Slide 4: Progress Update
- **Overall Progress**: 75% Complete
- **Milestones Achieved**: 8 of 12
- **Quality Score**: 95%
- **Client Satisfaction**: High

## Slide 5: Budget Analysis
- **Original Budget**: $1,000,000
- **Current Expenditure**: $750,000
- **Remaining Budget**: $250,000
- **Variance**: 0% (On Track)

## Slide 6: Timeline Status
- **Start Date**: [Project Start Date]
- **Current Phase**: Phase 3 of 4
- **Expected Completion**: [Completion Date]
- **Status**: On Schedule

## Slide 7: Key Achievements
- Completed Phase 1 ahead of schedule
- Implemented new quality processes
- Achieved 100% safety record
- Exceeded client expectations

## Slide 8: Challenges & Solutions
- **Challenge**: Weather delays
- **Solution**: Adjusted schedule and resources
- **Challenge**: Material shortages
- **Solution**: Alternative suppliers identified

## Slide 9: Next Steps
- Complete Phase 3 by [date]
- Begin Phase 4 planning
- Conduct client review meeting
- Prepare final deliverables

## Slide 10: Risk Assessment
- **Low Risk**: Schedule delays
- **Medium Risk**: Budget overruns
- **Mitigation**: Regular monitoring and adjustments

## Slide 11: Team Performance
- **Productivity**: 110% of target
- **Quality**: 95% first-time pass rate
- **Safety**: Zero incidents
- **Morale**: High team satisfaction

## Slide 12: Conclusion
- Project is on track for successful completion
- All major milestones achieved
- Client satisfaction is high
- Ready for next phase

## Slide 13: Questions & Discussion
Thank you for your attention.
Questions and discussion welcome.

---
Presentation prepared by: ${presentationData.presenter || 'Project Manager'}
Date: ${new Date().toISOString().split('T')[0]}`;
    }
    
    return "AI-generated content will be implemented here...";
  };
  const [presentationData, setPresentationData] = useState<PresentationData>({
    title: '',
    subtitle: '',
    presenter: '',
    date: '',
    audience: '',
    projectName: '',
    objective: '',
    keyPoints: '',
    data: '',
    conclusion: '',
    nextSteps: '',
    contactInfo: ''
  });
  const [selectedType, setSelectedType] = useState<string>('');
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [generatedPresentation, setGeneratedPresentation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'slides' | 'generate'>('create');

  const handleInputChange = (field: keyof PresentationData, value: string) => {
    setPresentationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSlide = (type: PresentationSlide['type']) => {
    const newSlide: PresentationSlide = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type,
      order: slides.length + 1
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const updateSlide = (slideId: string, field: keyof PresentationSlide, value: string) => {
    setSlides(prev => prev.map(slide => 
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  };

  const removeSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId));
  };

  const generatePresentation = async () => {
    if (!presentationData.title || !presentationData.objective) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive presentation deck for a construction project with the following details:

Presentation Information:
- Title: ${presentationData.title}
- Subtitle: ${presentationData.subtitle}
- Presenter: ${presentationData.presenter}
- Date: ${presentationData.date}
- Audience: ${presentationData.audience}
- Project: ${presentationData.projectName}

Presentation Objective: ${presentationData.objective}

Key Points: ${presentationData.keyPoints}

Data/Statistics: ${presentationData.data}

Conclusion: ${presentationData.conclusion}

Next Steps: ${presentationData.nextSteps}

Contact Information: ${presentationData.contactInfo}

Presentation Type: ${selectedType}

Generate a professional presentation deck that includes:
1. Title slide with project information
2. Executive summary slide
3. Project overview and objectives
4. Progress and milestones achieved
5. Budget and financial performance
6. Timeline and schedule status
7. Quality metrics and performance indicators
8. Risk assessment and mitigation strategies
9. Team performance and resource utilization
10. Stakeholder communication and feedback
11. Challenges and lessons learned
12. Next steps and action items
13. Conclusion and recommendations
14. Contact information and Q&A

The presentation should be:
- Professional and visually appealing
- Data-driven with specific metrics
- Clear and actionable
- Suitable for client presentation
- Include slide-by-slide content
- Provide speaker notes for each slide
- Include visual suggestions (charts, images, etc.)
- Follow construction industry standards

Return the presentation content in a structured format with clear slide separations and speaker notes.`;

      const response = await generateAIResponse(prompt);
      setGeneratedPresentation(response);
      toast.success('Presentation deck generated successfully!');
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Failed to generate presentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPresentation);
    toast.success('Presentation copied to clipboard!');
  };

  const downloadPresentation = () => {
    const blob = new Blob([generatedPresentation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation-deck-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Presentation downloaded!');
  };

  const resetForm = () => {
    setPresentationData({
      title: '',
      subtitle: '',
      presenter: '',
      date: '',
      audience: '',
      projectName: '',
      objective: '',
      keyPoints: '',
      data: '',
      conclusion: '',
      nextSteps: '',
      contactInfo: ''
    });
    setSelectedType('');
    setSlides([]);
    setGeneratedPresentation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
            <Presentation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Presentation Deck Generator
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-created project presentations with visual suggestions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button className="h-8 text-xs">
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Present
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create')}
          className="h-8 text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create
        </Button>
        <Button
          variant={activeTab === 'slides' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('slides')}
          className="h-8 text-xs"
        >
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          Slides
        </Button>
        <Button
          variant={activeTab === 'generate' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('generate')}
          className="h-8 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Generate
        </Button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Presentation Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs">Presentation Title *</Label>
                  <Input
                    id="title"
                    value={presentationData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter presentation title"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-xs">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={presentationData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Enter subtitle"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="presenter" className="text-xs">Presenter</Label>
                    <Input
                      id="presenter"
                      value={presentationData.presenter}
                      onChange={(e) => handleInputChange('presenter', e.target.value)}
                      placeholder="Presenter name"
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-xs">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={presentationData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-xs">Audience</Label>
                  <Input
                    id="audience"
                    value={presentationData.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    placeholder="Target audience"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-xs">Project Name</Label>
                  <Input
                    id="projectName"
                    value={presentationData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Related project"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objective" className="text-xs">Presentation Objective *</Label>
                  <Textarea
                    id="objective"
                    value={presentationData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                    placeholder="Describe the presentation objective"
                    className="min-h-[80px] text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keyPoints" className="text-xs">Key Points</Label>
                  <Textarea
                    id="keyPoints"
                    value={presentationData.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                    placeholder="List key points to cover"
                    className="min-h-[80px] text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-xs">Data/Statistics</Label>
                  <Textarea
                    id="data"
                    value={presentationData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    placeholder="Include relevant data and statistics"
                    className="min-h-[80px] text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conclusion" className="text-xs">Conclusion</Label>
                  <Textarea
                    id="conclusion"
                    value={presentationData.conclusion}
                    onChange={(e) => handleInputChange('conclusion', e.target.value)}
                    placeholder="Presentation conclusion"
                    className="min-h-[80px] text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextSteps" className="text-xs">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    value={presentationData.nextSteps}
                    onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                    placeholder="Outline next steps"
                    className="min-h-[80px] text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo" className="text-xs">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    value={presentationData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    placeholder="Contact details"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="presentationType" className="text-xs">Presentation Type</Label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select presentation type" />
                </SelectTrigger>
                <SelectContent>
                  {presentationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slides Tab */}
      {activeTab === 'slides' && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Presentation Slides
                </CardTitle>
              </div>
              <div className="flex gap-2">
                {slideTypes.map((slideType) => (
                  <Button
                    key={slideType.value}
                    variant="outline"
                    size="sm"
                    onClick={() => addSlide(slideType.value as PresentationSlide['type'])}
                    className="h-8 text-xs"
                  >
                    <slideType.icon className="h-3.5 w-3.5 mr-1.5" />
                    {slideType.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {slides.length === 0 ? (
              <div className="text-center py-8">
                <Presentation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No slides created yet</p>
                <p className="text-xs text-muted-foreground">Add slides to build your presentation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[9px]">
                          Slide {index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-[9px]">
                          {slideTypes.find(t => t.value === slide.type)?.label}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSlide(slide.id)}
                        className="h-6 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Slide Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                          placeholder="Enter slide title"
                          className="h-8 text-xs"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Slide Content</Label>
                        <Textarea
                          value={slide.content}
                          onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                          placeholder="Enter slide content"
                          className="min-h-[100px] text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Generate Presentation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Button
              onClick={generatePresentation}
              disabled={!presentationData.title || !presentationData.objective || isGenerating}
              className="w-full h-8 text-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate AI Presentation
                </>
              )}
            </Button>
            
            {generatedPresentation && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Generated Presentation</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-8 text-xs"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPresentation}
                      className="h-8 text-xs"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Presentation Content</Label>
                  <Textarea
                    value={generatedPresentation}
                    onChange={(e) => setGeneratedPresentation(e.target.value)}
                    className="min-h-[400px] text-xs"
                    placeholder="Generated presentation content will appear here..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="h-8 text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Reset
                  </Button>
                  <Button
                    onClick={generatePresentation}
                    className="h-8 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PresentationDeckTool;
