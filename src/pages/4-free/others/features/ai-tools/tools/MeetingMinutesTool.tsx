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
import { ArrowLeft, ClipboardList, Download, Copy, RefreshCw, Sparkles, CheckCircle, AlertCircle, Clock, User, Building, Calendar, DollarSign, BarChart3, FileText, MessageSquare, Presentation, Bot, Users, Mic, Video, Phone } from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface MeetingParticipant {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
}

interface MeetingData {
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingDuration: string;
  meetingType: string;
  location: string;
  projectName: string;
  meetingPurpose: string;
  agendaItems: string;
  keyDecisions: string;
  actionItems: string;
  nextMeeting: string;
  notes: string;
  attachments: string;
}

const meetingTypes = [
  { value: 'project-kickoff', label: 'Project Kickoff' },
  { value: 'progress-review', label: 'Progress Review' },
  { value: 'stakeholder-meeting', label: 'Stakeholder Meeting' },
  { value: 'technical-review', label: 'Technical Review' },
  { value: 'budget-review', label: 'Budget Review' },
  { value: 'risk-assessment', label: 'Risk Assessment' },
  { value: 'quality-review', label: 'Quality Review' },
  { value: 'safety-meeting', label: 'Safety Meeting' },
  { value: 'change-order', label: 'Change Order' },
  { value: 'closeout-meeting', label: 'Closeout Meeting' }
];

const MeetingMinutesTool: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useParams<{ project: string }>();
  const { sendMessage } = useAiStore();
  
  // Mock AI response function for now
  const generateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response based on the prompt
    if (prompt.includes('meeting minutes')) {
      return `# Meeting Minutes

**Meeting Title**: ${meetingData.meetingTitle || 'Project Meeting'}
**Date**: ${meetingData.meetingDate || new Date().toISOString().split('T')[0]}
**Time**: ${meetingData.meetingTime || '10:00 AM - 11:00 AM'}
**Location**: ${meetingData.location || 'Conference Room'}

## Attendees
${participants.map(p => `- ${p.name} (${p.role})`).join('\n') || '- Project Manager\n- Team Lead\n- Client Representative'}

## Agenda Items
1. Project Status Update
2. Budget Review
3. Timeline Discussion
4. Risk Assessment
5. Next Steps

## Discussion Points
- Project is progressing according to schedule
- Budget remains within allocated limits
- No major risks identified
- Next milestone scheduled for next week

## Decisions Made
- Approved current project direction
- Confirmed budget allocation
- Agreed on timeline adjustments

## Action Items
| Task | Assigned To | Due Date | Status |
|------|-------------|----------|--------|
| Complete Phase 1 | Team Lead | Next Friday | In Progress |
| Review Budget | Project Manager | Tomorrow | Pending |
| Update Timeline | Project Manager | This Week | Pending |

## Next Meeting
- **Date**: [Next meeting date]
- **Time**: [Next meeting time]
- **Agenda**: [Next meeting agenda items]

---
Minutes prepared by: ${meetingData.meetingTitle || 'Meeting Secretary'}
Date: ${new Date().toISOString().split('T')[0]}`;
    }
    
    return "AI-generated content will be implemented here...";
  };
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [meetingData, setMeetingData] = useState<MeetingData>({
    meetingTitle: '',
    meetingDate: '',
    meetingTime: '',
    meetingDuration: '',
    meetingType: '',
    location: '',
    projectName: '',
    meetingPurpose: '',
    agendaItems: '',
    keyDecisions: '',
    actionItems: '',
    nextMeeting: '',
    notes: '',
    attachments: ''
  });
  const [generatedMinutes, setGeneratedMinutes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newParticipant, setNewParticipant] = useState<MeetingParticipant>({
    id: '',
    name: '',
    role: '',
    organization: '',
    email: ''
  });

  const handleInputChange = (field: keyof MeetingData, value: string) => {
    setMeetingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.role) {
      const participant: MeetingParticipant = {
        ...newParticipant,
        id: Date.now().toString()
      };
      setParticipants(prev => [...prev, participant]);
      setNewParticipant({
        id: '',
        name: '',
        role: '',
        organization: '',
        email: ''
      });
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const generateMinutes = async () => {
    if (!meetingData.meetingTitle || !meetingData.meetingDate) {
      toast.error('Please fill in required meeting information');
      return;
    }

    setIsGenerating(true);
    try {
      const participantsList = participants.map(p => 
        `${p.name} (${p.role})${p.organization ? ` - ${p.organization}` : ''}`
      ).join(', ');

      const prompt = `Generate comprehensive meeting minutes for a construction project meeting with the following details:

Meeting Information:
- Title: ${meetingData.meetingTitle}
- Date: ${meetingData.meetingDate}
- Time: ${meetingData.meetingTime}
- Duration: ${meetingData.meetingDuration}
- Type: ${meetingData.meetingType}
- Location: ${meetingData.location}
- Project: ${meetingData.projectName}

Meeting Purpose: ${meetingData.meetingPurpose}

Participants: ${participantsList || 'Not specified'}

Agenda Items: ${meetingData.agendaItems}

Key Decisions: ${meetingData.keyDecisions}

Action Items: ${meetingData.actionItems}

Next Meeting: ${meetingData.nextMeeting}

Additional Notes: ${meetingData.notes}

Attachments: ${meetingData.attachments}

Generate professional meeting minutes that include:
1. Meeting header with title, date, time, location, and participants
2. Meeting purpose and objectives
3. Detailed agenda items with discussion points
4. Key decisions made during the meeting
5. Action items with assigned responsibilities and due dates
6. Next steps and follow-up actions
7. Next meeting information
8. Attachments and references
9. Meeting conclusion and adjournment

The minutes should be:
- Professional and well-structured
- Clear and concise
- Include all key information
- Follow standard meeting minutes format
- Suitable for distribution to all participants
- Include proper formatting and organization

Return only the meeting minutes content, properly formatted with clear section headers.`;

      const response = await generateAIResponse(prompt);
      setGeneratedMinutes(response);
      toast.success('Meeting minutes generated successfully!');
    } catch (error) {
      console.error('Error generating minutes:', error);
      toast.error('Failed to generate minutes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMinutes);
    toast.success('Minutes copied to clipboard!');
  };

  const downloadMinutes = () => {
    const blob = new Blob([generatedMinutes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-minutes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Minutes downloaded!');
  };

  const resetForm = () => {
    setParticipants([]);
    setMeetingData({
      meetingTitle: '',
      meetingDate: '',
      meetingTime: '',
      meetingDuration: '',
      meetingType: '',
      location: '',
      projectName: '',
      meetingPurpose: '',
      agendaItems: '',
      keyDecisions: '',
      actionItems: '',
      nextMeeting: '',
      notes: '',
      attachments: ''
    });
    setGeneratedMinutes('');
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
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Meeting Minutes Template
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-generated meeting documentation and action items
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button className="h-8 text-xs">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Information */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Meeting Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="meetingTitle" className="text-xs">Meeting Title *</Label>
                <Input
                  id="meetingTitle"
                  value={meetingData.meetingTitle}
                  onChange={(e) => handleInputChange('meetingTitle', e.target.value)}
                  placeholder="Enter meeting title"
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="meetingDate" className="text-xs">Date *</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={meetingData.meetingDate}
                    onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTime" className="text-xs">Time</Label>
                  <Input
                    id="meetingTime"
                    type="time"
                    value={meetingData.meetingTime}
                    onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="meetingDuration" className="text-xs">Duration</Label>
                  <Input
                    id="meetingDuration"
                    value={meetingData.meetingDuration}
                    onChange={(e) => handleInputChange('meetingDuration', e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingType" className="text-xs">Meeting Type</Label>
                  <Select
                    value={meetingData.meetingType}
                    onValueChange={(value) => handleInputChange('meetingType', value)}
                  >
                    <SelectTrigger className="h-8 text-xs border border-border bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  value={meetingData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Meeting location or platform"
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-xs">Project Name</Label>
                <Input
                  id="projectName"
                  value={meetingData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Related project name"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Participants
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Add Participant */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="participantName" className="text-xs">Name *</Label>
                  <Input
                    id="participantName"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Participant name"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participantRole" className="text-xs">Role *</Label>
                  <Input
                    id="participantRole"
                    value={newParticipant.role}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Project Manager"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="participantOrg" className="text-xs">Organization</Label>
                  <Input
                    id="participantOrg"
                    value={newParticipant.organization}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Company name"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participantEmail" className="text-xs">Email</Label>
                  <Input
                    id="participantEmail"
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <Button
                onClick={addParticipant}
                disabled={!newParticipant.name || !newParticipant.role}
                className="w-full h-8 text-xs"
              >
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Add Participant
              </Button>
            </div>

            {/* Participants List */}
            {participants.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Meeting Participants</Label>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-background border border-border rounded-lg">
                      <div>
                        <p className="text-xs font-medium">{participant.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {participant.role}{participant.organization && ` - ${participant.organization}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(participant.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meeting Content */}
      <Card className="border-border/50">
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold tracking-tight">
              Meeting Content
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="meetingPurpose" className="text-xs">Meeting Purpose</Label>
                <Textarea
                  id="meetingPurpose"
                  value={meetingData.meetingPurpose}
                  onChange={(e) => handleInputChange('meetingPurpose', e.target.value)}
                  placeholder="Describe the purpose and objectives of the meeting"
                  className="min-h-[80px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agendaItems" className="text-xs">Agenda Items</Label>
                <Textarea
                  id="agendaItems"
                  value={meetingData.agendaItems}
                  onChange={(e) => handleInputChange('agendaItems', e.target.value)}
                  placeholder="List the main agenda items and discussion points"
                  className="min-h-[80px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyDecisions" className="text-xs">Key Decisions</Label>
                <Textarea
                  id="keyDecisions"
                  value={meetingData.keyDecisions}
                  onChange={(e) => handleInputChange('keyDecisions', e.target.value)}
                  placeholder="Record important decisions made during the meeting"
                  className="min-h-[80px] text-xs"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="actionItems" className="text-xs">Action Items</Label>
                <Textarea
                  id="actionItems"
                  value={meetingData.actionItems}
                  onChange={(e) => handleInputChange('actionItems', e.target.value)}
                  placeholder="List action items with assigned responsibilities and due dates"
                  className="min-h-[80px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextMeeting" className="text-xs">Next Meeting</Label>
                <Textarea
                  id="nextMeeting"
                  value={meetingData.nextMeeting}
                  onChange={(e) => handleInputChange('nextMeeting', e.target.value)}
                  placeholder="Information about the next meeting"
                  className="min-h-[80px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={meetingData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes or observations"
                  className="min-h-[80px] text-xs"
                />
              </div>
            </div>
          </div>
          
          <Button
            onClick={generateMinutes}
            disabled={!meetingData.meetingTitle || !meetingData.meetingDate || isGenerating}
            className="w-full h-8 text-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Generating Minutes...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Generate Meeting Minutes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Minutes */}
      {generatedMinutes && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <ClipboardList className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Generated Meeting Minutes
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
                  onClick={downloadMinutes}
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
              <Label className="text-xs font-semibold">Meeting Minutes Content</Label>
              <Textarea
                value={generatedMinutes}
                onChange={(e) => setGeneratedMinutes(e.target.value)}
                className="min-h-[400px] text-xs"
                placeholder="Generated meeting minutes will appear here..."
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
                onClick={generateMinutes}
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

export default MeetingMinutesTool;
