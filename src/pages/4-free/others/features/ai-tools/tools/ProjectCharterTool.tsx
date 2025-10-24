import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { 
  FileText, 
  Sparkles, 
  Save,
  Download, 
  ChevronLeft,
  Target,
  CheckCircle2,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useCharterStore } from '../stores/useCharterStore';

export default function ProjectCharterTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get selected project from unified store
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Get charter sections from charter store
  const { 
    sections, 
    loadSections, 
    updateSection, 
    toggleComplete,
    isLoading, 
    getCompletionPercentage 
  } = useCharterStore();

  const [activeTab, setActiveTab] = useState<string>('0');
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});

  // Load charter sections when project selected
  useEffect(() => {
    if (project?.id) {
      loadSections(project.id);
    }
  }, [project?.id, loadSections]);

  // Empty state when no project selected
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/free/ai-tools/planning')}
            className="mb-4 h-8 text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Planning Hub
          </Button>
          
          <Card className="border-border/50 mt-8">
            <CardContent className="p-12 text-center">
              <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please select or create a project to use the Charter Generator
              </p>
              <Button onClick={() => navigate('/free/ai-tools/planning')}>
                <Layers className="h-4 w-4 mr-2" />
                Select Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle content changes (local editing state)
  const handleContentChange = (sectionId: string, content: string) => {
    setEditingContent(prev => ({ ...prev, [sectionId]: content }));
  };

  // Save section content to database
  const handleSaveSection = async (sectionId: string) => {
    const content = editingContent[sectionId];
    if (content === undefined) return;

    try {
      await updateSection(sectionId, content);
      toast({
        title: 'Saved',
        description: 'Section updated successfully'
      });
      
      // Clear editing state
      setEditingContent(prev => {
        const { [sectionId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save section',
        variant: 'destructive'
      });
    }
  };

  // Handle section complete toggle
  const handleToggleComplete = async (sectionId: string) => {
    try {
      await toggleComplete(sectionId);
      toast({
        description: 'Status updated'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const completionPercentage = getCompletionPercentage();
  const currentSection = sections[parseInt(activeTab)] || sections[0];

  // Export to PDF
  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Generating PDF export...'
    });
    // TODO: Implement PDF generation
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
                {project.name} - Charter
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
                    {sections.filter(s => s.is_completed).length} of {sections.length} sections completed
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

        {/* Main Content - Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          
          {/* Left Sidebar - Section Navigation */}
          <Card className="border-border/50 h-fit sticky top-6">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight">Charter Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
              
              {/* Sections List */}
              {!isLoading && (
                <div className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(index.toString())}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeTab === index.toString()
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold mb-1 ${
                            activeTab === index.toString() ? 'text-primary' : ''
                          }`}>
                            {section.section_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {section.section_description}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {section.is_completed ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

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
                    {currentSection?.section_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {currentSection?.section_description}
                  </p>
                </div>
                {currentSection?.ai_generated && (
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Content Editor */}
              {currentSection && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Section Content</span>
                    <div className="flex items-center gap-2">
                      {(editingContent[currentSection.id] !== undefined && 
                        editingContent[currentSection.id] !== currentSection.content) && (
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleSaveSection(currentSection.id)}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Changes
                        </Button>
                      )}
                      {currentSection.content && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleToggleComplete(currentSection.id)}
                        >
                          {currentSection.is_completed ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                              Completed
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Mark Complete
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <Textarea
                    id="section-content"
                    value={editingContent[currentSection.id] ?? currentSection.content ?? ''}
                    onChange={(e) => handleContentChange(currentSection.id, e.target.value)}
                    onBlur={() => {
                      // Auto-save on blur if content changed
                      const content = editingContent[currentSection.id];
                      if (content !== undefined && content !== currentSection.content) {
                        handleSaveSection(currentSection.id);
                      }
                    }}
                    placeholder={`Enter content for ${currentSection.section_name}...\n\nTip: You can use AI to generate professional content or write your own.`}
                    className="min-h-[400px] font-sans text-sm resize-y"
                  />

                  {/* Helper Text */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Changes are auto-saved when you click outside the text area</span>
                    <span>{(editingContent[currentSection.id] ?? currentSection.content ?? '').length} characters</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    const currentIndex = parseInt(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab((currentIndex - 1).toString());
                    }
                  }}
                  disabled={parseInt(activeTab) === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1.5" />
                  Previous Section
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    const currentIndex = parseInt(activeTab);
                    if (currentIndex < sections.length - 1) {
                      setActiveTab((currentIndex + 1).toString());
                    }
                  }}
                  disabled={parseInt(activeTab) === sections.length - 1}
                >
                  Next Section
                  <ChevronLeft className="h-3.5 w-3.5 ml-1.5 rotate-180" />
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
                  <li>All changes are auto-saved when you click outside the text area</li>
                  <li>Mark sections as complete to track your progress</li>
                  <li>Export to PDF when ready for stakeholder review</li>
                  <li>Use descriptive, professional language for formal documentation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
