import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  Calendar,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  FileText,
  Video,
  Phone,
  MapPin,
  User,
  MessageSquare,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'emergency' | 'client' | 'subcontractor';
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  meetingType: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  organizer: string;
  attendees: string[];
  agenda: string[];
  objectives: string[];
  followUps: string[];
  notes: string;
  attachments: string[];
}

export default function MeetingPlannerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // Sample meetings
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Daily Site Coordination Meeting',
      type: 'daily',
      date: '2025-01-20',
      time: '08:00',
      duration: 30,
      location: 'Site Office',
      meetingType: 'in-person',
      status: 'scheduled',
      organizer: 'Ahmed Al-Rashid',
      attendees: ['Site Supervisor', 'Safety Officer', 'Foreman', 'Quality Inspector'],
      agenda: [
        'Safety briefing',
        'Previous day progress review',
        'Today\'s work plan',
        'Resource requirements',
        'Weather conditions',
        'Safety concerns'
      ],
      objectives: [
        'Ensure daily coordination',
        'Address safety issues',
        'Plan resource allocation'
      ],
      followUps: [
        'Review safety checklist',
        'Update progress report',
        'Schedule equipment maintenance'
      ],
      notes: 'Regular daily coordination meeting to ensure smooth operations.',
      attachments: ['safety-checklist.pdf', 'progress-report.xlsx']
    },
    {
      id: '2',
      title: 'Weekly Progress Review',
      type: 'weekly',
      date: '2025-01-22',
      time: '14:00',
      duration: 60,
      location: 'Project Office',
      meetingType: 'video',
      status: 'scheduled',
      organizer: 'Project Manager',
      attendees: ['Client Representative', 'Architect', 'Engineer', 'Contractor'],
      agenda: [
        'Weekly progress summary',
        'Schedule review',
        'Budget status',
        'Quality issues',
        'Upcoming milestones',
        'Risk assessment'
      ],
      objectives: [
        'Review project progress',
        'Address client concerns',
        'Plan next week activities'
      ],
      followUps: [
        'Send progress report to client',
        'Update project schedule',
        'Address quality issues'
      ],
      notes: 'Weekly client meeting to review progress and address concerns.',
      attachments: ['progress-report.pdf', 'schedule-update.xlsx']
    },
    {
      id: '3',
      title: 'Emergency Safety Meeting',
      type: 'emergency',
      date: '2025-01-18',
      time: '10:30',
      duration: 45,
      location: 'Site Office',
      meetingType: 'in-person',
      status: 'completed',
      organizer: 'Safety Officer',
      attendees: ['All Site Personnel', 'Site Supervisor', 'Foreman'],
      agenda: [
        'Safety incident review',
        'Corrective actions',
        'Prevention measures',
        'Safety protocol updates'
      ],
      objectives: [
        'Address safety incident',
        'Implement corrective measures',
        'Prevent future occurrences'
      ],
      followUps: [
        'Implement safety measures',
        'Conduct safety training',
        'Update safety protocols'
      ],
      notes: 'Emergency meeting called due to safety incident. All personnel attended.',
      attachments: ['incident-report.pdf', 'safety-protocols.pdf']
    }
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive meeting agenda and coordination plan for a construction project. Project ID: ${projectId || 'N/A'}. Include daily, weekly, and monthly meeting templates with agendas, objectives, and follow-up actions. Focus on Saudi construction projects with realistic meeting structures, safety protocols, and coordination requirements.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated meeting templates and agendas. Review recommendations below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate meeting plan. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIScheduleOptimization = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Optimize meeting scheduling for a construction project. Project ID: ${projectId || 'N/A'}. Analyze participant availability, time zones, project phases, and suggest optimal meeting times. Include conflict resolution, recurring meeting patterns, and Saudi working hours (Sunday-Thursday, 8 AM - 5 PM). Provide smart scheduling recommendations.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has optimized meeting schedules and provided smart recommendations.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI scheduling failed:', error);
      toast.error("Could not optimize scheduling. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIAgendaGeneration = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate intelligent meeting agendas for construction project meetings. Project ID: ${projectId || 'N/A'}. Create dynamic agendas based on project phase, recent issues, upcoming milestones, and participant roles. Include time allocations, discussion topics, decision points, and follow-up actions. Focus on Saudi construction project management best practices.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated intelligent meeting agendas with time allocations.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI agenda generation failed:', error);
      toast.error("Could not generate agendas. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIAttendancePrediction = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Predict meeting attendance and participation patterns for a construction project. Project ID: ${projectId || 'N/A'}. Analyze historical attendance data, meeting types, participant roles, and project urgency. Provide attendance predictions, participation insights, and recommendations for improving meeting effectiveness. Include Saudi cultural considerations for meeting participation.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has analyzed attendance patterns and provided participation insights.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI attendance prediction failed:', error);
      toast.error("Could not predict attendance. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your meeting data has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your meeting report is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'weekly':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'monthly':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'emergency':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'client':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'subcontractor':
        return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="h-3.5 w-3.5" />;
      case 'video':
        return <Video className="h-3.5 w-3.5" />;
      case 'phone':
        return <Phone className="h-3.5 w-3.5" />;
      default:
        return <Calendar className="h-3.5 w-3.5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-3.5 w-3.5" />;
      case 'in-progress':
        return <AlertCircle className="h-3.5 w-3.5" />;
      case 'completed':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <Calendar className="h-3.5 w-3.5" />;
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length;
  const completedMeetings = meetings.filter(m => m.status === 'completed').length;
  const totalAttendees = meetings.reduce((sum, m) => sum + m.attendees.length, 0);
  const averageDuration = meetings.reduce((sum, m) => sum + m.duration, 0) / meetings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/execution')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Meeting Planner</h1>
              <p className="text-xs text-muted-foreground">
                Coordinate meetings with AI-powered agenda generation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Meetings
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{meetings.length}</div>
              <div className="text-xs text-muted-foreground">Total Meetings</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcomingMeetings}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedMeetings}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{averageDuration.toFixed(0)}m</div>
              <div className="text-xs text-muted-foreground">Avg Duration</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - AI Actions & Templates */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Actions */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  className="w-full h-8 text-xs shadow-md"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Generate Agenda
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIScheduleOptimization}
                  disabled={isGenerating}
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Optimize Schedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIAgendaGeneration}
                  disabled={isGenerating}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Smart Agendas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIAttendancePrediction}
                  disabled={isGenerating}
                >
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Predict Attendance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Meeting Templates */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Templates</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Daily Standup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Weekly Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                  Emergency Meeting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  Client Meeting
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Meeting Frequency</span>
                  </div>
                  <p className="text-[10px] text-blue-600/80 leading-relaxed">
                    Optimal meeting frequency: Daily standups, weekly reviews, monthly planning.
                  </p>
                </div>

                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Attendance Rate</span>
                  </div>
                  <p className="text-[10px] text-green-600/80 leading-relaxed">
                    95% attendance rate indicates good meeting coordination.
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Duration Optimization</span>
                  </div>
                  <p className="text-[10px] text-amber-600/80 leading-relaxed">
                    Average meeting duration is optimal. Consider shorter daily standups.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Participation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Attendees</div>
                  <div className="text-xl font-bold text-primary">{totalAttendees}</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Avg per Meeting</div>
                  <div className="text-xl font-bold text-blue-600">
                    {meetings.length > 0 ? (totalAttendees / meetings.length).toFixed(1) : 0}
                  </div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Meeting Types</div>
                  <div className="text-xl font-bold text-green-600">{new Set(meetings.map(m => m.type)).size}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Meetings List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Meetings Schedule
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {meetings.length} meetings • {upcomingMeetings} upcoming • {completedMeetings} completed
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowNewForm(!showNewForm)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    New Meeting
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold">{meeting.title}</h3>
                          <Badge className={`text-[9px] ${getStatusColor(meeting.status)}`}>
                            {getStatusIcon(meeting.status)}
                            <span className="ml-1">
                              {meeting.status === 'scheduled' ? 'Scheduled' :
                               meeting.status === 'in-progress' ? 'In Progress' :
                               meeting.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </Badge>
                          <Badge className={`text-[9px] ${getTypeColor(meeting.type)}`}>
                            {meeting.type === 'daily' ? 'Daily' :
                             meeting.type === 'weekly' ? 'Weekly' :
                             meeting.type === 'monthly' ? 'Monthly' :
                             meeting.type === 'emergency' ? 'Emergency' :
                             meeting.type === 'client' ? 'Client' : 'Subcontractor'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{meeting.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{meeting.time} ({meeting.duration}m)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getMeetingTypeIcon(meeting.meetingType)}
                            <span>{meeting.location}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Organizer:</strong> {meeting.organizer} • <strong>Attendees:</strong> {meeting.attendees.length}
                        </div>
                      </div>
                    </div>
                    
                    {/* Agenda */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Agenda:</div>
                      <div className="space-y-1">
                        {meeting.agenda.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {item}
                          </div>
                        ))}
                        {meeting.agenda.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{meeting.agenda.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Objectives:</div>
                      <div className="space-y-1">
                        {meeting.objectives.map((objective, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Follow-ups */}
                    {meeting.followUps.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Follow-ups:</div>
                        <div className="space-y-1">
                          {meeting.followUps.map((followUp, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-blue-600" />
                              {followUp}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {meeting.notes && (
                      <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground mb-2">
                        <strong>Notes:</strong> {meeting.notes}
                      </div>
                    )}

                    {meeting.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Attachments:</span>
                        {meeting.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-[9px]">
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
