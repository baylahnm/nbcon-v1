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
import { ArrowLeft, BarChart3, Download, Copy, RefreshCw, Sparkles, CheckCircle, AlertCircle, Clock, User, Building, Calendar, DollarSign, FileText, MessageSquare, Presentation, Bot, TrendingUp, Target, Zap } from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface ReportSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface ReportData {
  projectName: string;
  reportPeriod: string;
  reportDate: string;
  projectManager: string;
  clientName: string;
  overallProgress: string;
  budgetStatus: string;
  timelineStatus: string;
  keyAchievements: string;
  challenges: string;
  nextSteps: string;
  risks: string;
  qualityMetrics: string;
  teamPerformance: string;
  stakeholderFeedback: string;
}

const reportSections: ReportSection[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    description: 'High-level project overview and key metrics',
    required: true
  },
  {
    id: 'progress-overview',
    title: 'Progress Overview',
    description: 'Detailed progress tracking and milestones',
    required: true
  },
  {
    id: 'budget-analysis',
    title: 'Budget Analysis',
    description: 'Financial performance and cost tracking',
    required: true
  },
  {
    id: 'timeline-status',
    title: 'Timeline Status',
    description: 'Schedule adherence and timeline updates',
    required: true
  },
  {
    id: 'quality-metrics',
    title: 'Quality Metrics',
    description: 'Quality assurance and performance indicators',
    required: false
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Risk identification and mitigation strategies',
    required: false
  },
  {
    id: 'team-performance',
    title: 'Team Performance',
    description: 'Team productivity and resource utilization',
    required: false
  },
  {
    id: 'stakeholder-communication',
    title: 'Stakeholder Communication',
    description: 'Communication updates and feedback',
    required: false
  }
];

const ProgressReportTool: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useParams<{ project: string }>();
  const { sendMessage } = useAiStore();
  
  // Mock AI response function for now
  const generateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response based on the prompt
    if (prompt.includes('progress report')) {
      return `# Progress Report - ${reportData.projectName || 'Project'}

## Executive Summary
This report covers the progress made during ${reportData.reportPeriod || 'the reporting period'} for ${reportData.projectName || 'the project'}. Overall progress stands at ${reportData.overallProgress || '75'}% completion.

## Progress Overview
- **Current Status**: ${reportData.budgetStatus || 'On Track'} budget, ${reportData.timelineStatus || 'On Schedule'} timeline
- **Key Achievements**: ${reportData.keyAchievements || 'Significant milestones completed'}
- **Challenges**: ${reportData.challenges || 'Minor obstacles encountered and resolved'}

## Budget Analysis
The project budget remains ${reportData.budgetStatus || 'on track'} with no significant variances reported.

## Timeline Status
Project timeline is ${reportData.timelineStatus || 'on schedule'} with all major milestones being met as planned.

## Next Steps
${reportData.nextSteps || 'Continue with current phase and prepare for next milestone'}

## Recommendations
- Maintain current progress pace
- Monitor budget and timeline closely
- Address any emerging challenges promptly

---
Report prepared by: ${reportData.projectManager || 'Project Manager'}
Date: ${reportData.reportDate || new Date().toISOString().split('T')[0]}`;
    }
    
    return "AI-generated content will be implemented here...";
  };
  const [selectedSections, setSelectedSections] = useState<string[]>(['executive-summary', 'progress-overview', 'budget-analysis', 'timeline-status']);
  const [reportData, setReportData] = useState<ReportData>({
    projectName: '',
    reportPeriod: '',
    reportDate: '',
    projectManager: '',
    clientName: '',
    overallProgress: '',
    budgetStatus: '',
    timelineStatus: '',
    keyAchievements: '',
    challenges: '',
    nextSteps: '',
    risks: '',
    qualityMetrics: '',
    teamPerformance: '',
    stakeholderFeedback: ''
  });
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleInputChange = (field: keyof ReportData, value: string) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = async () => {
    if (selectedSections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedSectionTitles = selectedSections.map(id => 
        reportSections.find(s => s.id === id)?.title
      ).filter(Boolean);

      const prompt = `Generate a comprehensive progress report for a construction project with the following details:

Project Information:
- Project Name: ${reportData.projectName}
- Report Period: ${reportData.reportPeriod}
- Report Date: ${reportData.reportDate}
- Project Manager: ${reportData.projectManager}
- Client Name: ${reportData.clientName}

Project Status:
- Overall Progress: ${reportData.overallProgress}
- Budget Status: ${reportData.budgetStatus}
- Timeline Status: ${reportData.timelineStatus}

Key Information:
- Key Achievements: ${reportData.keyAchievements}
- Challenges: ${reportData.challenges}
- Next Steps: ${reportData.nextSteps}
- Risks: ${reportData.risks}
- Quality Metrics: ${reportData.qualityMetrics}
- Team Performance: ${reportData.teamPerformance}
- Stakeholder Feedback: ${reportData.stakeholderFeedback}

Required Sections: ${selectedSectionTitles.join(', ')}

Generate a professional, well-structured progress report that includes:
1. Executive Summary with key highlights
2. Detailed progress analysis with specific metrics
3. Budget performance with variance analysis
4. Timeline adherence with milestone tracking
5. Quality assurance metrics and performance indicators
6. Risk assessment with mitigation strategies
7. Team performance and resource utilization
8. Stakeholder communication and feedback
9. Recommendations for next period
10. Action items and next steps

The report should be:
- Professional and comprehensive
- Data-driven with specific metrics
- Clear and actionable
- Suitable for client presentation
- Include visual data representation suggestions
- Follow construction industry standards

Return only the report content, properly formatted with clear section headers.`;

      const response = await generateAIResponse(prompt);
      setGeneratedReport(response);
      toast.success('Progress report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport);
    toast.success('Report copied to clipboard!');
  };

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  const resetForm = () => {
    setSelectedSections(['executive-summary', 'progress-overview', 'budget-analysis', 'timeline-status']);
    setReportData({
      projectName: '',
      reportPeriod: '',
      reportDate: '',
      projectManager: '',
      clientName: '',
      overallProgress: '',
      budgetStatus: '',
      timelineStatus: '',
      keyAchievements: '',
      challenges: '',
      nextSteps: '',
      risks: '',
      qualityMetrics: '',
      teamPerformance: '',
      stakeholderFeedback: ''
    });
    setGeneratedReport('');
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
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Progress Report Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered automated progress reports with insights
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button className="h-8 text-xs">
            <Presentation className="h-3.5 w-3.5 mr-1.5" />
            Present
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Report Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Project Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Project Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-xs">Project Name</Label>
                  <Input
                    id="projectName"
                    value={reportData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Enter project name"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportPeriod" className="text-xs">Report Period</Label>
                  <Input
                    id="reportPeriod"
                    value={reportData.reportPeriod}
                    onChange={(e) => handleInputChange('reportPeriod', e.target.value)}
                    placeholder="e.g., Week 1-4"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reportDate" className="text-xs">Report Date</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    value={reportData.reportDate}
                    onChange={(e) => handleInputChange('reportDate', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectManager" className="text-xs">Project Manager</Label>
                  <Input
                    id="projectManager"
                    value={reportData.projectManager}
                    onChange={(e) => handleInputChange('projectManager', e.target.value)}
                    placeholder="Your name"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-xs">Client Name</Label>
                <Input
                  id="clientName"
                  value={reportData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Client company name"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Project Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Project Status</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="overallProgress" className="text-xs">Progress %</Label>
                  <Input
                    id="overallProgress"
                    value={reportData.overallProgress}
                    onChange={(e) => handleInputChange('overallProgress', e.target.value)}
                    placeholder="75%"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetStatus" className="text-xs">Budget</Label>
                  <Select
                    value={reportData.budgetStatus}
                    onValueChange={(value) => handleInputChange('budgetStatus', value)}
                  >
                    <SelectTrigger className="h-8 text-xs border border-border bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="over-budget">Over Budget</SelectItem>
                      <SelectItem value="under-budget">Under Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timelineStatus" className="text-xs">Timeline</Label>
                  <Select
                    value={reportData.timelineStatus}
                    onValueChange={(value) => handleInputChange('timelineStatus', value)}
                  >
                    <SelectTrigger className="h-8 text-xs border border-border bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-schedule">On Schedule</SelectItem>
                      <SelectItem value="ahead">Ahead</SelectItem>
                      <SelectItem value="behind">Behind</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Key Information</h3>
              <div className="space-y-2">
                <Label htmlFor="keyAchievements" className="text-xs">Key Achievements</Label>
                <Textarea
                  id="keyAchievements"
                  value={reportData.keyAchievements}
                  onChange={(e) => handleInputChange('keyAchievements', e.target.value)}
                  placeholder="List major accomplishments this period"
                  className="min-h-[60px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges" className="text-xs">Challenges</Label>
                <Textarea
                  id="challenges"
                  value={reportData.challenges}
                  onChange={(e) => handleInputChange('challenges', e.target.value)}
                  placeholder="Describe any challenges faced"
                  className="min-h-[60px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextSteps" className="text-xs">Next Steps</Label>
                <Textarea
                  id="nextSteps"
                  value={reportData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  placeholder="Outline upcoming activities"
                  className="min-h-[60px] text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Sections */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Report Sections
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              {reportSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedSections.includes(section.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSectionToggle(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 border-2 rounded ${
                        selectedSections.includes(section.id)
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedSections.includes(section.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{section.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    {section.required && (
                      <Badge variant="outline" className="text-[9px]">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={generateReport}
              disabled={selectedSections.length === 0 || isGenerating}
              className="w-full h-8 text-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Report */}
      {generatedReport && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Generated Progress Report
                </CardTitle>
              </div>
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
                  onClick={downloadReport}
                  className="h-8 text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Report Content</Label>
              <Textarea
                value={generatedReport}
                onChange={(e) => setGeneratedReport(e.target.value)}
                className="min-h-[400px] text-xs"
                placeholder="Generated report content will appear here..."
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
                onClick={generateReport}
                className="h-8 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressReportTool;
