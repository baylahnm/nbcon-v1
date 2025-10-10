import { useState } from "react";
import { useAuthStore } from "../../stores/auth";
import { getUserDisplayName } from "../../../../1-HomePage/others/lib/userUtils";
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
  Calendar,
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
  Calendar as CalendarIcon,
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
  Stopwatch,
  Clock as ClockIcon,
  Calendar as CalendarIcon2,
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
  Church,
  Mosque,
  Bank,
  Hotel,
  Restaurant,
  Coffee,
  ShoppingCart,
  ShoppingBag,
  CreditCard as CreditCardIcon,
  Wallet,
  PiggyBank,
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
  NotEqual,
  LessThan,
  GreaterThan,
  LessThanOrEqual,
  GreaterThanOrEqual,
  Infinity,
  Pi,
  Sigma,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega
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

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

interface Token {
  key: string;
  description: string;
  value: string;
  category: string;
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

const themePresets: ThemePreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional theme",
    colors: {
      primary: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(210 40% 98%)",
      accent: "hsl(210 40% 98%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)"
    }
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Easy on the eyes for low-light environments",
    colors: {
      primary: "hsl(210 40% 98%)",
      secondary: "hsl(222.2 84% 4.9%)",
      accent: "hsl(222.2 84% 4.9%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)"
    }
  },
  {
    id: "warm",
    name: "Warm",
    description: "Cozy and inviting color scheme",
    colors: {
      primary: "hsl(24 70% 50%)",
      secondary: "hsl(60 9% 98%)",
      accent: "hsl(60 9% 98%)",
      background: "hsl(60 9% 98%)",
      foreground: "hsl(20 14.3% 4.1%)"
    }
  },
  {
    id: "cool",
    name: "Cool",
    description: "Calm and professional blue tones",
    colors: {
      primary: "hsl(221.2 83.2% 53.3%)",
      secondary: "hsl(210 40% 98%)",
      accent: "hsl(210 40% 98%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)"
    }
  }
];

const designTokens: Token[] = [
  { key: "primary", description: "Primary brand color", value: "hsl(222.2 84% 4.9%)", category: "colors" },
  { key: "secondary", description: "Secondary brand color", value: "hsl(210 40% 98%)", category: "colors" },
  { key: "accent", description: "Accent color for highlights", value: "hsl(210 40% 98%)", category: "colors" },
  { key: "background", description: "Main background color", value: "hsl(0 0% 100%)", category: "colors" },
  { key: "foreground", description: "Main text color", value: "hsl(222.2 84% 4.9%)", category: "colors" },
  { key: "muted", description: "Muted text color", value: "hsl(215.4 16.3% 46.9%)", category: "colors" },
  { key: "border", description: "Border color", value: "hsl(214.3 31.8% 91.4%)", category: "colors" },
  { key: "radius", description: "Border radius", value: "0.5rem", category: "spacing" },
  { key: "spacing", description: "Base spacing unit", value: "1rem", category: "spacing" },
  { key: "font-family", description: "Primary font family", value: "Inter, sans-serif", category: "typography" },
  { key: "font-size", description: "Base font size", value: "16px", category: "typography" },
  { key: "line-height", description: "Base line height", value: "1.5", category: "typography" }
];

export function SettingsContent() {
  const { profile, updateUser } = useAuthStore();
  const currentUserName = getUserDisplayName(profile);
  
  const [notifications, setNotifications] = useState(notificationSettings);
  const [currentPreset, setCurrentPreset] = useState<ThemePreset>(themePresets[0]);
  const [customTokens, setCustomTokens] = useState<Token[]>(designTokens);
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  const handlePresetChange = (newPreset: ThemePreset) => {
    setCurrentPreset(newPreset);
    // Apply preset colors to custom tokens
    setCustomTokens(prev => 
      prev.map(token => {
        if (token.category === 'colors' && newPreset.colors[token.key as keyof typeof newPreset.colors]) {
          return { ...token, value: newPreset.colors[token.key as keyof typeof newPreset.colors] };
        }
        return token;
      })
    );
  };

  const handleTokenChange = (key: string, value: string) => {
    setCustomTokens(prev => 
      prev.map(token => 
        token.key === key ? { ...token, value } : token
      )
    );
  };

  const handleImport = () => {
    setIsImporting(true);
    try {
      const data = JSON.parse(importData);
      if (data.tokens) {
        setCustomTokens(data.tokens);
      }
      if (data.preset) {
        const preset = themePresets.find(p => p.id === data.preset);
        if (preset) {
          setCurrentPreset(preset);
        }
      }
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
    const exportData = {
      tokens: customTokens,
      preset: currentPreset.id,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nbcon-theme-${currentPreset.name.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account preferences and platform settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="h-auto bg-transparent p-0 border-b border-sidebar-border rounded-none w-full">
          <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
            <TabsTrigger value="account" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy & Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </div>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {currentUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Nasser" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Baylah" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="info@nbcon.app" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+966 55 123 4567" />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" defaultValue="Senior Structural Engineer" />
                </div>
                
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Independent Consultant" />
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select defaultValue="12+">
                    <SelectTrigger>
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
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" defaultValue="Structural Engineering, Seismic Design" />
                </div>
                
                <div>
                  <Label htmlFor="sceNumber">SCE License Number</Label>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Data
                </Button>
                <Button variant="outline" className="justify-start text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
                <Button variant="outline" className="justify-start text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        <Mail className="w-4 h-4 mr-1 inline" />
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
                        <Bell className="w-4 h-4 mr-1 inline" />
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
                        <Smartphone className="w-4 h-4 mr-1 inline" />
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
        <TabsContent value="privacy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Profile Visibility</Label>
                    <p className="text-xs text-muted-foreground">Who can see your profile</p>
                  </div>
                  <Select defaultValue="professional">
                    <SelectTrigger className="w-32">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
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
                    <SelectTrigger className="w-24">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Security Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
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
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {themePresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        currentPreset.id === preset.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-sidebar-border hover:border-muted-foreground'
                      }`}
                      onClick={() => handlePresetChange(preset)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                        </div>
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Customize Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customTokens
                  .filter(token => token.category === 'colors')
                  .map((token) => (
                    <div key={token.key} className="space-y-2">
                      <Label className="text-sm font-medium">{token.description}</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: token.value }}
                        />
                        <Input
                          value={token.value}
                          onChange={(e) => handleTokenChange(token.key, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export Theme
                </Button>
                
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
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
                      <Button onClick={handleImport} disabled={isImporting}>
                        {isImporting ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
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
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
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
  );
}

// Token Editor Component
function TokenEditor({
  token,
  value,
  onChange
}: {
  token: { key: string; description: string };
  value: string;
  onChange: (value: string) => void;
}) {
  // Convert HSL to RGB for display
  const hslToRgb = (hsl: string) => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return { r: 0, g: 0, b: 0 };
    
    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    };
  };

  const rgb = hslToRgb(value);
  const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{token.description}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <Badge variant="outline" className="text-xs">
          {hex.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}

