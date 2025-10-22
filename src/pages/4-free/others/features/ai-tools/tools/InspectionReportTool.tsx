import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  FileText,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Camera,
  Loader2,
  Upload,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface InspectionPhoto {
  id: string;
  url: string;
  caption: string;
  category: string;
  timestamp: string;
  location: string;
  inspector: string;
}

interface InspectionFinding {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  category: string;
  location: string;
  photos: string[];
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  dueDate: string;
  resolution?: string;
}

interface InspectionReport {
  id: string;
  title: string;
  projectId: string;
  inspector: string;
  date: string;
  location: string;
  weather: string;
  temperature: string;
  findings: InspectionFinding[];
  photos: InspectionPhoto[];
  summary: string;
  recommendations: string[];
  compliance: {
    sce: boolean;
    buildingCodes: boolean;
    safety: boolean;
  };
}

export default function InspectionReportTool() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('structural');
  const [selectedSeverity, setSelectedSeverity] = useState('major');

  const [report, setReport] = useState<InspectionReport>({
    id: '1',
    title: 'Structural Framework Inspection',
    projectId: projectId || '1',
    inspector: 'Ahmed Al-Rashid',
    date: '2024-01-20',
    location: 'Riyadh Office Complex - Level 3',
    weather: 'Clear',
    temperature: '28°C',
    findings: [
      {
        id: '1',
        title: 'Steel Reinforcement Spacing Issue',
        description: 'Reinforcement spacing exceeds allowable tolerance in columns C-3 and C-7. Current spacing is 200mm vs required 150mm.',
        severity: 'major',
        category: 'structural',
        location: 'Column C-3, C-7 - Level 3',
        photos: ['photo1.jpg', 'photo2.jpg'],
        status: 'open',
        assignedTo: 'Structural Engineer',
        dueDate: '2024-01-25'
      },
      {
        id: '2',
        title: 'Concrete Cover Insufficient',
        description: 'Concrete cover on beam B-12 is 20mm vs required 40mm minimum per SBC 304.',
        severity: 'critical',
        category: 'structural',
        location: 'Beam B-12 - Level 3',
        photos: ['photo3.jpg'],
        status: 'in-progress',
        assignedTo: 'Quality Control',
        dueDate: '2024-01-22'
      },
      {
        id: '3',
        title: 'Formwork Deflection',
        description: 'Minor deflection observed in formwork for slab S-3. Within acceptable limits but monitoring required.',
        severity: 'minor',
        category: 'structural',
        location: 'Slab S-3 - Level 3',
        photos: ['photo4.jpg'],
        status: 'resolved',
        assignedTo: 'Site Engineer',
        dueDate: '2024-01-21',
        resolution: 'Formwork reinforced and deflection corrected.'
      }
    ],
    photos: [
      {
        id: '1',
        url: '/placeholder.jpg',
        caption: 'Column C-3 reinforcement spacing',
        category: 'structural',
        timestamp: '2024-01-20 10:30',
        location: 'Level 3 - Column C-3',
        inspector: 'Ahmed Al-Rashid'
      },
      {
        id: '2',
        url: '/placeholder.jpg',
        caption: 'Beam B-12 concrete cover measurement',
        category: 'structural',
        timestamp: '2024-01-20 11:15',
        location: 'Level 3 - Beam B-12',
        inspector: 'Ahmed Al-Rashid'
      }
    ],
    summary: 'Overall structural quality is good with minor issues identified. Critical concrete cover issue requires immediate attention. SCE compliance maintained.',
    recommendations: [
      'Immediate correction of concrete cover on Beam B-12',
      'Review reinforcement spacing in all columns',
      'Implement additional quality checks for concrete cover',
      'Schedule follow-up inspection after corrections'
    ],
    compliance: {
      sce: true,
      buildingCodes: false,
      safety: true
    }
  });

  const categories = [
    { value: 'structural', label: 'Structural' },
    { value: 'mep', label: 'MEP Systems' },
    { value: 'safety', label: 'Safety' },
    { value: 'finishes', label: 'Finishes' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const severities = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    { value: 'major', label: 'Major', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    { value: 'minor', label: 'Minor', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    { value: 'observation', label: 'Observation', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' }
  ];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive inspection report for a construction project. Project ID: ${projectId || 'N/A'}. Category: ${selectedCategory}. Include detailed findings, photos analysis, compliance assessment, and recommendations based on Saudi construction standards and SCE requirements.`;
      await sendMessage(prompt);
      toast.success("AI has generated an inspection report. Review and adjust as needed.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate inspection report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Inspection report saved successfully!");
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Could not save report. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success("Inspection report exported to PDF");
  };

  const handlePhotoUpload = () => {
    toast.success("Photo uploaded successfully");
  };

  const getSeverityColor = (severity: string) => {
    const severityData = severities.find(s => s.value === severity);
    return severityData?.color || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/10 text-red-600';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-600';
      case 'resolved': return 'bg-green-500/10 text-green-600';
      case 'closed': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const criticalFindings = report.findings.filter(f => f.severity === 'critical').length;
  const majorFindings = report.findings.filter(f => f.severity === 'major').length;
  const totalFindings = report.findings.length;
  const resolvedFindings = report.findings.filter(f => f.status === 'resolved' || f.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Inspection Report Builder</h1>
              <p className="text-xs text-muted-foreground">AI-powered inspection reports with photo documentation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Report
                </>
              )}
            </Button>
            <Button 
              className="h-8 text-xs shadow-md"
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
                  AI Generate
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Report Info */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Inspection Report Details</CardTitle>
                <p className="text-xs text-muted-foreground">Report information and metadata</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Title</label>
                <Input 
                  value={report.title}
                  onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
                  className="border border-border h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Inspector</label>
                <Input 
                  value={report.inspector}
                  onChange={(e) => setReport(prev => ({ ...prev, inspector: e.target.value }))}
                  className="border border-border h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input 
                  value={report.location}
                  onChange={(e) => setReport(prev => ({ ...prev, location: e.target.value }))}
                  className="border border-border h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={report.date}
                  onChange={(e) => setReport(prev => ({ ...prev, date: e.target.value }))}
                  className="border border-border h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Summary */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Inspection Summary</CardTitle>
                <p className="text-xs text-muted-foreground">Key findings and compliance status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Findings</span>
                  <span className="text-sm font-bold text-primary">{totalFindings}</span>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground">All areas inspected</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Critical Issues</span>
                  <span className="text-sm font-bold text-red-600">{criticalFindings}</span>
                </div>
                <Progress value={criticalFindings > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground">Immediate attention required</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Major Issues</span>
                  <span className="text-sm font-bold text-orange-600">{majorFindings}</span>
                </div>
                <Progress value={majorFindings > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground">Priority resolution needed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resolved</span>
                  <span className="text-sm font-bold text-green-600">{resolvedFindings}/{totalFindings}</span>
                </div>
                <Progress value={(resolvedFindings / totalFindings) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Issues addressed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Findings List */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Inspection Findings</CardTitle>
                  <p className="text-xs text-muted-foreground">Detailed findings and recommendations</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Finding
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {report.findings.map((finding) => (
                <div key={finding.id} className="p-4 bg-background border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold">{finding.title}</h3>
                        <Badge className={`text-[9px] ${getSeverityColor(finding.severity)}`}>
                          {finding.severity.toUpperCase()}
                        </Badge>
                        <Badge className={`text-[9px] ${getStatusColor(finding.status)}`}>
                          {finding.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{finding.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{finding.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {finding.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {finding.resolution && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Resolution:</strong> {finding.resolution}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Documentation */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Camera className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Photo Documentation</CardTitle>
                  <p className="text-xs text-muted-foreground">Visual evidence and documentation</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handlePhotoUpload}>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Photos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.photos.map((photo) => (
                <div key={photo.id} className="bg-background border border-border rounded-lg p-3">
                  <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{photo.caption}</p>
                    <p className="text-xs text-muted-foreground">{photo.location}</p>
                    <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Actions */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">AI-Powered Actions</CardTitle>
                <p className="text-xs text-muted-foreground">Leverage AI for enhanced inspection analysis</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    Generate Report
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is analyzing photos...")}
              >
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Analyze Photos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is generating recommendations...")}
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                Recommendations
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is checking compliance...")}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Compliance Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
