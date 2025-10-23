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
import { ArrowLeft, FileText, Download, Copy, RefreshCw, Sparkles, CheckCircle, AlertCircle, Clock, User, Building, Calendar, DollarSign, BarChart3, MessageSquare, Presentation, Bot, Plus, Trash2, Edit, Eye, Send, Archive } from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface RFI {
  id: string;
  rfiNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'in-review' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  assignedTo: string;
  response: string;
  attachments: string[];
  projectName: string;
  relatedDocuments: string[];
}

interface RFIData {
  rfiNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  assignedTo: string;
  projectName: string;
  relatedDocuments: string;
  attachments: string;
  response: string;
}

const rfiCategories = [
  'Design Clarification',
  'Material Specification',
  'Construction Method',
  'Code Compliance',
  'Safety Requirements',
  'Quality Standards',
  'Schedule Impact',
  'Cost Impact',
  'Environmental',
  'Other'
];

const rfiPriorities = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

const rfiStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-review', label: 'In Review', color: 'bg-blue-100 text-blue-800' },
  { value: 'answered', label: 'Answered', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-purple-100 text-purple-800' }
];

const RFIManagerTool: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useParams<{ project: string }>();
  const { sendMessage } = useAiStore();
  
  // Mock AI response function for now
  const generateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response based on the prompt
    if (prompt.includes('RFI response')) {
      return `# RFI Response - ${selectedRfi?.rfiNumber || 'RFI-001'}

## Response Details
**RFI Title**: ${selectedRfi?.title || 'Request for Information'}
**Response Date**: ${new Date().toISOString().split('T')[0]}
**Responded By**: ${selectedRfi?.assignedTo || 'Project Team'}

## Response Content

Thank you for your Request for Information regarding ${selectedRfi?.title || 'the project matter'}. We have reviewed your inquiry and provide the following response:

### Technical Response
Based on the project specifications and current design documents, the requested information is as follows:

1. **Design Clarification**: The design intent is to [provide specific technical details based on the RFI content].

2. **Material Specifications**: The materials specified meet all required standards and codes.

3. **Construction Methods**: The proposed construction methods are approved and align with project requirements.

### Impact Analysis
- **Schedule Impact**: No significant impact on project timeline
- **Cost Impact**: No additional costs anticipated
- **Quality Impact**: Maintains or improves quality standards

### Next Steps
1. Please review this response and confirm understanding
2. If additional clarification is needed, please submit a follow-up RFI
3. Implementation can proceed as outlined

### Contact Information
For any further questions, please contact:
- Project Manager: ${selectedRfi?.assignedTo || 'Project Manager'}
- Email: [contact email]
- Phone: [contact phone]

---
This response is provided in accordance with the project contract terms and conditions.`;
    }
    
    return "AI-generated content will be implemented here...";
  };
  const [rfis, setRfis] = useState<RFI[]>([]);
  const [selectedRfi, setSelectedRfi] = useState<RFI | null>(null);
  const [rfiData, setRfiData] = useState<RFIData>({
    rfiNumber: '',
    title: '',
    description: '',
    category: '',
    priority: '',
    submittedBy: '',
    submittedDate: '',
    dueDate: '',
    assignedTo: '',
    projectName: '',
    relatedDocuments: '',
    attachments: '',
    response: ''
  });
  const [generatedResponse, setGeneratedResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'respond'>('create');

  const handleInputChange = (field: keyof RFIData, value: string) => {
    setRfiData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createRFI = () => {
    if (!rfiData.title || !rfiData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const newRFI: RFI = {
      id: Date.now().toString(),
      rfiNumber: rfiData.rfiNumber || `RFI-${Date.now()}`,
      title: rfiData.title,
      description: rfiData.description,
      status: 'pending',
      priority: rfiData.priority as RFI['priority'],
      category: rfiData.category,
      submittedBy: rfiData.submittedBy,
      submittedDate: rfiData.submittedDate || new Date().toISOString().split('T')[0],
      dueDate: rfiData.dueDate,
      assignedTo: rfiData.assignedTo,
      response: '',
      attachments: rfiData.attachments ? rfiData.attachments.split(',').map(a => a.trim()) : [],
      projectName: rfiData.projectName,
      relatedDocuments: rfiData.relatedDocuments ? rfiData.relatedDocuments.split(',').map(d => d.trim()) : []
    };

    setRfis(prev => [...prev, newRFI]);
    setRfiData({
      rfiNumber: '',
      title: '',
      description: '',
      category: '',
      priority: '',
      submittedBy: '',
      submittedDate: '',
      dueDate: '',
      assignedTo: '',
      projectName: '',
      relatedDocuments: '',
      attachments: '',
      response: ''
    });
    toast.success('RFI created successfully!');
  };

  const generateResponse = async () => {
    if (!selectedRfi) {
      toast.error('Please select an RFI first');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional RFI (Request for Information) response for a construction project with the following details:

RFI Information:
- RFI Number: ${selectedRfi.rfiNumber}
- Title: ${selectedRfi.title}
- Description: ${selectedRfi.description}
- Category: ${selectedRfi.category}
- Priority: ${selectedRfi.priority}
- Submitted By: ${selectedRfi.submittedBy}
- Submitted Date: ${selectedRfi.submittedDate}
- Due Date: ${selectedRfi.dueDate}
- Assigned To: ${selectedRfi.assignedTo}
- Project: ${selectedRfi.projectName}

Related Documents: ${selectedRfi.relatedDocuments.join(', ') || 'None specified'}
Attachments: ${selectedRfi.attachments.join(', ') || 'None specified'}

Generate a comprehensive RFI response that includes:
1. Professional acknowledgment of the RFI
2. Clear and detailed answer to the question/request
3. Reference to relevant drawings, specifications, or documents
4. Any clarifications or additional information needed
5. Impact on schedule, cost, or quality (if applicable)
6. Next steps or follow-up actions required
7. Contact information for further questions

The response should be:
- Professional and courteous
- Clear and comprehensive
- Technically accurate
- Reference relevant project documents
- Include any necessary clarifications
- Address potential impacts
- Provide actionable next steps

Return only the RFI response content, properly formatted with clear section headers.`;

      const response = await generateAIResponse(prompt);
      setGeneratedResponse(response);
      toast.success('RFI response generated successfully!');
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateRFIStatus = (rfiId: string, status: RFI['status']) => {
    setRfis(prev => prev.map(rfi => 
      rfi.id === rfiId ? { ...rfi, status } : rfi
    ));
    toast.success('RFI status updated!');
  };

  const deleteRFI = (rfiId: string) => {
    setRfis(prev => prev.filter(rfi => rfi.id !== rfiId));
    if (selectedRfi?.id === rfiId) {
      setSelectedRfi(null);
    }
    toast.success('RFI deleted!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResponse);
    toast.success('Response copied to clipboard!');
  };

  const downloadResponse = () => {
    const blob = new Blob([generatedResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rfi-response-${selectedRfi?.rfiNumber || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Response downloaded!');
  };

  const resetForm = () => {
    setRfiData({
      rfiNumber: '',
      title: '',
      description: '',
      category: '',
      priority: '',
      submittedBy: '',
      submittedDate: '',
      dueDate: '',
      assignedTo: '',
      projectName: '',
      relatedDocuments: '',
      attachments: '',
      response: ''
    });
    setGeneratedResponse('');
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
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              RFI Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              Request for Information tracking and AI-assisted responses
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
            Send
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
          Create RFI
        </Button>
        <Button
          variant={activeTab === 'manage' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('manage')}
          className="h-8 text-xs"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Manage RFIs
        </Button>
        <Button
          variant={activeTab === 'respond' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('respond')}
          className="h-8 text-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          Respond to RFI
        </Button>
      </div>

      {/* Create RFI Tab */}
      {activeTab === 'create' && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                Create New RFI
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rfiNumber" className="text-xs">RFI Number</Label>
                  <Input
                    id="rfiNumber"
                    value={rfiData.rfiNumber}
                    onChange={(e) => handleInputChange('rfiNumber', e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs">Title *</Label>
                  <Input
                    id="title"
                    value={rfiData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="RFI title"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs">Description *</Label>
                  <Textarea
                    id="description"
                    value={rfiData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the request"
                    className="min-h-[100px] text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs">Category</Label>
                    <Select
                      value={rfiData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="h-8 text-xs border border-border bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {rfiCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-xs">Priority</Label>
                    <Select
                      value={rfiData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger className="h-8 text-xs border border-border bg-background">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {rfiPriorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submittedBy" className="text-xs">Submitted By</Label>
                  <Input
                    id="submittedBy"
                    value={rfiData.submittedBy}
                    onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                    placeholder="Submitter name"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="submittedDate" className="text-xs">Submitted Date</Label>
                    <Input
                      id="submittedDate"
                      type="date"
                      value={rfiData.submittedDate}
                      onChange={(e) => handleInputChange('submittedDate', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-xs">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={rfiData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-xs">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={rfiData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    placeholder="Responsible person"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-xs">Project Name</Label>
                  <Input
                    id="projectName"
                    value={rfiData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Related project"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relatedDocuments" className="text-xs">Related Documents</Label>
                  <Input
                    id="relatedDocuments"
                    value={rfiData.relatedDocuments}
                    onChange={(e) => handleInputChange('relatedDocuments', e.target.value)}
                    placeholder="Comma-separated document references"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attachments" className="text-xs">Attachments</Label>
                  <Input
                    id="attachments"
                    value={rfiData.attachments}
                    onChange={(e) => handleInputChange('attachments', e.target.value)}
                    placeholder="Comma-separated attachment names"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
            
            <Button
              onClick={createRFI}
              disabled={!rfiData.title || !rfiData.description}
              className="w-full h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create RFI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Manage RFIs Tab */}
      {activeTab === 'manage' && (
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                RFI Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {rfis.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No RFIs created yet</p>
                <p className="text-xs text-muted-foreground">Create your first RFI to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rfis.map((rfi) => (
                  <div key={rfi.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="text-sm font-semibold">{rfi.title}</h3>
                          <p className="text-xs text-muted-foreground">#{rfi.rfiNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] ${rfiPriorities.find(p => p.value === rfi.priority)?.color || ''}`}
                        >
                          {rfiPriorities.find(p => p.value === rfi.priority)?.label}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] ${rfiStatuses.find(s => s.value === rfi.status)?.color || ''}`}
                        >
                          {rfiStatuses.find(s => s.value === rfi.status)?.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {rfi.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Submitted: {rfi.submittedDate}</span>
                        <span>Due: {rfi.dueDate}</span>
                        <span>Assigned: {rfi.assignedTo}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRfi(rfi)}
                          className="h-6 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRFIStatus(rfi.id, 'in-review')}
                          className="h-6 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRFI(rfi.id)}
                          className="h-6 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Respond to RFI Tab */}
      {activeTab === 'respond' && (
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Select RFI to Respond
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {rfis.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No RFIs available</p>
                  <p className="text-xs text-muted-foreground">Create RFIs first to respond to them</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rfis.map((rfi) => (
                    <div
                      key={rfi.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedRfi?.id === rfi.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedRfi(rfi)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold">{rfi.title}</h3>
                          <p className="text-xs text-muted-foreground">#{rfi.rfiNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] ${rfiPriorities.find(p => p.value === rfi.priority)?.color || ''}`}
                          >
                            {rfiPriorities.find(p => p.value === rfi.priority)?.label}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] ${rfiStatuses.find(s => s.value === rfi.status)?.color || ''}`}
                          >
                            {rfiStatuses.find(s => s.value === rfi.status)?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedRfi && (
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight">
                      Generate Response for {selectedRfi.rfiNumber}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!generatedResponse}
                      className="h-8 text-xs"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResponse}
                      disabled={!generatedResponse}
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
                  <Label className="text-xs font-semibold">RFI Details</Label>
                  <div className="p-3 bg-background border border-border rounded-lg">
                    <p className="text-xs font-medium">{selectedRfi.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedRfi.description}</p>
                  </div>
                </div>
                
                <Button
                  onClick={generateResponse}
                  disabled={isGenerating}
                  className="w-full h-8 text-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating Response...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Generate AI Response
                    </>
                  )}
                </Button>
                
                {generatedResponse && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Generated Response</Label>
                    <Textarea
                      value={generatedResponse}
                      onChange={(e) => setGeneratedResponse(e.target.value)}
                      className="min-h-[300px] text-xs"
                      placeholder="Generated response will appear here..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RFIManagerTool;
