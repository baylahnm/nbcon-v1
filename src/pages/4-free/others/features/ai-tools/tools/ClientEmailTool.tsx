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
import { ArrowLeft, Mail, Send, Copy, Download, RefreshCw, Sparkles, CheckCircle, AlertCircle, Clock, User, Building, Calendar, DollarSign, BarChart3, FileText, MessageSquare, Presentation, Bot } from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'progress-update',
    name: 'Progress Update',
    description: 'Weekly project progress update to client',
    subject: 'Project Progress Update - Week {week}',
    content: 'Dear {client_name},\n\nI hope this email finds you well. I am writing to provide you with a comprehensive update on the progress of {project_name}.\n\n**Key Achievements This Week:**\n- {achievement_1}\n- {achievement_2}\n- {achievement_3}\n\n**Current Status:**\n- Overall Progress: {progress_percentage}%\n- Budget Status: {budget_status}\n- Timeline: {timeline_status}\n\n**Next Steps:**\n- {next_step_1}\n- {next_step_2}\n\n**Any Concerns or Questions:**\nPlease feel free to reach out if you have any questions or concerns about the project progress.\n\nBest regards,\n{your_name}',
    category: 'Progress'
  },
  {
    id: 'budget-alert',
    name: 'Budget Alert',
    description: 'Budget variance notification to client',
    subject: 'Budget Alert - {project_name}',
    content: 'Dear {client_name},\n\nI am writing to inform you about a budget variance in the {project_name} project.\n\n**Budget Summary:**\n- Original Budget: {original_budget}\n- Current Expenditure: {current_expenditure}\n- Variance: {variance_amount} ({variance_percentage}%)\n\n**Reason for Variance:**\n{variance_reason}\n\n**Recommended Actions:**\n- {action_1}\n- {action_2}\n\n**Next Steps:**\nWe will continue to monitor the budget closely and keep you informed of any significant changes.\n\nPlease let me know if you would like to discuss this further.\n\nBest regards,\n{your_name}',
    category: 'Budget'
  },
  {
    id: 'milestone-completion',
    name: 'Milestone Completion',
    description: 'Milestone achievement notification',
    subject: 'Milestone Achieved - {milestone_name}',
    content: 'Dear {client_name},\n\nI am pleased to inform you that we have successfully completed the {milestone_name} milestone for the {project_name} project.\n\n**Milestone Details:**\n- Milestone: {milestone_name}\n- Completion Date: {completion_date}\n- Quality Score: {quality_score}\n\n**What This Means:**\n{milestone_impact}\n\n**Next Milestone:**\n- Target: {next_milestone}\n- Expected Date: {next_milestone_date}\n\n**Quality Assurance:**\nAll deliverables have been thoroughly tested and meet the specified requirements.\n\nCongratulations on reaching this important milestone!\n\nBest regards,\n{your_name}',
    category: 'Milestone'
  },
  {
    id: 'issue-resolution',
    name: 'Issue Resolution',
    description: 'Issue resolution update to client',
    subject: 'Issue Resolved - {issue_title}',
    content: 'Dear {client_name},\n\nI am writing to inform you that we have successfully resolved the issue regarding {issue_title} in the {project_name} project.\n\n**Issue Summary:**\n- Issue: {issue_title}\n- Impact: {issue_impact}\n- Resolution Date: {resolution_date}\n\n**Resolution Details:**\n{resolution_details}\n\n**Preventive Measures:**\n- {preventive_measure_1}\n- {preventive_measure_2}\n\n**Project Status:**\nThe project is now back on track and we are confident in meeting the original timeline.\n\nThank you for your patience during the resolution process.\n\nBest regards,\n{your_name}',
    category: 'Issue'
  },
  {
    id: 'change-request',
    name: 'Change Request',
    description: 'Change request notification to client',
    subject: 'Change Request - {project_name}',
    content: 'Dear {client_name},\n\nI am writing to inform you about a change request for the {project_name} project.\n\n**Change Request Details:**\n- Requested By: {requested_by}\n- Change Type: {change_type}\n- Impact: {change_impact}\n\n**Proposed Changes:**\n{proposed_changes}\n\n**Impact Analysis:**\n- Timeline Impact: {timeline_impact}\n- Budget Impact: {budget_impact}\n- Quality Impact: {quality_impact}\n\n**Recommendation:**\n{recommendation}\n\n**Next Steps:**\nPlease review the proposed changes and let us know your decision by {deadline_date}.\n\nBest regards,\n{your_name}',
    category: 'Change'
  }
];

const ClientEmailTool: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useParams<{ project: string }>();
  const { sendMessage } = useAiStore();
  
  // Mock AI response function for now
  const generateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response based on the prompt
    if (prompt.includes('email')) {
      return `Dear ${emailData.clientName || 'Client'},

I hope this email finds you well. I am writing to provide you with a comprehensive update on the progress of ${emailData.projectName || 'your project'}.

**Key Achievements This Week:**
- ${emailData.achievement1 || 'Significant progress made'}
- ${emailData.achievement2 || 'Milestones completed'}
- ${emailData.achievement3 || 'Quality standards maintained'}

**Current Status:**
- Overall Progress: ${emailData.progressPercentage || '75'}%
- Budget Status: ${emailData.budgetStatus || 'On Track'}
- Timeline: ${emailData.timelineStatus || 'On Schedule'}

**Next Steps:**
- ${emailData.nextStep1 || 'Continue with current phase'}
- ${emailData.nextStep2 || 'Prepare for next milestone'}

**Any Concerns or Questions:**
Please feel free to reach out if you have any questions or concerns about the project progress.

Best regards,
${emailData.yourName || 'Project Manager'}`;
    }
    
    return "AI-generated content will be implemented here...";
  };
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailData, setEmailData] = useState({
    clientName: '',
    projectName: '',
    week: '',
    progressPercentage: '',
    budgetStatus: '',
    timelineStatus: '',
    achievement1: '',
    achievement2: '',
    achievement3: '',
    nextStep1: '',
    nextStep2: '',
    yourName: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailSubject, setEmailSubject] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setGeneratedEmail('');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateEmail = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    const template = emailTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional client email based on this template:

Template: ${template.name}
Subject: ${template.subject}
Content: ${template.content}

Fill in the following data:
- Client Name: ${emailData.clientName}
- Project Name: ${emailData.projectName}
- Week: ${emailData.week}
- Progress Percentage: ${emailData.progressPercentage}
- Budget Status: ${emailData.budgetStatus}
- Timeline Status: ${emailData.timelineStatus}
- Achievement 1: ${emailData.achievement1}
- Achievement 2: ${emailData.achievement2}
- Achievement 3: ${emailData.achievement3}
- Next Step 1: ${emailData.nextStep1}
- Next Step 2: ${emailData.nextStep2}
- Your Name: ${emailData.yourName}

Generate a professional, well-structured email that:
1. Uses the template structure but fills in all the provided data
2. Maintains a professional and friendly tone
3. Is clear and concise
4. Includes proper formatting
5. Addresses the client by name
6. Provides all necessary information

Return only the email content, properly formatted.`;

      const response = await generateAIResponse(prompt);
      setGeneratedEmail(response);
      
      // Generate subject line
      const subjectPrompt = `Generate a professional email subject line for this client email:
      
${response}

The subject should be:
- Clear and concise
- Professional
- Relevant to the content
- Under 60 characters

Return only the subject line.`;

      const subjectResponse = await generateAIResponse(subjectPrompt);
      setEmailSubject(subjectResponse);
      
      toast.success('Email generated successfully!');
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };

  const downloadEmail = () => {
    const blob = new Blob([generatedEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client-email-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Email downloaded!');
  };

  const resetForm = () => {
    setSelectedTemplate('');
    setEmailData({
      clientName: '',
      projectName: '',
      week: '',
      progressPercentage: '',
      budgetStatus: '',
      timelineStatus: '',
      achievement1: '',
      achievement2: '',
      achievement3: '',
      nextStep1: '',
      nextStep2: '',
      yourName: ''
    });
    setGeneratedEmail('');
    setEmailSubject('');
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
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Client Update Email Generator
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered personalized client communication
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
            Send Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Email Template
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3 bg-main-bg">
              {emailTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md bg-background ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Data Input */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <User className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Email Data
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-xs">Client Name</Label>
                <Input
                  id="clientName"
                  value={emailData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Enter client name"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-xs">Project Name</Label>
                <Input
                  id="projectName"
                  value={emailData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter project name"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="week" className="text-xs">Week</Label>
                <Input
                  id="week"
                  value={emailData.week}
                  onChange={(e) => handleInputChange('week', e.target.value)}
                  placeholder="Week 1"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progressPercentage" className="text-xs">Progress %</Label>
                <Input
                  id="progressPercentage"
                  value={emailData.progressPercentage}
                  onChange={(e) => handleInputChange('progressPercentage', e.target.value)}
                  placeholder="75%"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yourName" className="text-xs">Your Name</Label>
                <Input
                  id="yourName"
                  value={emailData.yourName}
                  onChange={(e) => handleInputChange('yourName', e.target.value)}
                  placeholder="Your name"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievement1" className="text-xs">Achievement 1</Label>
              <Input
                id="achievement1"
                value={emailData.achievement1}
                onChange={(e) => handleInputChange('achievement1', e.target.value)}
                placeholder="Enter key achievement"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievement2" className="text-xs">Achievement 2</Label>
              <Input
                id="achievement2"
                value={emailData.achievement2}
                onChange={(e) => handleInputChange('achievement2', e.target.value)}
                placeholder="Enter key achievement"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievement3" className="text-xs">Achievement 3</Label>
              <Input
                id="achievement3"
                value={emailData.achievement3}
                onChange={(e) => handleInputChange('achievement3', e.target.value)}
                placeholder="Enter key achievement"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="budgetStatus" className="text-xs">Budget Status</Label>
                <Select
                  value={emailData.budgetStatus}
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
                <Label htmlFor="timelineStatus" className="text-xs">Timeline Status</Label>
                <Select
                  value={emailData.timelineStatus}
                  onValueChange={(value) => handleInputChange('timelineStatus', value)}
                >
                  <SelectTrigger className="h-8 text-xs border border-border bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-schedule">On Schedule</SelectItem>
                    <SelectItem value="ahead-of-schedule">Ahead of Schedule</SelectItem>
                    <SelectItem value="behind-schedule">Behind Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextStep1" className="text-xs">Next Step 1</Label>
              <Input
                id="nextStep1"
                value={emailData.nextStep1}
                onChange={(e) => handleInputChange('nextStep1', e.target.value)}
                placeholder="Enter next step"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextStep2" className="text-xs">Next Step 2</Label>
              <Input
                id="nextStep2"
                value={emailData.nextStep2}
                onChange={(e) => handleInputChange('nextStep2', e.target.value)}
                placeholder="Enter next step"
                className="h-8 text-xs"
              />
            </div>

            <Button
              onClick={generateEmail}
              disabled={!selectedTemplate || isGenerating}
              className="w-full h-8 text-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Email */}
      {generatedEmail && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Generated Email
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
                  onClick={downloadEmail}
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
              <Label className="text-xs font-semibold">Subject Line</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="h-8 text-xs"
                placeholder="Email subject line"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Email Content</Label>
              <Textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                className="min-h-[300px] text-xs"
                placeholder="Generated email content will appear here..."
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
                onClick={generateEmail}
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

export default ClientEmailTool;
