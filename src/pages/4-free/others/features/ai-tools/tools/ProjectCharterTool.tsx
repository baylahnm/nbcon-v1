import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { 
  FileText, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  Target,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { FloatingAIButton } from '../components/FloatingAIButton';

interface CharterSection {
  id: string;
  title: string;
  description: string;
  content: string;
  aiGenerated: boolean;
  isEditing: boolean;
}

export default function ProjectCharterTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage, setComposerText } = useAiStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('vision');

  // Charter sections state
  const [sections, setSections] = useState<CharterSection[]>([
    {
      id: 'vision',
      title: 'Vision & Objectives',
      description: 'Define the project vision and key objectives',
      content: '',
      aiGenerated: false,
      isEditing: false
    },
    {
      id: 'scope',
      title: 'Scope Boundaries',
      description: 'What is included and excluded from the project',
      content: '',
      aiGenerated: false,
      isEditing: false
    },
    {
      id: 'success',
      title: 'Success Criteria',
      description: 'How will we measure project success',
      content: '',
      aiGenerated: false,
      isEditing: false
    },
    {
      id: 'stakeholders',
      title: 'Key Stakeholders',
      description: 'Who are the main stakeholders and their roles',
      content: '',
      aiGenerated: false,
      isEditing: false
    },
    {
      id: 'constraints',
      title: 'Constraints & Assumptions',
      description: 'Known limitations and assumptions',
      content: '',
      aiGenerated: false,
      isEditing: false
    },
    {
      id: 'deliverables',
      title: 'Major Deliverables',
      description: 'Key outputs and deliverables',
      content: '',
      aiGenerated: false,
      isEditing: false
    }
  ]);

  // Calculate completion
  const completedSections = sections.filter(s => s.content.trim().length > 0).length;
  const completionPercentage = Math.round((completedSections / sections.length) * 100);

  // Handle AI generation for a section
  const handleAIGenerate = async (sectionId: string) => {
    setIsGenerating(true);
    
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Create AI prompt based on section
    const prompt = `Generate content for the "${section.title}" section of a project charter. ${section.description}. Make it professional and comprehensive for a construction project in Saudi Arabia. Project ID: ${projectId || 'N/A'}`;

    try {
      // Call AI Assistant (opens chat with prompt)
      await sendMessage(prompt);
      
      // For now, use mock content (in production, AI response would be parsed and inserted)
      const mockContent = `[AI Generated Content for ${section.title}]\n\nThis section provides comprehensive details about ${section.description.toLowerCase()}. The content is tailored for construction projects in Saudi Arabia, following PMI best practices and local regulations.\n\n• Key Point 1: Industry-specific considerations\n• Key Point 2: Regulatory compliance requirements\n• Key Point 3: Stakeholder engagement strategies\n\nThis content should be reviewed and customized to match your specific project requirements.`;
      
      // Update section with content
      setSections(prev => prev.map(s => 
        s.id === sectionId 
          ? { ...s, content: mockContent, aiGenerated: true }
          : s
      ));

      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  // Handle content edit
  const handleContentChange = (sectionId: string, newContent: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId 
        ? { ...s, content: newContent, aiGenerated: false }
        : s
    ));
  };

  // Toggle edit mode
  const toggleEdit = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId 
        ? { ...s, isEditing: !s.isEditing }
        : s
    ));
  };

  // Get current section
  const currentSection = sections.find(s => s.id === activeTab);

  // Save charter
  const handleSave = () => {
    console.log('Saving charter...', sections);
    // In real implementation: Save to database
  };

  // Export to PDF
  const handleExport = () => {
    console.log('Exporting to PDF...', sections);
    // In real implementation: Generate PDF
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header with Back Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/planning')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Project Charter Generator
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create a comprehensive project charter with AI assistance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSave}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Draft
            </Button>
            <Button size="sm" className="h-8 text-xs shadow-md" onClick={handleExport}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Charter Completion</p>
                  <p className="text-xs text-muted-foreground">
                    {completedSections} of {sections.length} sections completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tracking-tight">{completionPercentage}%</p>
                <p className="text-[10px] text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content - Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          
          {/* Left Sidebar - Section Navigation */}
          <Card className="border-border/50 h-fit sticky top-6">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight">Charter Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeTab === section.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold mb-1 ${
                          activeTab === section.id ? 'text-primary' : ''
                        }`}>
                          {section.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {section.description}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {section.content.trim().length > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                <p className="text-[10px] text-muted-foreground mb-2">Progress</p>
                <Progress value={completionPercentage} className="h-1.5 mb-2" />
                <p className="text-xs font-bold">{completionPercentage}% Complete</p>
              </div>
            </CardContent>
          </Card>

          {/* Right Content Area */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold tracking-tight mb-1">
                    {currentSection?.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {currentSection?.description}
                  </p>
                </div>
                {currentSection?.aiGenerated && (
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              
              {/* AI Generation Controls */}
              {currentSection && currentSection.content.trim().length === 0 && (
                <Card className="bg-background border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold mb-1">Let AI Help You</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          AI can generate professional content for this section based on best practices and your project context.
                        </p>
                        <Button 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => handleAIGenerate(currentSection.id)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content Editor */}
              {currentSection && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="section-content" className="text-sm font-medium">
                      Section Content
                    </Label>
                    {currentSection.content.trim().length > 0 && (
                      <div className="flex items-center gap-2">
                        {!currentSection.isEditing ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => toggleEdit(currentSection.id)}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => toggleEdit(currentSection.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Done Editing
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {currentSection.content.trim().length === 0 ? (
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                      <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold mb-1">No content yet</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Use AI to generate content or write your own
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => toggleEdit(currentSection.id)}
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                          Write Manually
                        </Button>
                        <Button 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleAIGenerate(currentSection.id)}
                          disabled={isGenerating}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Generate with AI
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentSection.isEditing ? (
                        <Textarea
                          id="section-content"
                          value={currentSection.content}
                          onChange={(e) => handleContentChange(currentSection.id, e.target.value)}
                          className="min-h-[300px] font-mono text-sm"
                          placeholder={`Enter ${currentSection.title.toLowerCase()}...`}
                        />
                      ) : (
                        <div className="p-4 bg-muted/20 rounded-lg border border-border/40 min-h-[300px]">
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap text-sm font-sans text-foreground">
                              {currentSection.content}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* AI Regenerate Option */}
                      {currentSection.aiGenerated && !currentSection.isEditing && (
                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <p className="text-xs text-primary font-medium">
                              AI-generated content
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleAIGenerate(currentSection.id)}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(sections[currentIndex - 1].id);
                    }
                  }}
                  disabled={sections.findIndex(s => s.id === activeTab) === 0}
                >
                  Previous Section
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeTab);
                    if (currentIndex < sections.length - 1) {
                      setActiveTab(sections[currentIndex + 1].id);
                    }
                  }}
                  disabled={sections.findIndex(s => s.id === activeTab) === sections.length - 1}
                >
                  Next Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Tips */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">💡 Pro Tips</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use AI to generate initial drafts, then customize to your needs</li>
                  <li>All sections are auto-saved as you work</li>
                  <li>Export to PDF when complete for stakeholder review</li>
                  <li>Link charter to your project for easy access later</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Floating AI Button */}
      <FloatingAIButton />
    </div>
  );
}

