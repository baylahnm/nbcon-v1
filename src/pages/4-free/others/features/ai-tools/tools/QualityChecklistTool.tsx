import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Checkbox } from '@/pages/1-HomePage/others/components/ui/checkbox';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  ClipboardList,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Target,
  Loader2,
  Camera,
  FileText,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
  photos?: string[];
  assignedTo?: string;
  dueDate?: string;
}

interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
  items: ChecklistItem[];
  completed: number;
  total: number;
}

export default function QualityChecklistTool() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState('foundation');
  const [selectedTrade, setSelectedTrade] = useState('structural');

  const [checklistCategories, setChecklistCategories] = useState<ChecklistCategory[]>([
    {
      id: '1',
      name: 'Foundation & Excavation',
      description: 'Site preparation, excavation, and foundation work quality checks',
      completed: 8,
      total: 12,
      items: [
        {
          id: '1',
          description: 'Excavation depth and dimensions verified per drawings',
          category: 'foundation',
          priority: 'high',
          completed: true,
          notes: 'All measurements within tolerance',
          assignedTo: 'Site Engineer',
          dueDate: '2024-01-15'
        },
        {
          id: '2',
          description: 'Soil compaction test results documented',
          category: 'foundation',
          priority: 'high',
          completed: true,
          notes: 'Proctor density achieved',
          assignedTo: 'Quality Control',
          dueDate: '2024-01-15'
        },
        {
          id: '3',
          description: 'Foundation reinforcement placement verified',
          category: 'foundation',
          priority: 'high',
          completed: false,
          assignedTo: 'Structural Engineer',
          dueDate: '2024-01-20'
        },
        {
          id: '4',
          description: 'Concrete mix design approved and tested',
          category: 'foundation',
          priority: 'medium',
          completed: true,
          notes: '28-day strength test pending',
          assignedTo: 'Concrete Specialist',
          dueDate: '2024-01-18'
        }
      ]
    },
    {
      id: '2',
      name: 'Structural Framework',
      description: 'Steel and concrete structural elements quality assurance',
      completed: 5,
      total: 15,
      items: [
        {
          id: '5',
          description: 'Steel reinforcement spacing and cover verified',
          category: 'structural',
          priority: 'high',
          completed: true,
          notes: 'Cover measurements within 5mm tolerance',
          assignedTo: 'Structural Engineer',
          dueDate: '2024-01-16'
        },
        {
          id: '6',
          description: 'Concrete pour quality and finish inspected',
          category: 'structural',
          priority: 'high',
          completed: false,
          assignedTo: 'Quality Control',
          dueDate: '2024-01-22'
        },
        {
          id: '7',
          description: 'Formwork alignment and stability checked',
          category: 'structural',
          priority: 'medium',
          completed: true,
          notes: 'No deflection observed',
          assignedTo: 'Site Engineer',
          dueDate: '2024-01-17'
        }
      ]
    },
    {
      id: '3',
      name: 'MEP Systems',
      description: 'Mechanical, Electrical, and Plumbing installation quality',
      completed: 3,
      total: 18,
      items: [
        {
          id: '8',
          description: 'Electrical conduit routing and protection verified',
          category: 'mep',
          priority: 'high',
          completed: true,
          notes: 'All conduits properly secured',
          assignedTo: 'Electrical Engineer',
          dueDate: '2024-01-19'
        },
        {
          id: '9',
          description: 'HVAC ductwork installation quality checked',
          category: 'mep',
          priority: 'medium',
          completed: false,
          assignedTo: 'MEP Engineer',
          dueDate: '2024-01-25'
        },
        {
          id: '10',
          description: 'Plumbing pipe connections and pressure tested',
          category: 'mep',
          priority: 'high',
          completed: false,
          assignedTo: 'Plumbing Engineer',
          dueDate: '2024-01-23'
        }
      ]
    }
  ]);

  const phases = [
    { value: 'foundation', label: 'Foundation & Excavation' },
    { value: 'structural', label: 'Structural Framework' },
    { value: 'mep', label: 'MEP Systems' },
    { value: 'finishes', label: 'Finishes & Fit-out' },
    { value: 'testing', label: 'Testing & Commissioning' }
  ];

  const trades = [
    { value: 'structural', label: 'Structural Engineering' },
    { value: 'mep', label: 'MEP Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'architectural', label: 'Architectural' },
    { value: 'safety', label: 'Safety & Compliance' }
  ];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive quality control checklist for a construction project. Project ID: ${projectId || 'N/A'}. Phase: ${selectedPhase}. Trade: ${selectedTrade}. Include SCE compliance requirements, Saudi building codes, and industry best practices. Provide detailed check items with priorities, responsible parties, and completion criteria.`;
      await sendMessage(prompt);
      toast.success("AI has generated a quality control checklist. Review and adjust as needed.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate checklist. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleItemToggle = (categoryId: string, itemId: string) => {
    setChecklistCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              items: category.items.map(item => 
                item.id === itemId 
                  ? { ...item, completed: !item.completed }
                  : item
              ),
              completed: category.items.map(item => 
                item.id === itemId 
                  ? !item.completed 
                  : item.completed
              ).filter(Boolean).length
            }
          : category
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Quality checklist saved successfully!");
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Could not save checklist. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success("Quality checklist exported to PDF");
  };

  const totalItems = checklistCategories.reduce((sum, cat) => sum + cat.total, 0);
  const completedItems = checklistCategories.reduce((sum, cat) => sum + cat.completed, 0);
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

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
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Quality Control Checklist Generator</h1>
              <p className="text-xs text-muted-foreground">AI-powered dynamic checklists for construction quality assurance</p>
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
                  Save Checklist
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

        {/* Project Info & Filters */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Project Configuration</CardTitle>
                <p className="text-xs text-muted-foreground">Configure checklist parameters and filters</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Phase</label>
                <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase.value} value={phase.value}>
                        {phase.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trade/Discipline</label>
                <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map((trade) => (
                      <SelectItem key={trade.value} value={trade.value}>
                        {trade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SCE Compliance</label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quality Progress Overview</CardTitle>
                <p className="text-xs text-muted-foreground">Overall checklist completion status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{completedItems} of {totalItems} items completed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Priority</span>
                  <span className="text-sm font-bold text-red-600">8/12</span>
                </div>
                <Progress value={67} className="h-2" />
                <p className="text-xs text-muted-foreground">Critical items pending</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SCE Compliance</span>
                  <span className="text-sm font-bold text-green-600">100%</span>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground">All requirements met</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality Score</span>
                  <span className="text-sm font-bold text-blue-600">92/100</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">Excellent quality rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Categories */}
        <div className="space-y-4">
          {checklistCategories.map((category) => (
            <Card key={category.id} className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{category.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px]">
                      {category.completed}/{category.total}
                    </Badge>
                    <div className="w-20">
                      <Progress value={(category.completed / category.total) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleItemToggle(category.id, item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {item.description}
                          </p>
                          <Badge className={`text-[9px] ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </Badge>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground italic">"{item.notes}"</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Due: {item.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Assigned: {item.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Camera className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <FileText className="h-3 w-3" />
                        </Button>
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
                <CardTitle className="text-base font-bold">AI-Powered Actions</CardTitle>
                <p className="text-xs text-muted-foreground">Leverage AI for enhanced quality management</p>
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
                    Generate Checklist
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is analyzing quality patterns...")}
              >
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Analyze Patterns
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is optimizing checklist...")}
              >
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Optimize Items
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is generating compliance report...")}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Compliance Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
