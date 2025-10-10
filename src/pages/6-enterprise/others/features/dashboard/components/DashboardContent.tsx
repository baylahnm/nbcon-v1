import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Search, Plus, TrendingUp, MoreHorizontal, Calendar, Users, 
  Clock, AlertTriangle, User, ExternalLink, BarChart3, 
  MapPin, Briefcase, FileText, DollarSign, Activity, ArrowUpRight, 
  ArrowDownRight, Shield, Bell, Upload, UserCheck, Navigation,
  CreditCard, Building2, Smartphone, Settings, Eye, MessageSquare,
  X, ChevronDown, CheckSquare, Columns, Rows, Wrench, Brush, Palette,
  Moon, Sun, Sunset, Paintbrush, CircleDot, Waves, TreePine, Layers, Sparkles,
  Target, Building, ShoppingCart, PieChart as PieChartIcon, FolderOpen,
  UserPlus, FileSpreadsheet, Handshake, Truck, ClipboardList
} from "lucide-react";
import { useInlineDashboardEditStore } from "../../../stores/inlineDashboardEdit";
import { DashboardEditMode } from './DashboardEditMode';
import { EditableWrapper } from './EditableWrapper';
import { Toolbar } from '../../../../../1-HomePage/others/components/toolbar/Toolbar';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../1-HomePage/others/components/ui/avatar";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../1-HomePage/others/components/ui/popover";
import { ChatComposer } from "../../ai/components/ChatComposer";
import { useAiStore } from "../../ai/store/useAiStore";
import { MessageBubble } from "../../ai/components/MessageBubble";
import { Link } from "react-router-dom";
import { R } from "../../../../../1-HomePage/others/lib/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../1-HomePage/others/components/ui/tabs";
import { useAuthStore } from "../../../stores/auth";
import { supabase } from "@/shared/supabase/client";
import { useThemeStore } from "../../../stores/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../1-HomePage/others/components/ui/dropdown-menu";

// AI Conversation Preview Component
function AIConversationPreview() {
  const { getActiveMessages, settings } = useAiStore();
  const activeMessages = getActiveMessages();
  const lastMessages = activeMessages.slice(-3); // Show last 3 messages

  if (lastMessages.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          {settings.rtl ? 'ابدأ محادثة جديدة' : 'Start a new conversation'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {lastMessages.map((message) => (
        <div key={message.id} className="text-xs">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-muted-foreground text-xs mb-1">
                {message.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className="text-foreground text-xs line-clamp-2">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardContent() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapCenter, setMapCenter] = useState([24.7136, 46.6753]); // Riyadh
  const [activeTab, setActiveTab] = useState("overview");
  const [engineerSpecializations, setEngineerSpecializations] = useState<string[]>([]);
  const [revenueView, setRevenueView] = useState<'monthly' | 'yearly'>('monthly');
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [dashboardComponents, setDashboardComponents] = useState<any[]>([]);
  const [hoveredBorder, setHoveredBorder] = useState<string | null>(null);
  
  // Ref and state for Quick Actions scroll arrows
  const quickActionsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [containerLayout, setContainerLayout] = useState({
    rows: 1,
    columns: 1,
    gridTemplate: '1fr'
  });
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();
  
  // Inline edit mode
  const { isEditMode, toggleEditMode } = useInlineDashboardEditStore();

  // Function to update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    if (!quickActionsContainerRef.current) return;
    
    const container = quickActionsContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Show left arrow if not at the beginning
    setShowLeftArrow(scrollLeft > 0);
    
    // Show right arrow if not at the end (with small tolerance for floating point precision)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Function to handle horizontal scrolling with arrow buttons
  const scrollQuickActions = (direction: 'left' | 'right') => {
    if (!quickActionsContainerRef.current) return;
    
    const container = quickActionsContainerRef.current;
    const buttonWidth = 120; // Approximate width of each button + gap
    const scrollAmount = buttonWidth;
    
    if (direction === 'left') {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    // Update arrow visibility after scrolling
    setTimeout(updateArrowVisibility, 300); // Wait for smooth scroll to complete
  };

  // useEffect for Quick Actions scroll tracking
  useEffect(() => {
    const container = quickActionsContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowVisibility();

    // Add scroll event listener
    container.addEventListener('scroll', updateArrowVisibility);
    
    // Add resize event listener to handle window size changes
    const handleResize = () => {
      setTimeout(updateArrowVisibility, 100); // Small delay to ensure layout has updated
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateArrowVisibility]);

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

  // Get AI route based on role
  const getAIRoute = () => {
    switch (profile?.role) {
      case 'engineer':
        return R.engineer.ai;
      case 'client':
        return R.client.ai;
      case 'enterprise':
        return R.enterprise.ai;
      default:
        return '/ai'; // fallback
    }
  };

  // Component options for the add component popup
  const componentOptions = [
    { id: 'chart', name: 'Chart', icon: BarChart3, description: 'Add a data visualization chart' },
    { id: 'table', name: 'Data Table', icon: FileText, description: 'Add a data table component' },
    { id: 'kpi', name: 'KPI Card', icon: TrendingUp, description: 'Add a key performance indicator card' },
    { id: 'activity', name: 'Activity Feed', icon: Activity, description: 'Add an activity feed component' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Add a calendar widget' },
    { id: 'notes', name: 'Notes', icon: FileText, description: 'Add a notes component' },
    { id: 'weather', name: 'Weather', icon: Navigation, description: 'Add a weather widget' },
    { id: 'tasks', name: 'Task List', icon: CheckSquare, description: 'Add a task management component' }
  ];

  const handleAddComponent = (componentId: string) => {
    console.log(`Adding component: ${componentId}`);
    
    // Component routing system
    const componentRoutes = {
      // Simple widgets - show popup cards
      'kpi': () => showKPICardPopup(),
      'notes': () => showNotesPopup(),
      'weather': () => showWeatherPopup(),
      
      // Data components - show popup cards with configuration
      'chart': () => showChartPopup(),
      'table': () => showDataTablePopup(),
      'activity': () => showActivityFeedPopup(),
      
      // Complex components - navigate to dedicated pages
      'calendar': () => navigateToCalendarPage(),
      'tasks': () => navigateToTaskListPage()
    };

    // Execute the appropriate action
    const action = componentRoutes[componentId as keyof typeof componentRoutes];
    if (action) {
      action();
    } else {
      console.warn(`No route defined for component: ${componentId}`);
    }
    
    setIsAddComponentOpen(false);
  };

  // Popup card functions for simple widgets
  const showKPICardPopup = () => {
    setActivePopup('kpi');
  };

  const showNotesPopup = () => {
    setActivePopup('notes');
  };

  const showWeatherPopup = () => {
    setActivePopup('weather');
  };

  // Popup card functions for data components
  const showChartPopup = () => {
    setActivePopup('chart');
  };

  const showDataTablePopup = () => {
    setActivePopup('table');
  };

  const showActivityFeedPopup = () => {
    setActivePopup('activity');
  };

  // Page navigation functions for complex components
  const navigateToCalendarPage = () => {
    navigate('/calendar');
  };

  const navigateToTaskListPage = () => {
    // For now, navigate to jobs page as task management is integrated there
    navigate('/jobs');
  };

  // Function to add components to dashboard
  const addComponentToDashboard = (componentData: any) => {
    setDashboardComponents(prev => [...prev, componentData]);
    console.log('Component added to dashboard:', componentData);
  };

  // Function to handle border hover actions
  const handleBorderAction = (action: string) => {
    console.log(`Border action: ${action}`);
    
    setContainerLayout(prev => {
      let newLayout = { ...prev };
      
      switch (action) {
        case 'add-column-left':
          newLayout.columns += 1;
          break;
        case 'add-column-right':
          newLayout.columns += 1;
          break;
        case 'add-row-top':
          newLayout.rows += 1;
          break;
        case 'add-row-bottom':
          newLayout.rows += 1;
          break;
        default:
          break;
      }
      
      return newLayout;
    });

    if (action === 'add-row-bottom') {
      const placeholderId = `placeholder-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      setDashboardComponents(prev => ([
        ...prev,
        {
          id: placeholderId,
          title: 'Empty Cell',
          type: 'placeholder',
          createdAt: Date.now()
        }
      ]));
    }
  };

  // Function to handle toolbar tool selection
  const handleToolbarToolSelect = (tool: string) => {
    console.log(`Toolbar tool selected: ${tool}`);
    switch (tool) {
      case 'select':
        setSelectedComponentId(null);
        break;
      case 'add-row':
        handleBorderAction('add-row-bottom');
        break;
      case 'add-column':
        handleBorderAction('add-column-right');
        break;
      case 'add-component':
        setIsAddComponentOpen(true);
        break;
      case 'remove-component':
        setDashboardComponents(prev => {
          if (prev.length === 0) return prev;
          if (selectedComponentId) {
            const next = prev.filter(c => c.id !== selectedComponentId);
            setSelectedComponentId(null);
            return next;
          }
          // Remove last if none selected
          const next = [...prev];
          next.pop();
          return next;
        });
        break;
      default:
        break;
    }
  };

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
      message: "New message from Nasser Baylah",
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



  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardEditMode>
      <div className="flex-1 min-h-screen">
        <div className="p-6">
          <div className="space-y-6 max-w mx-auto">
          
          {/* Toolbar */}
          {isToolbarVisible && (
            <Toolbar
              onToolSelect={handleToolbarToolSelect}
              onClose={() => setIsToolbarVisible(false)}
              isOpen={isToolbarVisible}
              onToggle={() => setIsToolbarVisible(!isToolbarVisible)}
            />
          )}
          
          {/* Row 1: Header with AI Assistant */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Welcome Header */}
           <div className="flex-1 lg:w-2/3">
             <EditableWrapper 
               componentId="welcome-header"
               componentType="Welcome Header"
               data-editable-component
             >
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
        <div className="flex items-center gap-2">
          <Button 
            variant="default"
            size="sm"
            onClick={toggleEditMode}
            className="flex items-center gap-2 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <Brush className="w-4 h-4 transition-colors duration-200 text-primary-foreground" />
            {isEditMode ? 'Exit Edit' : 'Customize'}
          </Button>
        </div>
                </div>
      {/* Inline AI Assistant */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">AI Assistant</h3>
          <Button asChild variant="outline" size="sm">
            <Link to={getAIRoute()}>Open</Link>
          </Button>
        </div>
        <div className="bg-background border rounded-lg p-4 space-y-3">
          <AIConversationPreview />
          <ChatComposer isCompact />
        </div>
      </div>
              </CardContent>
            </Card>
            </EditableWrapper>
          </div>
          
          </div>

          {/* Row 2: Quick Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
           {/* Quick Actions */}
           <div className="w-full">
             <EditableWrapper 
               componentId="quick-actions"
               componentType="Quick Actions"
               data-editable-component
             >
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px' }}>
                      <Plus className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                   <div className="relative quick-actions-container">
                     {/* Arrow Navigation */}
                     <div className="flex justify-between items-center mb-2">
                       <div className="w-10">
                         {showLeftArrow && (
                           <button 
                             onClick={() => scrollQuickActions('left')}
                             className="p-1.5 bg-background border border-border rounded-full hover:bg-muted transition-all duration-200 shadow-sm opacity-100"
                             aria-label="Scroll left"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                             </svg>
                           </button>
                         )}
                       </div>
                       <span className="text-xs text-muted-foreground">Swipe or use arrows</span>
                       <div className="w-10 flex justify-end">
                         {showRightArrow && (
                           <button 
                             onClick={() => scrollQuickActions('right')}
                             className="p-1.5 bg-background border border-border rounded-full hover:bg-muted transition-all duration-200 shadow-sm opacity-100"
                             aria-label="Scroll right"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                             </svg>
                           </button>
                         )}
                       </div>
                     </div>

                     <div 
                       ref={quickActionsContainerRef}
                       className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80 hide-scrollbar"
                       style={{
                         scrollBehavior: 'smooth'
                       }}
                     >
                    
                    {profile?.role === 'enterprise' ? (
                      <>
                        {/* Team Management */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/team">
                            <Users className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium">Team</span>
                          </Link>
                        </Button>

                        {/* Projects */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/projects">
                            <FolderOpen className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-medium">Projects</span>
                          </Link>
                        </Button>

                        {/* Finance */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/finance">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                            <span className="text-sm font-medium">Finance</span>
                          </Link>
                        </Button>

                        {/* Procurement */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/procurement">
                            <ShoppingCart className="w-6 h-6 text-orange-600" />
                            <span className="text-sm font-medium">Procurement</span>
                          </Link>
                        </Button>

                        {/* Analytics */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/analytics">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                            <span className="text-sm font-medium">Analytics</span>
                          </Link>
                        </Button>

                        {/* Messages */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/messages">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium">Messages</span>
                          </Link>
                        </Button>

                        {/* Calendar */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/enterprise/calendar">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            <span className="text-sm font-medium">Calendar</span>
                          </Link>
                        </Button>

                      </>
                    ) : (
                      <>
                        {/* Browse Jobs */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/jobs">
                            <Briefcase className="w-6 h-6 text-info" />
                            <span className="text-sm font-medium">Browse Jobs</span>
                          </Link>
                        </Button>

                        {/* Check-In */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/checkin">
                            <MapPin className="w-6 h-6 text-success" />
                            <span className="text-sm font-medium">Check-In</span>
                          </Link>
                        </Button>

                        {/* Upload Deliverable */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/job/upload">
                            <Upload className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">Upload</span>
                          </Link>
                        </Button>

                        {/* Messages */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/messages">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium">Messages</span>
                          </Link>
                        </Button>

                        {/* Calendar */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/calendar">
                            <Calendar className="w-6 h-6 text-purple-600" />
                            <span className="text-sm font-medium">Calendar</span>
                          </Link>
                        </Button>

                        {/* Profile */}
                        <Button asChild variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Link to="/engineer/profile">
                            <User className="w-6 h-6 text-orange-600" />
                            <span className="text-sm font-medium">Profile</span>
                          </Link>
                        </Button>
                      </>
                    )}

                    {/* Theme Toggle */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 p-4 flex-1">
                          <Palette className="w-6 h-6 text-purple-600" />
                          <span className="text-sm font-medium">Theme</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border theme-toggle-menu">
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('light')}>
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('dark')}>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('wazeer')}>
                          <Palette className="h-4 w-4 mr-2" />
                          Wazeer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('sunset')}>
                          <Sunset className="h-4 w-4 mr-2" />
                          Sunset
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('abstract')}>
                          <Paintbrush className="h-4 w-4 mr-2" />
                          Abstract
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('nika')}>
                          <CircleDot className="h-4 w-4 mr-2" />
                          Nika
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('lagoon')}>
                          <Waves className="h-4 w-4 mr-2" />
                          Lagoon
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('dark-nature')}>
                          <TreePine className="h-4 w-4 mr-2" />
                          Dark Nature
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('full-gradient')}>
                          <Layers className="h-4 w-4 mr-2" />
                          Full Gradient
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => useThemeStore.getState().applyPreset('sea-purple')}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Sea Purple
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    </div>
                  </div>
                </CardContent>
              </Card>
              </EditableWrapper>
            </div>
          </div>

          {/* Row 3: Add New Component Empty State */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full">
              <EditableWrapper 
                componentId="add-new-component"
                componentType="Add New Component"
                data-editable-component
              >
                <Popover open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
                  <PopoverTrigger asChild>
                    <div className="min-h-[200px]">
                      {dashboardComponents.length > 0 ? (
                        <div 
                          className="grid gap-4 h-full"
                          style={{
                            gridTemplateColumns: `repeat(${containerLayout.columns}, 1fr)`,
                            gridTemplateRows: `repeat(${containerLayout.rows}, 1fr)`
                          }}
                        >
                          {dashboardComponents.map((component) => (
                            <Card 
                              key={component.id} 
                              className={`p-4 ${selectedComponentId === component.id ? 'ring-2 ring-primary' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponentId(component.id);
                              }}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">{component.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 text-xs text-muted-foreground">
                                  <div>Type: {component.type}</div>
                                  {component.chartType && <div>Chart Type: {component.chartType}</div>}
                                  {component.dataSource && <div>Data Source: {component.dataSource}</div>}
                                  <div>Added: {new Date(component.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    Configure
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs text-destructive"
                                    onClick={() => {
                                      setDashboardComponents(prev => 
                                        prev.filter(comp => comp.id !== component.id)
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          {/* Empty grid cells for layout visualization */}
                          {Array.from({ length: (containerLayout.rows * containerLayout.columns) - dashboardComponents.length }).map((_, index) => (
                            <div 
                              key={`empty-${index}`} 
                              className="border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center min-h-[100px]"
                            >
                              <span className="text-muted-foreground/50 text-sm">Empty Cell</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative text-center py-8 text-muted-foreground border-2 border-dashed border-sidebar-border rounded-lg cursor-pointer hover:border-primary/50 hover:text-primary transition-colors">
                          {/* Left Border - Add Column */}
                          <div 
                            className="absolute left-0 top-0 w-6 h-full hover:bg-primary/20 transition-colors cursor-pointer group z-10"
                            onMouseEnter={() => setHoveredBorder('left')}
                            onMouseLeave={() => setHoveredBorder(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBorderAction('add-column-left');
                            }}
                          >
                            {hoveredBorder === 'left' && (
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                                <Columns className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Right Border - Add Column */}
                          <div 
                            className="absolute right-0 top-0 w-6 h-full hover:bg-primary/20 transition-colors cursor-pointer group z-10"
                            onMouseEnter={() => setHoveredBorder('right')}
                            onMouseLeave={() => setHoveredBorder(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBorderAction('add-column-right');
                            }}
                          >
                            {hoveredBorder === 'right' && (
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                                <Columns className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Top Border - Add Row */}
                          <div 
                            className="absolute top-0 left-0 w-full h-6 hover:bg-primary/20 transition-colors cursor-pointer group z-10"
                            onMouseEnter={() => setHoveredBorder('top')}
                            onMouseLeave={() => setHoveredBorder(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBorderAction('add-row-top');
                            }}
                          >
                            {hoveredBorder === 'top' && (
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                                <Rows className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Bottom Border - Add Row */}
                          <div 
                            className="absolute bottom-0 left-0 w-full h-6 hover:bg-primary/20 transition-colors cursor-pointer group z-10"
                            onMouseEnter={() => setHoveredBorder('bottom')}
                            onMouseLeave={() => setHoveredBorder(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBorderAction('add-row-bottom');
                            }}
                          >
                            {hoveredBorder === 'bottom' && (
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                                <Rows className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center gap-2 relative z-0">
                            <Plus className="w-6 h-6" />
                            <p className="text-sm font-medium">Add new component here</p>
                            <p className="text-xs opacity-75">Click to choose from available components</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0 bg-card border-card" align="center">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-card-foreground">Add Component</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddComponentOpen(false)}
                          className="hover:bg-muted/50 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {componentOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <Button
                              key={option.id}
                              variant="outline"
                              className="h-auto p-2 flex flex-col items-center gap-1 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 group"
                              onClick={() => handleAddComponent(option.id)}
                            >
                              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <IconComponent className="w-3 h-3 text-primary" />
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-card-foreground leading-tight">
                                  {option.name}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </EditableWrapper>
            </div>
          </div>

        </div>
      </div>

    </div>

    {/* Component Popup Cards */}
    {activePopup && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4">
          {activePopup === 'kpi' && <KPICardPopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
          {activePopup === 'notes' && <NotesPopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
          {activePopup === 'weather' && <WeatherPopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
          {activePopup === 'chart' && <ChartPopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
          {activePopup === 'table' && <DataTablePopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
          {activePopup === 'activity' && <ActivityFeedPopup onClose={() => setActivePopup(null)} onAdd={addComponentToDashboard} />}
        </div>
      </div>
    )}
    </DashboardEditMode>
  );
}

// KPI Card Popup Component
const KPICardPopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Add KPI Card</h3>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">KPI Title</label>
        <Input placeholder="e.g., Monthly Revenue" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Value</label>
        <Input placeholder="e.g., 594,900 SAR" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Change</label>
        <Input placeholder="e.g., +12.5%" className="mt-1" />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Add KPI Card</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  </div>
);

// Notes Popup Component
const NotesPopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Add Notes</h3>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Note Title</label>
        <Input placeholder="e.g., Project Update" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Content</label>
        <textarea 
          className="w-full p-2 border border-border rounded-md resize-none h-24"
          placeholder="Enter your notes here..."
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Add Notes</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  </div>
);

// Weather Popup Component
const WeatherPopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Add Weather Widget</h3>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input placeholder="e.g., Riyadh, Saudi Arabia" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Temperature Unit</label>
        <select className="w-full p-2 border border-border rounded-md mt-1">
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
        </select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Add Weather Widget</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  </div>
);

// Chart Popup Component
const ChartPopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => {
  const [chartType, setChartType] = useState('line');
  const [dataSource, setDataSource] = useState('');
  const [chartTitle, setChartTitle] = useState('');

  const handleAddChart = () => {
    if (!dataSource || !chartTitle) {
      alert('Please fill in all required fields');
      return;
    }

    // Create chart component data
    const chartData = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      chartType,
      dataSource,
      title: chartTitle,
      createdAt: new Date().toISOString()
    };

    // Add to dashboard
    onAdd(chartData);
    
    // Show success message
    alert(`Chart "${chartTitle}" added successfully!`);
    
    // Close popup
    onClose();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add Chart</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Chart Type</label>
          <select 
            className="w-full p-2 border border-border rounded-md mt-1"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Data Source</label>
          <select 
            className="w-full p-2 border border-border rounded-md mt-1"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
          >
            <option value="">Select a data source...</option>
            <optgroup label="Financial Data">
              <option value="monthly-revenue">Monthly Revenue</option>
              <option value="yearly-revenue">Yearly Revenue</option>
              <option value="project-budget">Project Budget</option>
              <option value="payment-status">Payment Status</option>
              <option value="expense-tracking">Expense Tracking</option>
            </optgroup>
            <optgroup label="Project Data">
              <option value="active-projects">Active Projects</option>
              <option value="project-timeline">Project Timeline</option>
              <option value="project-status">Project Status</option>
              <option value="team-performance">Team Performance</option>
              <option value="project-milestones">Project Milestones</option>
            </optgroup>
            <optgroup label="User & Network Data">
              <option value="user-activity">User Activity</option>
              <option value="network-connections">Network Connections</option>
              <option value="engineer-specializations">Engineer Specializations</option>
              <option value="client-interactions">Client Interactions</option>
              <option value="team-collaboration">Team Collaboration</option>
            </optgroup>
            <optgroup label="Job & Task Data">
              <option value="job-listings">Job Listings</option>
              <option value="task-completion">Task Completion</option>
              <option value="job-applications">Job Applications</option>
              <option value="skill-demand">Skill Demand</option>
              <option value="workload-distribution">Workload Distribution</option>
            </optgroup>
            <optgroup label="Analytics Data">
              <option value="dashboard-metrics">Dashboard Metrics</option>
              <option value="performance-kpis">Performance KPIs</option>
              <option value="engagement-stats">Engagement Statistics</option>
              <option value="conversion-rates">Conversion Rates</option>
              <option value="growth-metrics">Growth Metrics</option>
            </optgroup>
            <optgroup label="Calendar & Events">
              <option value="calendar-events">Calendar Events</option>
              <option value="meeting-schedule">Meeting Schedule</option>
              <option value="deadline-tracking">Deadline Tracking</option>
              <option value="event-attendance">Event Attendance</option>
            </optgroup>
            <optgroup label="Learning & Development">
              <option value="course-progress">Course Progress</option>
              <option value="certification-status">Certification Status</option>
              <option value="skill-assessments">Skill Assessments</option>
              <option value="training-completion">Training Completion</option>
            </optgroup>
            <optgroup label="Communication Data">
              <option value="message-volume">Message Volume</option>
              <option value="response-times">Response Times</option>
              <option value="support-tickets">Support Tickets</option>
              <option value="feedback-ratings">Feedback Ratings</option>
            </optgroup>
            <optgroup label="External Data Sources">
              <option value="pdf-document">PDF Document</option>
              <option value="excel-spreadsheet">Excel Spreadsheet</option>
              <option value="external-link">External Link</option>
              <option value="api-endpoint">API Endpoint</option>
              <option value="script-output">Script Output</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Chart Title</label>
          <Input 
            placeholder="e.g., Monthly Revenue Trend" 
            className="mt-1"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button className="flex-1" onClick={handleAddChart}>Add Chart</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

// Data Table Popup Component
const DataTablePopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Add Data Table</h3>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Table Title</label>
        <Input placeholder="e.g., Project List" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Data Source</label>
        <Input placeholder="e.g., Projects API" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Columns</label>
        <Input placeholder="e.g., Name, Status, Progress" className="mt-1" />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Add Data Table</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  </div>
);

// Activity Feed Popup Component
const ActivityFeedPopup = ({ onClose, onAdd }: { onClose: () => void; onAdd: (component: any) => void }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Add Activity Feed</h3>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Feed Title</label>
        <Input placeholder="e.g., Recent Activity" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Activity Source</label>
        <select className="w-full p-2 border border-border rounded-md mt-1">
          <option value="all">All Activities</option>
          <option value="projects">Projects Only</option>
          <option value="users">User Activities</option>
          <option value="system">System Events</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Max Items</label>
        <Input type="number" placeholder="10" className="mt-1" />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Add Activity Feed</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  </div>
);

