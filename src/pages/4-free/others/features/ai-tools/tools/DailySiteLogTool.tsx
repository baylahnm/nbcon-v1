import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  ClipboardList,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  Calendar,
  Cloud,
  Shield,
  Users,
  Wrench,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sun,
  CloudRain,
  Thermometer,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: string;
  safetyAlert: boolean;
}

interface SafetyIncident {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  reportedBy: string;
  time: string;
}

interface WorkProgress {
  activity: string;
  location: string;
  progress: number;
  workers: number;
  equipment: string[];
  notes: string;
}

export default function DailySiteLogTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample weather data
  const [weatherData] = useState<WeatherData>({
    temperature: 28,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 12,
    visibility: 'Good',
    safetyAlert: false,
  });

  // Sample safety incidents
  const [safetyIncidents] = useState<SafetyIncident[]>([
    {
      id: '1',
      type: 'Near Miss',
      description: 'Worker almost stepped on exposed rebar',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Ahmed Al-Rashid',
      time: '09:30',
    },
  ]);

  // Sample work progress
  const [workProgress] = useState<WorkProgress[]>([
    {
      activity: 'Foundation Concrete Pour',
      location: 'Building A - Basement',
      progress: 85,
      workers: 12,
      equipment: ['Concrete Pump', 'Vibrator', 'Crane'],
      notes: 'Concrete quality excellent, no delays',
    },
    {
      activity: 'Steel Frame Assembly',
      location: 'Building B - Ground Floor',
      progress: 45,
      workers: 8,
      equipment: ['Crane', 'Welding Equipment'],
      notes: 'Steel delivery delayed by 2 hours',
    },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive daily site log for a construction project. Project ID: ${projectId || 'N/A'}. Date: ${selectedDate}. Include weather conditions, safety incidents, work progress, team attendance, equipment status, and any delays or issues. Focus on Saudi construction sites with realistic weather data, safety protocols, and work activities. Format as professional daily report suitable for project management.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated daily site log. Review and adjust as needed.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate site log. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your daily site log has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your daily site log is being exported to PDF...");
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const totalWorkers = workProgress.reduce((sum, work) => sum + work.workers, 0);
  const totalEquipment = workProgress.reduce((sum, work) => sum + work.equipment.length, 0);
  const averageProgress = workProgress.reduce((sum, work) => sum + work.progress, 0) / workProgress.length;

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
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Daily Site Log</h1>
              <p className="text-xs text-muted-foreground">
                Weather, safety, progress, and team coordination
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
              Save Log
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Date & Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Date & Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Date</span>
                <span className="text-sm text-muted-foreground">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Shift</span>
                <span className="text-sm text-muted-foreground">Day Shift (06:00 - 18:00)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Site Manager</span>
                <span className="text-sm text-muted-foreground">Mohammed Al-Sabah</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Cloud className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Weather Conditions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(weatherData.condition)}
                  <span className="text-sm font-medium">{weatherData.condition}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold">{weatherData.temperature}°C</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity</span>
                  <span className="font-medium">{weatherData.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind</span>
                  <span className="font-medium">{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="font-medium">{weatherData.visibility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Safety Alert</span>
                  <Badge className={weatherData.safetyAlert ? 'bg-red-500/10 text-red-600 border-red-500/20 text-[9px]' : 'bg-green-500/10 text-green-600 border-green-500/20 text-[9px]'}>
                    {weatherData.safetyAlert ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Safety & Team */}
          <div className="lg:col-span-1 space-y-4">
            {/* Safety Incidents */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Safety Incidents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {safetyIncidents.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-green-600 font-medium">No incidents today</p>
                    <p className="text-[10px] text-muted-foreground">Great safety record!</p>
                  </div>
                ) : (
                  safetyIncidents.map((incident) => (
                    <div key={incident.id} className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{incident.type}</span>
                        <Badge className={`text-[9px] ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-1">{incident.description}</p>
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                        <span>By: {incident.reportedBy}</span>
                        <span>{incident.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Team Attendance */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Team Attendance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-primary">{totalWorkers}</div>
                    <div className="text-[9px] text-muted-foreground">Workers Present</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-green-600">100%</div>
                    <div className="text-[9px] text-muted-foreground">Attendance Rate</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Expected</span>
                    <span className="font-medium">{totalWorkers}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Present</span>
                    <span className="font-medium text-green-600">{totalWorkers}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Absent</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
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
                      AI Generate Log
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Add Photos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Work Progress */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Work Progress
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {workProgress.length} activities • {totalWorkers} workers • {totalEquipment} equipment
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {workProgress.map((work, index) => (
                  <div key={index} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold">{work.activity}</h3>
                        <p className="text-xs text-muted-foreground">{work.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{work.progress}%</div>
                        <div className="text-[9px] text-muted-foreground">Complete</div>
                      </div>
                    </div>
                    
                    <Progress value={work.progress} className="h-2 mb-3" />
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Workers</div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{work.workers}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Equipment</div>
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{work.equipment.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-1">Equipment Used</div>
                      <div className="flex flex-wrap gap-1">
                        {work.equipment.map((equipment, eqIndex) => (
                          <Badge key={eqIndex} className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                            {equipment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-2 bg-muted/30 rounded border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Notes</div>
                      <p className="text-xs leading-relaxed">{work.notes}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Daily Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-primary">{averageProgress.toFixed(0)}%</div>
                    <div className="text-[9px] text-muted-foreground">Avg Progress</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-green-600">{totalWorkers}</div>
                    <div className="text-[9px] text-muted-foreground">Workers</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-blue-600">{totalEquipment}</div>
                    <div className="text-[9px] text-muted-foreground">Equipment</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-amber-600">{safetyIncidents.length}</div>
                    <div className="text-[9px] text-muted-foreground">Incidents</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
