import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { R, RH } from '@/lib/routes';
import { toast } from 'sonner';
import { useThemeStore, THEME_TOKENS, type ThemePreset } from '@/stores/theme';
import { 
  Settings,
  User,
  Building,
  Bell,
  Shield,
  Mail,
  Key,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Camera,
  Globe,
  Lock,
  UserX,
  Trash2,
  Save,
  RefreshCw,
  X,
  Copy,
  Plus,
  MoreHorizontal,
  LogOut,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Palette,
  Link,
  QrCode,
  CreditCard,
  Sunset,
  Sparkles,
  Circle,
  Waves,
  TreePine,
  Paintbrush,
  Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserSettings {
  // Account settings
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  
  // Company settings
  companyName: string;
  companyNameArabic: string;
  companyLogo?: string;
  website: string;
  phoneNumber: string;
  address: string;
  
  // Notification settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  taskReminders: boolean;
  budgetAlerts: boolean;
  teamInvitations: boolean;
  securityAlerts: boolean;
  
  // Security settings
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  ipWhitelist: boolean;
  loginNotifications: boolean;
  
  // General settings
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
  permissions: string[];
}

interface AccessLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  action: string;
  status: 'success' | 'failed';
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Sheet states for right-side panels
  const [showApiKeyDetails, setShowApiKeyDetails] = useState<string | null>(null);
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  // URL parameter management
  const updateQuery = (params: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  };

  // Initialize from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const tab = url.searchParams.get('tab') || 'account';
    const apiKey = url.searchParams.get('apiKey');
    const logs = url.searchParams.get('logs') === 'true';
    const themeEditor = url.searchParams.get('themeEditor') === 'true';
    const emailChange = url.searchParams.get('emailChange') === 'true';
    const twoFA = url.searchParams.get('2fa') === 'true';
    const dataExport = url.searchParams.get('dataExport') === 'true';
    
    setActiveTab(tab);
    setShowApiKeyDetails(apiKey);
    setShowAccessLogs(logs);
    setShowThemeEditor(themeEditor);
    setShowEmailChange(emailChange);
    setShow2FASetup(twoFA);
    setShowDataExport(dataExport);
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateQuery({ tab: value });
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

  const [settings, setSettings] = useState<UserSettings>({
    // Account
    email: 'ahmed.almansouri@neom-engineering.sa',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Company
    companyName: 'NEOM Engineering Consultants',
    companyNameArabic: 'شركة نيوم للاستشارات الهندسية',
    companyLogo: undefined,
    website: 'www.neom-engineering.sa',
    phoneNumber: '+966 11 234 5678',
    address: 'King Fahd Road, Al Olaya District, Riyadh 11543',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    projectUpdates: true,
    taskReminders: true,
    budgetAlerts: true,
    teamInvitations: true,
    securityAlerts: true,
    
    // Security
    twoFactorEnabled: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    loginNotifications: true,
    
    // General
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Riyadh'
  });

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

  // Theme handlers
  const handlePresetChange = (newPreset: ThemePreset) => {
    applyPreset(newPreset);
  };

  const handleTokenChange = (key: string, value: string) => {
    updateToken(key, value);
  };

  const handleResetToPreset = () => {
    resetAll();
    toast.success('Theme reset to preset');
  };

  const handleSaveTheme = async () => {
    try {
      await save();
      toast.success('Theme saved successfully');
    } catch (error) {
      toast.error('Failed to save theme');
    }
  };

  const handleExportTheme = () => {
    const themeData = exportTheme();
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `theme-${preset}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Theme exported successfully');
  };

  const handleImportTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const themeData = JSON.parse(e.target?.result as string);
            importTheme(themeData);
            toast.success('Theme imported successfully');
          } catch (error) {
            toast.error('Invalid theme file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetTheme = () => {
    resetAll();
    toast.success('Theme reset to default');
  };

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
                let h = 0, s = 0, l = (max + min) / 2;
                
                if (max !== min) {
                  const d = max - min;
                  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  
                  switch (max) {
                    case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                    case gNorm: h = (bNorm - rNorm) / d + 2; break;
                    case bNorm: h = (rNorm - gNorm) / d + 4; break;
                  }
                  h /= 6;
                }
                
                const hslValue = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
                onChange(hslValue);
              }}
              className="w-8 h-8 rounded border border-sidebar-border cursor-pointer"
              title={`Click to change color (${displayValue})`}
            />
          )}
          <Input
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs flex-1"
            placeholder="Enter hex value (e.g., #3b82f6)"
          />
        </div>
      </div>
    );
  }

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'NEOM Integration API',
      key: 'ne_live_4kX9mP2nQ8vR7sT1uY5wZ3aB6cD9fE2g',
      lastUsed: '2024-09-25 14:30:00',
      created: '2024-01-15',
      permissions: ['read:projects', 'write:reports', 'read:team']
    },
    {
      id: '2',
      name: 'Mobile App Access',
      key: 'ne_live_8hL4pQ7mN1xV9sB3tU6kW2yF5rE8cA9j',
      lastUsed: '2024-09-26 09:15:00',
      created: '2024-03-20',
      permissions: ['read:all', 'write:tasks']
    }
  ]);

  const [accessLogs] = useState<AccessLog[]>([
    {
      id: '1',
      timestamp: '2024-09-26 10:30:00',
      ipAddress: '192.168.1.100',
      location: 'Riyadh, Saudi Arabia',
      device: 'Chrome on Windows',
      action: 'Login',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-09-25 16:45:00',
      ipAddress: '192.168.1.101',
      location: 'Riyadh, Saudi Arabia',
      device: 'Safari on iPhone',
      action: 'API Access',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-09-24 22:15:00',
      ipAddress: '203.45.67.89',
      location: 'Unknown',
      device: 'Chrome on Linux',
      action: 'Failed Login Attempt',
      status: 'failed'
    }
  ]);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleCancel = () => {
    // Reset to original values (simplified for demo)
    setHasUnsavedChanges(false);
    toast.info('Changes cancelled');
  };

  const handlePasswordUpdate = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      toast.success('Password updated successfully');
    }, 1500);
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const generateApiKey = () => {
    toast.success('New API key generated successfully');
  };

  const revokeApiKey = (keyId: string) => {
    toast.success('API key revoked successfully');
  };

  const enable2FA = () => {
    handleSettingChange('twoFactorEnabled', true);
    toast.success('Two-factor authentication enabled');
  };

  const disable2FA = () => {
    handleSettingChange('twoFactorEnabled', false);
    toast.success('Two-factor authentication disabled');
  };

  // Sheet action handlers
  const handleViewApiKey = (keyId: string) => {
    setShowApiKeyDetails(keyId);
    updateQuery({ apiKey: keyId });
  };

  const handleCloseApiKeyDetails = () => {
    setShowApiKeyDetails(null);
    updateQuery({ apiKey: undefined });
  };

  const handleOpenAccessLogs = () => {
    setShowAccessLogs(true);
    updateQuery({ logs: 'true' });
  };

  const handleCloseAccessLogs = () => {
    setShowAccessLogs(false);
    updateQuery({ logs: undefined });
  };

  const handleOpenThemeEditor = () => {
    setShowThemeEditor(true);
    updateQuery({ themeEditor: 'true' });
  };

  const handleCloseThemeEditor = () => {
    setShowThemeEditor(false);
    updateQuery({ themeEditor: undefined });
  };

  const handleOpenEmailChange = () => {
    setShowEmailChange(true);
    updateQuery({ emailChange: 'true' });
  };

  const handleCloseEmailChange = () => {
    setShowEmailChange(false);
    updateQuery({ emailChange: undefined });
  };

  const handleOpen2FASetup = () => {
    setShow2FASetup(true);
    updateQuery({ '2fa': 'true' });
  };

  const handleClose2FASetup = () => {
    setShow2FASetup(false);
    updateQuery({ '2fa': undefined });
  };

  const handleOpenDataExport = () => {
    setShowDataExport(true);
    updateQuery({ dataExport: 'true' });
  };

  const handleCloseDataExport = () => {
    setShowDataExport(false);
    updateQuery({ dataExport: undefined });
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and platform settings
        </p>
      </div>
        
      {hasUnsavedChanges && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
              <TabsTrigger value="account" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Building className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          {/* Email & Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email & Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleOpenEmailChange}>
                    Change Email
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll send you a verification email to confirm the change
                </p>
              </div>

              <Separator />

              {/* Change Password */}
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={settings.currentPassword}
                        onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={settings.newPassword}
                        onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={settings.confirmPassword}
                      onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordUpdate}
                  disabled={isLoading || !settings.currentPassword || !settings.newPassword || !settings.confirmPassword}
                  className="w-fit"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Riyadh (UTC+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">Dubai (UTC+4)</SelectItem>
                      <SelectItem value="Asia/Kuwait">Kuwait (UTC+3)</SelectItem>
                      <SelectItem value="Asia/Bahrain">Manama (UTC+3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Logo */}
              <div className="space-y-4">
                <Label>Company Logo</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={settings.companyLogo} />
                    <AvatarFallback className="text-lg">
                      {settings.companyName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2" onClick={() => console.log('Upload logo')}>
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Recommended: 256x256px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (English)</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyNameArabic">Company Name (Arabic)</Label>
                  <Input
                    id="companyNameArabic"
                    value={settings.companyNameArabic}
                    onChange={(e) => handleSettingChange('companyNameArabic', e.target.value)}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleSettingChange('website', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                    placeholder="+966 11 234 5678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about project status changes and milestones
                    </p>
                  </div>
                  <Switch
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => handleSettingChange('projectUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders for upcoming task deadlines
                    </p>
                  </div>
                  <Switch
                    checked={settings.taskReminders}
                    onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts when project budgets reach thresholds
                    </p>
                  </div>
                  <Switch
                    checked={settings.budgetAlerts}
                    onCheckedChange={(checked) => handleSettingChange('budgetAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Team Invitations</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when invited to teams or projects
                    </p>
                  </div>
                  <Switch
                    checked={settings.teamInvitations}
                    onCheckedChange={(checked) => handleSettingChange('teamInvitations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security and account notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => 
                    checked ? enable2FA() : disable2FA()
                  }
                />
              </div>

              {settings.twoFactorEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Two-factor authentication is enabled
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleOpen2FASetup}>
                      <QrCode className="h-4 w-4" />
                      Show QR Code
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginNotifications}
                    onCheckedChange={(checked) => handleSettingChange('loginNotifications', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <Button onClick={generateApiKey} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {apiKey.permissions.length} permissions
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                      <div className="font-mono text-xs bg-muted p-2 rounded flex items-center justify-between">
                        <span>{apiKey.key.substring(0, 20)}...{apiKey.key.substring(apiKey.key.length - 4)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyApiKey(apiKey.key)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewApiKey(apiKey.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => revokeApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Access Logs
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleOpenAccessLogs}>
                  <Download className="h-4 w-4" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      )} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{log.action}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              log.status === 'success' 
                                ? 'text-green-700 border-green-200' 
                                : 'text-red-700 border-red-200'
                            )}
                          >
                            {log.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {log.timestamp}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {log.location}
                          </span>
                          <span className="flex items-center">
                            <Monitor className="h-3 w-3 mr-1" />
                            {log.device}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {log.ipAddress}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <p className="font-medium">Sign Out All Devices</p>
                  <p className="text-sm text-muted-foreground">
                    End all active sessions on other devices
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out All
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <p className="font-medium">Download Account Data</p>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of all your account data
                  </p>
                </div>
                <Button variant="outline" className="gap-2" onClick={handleOpenDataExport}>
                  <Download className="h-4 w-4" />
                  Download Data
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-fit gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6 mt-6">
          {/* Theme Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
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
                 <Button variant="outline" className="gap-2" onClick={handleExportTheme}>
                   <Download className="h-4 w-4" />
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
                 <Button variant="outline" className="gap-2" onClick={handleImportTheme}>
                   <Upload className="h-4 w-4" />
                   Import JSON
                 </Button>
               </div>

               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="font-medium">Reset Theme</h4>
                   <p className="text-sm text-muted-foreground">
                     Reset to default theme settings
                   </p>
                 </div>
                 <Button variant="outline" className="gap-2" onClick={handleResetTheme}>
                   <RefreshCw className="h-4 w-4" />
                   Reset
                 </Button>
               </div>

               <div className="pt-6 border-t">
                 <div className="flex items-center justify-end gap-3">
                   <Button variant="outline" onClick={handleResetToPreset}>
                     Reset to Preset
                   </Button>
                   <Button onClick={handleSaveTheme}>
                     <Save className="h-4 w-4 mr-2" />
                     Save
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Right-side Sheets */}
      
      {/* API Key Details Sheet */}
      <Sheet open={!!showApiKeyDetails} onOpenChange={handleCloseApiKeyDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>API Key Details</SheetTitle>
            <SheetDescription>
              Complete information about your API key and its permissions.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showApiKeyDetails && (() => {
              const apiKey = apiKeys.find(k => k.id === showApiKeyDetails);
              if (!apiKey) return null;
              
              return (
                <div className="space-y-6">
                  {/* API Key Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{apiKey.name}</h3>
                      <p className="text-muted-foreground mt-1">API Key Management</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {apiKey.permissions.length} permissions
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* API Key Value */}
                  <div className="space-y-4">
                    <h4 className="font-medium">API Key</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="font-mono text-sm break-all">
                        {apiKey.key}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" onClick={() => copyApiKey(apiKey.key)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Key
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Key Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Created</Label>
                        <p className="font-medium">{apiKey.created}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Last Used</Label>
                        <p className="font-medium">{apiKey.lastUsed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Permissions</h4>
                    <div className="space-y-2">
                      {apiKey.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-mono">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => revokeApiKey(apiKey.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke Key
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Access Logs Sheet */}
      <Sheet open={showAccessLogs} onOpenChange={handleCloseAccessLogs}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Access Logs</SheetTitle>
            <SheetDescription>
              Detailed access logs and security information for your account.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6">
              {/* Logs Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {accessLogs.filter(log => log.status === 'success').length}
                  </div>
                  <p className="text-sm text-green-600">Successful</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {accessLogs.filter(log => log.status === 'failed').length}
                  </div>
                  <p className="text-sm text-red-600">Failed</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {accessLogs.length}
                  </div>
                  <p className="text-sm text-blue-600">Total</p>
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Export Options</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </div>

              {/* Detailed Logs */}
              <div className="space-y-4">
                <h4 className="font-medium">Recent Activity</h4>
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full mt-1",
                            log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                          )} />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{log.action}</span>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  log.status === 'success' 
                                    ? 'text-green-700 border-green-200' 
                                    : 'text-red-700 border-red-200'
                                )}
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {log.timestamp}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {log.location}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Monitor className="h-3 w-3 mr-1" />
                                  {log.device}
                                </span>
                                <span className="font-mono text-xs">
                                  {log.ipAddress}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Theme Editor Sheet */}
      <Sheet open={showThemeEditor} onOpenChange={handleCloseThemeEditor}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Theme Editor</SheetTitle>
            <SheetDescription>
              Advanced theme customization with live preview.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6">
              {/* Theme Tokens */}
              <div className="space-y-4">
                <h4 className="font-medium">Color Tokens</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded border bg-primary"></div>
                      <Input placeholder="#2678ab" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Background</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded border bg-background"></div>
                      <Input placeholder="#ffffff" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Card Background</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded border bg-card"></div>
                      <Input placeholder="#f5f5f5" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded border bg-foreground"></div>
                      <Input placeholder="#000000" className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4">
                <h4 className="font-medium">Typography</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Font Family</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="system">System Font</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Font Size</Label>
                    <Input type="range" min="12" max="18" defaultValue="14" />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-4">
                <h4 className="font-medium">Border Radius</h4>
                <div className="space-y-2">
                  <Label className="text-sm">Corner Radius</Label>
                  <Input type="range" min="0" max="24" defaultValue="8" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Apply Theme
                </Button>
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Email Change Sheet */}
      <Sheet open={showEmailChange} onOpenChange={handleCloseEmailChange}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Change Email Address</SheetTitle>
            <SheetDescription>
              Update your email address. You'll receive a verification email.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6">
              {/* Current Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Email</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm">{settings.email}</span>
                </div>
              </div>

              {/* New Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">New Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="Enter new email address"
                  className="w-full"
                />
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Password</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder="Enter current password"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Information */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Important:</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>You'll receive a verification email at the new address</li>
                      <li>Your current email will remain active until verified</li>
                      <li>All notifications will be sent to the new email once verified</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Verification Email
                </Button>
                <Button variant="outline" onClick={handleCloseEmailChange}>
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* 2FA Setup Sheet */}
      <Sheet open={show2FASetup} onOpenChange={handleClose2FASetup}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Two-Factor Authentication Setup</SheetTitle>
            <SheetDescription>
              Secure your account with two-factor authentication.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6">
              {/* QR Code */}
              <div className="space-y-4">
                <h4 className="font-medium">Scan QR Code</h4>
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with your authenticator app
                </p>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4">
                <h4 className="font-medium">Manual Entry</h4>
                <div className="space-y-2">
                  <Label className="text-sm">Secret Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value="JBSWY3DPEHPK3PXP" 
                      readOnly 
                      className="font-mono"
                    />
                    <Button size="sm" onClick={() => navigator.clipboard.writeText('JBSWY3DPEHPK3PXP')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Verification Code */}
              <div className="space-y-4">
                <h4 className="font-medium">Enter Verification Code</h4>
                <div className="space-y-2">
                  <Label className="text-sm">6-digit code from your app</Label>
                  <Input 
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </div>

              {/* Backup Codes */}
              <div className="space-y-4">
                <h4 className="font-medium">Backup Codes</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {['12345678', '87654321', '11223344', '44332211', '55667788', '88776655'].map((code, index) => (
                      <div key={index} className="p-2 bg-background rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Save these codes in a safe place. Each can only be used once.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
                <Button variant="outline" onClick={handleClose2FASetup}>
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Data Export Sheet */}
      <Sheet open={showDataExport} onOpenChange={handleCloseDataExport}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Export Account Data</SheetTitle>
            <SheetDescription>
              Download a copy of all your account data and settings.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6">
              {/* Export Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Export Format</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input type="radio" id="json" name="format" value="json" className="rounded" />
                    <div className="flex-1">
                      <Label htmlFor="json" className="font-medium">JSON Format</Label>
                      <p className="text-sm text-muted-foreground">Machine-readable format for developers</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input type="radio" id="csv" name="format" value="csv" className="rounded" />
                    <div className="flex-1">
                      <Label htmlFor="csv" className="font-medium">CSV Format</Label>
                      <p className="text-sm text-muted-foreground">Spreadsheet-compatible format</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input type="radio" id="pdf" name="format" value="pdf" className="rounded" />
                    <div className="flex-1">
                      <Label htmlFor="pdf" className="font-medium">PDF Report</Label>
                      <p className="text-sm text-muted-foreground">Human-readable report format</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sections */}
              <div className="space-y-4">
                <h4 className="font-medium">Include Data Sections</h4>
                <div className="space-y-3">
                  {[
                    'Account Information',
                    'Company Settings',
                    'Project Data',
                    'Team Members',
                    'Financial Records',
                    'Access Logs',
                    'API Keys',
                    'Theme Settings'
                  ].map((section, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input type="checkbox" id={`section-${index}`} className="rounded" defaultChecked />
                      <Label htmlFor={`section-${index}`} className="text-sm">{section}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Size */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Size</span>
                  <span className="text-sm text-muted-foreground">~2.3 MB</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium">Processing Time</span>
                  <span className="text-sm text-muted-foreground">~30 seconds</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Data Export Information:</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Export will be sent to your registered email address</li>
                      <li>Download link will expire in 7 days</li>
                      <li>Large exports may take several minutes to process</li>
                      <li>You'll receive an email notification when ready</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Request Export
                </Button>
                <Button variant="outline" onClick={handleCloseDataExport}>
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}