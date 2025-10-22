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
  Shield,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Loader2,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Building,
  Gavel,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: 'sce' | 'building-codes' | 'safety' | 'environmental' | 'quality';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'non-compliant' | 'pending' | 'not-applicable';
  dueDate: string;
  responsible: string;
  evidence: string[];
  lastChecked: string;
  nextReview: string;
  score: number;
  maxScore: number;
}

interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  requirements: ComplianceRequirement[];
  overallScore: number;
  maxScore: number;
  status: 'compliant' | 'non-compliant' | 'pending';
}

export default function ComplianceTrackerTool() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sce');
  const [selectedPriority, setSelectedPriority] = useState('critical');

  const [complianceCategories, setComplianceCategories] = useState<ComplianceCategory[]>([
    {
      id: '1',
      name: 'SCE Compliance',
      description: 'Saudi Council of Engineers requirements and professional standards',
      overallScore: 95,
      maxScore: 100,
      status: 'compliant',
      requirements: [
        {
          id: '1',
          title: 'Professional Engineer Registration',
          description: 'All engineers must be registered with SCE and maintain valid licenses',
          category: 'sce',
          priority: 'critical',
          status: 'compliant',
          dueDate: '2024-12-31',
          responsible: 'Project Manager',
          evidence: ['SCE License Copy', 'Registration Certificate'],
          lastChecked: '2024-01-15',
          nextReview: '2024-04-15',
          score: 100,
          maxScore: 100
        },
        {
          id: '2',
          title: 'Design Review and Approval',
          description: 'All structural designs must be reviewed and approved by SCE-registered engineers',
          category: 'sce',
          priority: 'high',
          status: 'compliant',
          dueDate: '2024-02-28',
          responsible: 'Structural Engineer',
          evidence: ['Design Calculations', 'SCE Approval Letter'],
          lastChecked: '2024-01-10',
          nextReview: '2024-03-10',
          score: 95,
          maxScore: 100
        },
        {
          id: '3',
          title: 'Continuing Professional Development',
          description: 'Engineers must maintain CPD hours as required by SCE',
          category: 'sce',
          priority: 'medium',
          status: 'pending',
          dueDate: '2024-06-30',
          responsible: 'All Engineers',
          evidence: ['CPD Certificates', 'Training Records'],
          lastChecked: '2024-01-01',
          nextReview: '2024-04-01',
          score: 80,
          maxScore: 100
        }
      ]
    },
    {
      id: '2',
      name: 'Building Codes',
      description: 'Saudi Building Code (SBC) and local building regulations compliance',
      overallScore: 88,
      maxScore: 100,
      status: 'compliant',
      requirements: [
        {
          id: '4',
          title: 'Structural Design Compliance',
          description: 'Structural design must comply with SBC 304 and SBC 301',
          category: 'building-codes',
          priority: 'critical',
          status: 'compliant',
          dueDate: '2024-03-15',
          responsible: 'Structural Engineer',
          evidence: ['Design Calculations', 'Code Compliance Report'],
          lastChecked: '2024-01-12',
          nextReview: '2024-02-12',
          score: 92,
          maxScore: 100
        },
        {
          id: '5',
          title: 'Fire Safety Requirements',
          description: 'Fire safety systems must comply with SBC 801',
          category: 'building-codes',
          priority: 'high',
          status: 'non-compliant',
          dueDate: '2024-02-20',
          responsible: 'MEP Engineer',
          evidence: ['Fire Safety Design', 'Inspection Reports'],
          lastChecked: '2024-01-08',
          nextReview: '2024-02-08',
          score: 75,
          maxScore: 100
        }
      ]
    },
    {
      id: '3',
      name: 'Safety Compliance',
      description: 'Occupational safety and health regulations compliance',
      overallScore: 92,
      maxScore: 100,
      status: 'compliant',
      requirements: [
        {
          id: '6',
          title: 'Safety Management System',
          description: 'Comprehensive safety management system implementation',
          category: 'safety',
          priority: 'critical',
          status: 'compliant',
          dueDate: '2024-01-31',
          responsible: 'Safety Manager',
          evidence: ['Safety Plan', 'Training Records', 'Incident Reports'],
          lastChecked: '2024-01-18',
          nextReview: '2024-02-18',
          score: 95,
          maxScore: 100
        }
      ]
    }
  ]);

  const categories = [
    { value: 'sce', label: 'SCE Compliance' },
    { value: 'building-codes', label: 'Building Codes' },
    { value: 'safety', label: 'Safety' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'quality', label: 'Quality' }
  ];

  const priorities = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    { value: 'high', label: 'High', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    { value: 'low', label: 'Low', color: 'bg-green-500/10 text-green-600 border-green-500/20' }
  ];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate comprehensive compliance monitoring insights for a construction project. Project ID: ${projectId || 'N/A'}. Category: ${selectedCategory}. Priority: ${selectedPriority}. Include SCE requirements, Saudi building codes, safety regulations, and environmental compliance. Provide compliance scoring, risk assessment, and recommendations.`;
      await sendMessage(prompt);
      toast.success("AI has generated compliance insights. Review recommendations below.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate compliance insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Compliance data saved successfully!");
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Could not save compliance data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success("Compliance report exported to PDF");
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = priorities.find(p => p.value === priority);
    return priorityData?.color || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/10 text-green-600';
      case 'non-compliant': return 'bg-red-500/10 text-red-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'not-applicable': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non-compliant': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not-applicable': return <Target className="h-4 w-4 text-gray-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalRequirements = complianceCategories.reduce((sum, cat) => sum + cat.requirements.length, 0);
  const compliantRequirements = complianceCategories.reduce((sum, cat) => 
    sum + cat.requirements.filter(req => req.status === 'compliant').length, 0
  );
  const nonCompliantRequirements = complianceCategories.reduce((sum, cat) => 
    sum + cat.requirements.filter(req => req.status === 'non-compliant').length, 0
  );
  const pendingRequirements = complianceCategories.reduce((sum, cat) => 
    sum + cat.requirements.filter(req => req.status === 'pending').length, 0
  );

  const overallComplianceScore = Math.round(
    complianceCategories.reduce((sum, cat) => sum + cat.overallScore, 0) / complianceCategories.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Compliance Tracker</h1>
              <p className="text-xs text-muted-foreground">SCE & Building Codes monitoring with real-time alerts</p>
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
                  Save Data
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
                  AI Analyze
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Compliance Overview</CardTitle>
                <p className="text-xs text-muted-foreground">Overall compliance status and scoring</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm font-bold text-primary">{overallComplianceScore}%</span>
                </div>
                <Progress value={overallComplianceScore} className="h-2" />
                <p className="text-xs text-muted-foreground">Compliance rating</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliant</span>
                  <span className="text-sm font-bold text-green-600">{compliantRequirements}</span>
                </div>
                <Progress value={(compliantRequirements / totalRequirements) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Requirements met</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Non-Compliant</span>
                  <span className="text-sm font-bold text-red-600">{nonCompliantRequirements}</span>
                </div>
                <Progress value={(nonCompliantRequirements / totalRequirements) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Issues to address</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-bold text-yellow-600">{pendingRequirements}</span>
                </div>
                <Progress value={(pendingRequirements / totalRequirements) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Under review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Categories */}
        <div className="space-y-6">
          {complianceCategories.map((category) => (
            <Card key={category.id} className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{category.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[9px] ${getStatusColor(category.status)}`}>
                      {category.status.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{category.overallScore}/{category.maxScore}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {category.requirements.map((requirement) => (
                    <div key={requirement.id} className="p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(requirement.status)}
                            <h3 className="text-sm font-bold">{requirement.title}</h3>
                            <Badge className={`text-[9px] ${getPriorityColor(requirement.priority)}`}>
                              {requirement.priority.toUpperCase()}
                            </Badge>
                            <Badge className={`text-[9px] ${getStatusColor(requirement.status)}`}>
                              {requirement.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{requirement.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>Responsible: {requirement.responsible}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {requirement.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Last Check: {requirement.lastChecked}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">{requirement.score}/{requirement.maxScore}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Evidence:</span>
                          <div className="flex gap-1">
                            {requirement.evidence.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-[9px]">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Actions */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">AI-Powered Compliance Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">Leverage AI for enhanced compliance monitoring</p>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    AI Analyze
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is checking SCE compliance...")}
              >
                <Building className="h-3.5 w-3.5 mr-1.5" />
                SCE Check
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is analyzing building codes...")}
              >
                <Gavel className="h-3.5 w-3.5 mr-1.5" />
                Code Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is generating compliance report...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
