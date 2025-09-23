import { useState, useEffect } from "react";
import { 
  Home, Search, Plus, TrendingUp, MoreHorizontal, Calendar, Users, 
  CheckCircle, Clock, AlertTriangle, User, ExternalLink, BarChart3, 
  MapPin, Briefcase, FileText, DollarSign, Activity, ArrowUpRight, 
  ArrowDownRight, Target, Shield, Bell, Upload, UserCheck, Navigation,
  CreditCard, Building2, Smartphone, Settings, Eye
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ChatComposer } from "@/features/ai/components/ChatComposer";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";

export function DashboardContent() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapCenter, setMapCenter] = useState([24.7136, 46.6753]); // Riyadh
  const [activeTab, setActiveTab] = useState("overview");
  const [engineerSpecializations, setEngineerSpecializations] = useState<string[]>([]);
  const [revenueView, setRevenueView] = useState<'monthly' | 'yearly'>('monthly');
  const { profile, user } = useAuthStore();

  // Load engineer specializations
  useEffect(() => {
    const loadEngineerSpecializations = async () => {
      if (!user || profile?.role !== 'engineer' || user.source === 'mock') return;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        return;
      }

      try {
        const { data: engineerProfile, error } = await supabase
          .from('engineer_profiles')
          .select('specializations')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading engineer specializations:', error);
          return;
        }

        if (engineerProfile?.specializations) {
          setEngineerSpecializations(engineerProfile.specializations);
        }
      } catch (error) {
        console.error('Error loading engineer specializations:', error);
      }
    };

    loadEngineerSpecializations();
  }, [user, profile?.role]);

  // Get display name from profile
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.first_name || profile?.email?.split('@')[0] || 'User';
  };

  // Get role display name
  const getRoleDisplayName = () => {
    switch (profile?.role) {
      case 'engineer':
        if (engineerSpecializations.length > 0) {
          return engineerSpecializations.join(', ');
        }
        return 'Senior Structural Engineer';
      case 'client':
        return 'Project Manager';
      case 'enterprise':
        return 'Enterprise Manager';
      default:
        return 'Professional';
    }
  };

  // Realistic Saudi engineering project data
  const projects = [
    {
      id: 1,
      name: "NEOM City Infrastructure",
      client: "NEOM Authority",
      value: "2,400,000 SAR",
      progress: 67,
      status: 'active',
      location: "NEOM",
      engineer: getDisplayName(),
      dueDate: "2024-03-15",
      category: "Civil Engineering"
    },
    {
      id: 2,
      name: "Aramco Refinery Expansion",
      client: "Saudi Aramco",
      value: "1,800,000 SAR",
      progress: 34,
      status: 'active',
      location: "Dammam",
      engineer: getDisplayName(),
      dueDate: "2024-06-20",
      category: "Mechanical Engineering"
    },
    {
      id: 3,
      name: "SABIC Chemical Plant",
      client: "SABIC",
      value: "3,200,000 SAR",
      progress: 89,
      status: 'active',
      location: "Jubail",
      engineer: getDisplayName(),
      dueDate: "2024-02-28",
      category: "Chemical Engineering"
    },
    {
      id: 4,
      name: "Red Sea Development",
      client: "Red Sea Global",
      value: "950,000 SAR",
      progress: 45,
      status: 'active',
      location: "Red Sea Coast",
      engineer: getDisplayName(),
      dueDate: "2024-08-10",
      category: "Environmental Engineering"
    },
    {
      id: 5,
      name: "AlUla Heritage Site",
      client: "Royal Commission for AlUla",
      value: "1,200,000 SAR",
      progress: 78,
      status: 'active',
      location: "AlUla",
      engineer: getDisplayName(),
      dueDate: "2024-04-30",
      category: "Structural Engineering"
    }
  ];

  // Financial data
  const financialData = {
    monthlyRevenue: "594,900 SAR",
    yearlyRevenue: "5,200,000 SAR",
    growth: "+22%",
    yearlyGrowth: "+27%",
    totalEscrow: "280,000 SAR",
    availableEarnings: "156,750 SAR",
    pendingRelease: "123,250 SAR",
    totalInvoices: 26,
    paidInvoices: 12,
    pendingInvoices: 7,
    overdueInvoices: 3
  };

  // Project status data for charts
  const projectStatusData = [
    { name: 'All Jobs', value: 12, color: '#6b7280' },
    { name: 'Draft', value: 2, color: '#9ca3af' },
    { name: 'Open', value: 3, color: '#3b82f6' },
    { name: 'Quoted', value: 2, color: '#8b5cf6' },
    { name: 'In Progress', value: 3, color: '#f59e0b' },
    { name: 'Completed', value: 4, color: '#10b981' },
    { name: 'Cancelled', value: 1, color: '#ef4444' }
  ];

  // Monthly revenue trend data
  const monthlyRevenueData = [
    { month: 'Oct', revenue: 415000 },
    { month: 'Nov', revenue: 487000 },
    { month: 'Dec', revenue: 594900 }
  ];

  // Yearly revenue trend data
  const yearlyRevenueData = [
    { year: '2021', revenue: 3200000 },
    { year: '2022', revenue: 4100000 },
    { year: '2023', revenue: 5200000 }
  ];

  // Current revenue data based on view
  const revenueTrendData = revenueView === 'monthly' ? monthlyRevenueData : yearlyRevenueData;

  // Escrow breakdown data
  const escrowData = [
    { name: 'Available', value: 156750, color: '#10b981' },
    { name: 'Pending', value: 123250, color: '#f59e0b' }
  ];

  // Nearby jobs data
  const nearbyJobs = [
    {
      id: 1,
      title: "Site Engineer - Residential Tower",
      company: "Al-Rashid Construction",
      location: "Riyadh (2.3 km)",
      salary: "18,000 SAR",
      type: "Full-time",
      distance: "2.3 km",
      coordinates: [24.7200, 46.6800]
    },
    {
      id: 2,
      title: "Structural Inspector - Shopping Mall",
      company: "Saudi Development Co.",
      location: "Riyadh (4.1 km)",
      salary: "22,000 SAR", 
      type: "Contract",
      distance: "4.1 km",
      coordinates: [24.7000, 46.6900]
    },
    {
      id: 3,
      title: "MEP Engineer - Office Complex",
      company: "Modern Engineering",
      location: "Riyadh (6.7 km)",
      salary: "25,000 SAR",
      type: "Full-time", 
      distance: "6.7 km",
      coordinates: [24.6800, 46.7000]
    }
  ];

  // Job recommendations
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Structural Engineer",
      company: "Saudi Binladin Group",
      location: "Riyadh",
      salary: "25,000 - 35,000 SAR",
      type: "Contract",
      match: "95%",
      postedAt: "2 days ago"
    },
    {
      id: 2,
      title: "Civil Engineer - Infrastructure", 
      company: "NEOM Development Authority",
      location: "NEOM",
      salary: "18,000 - 28,000 SAR",
      type: "Full-time",
      match: "88%",
      postedAt: "1 week ago"
    },
    {
      id: 3,
      title: "Environmental Consultant",
      company: "Red Sea Global",
      location: "Red Sea Coast",
      salary: "20,000 - 30,000 SAR",
      type: "Contract",
      match: "92%",
      postedAt: "3 days ago"
    }
  ];

  // Activity and alerts
  const activities = [
    {
      id: 1,
      type: "payment",
      message: "Payment received: 85,000 SAR from NEOM Authority",
      time: "30 min ago",
      icon: "💰"
    },
    {
      id: 2,
      type: "project",
      message: "New project assignment: Structural Review",
      time: "2 hours ago", 
      icon: "🏗️"
    },
    {
      id: 3,
      type: "alert",
      message: "Milestone deadline approaching: Foundation Report",
      time: "4 hours ago",
      icon: "⚠️"
    },
    {
      id: 4,
      type: "message",
      message: "New message from Ahmed Al-Rashid",
      time: "6 hours ago",
      icon: "💬"
    }
  ];

  // Milestones due
  const milestonesDue = [
    {
      id: 1,
      title: "Foundation Analysis Report",
      project: "NEOM City Infrastructure",
      dueDate: "Dec 18",
      amount: "85,000 SAR",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Structural Design Phase 2",
      project: "Aramco Refinery Expansion",
      dueDate: "Dec 22",
      amount: "120,000 SAR",
      status: "Pending Review"
    },
    {
      id: 3,
      title: "Safety Compliance Report",
      project: "SABIC Chemical Plant",
      dueDate: "Dec 25",
      amount: "45,000 SAR",
      status: "Not Started"
    }
  ];

  // My tasks
  const myTasks = [
    {
      id: 1,
      title: "Structural Assessment - Villa Complex",
      subtitle: "Conduct structural integrity assessment for 15-unit villa complex in Riyadh",
      status: "in-progress",
      priority: "high",
      category: "Structural",
      dueTime: "2:00 PM",
      assignee: { name: "Ahmed Al-Rashid", avatar: "AR" }
    },
    {
      id: 2,
      title: "Bridge Load Analysis",
      subtitle: "Detailed load-bearing analysis for highway bridge maintenance project",
      status: "in-progress",
      priority: "high",
      category: "Civil",
      dueTime: "4:30 PM",
      assignee: { name: "Mohammed Al-Shehri", avatar: "MS" }
    },
    {
      id: 3,
      title: "Site Inspection - Industrial Facility",
      subtitle: "Safety and compliance inspection for petrochemical plant expansion",
      status: "pending",
      priority: "high",
      category: "Industrial",
      dueTime: "Tomorrow",
      assignee: { name: "Tariq Al-Harbi", avatar: "TH" }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-info" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-sidebar-border';
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="p-6">
        <div className="space-y-4 max-w mx-auto">
          
          {/* Row 1: Header & Search */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Welcome Header */}
           <div className="flex-1 lg:w-2/3">
             <Card className="h-full">
    <CardContent className="p-4 flex flex-col h-full">
      <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-foreground">
                        Welcome back, {getDisplayName()}
                      </h1>
                      <p className="text-muted-foreground">
                        {getCurrentDate()} • {getRoleDisplayName()}
                      </p>
                    </div>
        </div>
                </div>
      {/* Inline AI Assistant */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">AI Assistant</h3>
          <Button asChild variant="outline" size="sm">
            <Link to="/ai">Open</Link>
          </Button>
        </div>
        <ChatComposer isCompact />
      </div>
              </CardContent>
            </Card>
          </div>
          
          {/* (moved AI Assistant into header card) */}
          </div>

          {/* Row 2: Project Overview */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Active Projects Card */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <BarChart3 className="w-5 h-5" />
                   Active Projects
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary">{projects.length}</div>
                  <p className="text-sm text-muted-foreground">Total Active Projects</p>
                </div>
                
                {/* Donut Chart */}
                <div className="h-32 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Current Projects */}
           <div className="lg:w-2/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="px-4 pt-4 pb-0">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <Target className="w-5 h-5" />
                   Current Projects
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={project.id} className="space-y-4">
                      <div className="mt-2">
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Value</span>
                          <p className="font-medium text-success">{project.value}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Due Date</span>
                          <p className="font-medium">{project.dueDate}</p>
                        </div>
                      </div>
                      
                      {index < 2 && <hr className="border-sidebar-border" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>

          {/* Row 3: Job Recommendations & Browse Jobs */}
          <div className="flex gap-4">
             {/* AI Job Recommendations */}
             <div className="flex-1">
               <Card className="h-full flex flex-col">
                 <CardHeader className="p-4">
                   <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                     <Briefcase className="w-5 h-5" />
                     AI Job Recommendations
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="flex-1 flex flex-col p-4">
                  <div className="space-y-3 flex-1">
                    {jobRecommendations.map((job) => (
                      <div key={job.id} className="p-3 border border-sidebar-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-0">
                          <h4 className="font-medium text-foreground text-sm">{job.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {job.match}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-success">{job.salary.split(' - ')[0]}</span>
                          <span className="text-xs text-muted-foreground">{job.postedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>

             {/* Browse Jobs */}
             <div className="flex-1">
               <Card className="h-full flex flex-col">
                 <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                  <Navigation className="w-5 h-5" />
                  Available Jobs
                </CardTitle>
                 </CardHeader>
                 <CardContent className="flex-1 flex flex-col p-4">
                  <div className="space-y-3 flex-1">
                    {nearbyJobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-3 p-3 border border-sidebar-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">{job.title}</h4>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-success">{job.salary}</span>
                            <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{job.distance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    <Navigation className="w-4 h-4 mr-2" />
                    View All Nearby Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 4: Nearby Jobs Map - Full Width */}
          <div className="w-full">
           {/* Nearby Jobs Map */}
           <div className="w-full">
             <Card>
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <MapPin className="w-5 h-5" />
                   Nearby Jobs (50km radius)
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Map */}
                  <div className="relative h-64 rounded-lg border border-sidebar-border overflow-hidden flex-1">
                    {/* Real Map */}
                    <iframe
                      className="absolute inset-0 w-full h-full border-0"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=46.5,24.4,46.8,24.7&layer=mapnik&marker=24.6,46.6"
                      title="Nearby Jobs Map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Job Location Markers */}
                    {nearbyJobs.map((job, index) => (
                      <div 
                        key={job.id}
                        className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg animate-pulse"
                        style={{
                          top: `${20 + (index * 25)}%`,
                          left: `${30 + (index * 20)}%`
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap border border-sidebar-border">
                          {job.title.split(' - ')[0]} ({job.distance})
                        </div>
                      </div>
                    ))}

                    {/* Your Location */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                        Your Location
                      </div>
                    </div>

                    {/* Distance Circles */}
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-primary/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-primary/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-44 h-44 border border-primary/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* Leads List */}
                  <div className="w-64 h-64 rounded-lg border border-sidebar-border bg-background p-3 overflow-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Leads</h4>
                      <span className="text-xs text-muted-foreground">{nearbyJobs.length} nearby</span>
                    </div>
                    <div className="space-y-2">
                      {nearbyJobs.map((job) => (
                        <div key={job.id} className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{job.title.split(' - ')[0]}</span>
                            <span className="text-xs text-muted-foreground">{job.distance}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px]">{job.type || 'Job'}</Badge>
                            <span className="text-xs text-muted-foreground">{job.location || 'Riyadh'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Your Location</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>Job Sites</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Full Map View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>

          {/* Row 5: Financial Overview */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Invoice Overview */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <FileText className="w-5 h-5" />
                   Invoice Overview
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{financialData.totalInvoices}</div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Paid</p>
                          <p className="text-xs text-muted-foreground">{financialData.paidInvoices} invoices</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-success">324,650 SAR</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-warning rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Pending</p>
                          <p className="text-xs text-muted-foreground">{financialData.pendingInvoices} invoices</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-warning">128,400 SAR</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Overdue</p>
                          <p className="text-xs text-muted-foreground">{financialData.overdueInvoices} invoices</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">45,750 SAR</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Monthly Revenue */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                     <TrendingUp className="w-5 h-5" />
                     {revenueView === 'monthly' ? 'Monthly Revenue' : 'Yearly Revenue'}
                   </CardTitle>
                   <div className="flex bg-muted rounded-lg p-1">
                     <Button
                       variant={revenueView === 'monthly' ? 'default' : 'ghost'}
                       size="sm"
                       onClick={() => setRevenueView('monthly')}
                       className="h-7 px-3 text-xs"
                     >
                       Monthly
                     </Button>
                     <Button
                       variant={revenueView === 'yearly' ? 'default' : 'ghost'}
                       size="sm"
                       onClick={() => setRevenueView('yearly')}
                       className="h-7 px-3 text-xs"
                     >
                       Yearly
                     </Button>
                   </div>
                 </div>
                
                {/* Revenue Trend Chart */}
                <div className="mt-4 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrendData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                        dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
                      />
                      <XAxis 
                        dataKey={revenueView === 'monthly' ? 'month' : 'year'} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                 <div className="mb-4">
                   <div className="text-3xl font-bold text-success">
                     {revenueView === 'monthly' ? financialData.monthlyRevenue : financialData.yearlyRevenue}
                   </div>
                   <p className="text-sm text-muted-foreground">
                     {revenueView === 'monthly' ? 'This Month' : 'This Year'}
                   </p>
                 </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {revenueView === 'monthly' ? 'Last Month' : 'Last Year'}
                    </span>
                    <span className="text-sm font-medium">
                      {revenueView === 'monthly' ? '487,300 SAR' : '4,100,000 SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Growth</span>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-success" />
                      <span className="text-sm font-medium text-success">
                        {revenueView === 'monthly' ? financialData.growth : financialData.yearlyGrowth}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Project Value</span>
                    <span className="text-sm font-medium">48,750 SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Escrow & Earnings */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <Shield className="w-5 h-5" />
                   Escrow & Earnings
                 </CardTitle>
                
                {/* Escrow Breakdown Chart */}
                <div className="mt-4 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={escrowData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={30}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        <Cell fill="hsl(var(--success))" />
                        <Cell fill="hsl(var(--warning))" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                 <div className="space-y-4">
                   <div>
                     <div className="text-2xl font-bold text-info">{financialData.totalEscrow}</div>
                     <p className="text-sm text-muted-foreground">Total in Escrow</p>
                   </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available Earnings</span>
                      <span className="text-sm font-medium text-success">{financialData.availableEarnings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Release</span>
                      <span className="text-sm font-medium text-warning">{financialData.pendingRelease}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-auto">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>

          {/* Row 6: Activity & Management */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Activity & Alerts */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <Bell className="w-5 h-5" />
                   Activity & Alerts
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-sidebar-border rounded-lg">
                      <div className="text-lg">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" style={{ marginTop: 'auto' }}>
                  <Activity className="w-4 h-4 mr-2" />
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

           {/* Next Milestones Due */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <Target className="w-5 h-5" />
                   Next Milestones Due
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-3">
                  {milestonesDue.map((milestone) => (
                    <div key={milestone.id} className="p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">{milestone.title}</h4>
                        <span className="text-xs text-muted-foreground">{milestone.dueDate}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{milestone.project}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-success">{milestone.amount}</span>
                        <Badge variant="secondary" className="text-xs">
                          {milestone.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-auto mt-4">
                  <Target className="w-4 h-4 mr-2" />
                  View All Milestones
                </Button>
              </CardContent>
            </Card>
          </div>

           {/* My Tasks */}
           <div className="lg:w-1/3">
             <Card className="h-full flex flex-col">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <CheckCircle className="w-5 h-5" />
                   My Tasks
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-3">
                  {myTasks.map((task) => (
                    <div key={task.id} className="p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{task.subtitle}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{task.dueTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-auto">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View All Tasks
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>

          {/* Row 7: Quick Actions */}
          <div className="w-full">
           {/* Quick Actions */}
           <div className="w-full">
             <Card>
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                   <Plus className="w-5 h-5" />
                   Quick Actions
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Browse Jobs */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-info" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Browse Jobs</p>
                      <p className="text-xs text-muted-foreground">Find new opportunities</p>
                    </div>
                  </Button>

                  {/* Check-In */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Check-In</p>
                      <p className="text-xs text-muted-foreground">Mark your location</p>
                    </div>
                  </Button>

                  {/* Upload Deliverable */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Upload Deliverable</p>
                      <p className="text-xs text-muted-foreground">Submit project files</p>
                    </div>
                  </Button>

                  {/* Emergency Contact */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-xs text-muted-foreground">Safety & support</p>
                    </div>
                  </Button>

                  {/* Settings */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-muted/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Settings</p>
                      <p className="text-xs text-muted-foreground">Account preferences</p>
                    </div>
                  </Button>

                  {/* Profile */}
                  <Button variant="outline" className="h-16 flex items-center justify-start gap-3 p-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Profile</p>
                      <p className="text-xs text-muted-foreground">Manage your profile</p>
                    </div>
                  </Button>

                </div>
              </CardContent>
            </Card>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
}
