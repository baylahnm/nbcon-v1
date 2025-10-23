import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  Target,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Loader2,
  Camera,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface Defect {
  id: string;
  title: string;
  description: string;
  category: 'structural' | 'mep' | 'finishes' | 'safety' | 'compliance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: number; // 1-10 scale
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  location: string;
  floor: string;
  room: string;
  discoveredBy: string;
  discoveredDate: string;
  assignedTo: string;
  dueDate: string;
  estimatedCost: number;
  actualCost?: number;
  photos: string[];
  notes: string[];
  resolution?: string;
  resolvedBy?: string;
  resolvedDate?: string;
  aiScore: number; // AI-generated priority score
  aiRecommendations: string[];
}

interface DefectCategory {
  id: string;
  name: string;
  description: string;
  defects: Defect[];
  totalCount: number;
  openCount: number;
  resolvedCount: number;
  avgPriority: number;
}

export default function DefectManagerTool() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('structural');
  const [selectedSeverity, setSelectedSeverity] = useState('high');
  const [searchTerm, setSearchTerm] = useState('');

  const [defectCategories, setDefectCategories] = useState<DefectCategory[]>([
    {
      id: '1',
      name: 'Structural Defects',
      description: 'Structural elements and framework issues',
      totalCount: 8,
      openCount: 3,
      resolvedCount: 5,
      avgPriority: 7.2,
      defects: [
        {
          id: '1',
          title: 'Concrete Cracking in Beam B-12',
          description: 'Horizontal cracks observed in reinforced concrete beam B-12, approximately 2mm wide and 1.5m long. Cracks appear to be shrinkage-related but require structural assessment.',
          category: 'structural',
          severity: 'high',
          priority: 8,
          status: 'open',
          location: 'Level 3 - Beam B-12',
          floor: 'Level 3',
          room: 'Office Area',
          discoveredBy: 'Ahmed Al-Rashid',
          discoveredDate: '2024-01-18',
          assignedTo: 'Structural Engineer',
          dueDate: '2024-01-25',
          estimatedCost: 15000,
          photos: ['crack1.jpg', 'crack2.jpg'],
          notes: ['Cracks appeared after concrete curing', 'No structural impact detected'],
          aiScore: 8.5,
          aiRecommendations: [
            'Immediate structural assessment required',
            'Consider epoxy injection for crack repair',
            'Monitor crack propagation'
          ]
        },
        {
          id: '2',
          title: 'Steel Reinforcement Spacing Issue',
          description: 'Reinforcement spacing in column C-3 exceeds allowable tolerance. Current spacing is 200mm vs required 150mm per SBC 304.',
          category: 'structural',
          severity: 'critical',
          priority: 9,
          status: 'in-progress',
          location: 'Level 2 - Column C-3',
          floor: 'Level 2',
          room: 'Lobby Area',
          discoveredBy: 'Quality Control',
          discoveredDate: '2024-01-15',
          assignedTo: 'Structural Engineer',
          dueDate: '2024-01-22',
          estimatedCost: 25000,
          actualCost: 18000,
          photos: ['reinforcement1.jpg', 'reinforcement2.jpg'],
          notes: ['Critical structural issue', 'Correction in progress'],
          aiScore: 9.2,
          aiRecommendations: [
            'Immediate correction required',
            'Structural integrity compromised',
            'Additional reinforcement needed'
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'MEP Defects',
      description: 'Mechanical, Electrical, and Plumbing system issues',
      totalCount: 12,
      openCount: 7,
      resolvedCount: 5,
      avgPriority: 6.8,
      defects: [
        {
          id: '3',
          title: 'Electrical Conduit Damage',
          description: 'Electrical conduit damaged during concrete pour. Conduit crushed and wires exposed. Safety hazard identified.',
          category: 'mep',
          severity: 'high',
          priority: 7,
          status: 'open',
          location: 'Level 1 - Electrical Room',
          floor: 'Level 1',
          room: 'Electrical Room',
          discoveredBy: 'Electrical Engineer',
          discoveredDate: '2024-01-20',
          assignedTo: 'Electrical Contractor',
          dueDate: '2024-01-27',
          estimatedCost: 8000,
          photos: ['conduit1.jpg', 'conduit2.jpg'],
          notes: ['Safety hazard', 'Immediate attention required'],
          aiScore: 7.8,
          aiRecommendations: [
            'Replace damaged conduit',
            'Test electrical continuity',
            'Update safety protocols'
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Finishes Defects',
      description: 'Interior and exterior finish quality issues',
      totalCount: 15,
      openCount: 10,
      resolvedCount: 5,
      avgPriority: 5.5,
      defects: [
        {
          id: '4',
          title: 'Paint Finish Defects',
          description: 'Paint finish showing brush marks and uneven coverage in several rooms. Quality below specification standards.',
          category: 'finishes',
          severity: 'medium',
          priority: 4,
          status: 'resolved',
          location: 'Level 2 - Office Rooms',
          floor: 'Level 2',
          room: 'Office Rooms 201-205',
          discoveredBy: 'Quality Inspector',
          discoveredDate: '2024-01-10',
          assignedTo: 'Painting Contractor',
          dueDate: '2024-01-17',
          estimatedCost: 5000,
          actualCost: 4500,
          photos: ['paint1.jpg', 'paint2.jpg'],
          notes: ['Quality issue', 'Repainting completed'],
          resolution: 'All affected areas repainted with proper technique and quality materials.',
          resolvedBy: 'Painting Contractor',
          resolvedDate: '2024-01-16',
          aiScore: 4.2,
          aiRecommendations: [
            'Repaint affected areas',
            'Improve application technique',
            'Quality control check'
          ]
        }
      ]
    }
  ]);

  const categories = [
    { value: 'structural', label: 'Structural' },
    { value: 'mep', label: 'MEP Systems' },
    { value: 'finishes', label: 'Finishes' },
    { value: 'safety', label: 'Safety' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const severities = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    { value: 'high', label: 'High', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    { value: 'low', label: 'Low', color: 'bg-green-500/10 text-green-600 border-green-500/20' }
  ];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Analyze construction defects for a project. Project ID: ${projectId || 'N/A'}. Category: ${selectedCategory}. Severity: ${selectedSeverity}. Provide AI-powered defect detection, prioritization scoring, cost estimation, and resolution recommendations based on Saudi construction standards.`;
      await sendMessage(prompt);
      toast.success("AI has analyzed defects and provided insights. Review recommendations below.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not analyze defects. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Defect data saved successfully!");
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Could not save defect data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success("Defect punch list exported to PDF");
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
      case 'rejected': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500/10 text-red-600';
    if (priority >= 6) return 'bg-orange-500/10 text-orange-600';
    if (priority >= 4) return 'bg-yellow-500/10 text-yellow-600';
    return 'bg-green-500/10 text-green-600';
  };

  const totalDefects = defectCategories.reduce((sum, cat) => sum + cat.totalCount, 0);
  const openDefects = defectCategories.reduce((sum, cat) => sum + cat.openCount, 0);
  const resolvedDefects = defectCategories.reduce((sum, cat) => sum + cat.resolvedCount, 0);
  const avgPriority = Math.round(
    defectCategories.reduce((sum, cat) => sum + cat.avgPriority, 0) / defectCategories.length
  );

  const filteredDefects = defectCategories.flatMap(cat => 
    cat.defects.filter(defect => 
      defect.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate('/free/ai-tools/quality')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Defect Punch List Manager</h1>
              <p className="text-xs text-muted-foreground">AI-powered defect detection and prioritization</p>
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
              className="h-8 text-xs"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Defect Overview */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Defect Overview</CardTitle>
                <p className="text-xs text-muted-foreground">Overall defect statistics and trends</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Defects</span>
                  <span className="text-sm font-bold text-primary">{totalDefects}</span>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground">All categories</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Defects</span>
                  <span className="text-sm font-bold text-red-600">{openDefects}</span>
                </div>
                <Progress value={(openDefects / totalDefects) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Require attention</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resolved</span>
                  <span className="text-sm font-bold text-green-600">{resolvedDefects}</span>
                </div>
                <Progress value={(resolvedDefects / totalDefects) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Priority</span>
                  <span className="text-sm font-bold text-orange-600">{avgPriority}/10</span>
                </div>
                <Progress value={avgPriority * 10} className="h-2" />
                <p className="text-xs text-muted-foreground">Priority score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Filters & Search</CardTitle>
                <p className="text-xs text-muted-foreground">Filter and search defects</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search defects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border border-border h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((severity) => (
                      <SelectItem key={severity.value} value={severity.value}>
                        {severity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Defect
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Defect Categories */}
        <div className="space-y-4">
          {defectCategories.map((category) => (
            <Card key={category.id} className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{category.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{category.totalCount}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600">{category.openCount}</div>
                      <div className="text-xs text-muted-foreground">Open</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">{category.resolvedCount}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-600">{category.avgPriority.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Avg Priority</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {category.defects.map((defect) => (
                    <div key={defect.id} className="p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-bold">{defect.title}</h3>
                            <Badge className={`text-[9px] ${getSeverityColor(defect.severity)}`}>
                              {defect.severity.toUpperCase()}
                            </Badge>
                            <Badge className={`text-[9px] ${getStatusColor(defect.status)}`}>
                              {defect.status.toUpperCase()}
                            </Badge>
                            <Badge className={`text-[9px] ${getPriorityColor(defect.priority)}`}>
                              Priority: {defect.priority}/10
                            </Badge>
                            <Badge className="text-[9px] bg-blue-500/10 text-blue-600 border-blue-500/20">
                              AI Score: {defect.aiScore.toFixed(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{defect.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{defect.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>Assigned: {defect.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {defect.dueDate}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Cost: SAR {defect.estimatedCost.toLocaleString()}</span>
                            <span>Discovered: {defect.discoveredDate}</span>
                            <span>By: {defect.discoveredBy}</span>
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
                            <Camera className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* AI Recommendations */}
                      {defect.aiRecommendations.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="text-xs font-bold text-blue-800 mb-2">AI Recommendations:</h4>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {defect.aiRecommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Resolution */}
                      {defect.resolution && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Resolution:</strong> {defect.resolution}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Resolved by {defect.resolvedBy} on {defect.resolvedDate}
                          </p>
                        </div>
                      )}
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
                <CardTitle className="text-base font-bold">AI-Powered Defect Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">Leverage AI for enhanced defect management</p>
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
                onClick={() => toast.success("AI is detecting new defects...")}
              >
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Detect Defects
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is prioritizing defects...")}
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Prioritize
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is generating cost estimates...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Cost Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
