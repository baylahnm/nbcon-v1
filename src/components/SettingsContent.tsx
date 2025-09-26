import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings,
  User,
  CreditCard,
  Sliders,
  Palette,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Globe,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Mail,
  Phone,
  Lock,
  Key,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Moon,
  Sun,
  Monitor,
  Languages,
  Volume2,
  VolumeX,
  Camera,
  Save,
  RefreshCw,
  ExternalLink,
  FileText,
  Database,
  UserX,
  LogOut,
  Edit,
  Plus,
  X,
  Check,
  Sunset,
  Sparkles,
  Circle,
  Waves,
  TreePine,
  Paintbrush,
  Droplets,
  Shuffle,
  RotateCcw,
  Upload
} from "lucide-react";
import { useThemeStore, THEME_PRESETS, THEME_TOKENS, type ThemePreset } from "@/stores/theme";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";

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
    id: "job-matches",
    title: "Job Matches",
    description: "New engineering opportunities matching your profile",
    email: true,
    push: true,
    sms: false,
    categories: ["jobs", "matching"]
  },
  {
    id: "milestone-payments",
    title: "Milestone Payments", 
    description: "Payment releases and escrow updates",
    email: true,
    push: true,
    sms: true,
    categories: ["payments", "milestones"]
  },
  {
    id: "project-updates",
    title: "Project Updates",
    description: "Messages from clients and project status changes",
    email: true,
    push: true,
    sms: false,
    categories: ["projects", "communication"]
  },
  {
    id: "safety-alerts",
    title: "Safety Alerts",
    description: "Critical safety notifications and emergency updates",
    email: true,
    push: true,
    sms: true,
    categories: ["safety", "emergency"]
  },
  {
    id: "sce-verification",
    title: "SCE Verification",
    description: "Updates on Saudi Council of Engineers credential status",
    email: true,
    push: false,
    sms: false,
    categories: ["verification", "professional"]
  },
  {
    id: "network-activity",
    title: "Network Activity",
    description: "Connection requests and professional network updates",
    email: false,
    push: true,
    sms: false,
    categories: ["networking", "social"]
  }
];

const securityLogs: SecurityLog[] = [
  {
    id: "1",
    action: "Login",
    device: "iPhone 15 Pro - Safari",
    location: "Riyadh, Saudi Arabia",
    timestamp: "2024-12-28 14:30:45",
    ip: "78.95.142.***",
    success: true
  },
  {
    id: "2",
    action: "Password Changed",
    device: "MacBook Pro - Chrome",
    location: "Jeddah, Saudi Arabia", 
    timestamp: "2024-12-26 10:15:22",
    ip: "85.117.235.***",
    success: true
  },
  {
    id: "3",
    action: "Login Attempt",
    device: "Unknown Device - Firefox",
    location: "Dubai, UAE",
    timestamp: "2024-12-25 23:45:12",
    ip: "91.203.147.***",
    success: false
  },
  {
    id: "4",
    action: "2FA Setup",
    device: "iPhone 15 Pro - nbcon App",
    location: "Dammam, Saudi Arabia",
    timestamp: "2024-12-24 16:20:33",
    ip: "78.95.142.***",
    success: true
  }
];

export function SettingsContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("riyadh");
  const [calendarType, setCalendarType] = useState("gregorian");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("professional");
  const [autoLogout, setAutoLogout] = useState("30");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Theme store
  const {
    preset,
    applied,
    applyPreset,
    updateToken,
    resetSection,
    resetAll,
    importTheme,
    exportTheme,
    randomize,
    save
  } = useThemeStore();
  
  const { toast } = useToast();

  const toggleNotification = (id: string, type: 'email' | 'push' | 'sms') => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id 
        ? { ...notif, [type]: !notif[type] }
        : notif
    ));
  };

  // Theme handlers
  const handlePresetChange = (newPreset: ThemePreset) => {
    applyPreset(newPreset);
  };

  const handleTokenChange = (key: string, value: string) => {
    updateToken(key, value);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importTheme(data);
            setIsImporting(false);
            toast({
              title: "Theme Imported",
              description: "Your theme has been imported successfully.",
            });
          } catch (error) {
            console.error('Failed to import theme:', error);
            toast({
              title: "Import Failed",
              description: "Failed to import theme. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = exportTheme();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nbcon-theme.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Theme Exported",
      description: "Your theme has been exported successfully.",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await save();
      toast({
        title: "Theme Saved",
        description: "Your theme has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const themes = [
    { id: "light", name: "Light", description: "Clean and bright interface", icon: Sun },
    { id: "dark", name: "Dark", description: "Easy on the eyes", icon: Moon },
    { id: "wazeer", name: "Wazeer", description: "Professional and elegant", icon: Palette },
    { id: "sunset", name: "Sunset", description: "Warm and inviting", icon: Sunset },
    { id: "abstract", name: "Abstract", description: "Creative and modern", icon: Sparkles },
    { id: "nika", name: "Nika", description: "Bold and vibrant", icon: Circle },
    { id: "lagoon", name: "Lagoon", description: "Fresh and calming", icon: Waves },
    { id: "dark-nature", name: "Dark Nature", description: "Natural and earthy", icon: TreePine },
    { id: "full-gradient", name: "Full Gradient", description: "Vibrant and dynamic", icon: Paintbrush },
    { id: "sea-purple", name: "Sea Purple", description: "Deep and mysterious", icon: Droplets }
  ];

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "ar", name: "Arabic", native: "العربية" }
  ];

  const timezones = [
    { code: "riyadh", name: "Riyadh (AST)", offset: "+03:00" },
    { code: "dubai", name: "Dubai (GST)", offset: "+04:00" },
    { code: "kuwait", name: "Kuwait (AST)", offset: "+03:00" },
    { code: "doha", name: "Doha (AST)", offset: "+03:00" }
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and platform settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-auto bg-transparent p-0 border-b border-sidebar-border rounded-none w-full mb-6">
            <div className="flex items-center w-full overflow-x-auto">
              <TabsTrigger 
                value="account"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger 
                value="themes"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Themes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy & Security</span>
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Email & Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email & Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Email Address</h4>
                      <p className="text-sm text-muted-foreground">nasser.baylah@neom.com</p>
                    </div>
                    <Button variant="outline">Change Email</Button>
                  </div>
                  
                  <Separator />
                  
                  <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                    <h4>Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter current password"
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="Enter new password" autoComplete="new-password" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" autoComplete="new-password" />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* SCE Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Saudi Council of Engineers (SCE)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <h4 className="text-success">SCE Verified</h4>
                      <p className="text-sm text-success/80">License #CE-2024-789456</p>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Valid until 2025-06-15
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Auto-sync SCE status</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show SCE badge on profile</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Renewal notifications</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="w-5 h-5" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Account actions are permanent and cannot be undone. Please contact support if you need assistance.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Account Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out All Devices
                  </Button>
                  
                  <Separator />
                  
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deactivate Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            {/* Language & Region */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Display Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name} ({lang.native})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.code} value={tz.code}>
                            {tz.name} ({tz.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Right-to-Left (RTL) Layout</h4>
                      <p className="text-sm text-muted-foreground">Enable Arabic text direction</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Use Arabic Numerals</h4>
                      <p className="text-sm text-muted-foreground">Display numbers in Arabic format</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendar & Time Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Calendar Type</Label>
                    <RadioGroup value={calendarType} onValueChange={setCalendarType} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gregorian" id="gregorian" />
                        <label htmlFor="gregorian">Gregorian Calendar</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hijri" id="hijri" />
                        <label htmlFor="hijri">Hijri Calendar (Islamic)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dual" id="dual" />
                        <label htmlFor="dual">Dual Calendar (Both)</label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Week Starts On</Label>
                      <Select defaultValue="sunday">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Format</Label>
                      <Select defaultValue="12h">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Show prayer times</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ramadan working hours</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Weekend notifications (Fri-Sat)</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Work Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Work Schedule</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Sunday-Thursday (8AM-5PM)</SelectItem>
                        <SelectItem value="early">Sunday-Thursday (6AM-3PM)</SelectItem>
                        <SelectItem value="late">Sunday-Thursday (10AM-7PM)</SelectItem>
                        <SelectItem value="flexible">Flexible Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preferred Project Location</Label>
                    <Select defaultValue="riyadh">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Location</SelectItem>
                        <SelectItem value="riyadh">Riyadh Region</SelectItem>
                        <SelectItem value="jeddah">Jeddah & Western Region</SelectItem>
                        <SelectItem value="dammam">Eastern Province</SelectItem>
                        <SelectItem value="neom">NEOM & Tabuk</SelectItem>
                        <SelectItem value="remote">Remote Work Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Available for emergency calls</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Travel for projects</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekend work availability</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            {/* Theme Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 pb-2">
                  {themes.map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <Button
                        key={theme.id}
                        variant={preset === theme.id ? 'default' : 'outline'}
                        onClick={() => handlePresetChange(theme.id as ThemePreset)}
                        className="flex flex-col items-center gap-1 h-auto py-1 px-0.5 text-xs"
                      >
                        <Icon className="h-3 w-3" />
                        <span className="text-center leading-tight">{theme.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom Theme Tokens */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Theme Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {['core', 'card', 'primary', 'secondary', 'status', 'ui', 'sidebar'].map((category) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetSection(category)}
                      >
                        Reset {category}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {THEME_TOKENS.filter(token => {
                        if (token.category === category) {
                          // Exclude specific sidebar tokens
                          if (category === 'sidebar' && 
                              (token.key === '--sidebar-primary' || 
                               token.key === '--sidebar-primary-foreground' || 
                               token.key === '--sidebar-ring')) {
                            return false;
                          }
                          return true;
                        }
                        return false;
                      }).map((token) => (
                        <TokenEditor
                          key={token.key}
                          token={token}
                          value={applied[token.key] || token.value}
                          onChange={(value) => handleTokenChange(token.key, value)}
                        />
                      ))}
                    </div>
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Download your current theme configuration
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Import Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload a theme configuration file
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleImport} disabled={isImporting}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import JSON
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Randomize Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate a random theme variation
                    </p>
                  </div>
                  <Button variant="outline" onClick={randomize}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Randomize
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reset All</h4>
                    <p className="text-sm text-muted-foreground">
                      Reset all customizations to the selected preset
                    </p>
                  </div>
                  <Button variant="outline" onClick={resetAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer Actions */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={resetAll}>
                  Reset to Preset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Safety and payment notifications cannot be disabled for security and compliance reasons.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="space-y-3">
                      <div>
                        <h4>{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 ml-4">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={notification.email}
                            onCheckedChange={() => toggleNotification(notification.id, 'email')}
                          />
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Email</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={notification.push}
                            onCheckedChange={() => toggleNotification(notification.id, 'push')}
                          />
                          <Bell className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Push</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={notification.sms}
                            onCheckedChange={() => toggleNotification(notification.id, 'sms')}
                            disabled={notification.categories.includes('safety') || notification.categories.includes('payments')}
                          />
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">SMS</span>
                        </div>
                      </div>
                      
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VolumeX className="w-5 h-5" />
                  Quiet Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Enable Quiet Hours</h4>
                    <p className="text-sm text-muted-foreground">Pause non-urgent notifications during specified times</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select defaultValue="22:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select defaultValue="07:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <Badge key={day} variant="outline" className="cursor-pointer hover:bg-primary/10">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Security Tab */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <h4 className="text-success">2FA Enabled</h4>
                      <p className="text-sm text-success/80">Your account is protected with two-factor authentication</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>SMS Authentication</h4>
                      <p className="text-sm text-muted-foreground">+966 55 *** **67</p>
                    </div>
                    <Badge variant="secondary">Primary</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">Google Authenticator</p>
                    </div>
                    <Badge variant="outline">Backup</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Add Backup Method
                </Button>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-logout after inactivity</Label>
                  <Select value={autoLogout} onValueChange={setAutoLogout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Require password for sensitive actions</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email notifications for new logins</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to all users</SelectItem>
                      <SelectItem value="professional">Professional Network Only</SelectItem>
                      <SelectItem value="clients">Clients and Recruiters Only</SelectItem>
                      <SelectItem value="private">Private - Hidden from searches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Show online status</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allow contact requests</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show project history</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Display earnings information</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Security Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.success ? "bg-success" : "bg-destructive"}`} />
                      <div>
                        <h4 className="text-sm">{log.action}</h4>
                        <p className="text-xs text-muted-foreground">
                          {log.device} • {log.location} • {log.timestamp}
                        </p>
                      </div>
                    </div>
                    {!log.success && (
                      <Badge variant="destructive" className="text-xs">
                        Failed
                      </Badge>
                    )}
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View Full Security Log
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Personal Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache & Cookies
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Data Processing Agreement
                  </Button>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Data Retention:</strong> Your data is stored in compliance with Saudi data protection laws. 
                    Project data is retained for 7 years as required by engineering regulations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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
      const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      if (!match) return '#000000';
      
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
      
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    };

    const displayValue = value.includes('--') ? value : hslToRgb(value);
    const isCssVar = value.includes('--');

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {(() => {
            const friendlyNames: { [key: string]: string } = {
              '--background': 'Main background color',
              '--foreground': 'Main text color',
              '--card': 'Card background color',
              '--card-foreground': 'Card text color',
              '--popover': 'Popover background color',
              '--popover-foreground': 'Popover text color',
              '--primary': 'Primary color',
              '--primary-foreground': 'Primary text color',
              '--primary-light': 'Light primary color',
              '--primary-dark': 'Dark primary color',
              '--secondary': 'Secondary color',
              '--secondary-foreground': 'Secondary text color',
              '--muted': 'Muted color',
              '--muted-foreground': 'Muted text color',
              '--accent': 'Accent color',
              '--accent-foreground': 'Accent text color',
              '--destructive': 'Destructive color',
              '--destructive-foreground': 'Destructive text color',
              '--border': 'Border color',
              '--input': 'Input border color',
              '--input-background': 'Input background color',
              '--input-foreground': 'Input text color',
              '--input-placeholder': 'Input placeholder color',
              '--ring': 'Focus ring color',
              '--success': 'Success color',
              '--success-foreground': 'Success text color',
              '--warning': 'Warning color',
              '--warning-foreground': 'Warning text color',
              '--info': 'Info color',
              '--info-foreground': 'Info text color',
              '--sidebar-background': 'Sidebar background',
              '--sidebar-foreground': 'Sidebar text color',
              '--sidebar-primary': 'Sidebar primary color',
              '--sidebar-primary-foreground': 'Sidebar primary text',
              '--sidebar-accent': 'Sidebar accent color',
              '--sidebar-accent-foreground': 'Sidebar accent text',
              '--sidebar-border': 'Sidebar border color',
              '--sidebar-ring': 'Sidebar focus ring'
            };
            return friendlyNames[token.key] || token.key;
          })()}
        </Label>
        <div className="flex items-center gap-2">
          {!isCssVar && (
            <input
              type="color"
              value={displayValue.startsWith('rgb') ? 
                `#${Math.round(parseInt(displayValue.match(/\d+/g)?.[0] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[1] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[2] || '0')).toString(16).padStart(2, '0')}` : 
                displayValue
              }
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                
                // Convert RGB to HSL
                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;
                
                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);
                const diff = max - min;
                
                let h = 0;
                let s = 0;
                const l = (max + min) / 2;
                
                if (diff !== 0) {
                  s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
                  
                  switch (max) {
                    case rNorm:
                      h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
                      break;
                    case gNorm:
                      h = (bNorm - rNorm) / diff + 2;
                      break;
                    case bNorm:
                      h = (rNorm - gNorm) / diff + 4;
                      break;
                  }
                  h /= 6;
                }
                
                const hsl = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
                onChange(hsl);
              }}
              className="w-8 h-8 rounded border border-sidebar-border cursor-pointer"
              title={`Click to change color (${displayValue})`}
            />
          )}
          <Input
            value={isCssVar ? value : displayValue.startsWith('rgb') ? 
              `#${Math.round(parseInt(displayValue.match(/\d+/g)?.[0] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[1] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[2] || '0')).toString(16).padStart(2, '0')}` : 
              displayValue
            }
            onChange={(e) => {
              if (isCssVar) {
                onChange(e.target.value);
                return;
              }
              
              const inputValue = e.target.value;
              
              // Handle hex input
              if (inputValue.startsWith('#')) {
                const hex = inputValue;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                
                // Convert RGB to HSL
                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;
                
                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);
                const diff = max - min;
                
                let h = 0;
                let s = 0;
                const l = (max + min) / 2;
                
                if (diff !== 0) {
                  s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
                  
                  switch (max) {
                    case rNorm:
                      h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
                      break;
                    case gNorm:
                      h = (bNorm - rNorm) / diff + 2;
                      break;
                    case bNorm:
                      h = (rNorm - gNorm) / diff + 4;
                      break;
                  }
                  h /= 6;
                }
                
                const hsl = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
                onChange(hsl);
              } else {
                // Handle HSL input
                onChange(inputValue);
              }
            }}
            placeholder={isCssVar ? "Enter CSS variable" : "Enter hex value (e.g., #3b82f6)"}
            className="font-mono text-xs flex-1"
          />
        </div>
      </div>
    );
  }
