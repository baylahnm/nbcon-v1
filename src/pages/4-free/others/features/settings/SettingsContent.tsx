import { useState } from "react";
import { useAuthStore } from "../../stores/auth";
import { getUserDisplayName } from "../../../../1-HomePage/others/lib/userUtils";
import { useThemeStore, THEME_METADATA, THEME_TOKENS } from "../../../../../shared/stores/theme";
import { 
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Laptop,
  Moon,
  Sun,
  MonitorSpeaker,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Key,
  Trash2,
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  FileText,
  Database,
  HardDrive,
  Wifi,
  Battery,
  Cpu,
  MemoryStick,
  HardDriveIcon,
  Activity,
  Zap,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Star,
  Heart,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  MoreHorizontal,
  Edit,
  Trash,
  Archive,
  Folder,
  FolderOpen,
  File,
  Image,
  Video,
  Music,
  Archive as ArchiveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Maximize,
  Minimize,
  X,
  Check,
  AlertCircle,
  Clock,
  CalendarIcon,
  Tag,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity as ActivityIcon,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Zap as ZapIcon,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sunrise,
  Sunset,
  Thermometer,
  Gauge,
  Timer,
  Clock as ClockIcon,
  Map,
  Navigation,
  Compass,
  MapPin as MapPinIcon,
  Home,
  Building as BuildingIcon,
  Factory,
  Store,
  School,
  Hospital,
  Coffee,
  ShoppingCart,
  ShoppingBag,
  CreditCard as CreditCardIcon,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  Percent as PercentIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Divide,
  X as XIcon,
  Equal,
  Infinity,
  Pi,
  Sigma
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../1-HomePage/others/components/ui/avatar";
import { Input } from "../../../../1-HomePage/others/components/ui/input";
import { Label } from "../../../../1-HomePage/others/components/ui/label";
import { Switch } from "../../../../1-HomePage/others/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../1-HomePage/others/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../1-HomePage/others/components/ui/select";
import { Separator } from "../../../../1-HomePage/others/components/ui/separator";
import { Progress } from "../../../../1-HomePage/others/components/ui/progress";
import { Alert, AlertDescription } from "../../../../1-HomePage/others/components/ui/alert";
import { Textarea } from "../../../../1-HomePage/others/components/ui/textarea";
import { Slider } from "../../../../1-HomePage/others/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "../../../../1-HomePage/others/components/ui/radio-group";
import { Checkbox } from "../../../../1-HomePage/others/components/ui/checkbox";
import { ScrollArea } from "../../../../1-HomePage/others/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../1-HomePage/others/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../1-HomePage/others/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../../1-HomePage/others/components/ui/command";
import { Calendar } from "../../../../1-HomePage/others/components/ui/calendar";
import { format } from "date-fns";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: string[];
}

interface SecurityLog {
  id: string;
  action: string;
  device: string;
  location: string;
  timestamp: string;
  ip: string;
  success: boolean;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: "1",
    title: "Project Updates",
    description: "Get notified when project status changes or new milestones are added",
    email: true,
    push: true,
    sms: false,
    categories: ["projects", "milestones"]
  },
  {
    id: "2",
    title: "Payment Notifications",
    description: "Receive alerts for payment confirmations and escrow releases",
    email: true,
    push: true,
    sms: true,
    categories: ["payments", "financial"]
  },
  {
    id: "3",
    title: "Safety Alerts",
    description: "Critical safety notifications and emergency updates",
    email: true,
    push: true,
    sms: true,
    categories: ["safety", "emergency"]
  },
  {
    id: "4",
    title: "System Maintenance",
    description: "Platform maintenance and update notifications",
    email: true,
    push: false,
    sms: false,
    categories: ["system", "maintenance"]
  },
  {
    id: "5",
    title: "Marketing Communications",
    description: "Newsletters, promotions, and platform updates",
    email: false,
    push: false,
    sms: false,
    categories: ["marketing", "news"]
  }
];

const securityLogs: SecurityLog[] = [
  {
    id: "1",
    action: "Login",
    device: "Chrome on Windows",
    location: "Riyadh, Saudi Arabia",
    timestamp: "2024-12-28T10:30:00Z",
    ip: "192.168.1.100",
    success: true
  },
  {
    id: "2",
    action: "Password Change",
    device: "Chrome on Windows",
    location: "Riyadh, Saudi Arabia",
    timestamp: "2024-12-27T15:45:00Z",
    ip: "192.168.1.100",
    success: true
  },
  {
    id: "3",
    action: "Failed Login",
    device: "Safari on iPhone",
    location: "Jeddah, Saudi Arabia",
    timestamp: "2024-12-26T09:15:00Z",
    ip: "203.45.67.89",
    success: false
  },
  {
    id: "4",
    action: "File Upload",
    device: "Chrome on Windows",
    location: "Riyadh, Saudi Arabia",
    timestamp: "2024-12-25T14:20:00Z",
    ip: "192.168.1.100",
    success: true
  },
  {
    id: "5",
    action: "Profile Update",
    device: "Chrome on Windows",
    location: "Riyadh, Saudi Arabia",
    timestamp: "2024-12-24T11:30:00Z",
    ip: "192.168.1.100",
    success: true
  }
];

export function SettingsContent() {
  const { profile, updateUser } = useAuthStore();
  const currentUserName = getUserDisplayName(profile);
  
  // Theme store
  const { preset, applyPreset, exportTheme, importTheme, resetAll } = useThemeStore();
  
  const [notifications, setNotifications] = useState(notificationSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);

  const toggleNotification = (id: string, type: 'email' | 'push' | 'sms') => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, [type]: !notif[type] }
          : notif
      )
    );
  };

  const handleImport = () => {
    setIsImporting(true);
    try {
      const data = JSON.parse(importData);
      importTheme(data);
      setShowImportDialog(false);
      setImportData("");
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    const exportData = exportTheme();
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nbcon-theme-${preset}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleSave = async () => {
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, you would save to your backend here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight">Settings</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">
                Manage your account preferences and platform settings
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-xs" onClick={handleSave}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
            <TabsTrigger value="account" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">
            <User className="h-3.5 w-3.5 mr-1.5" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Privacy & Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">
            <Palette className="h-3.5 w-3.5 mr-1.5" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Profile Information */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Profile Information</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Your personal details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {currentUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="h-8 text-xs">
                      <Camera className="h-3.5 w-3.5 mr-1.5" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="mb-2">First Name</Label>
                    <Input id="firstName" defaultValue="Nasser" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-2">Last Name</Label>
                    <Input id="lastName" defaultValue="Baylah" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="mb-2">Email</Label>
                  <Input id="email" type="email" defaultValue="info@nbcon.app" />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="mb-2">Phone</Label>
                  <Input id="phone" defaultValue="+966 55 123 4567" />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="mb-2">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself..."
                    defaultValue="Experienced structural engineer with 12+ years in large-scale infrastructure projects across Saudi Arabia."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Professional Information</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Your business details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div>
                  <Label htmlFor="title" className="mb-2">Job Title</Label>
                  <Input id="title" defaultValue="Senior Structural Engineer" />
                </div>
                
                <div>
                  <Label htmlFor="company" className="mb-2">Company</Label>
                  <Input id="company" defaultValue="Independent Consultant" />
                </div>
                
                <div>
                  <Label htmlFor="experience" className="mb-2">Years of Experience</Label>
                  <Select defaultValue="12+">
                    <SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="16+">16+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="specialization" className="mb-2">Specialization</Label>
                  <Input id="specialization" defaultValue="Structural Engineering, Seismic Design" />
                </div>
                
                <div>
                  <Label htmlFor="sceNumber" className="mb-2">SCE License Number</Label>
                  <Input id="sceNumber" defaultValue="SCE-SE-2024-789456" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" defaultChecked />
                  <Label htmlFor="verified" className="text-sm">
                    SCE License Verified
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Account Actions</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage your account settings</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-[36px] text-xs">
                  <Key className="h-3.5 w-3.5 mr-1.5" />
                  Change Password
                </Button>
                <Button variant="outline" className="justify-start h-[36px] text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download Data
                </Button>
                <Button variant="outline" className="justify-start h-[36px] text-xs text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete Account
                </Button>
                <Button variant="outline" className="justify-start h-[36px] text-xs text-destructive">
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Sign Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Notification Preferences</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Control how you receive updates</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-6 bg-background rounded-b-xl">
              {notifications.map((notification) => (
                <div key={notification.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${notification.id}-email`}
                        checked={notification.email}
                        onCheckedChange={() => toggleNotification(notification.id, 'email')}
                      />
                      <Label htmlFor={`${notification.id}-email`} className="text-sm">
                        <Mail className="h-3 w-3 mr-1 inline" />
                        Email
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${notification.id}-push`}
                        checked={notification.push}
                        onCheckedChange={() => toggleNotification(notification.id, 'push')}
                      />
                      <Label htmlFor={`${notification.id}-push`} className="text-sm">
                        <Bell className="h-3 w-3 mr-1 inline" />
                        Push
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${notification.id}-sms`}
                        checked={notification.sms}
                        onCheckedChange={() => toggleNotification(notification.id, 'sms')}
                      />
                      <Label htmlFor={`${notification.id}-sms`} className="text-sm">
                        <Smartphone className="h-3 w-3 mr-1 inline" />
                        SMS
                      </Label>
                    </div>
                  </div>
                  
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security */}
        <TabsContent value="privacy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Privacy Settings */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Privacy Settings</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Control your visibility</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Profile Visibility</Label>
                    <p className="text-xs text-muted-foreground">Who can see your profile</p>
                  </div>
                  <Select defaultValue="professional">
                    <SelectTrigger className="w-32 bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Contact Info</Label>
                    <p className="text-xs text-muted-foreground">Display phone and email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Location</Label>
                    <p className="text-xs text-muted-foreground">Display your city and province</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Activity Status</Label>
                    <p className="text-xs text-muted-foreground">When you're online or offline</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Security Settings</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Protect your account</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Login Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Session Timeout</Label>
                    <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-24 bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Log */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Recent Security Activity</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Monitor your account access</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 bg-background rounded-b-xl">
              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.device} • {log.location} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Theme Selection */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Theme Selection</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred theme</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(THEME_METADATA).map(([presetKey, metadata]) => (
                    <div
                      key={presetKey}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        preset === presetKey 
                          ? 'border-primary bg-primary/10 shadow-md' 
                          : 'border-border/50 hover:border-primary/30 hover:shadow-sm'
                      }`}
                      onClick={() => applyPreset(presetKey as any)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm">{metadata.name}</h4>
                          {preset === presetKey && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{metadata.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                    <Monitor className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Display Settings</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Customize your view</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Slider
                    defaultValue={[16]}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Density</Label>
                  <RadioGroup defaultValue="comfortable">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="compact" />
                      <Label htmlFor="compact" className="text-sm">Compact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable" id="comfortable" />
                      <Label htmlFor="comfortable" className="text-sm">Comfortable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spacious" id="spacious" />
                      <Label htmlFor="spacious" className="text-sm">Spacious</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reduce Motion</Label>
                    <p className="text-xs text-muted-foreground">Minimize animations</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Customization */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Customize Theme</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Personalize your colors</p>
                </div>
              </div>
            </CardHeader>
              <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Advanced theme customization with token editing. Export your theme to share with your team or import custom configurations.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Current Theme</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {THEME_METADATA[preset as keyof typeof THEME_METADATA]?.name || preset}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {THEME_TOKENS.length} tokens
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  className="h-8 text-xs w-full"
                  onClick={() => resetAll()}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset to Default Theme
                </Button>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                <Button variant="outline" className="h-8 text-xs" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Export Theme
                </Button>
                
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-8 text-xs">
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Import Theme
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Theme</DialogTitle>
                      <DialogDescription>
                        Paste your theme configuration JSON below.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Paste theme JSON here..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                        Cancel
                      </Button>
                      <Button className="h-8 text-xs" onClick={handleImport} disabled={isImporting}>
                        {isImporting ? (
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Import
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Advanced Settings</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Developer and system options</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Developer Mode</Label>
                  <p className="text-xs text-muted-foreground">Enable debugging tools and console logs</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Performance Monitoring</Label>
                  <p className="text-xs text-muted-foreground">Track app performance metrics</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Error Reporting</Label>
                  <p className="text-xs text-muted-foreground">Automatically report errors to help improve the app</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Analytics</Label>
                  <p className="text-xs text-muted-foreground">Help us improve by sharing usage data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">System Information</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Platform and version details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 bg-background rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Platform</Label>
                  <p className="text-sm">Web Browser</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Version</Label>
                  <p className="text-sm">1.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">December 28, 2024</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Storage Used</Label>
                  <p className="text-sm">2.4 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

