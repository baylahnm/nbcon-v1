import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Switch } from '../1-HomePage/others/components/ui/switch';
import { Label } from '../1-HomePage/others/components/ui/label';
import { Separator } from '../1-HomePage/others/components/ui/separator';
import { useThemeStore, THEME_TOKENS, type ThemePreset } from './others/stores/theme';
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  Sunset,
  Sparkles,
  Circle,
  Waves,
  TreePine,
  Paintbrush,
  Droplets,
  Download,
  Upload
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  projectUpdates: boolean;
  paymentNotifications: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'connections' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showEarnings: boolean;
  showProjectHistory: boolean;
}

// Mock data
const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  projectUpdates: true,
  paymentNotifications: true,
  marketingEmails: false
};

const initialPrivacySettings: PrivacySettings = {
  profileVisibility: 'public',
  showOnlineStatus: true,
  allowDirectMessages: true,
  showEarnings: false,
  showProjectHistory: true
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPassword, setShowPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState(initialPrivacySettings);

  // Theme store
  const { 
    preset, 
    applied, 
    applyPreset, 
    updateToken, 
    resetSection, 
    resetAll, 
    exportTheme, 
    importTheme, 
    randomize 
  } = useThemeStore();

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

  // Theme handlers
  const handlePresetChange = (presetId: ThemePreset) => {
    applyPreset(presetId);
  };

  const handleTokenChange = (key: string, value: string) => {
    updateToken(key, value);
  };

  const handleResetSection = (category: string) => {
    resetSection(category);
  };

  const handleResetToPreset = () => {
    resetAll();
  };

  const handleSaveTheme = async () => {
    await useThemeStore.getState().save();
  };

  const handleExportTheme = () => {
    const themeData = exportTheme();
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nbcon-theme-${preset}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          } catch (error) {
            console.error('Failed to import theme:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetTheme = () => {
    resetAll();
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
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
      const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
      if (!match) return '#000000';
      
      const h = parseFloat(match[1]) / 360;
      const s = parseFloat(match[2]) / 100;
      const l = parseFloat(match[3]) / 100;
      
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
      
      const rHex = Math.round(r * 255).toString(16).padStart(2, '0');
      const gHex = Math.round(g * 255).toString(16).padStart(2, '0');
      const bHex = Math.round(b * 255).toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}`;
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
              value={displayValue.startsWith('#') ? displayValue : 
                displayValue.startsWith('rgb') ? 
                  `#${Math.round(parseInt(displayValue.match(/\d+/g)?.[0] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[1] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[2] || '0')).toString(16).padStart(2, '0')}` : 
                  '#f5f5f5'
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
            value={displayValue.startsWith('#') ? displayValue : 
              displayValue.startsWith('rgb') ? 
                `#${Math.round(parseInt(displayValue.match(/\d+/g)?.[0] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[1] || '0')).toString(16).padStart(2, '0')}${Math.round(parseInt(displayValue.match(/\d+/g)?.[2] || '0')).toString(16).padStart(2, '0')}` : 
                displayValue
            }
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs flex-1"
            placeholder="Enter hex value (e.g., #3b82f6)"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </h1>
          <p className="text-xs text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </TabsTrigger>
        </TabsList>


        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Specific Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="project-updates">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates on your active projects</p>
                    </div>
                    <Switch
                      id="project-updates"
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('projectUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notifications">Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notifications about payments and earnings</p>
                    </div>
                    <Switch
                      id="payment-notifications"
                      checked={notificationSettings.paymentNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('paymentNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <select
                  id="profile-visibility"
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                >
                  <option value="public">Public - Anyone can see your profile</option>
                  <option value="connections">Connections Only - Only your connections can see</option>
                  <option value="private">Private - Only you can see your profile</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-online-status">Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Let others know when you're online</p>
                  </div>
                  <Switch
                    id="show-online-status"
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-direct-messages">Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Allow others to send you direct messages</p>
                  </div>
                  <Switch
                    id="allow-direct-messages"
                    checked={privacySettings.allowDirectMessages}
                    onCheckedChange={(checked) => handlePrivacyChange('allowDirectMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-earnings">Show Earnings</Label>
                    <p className="text-sm text-muted-foreground">Display your earnings on your profile</p>
                  </div>
                  <Switch
                    id="show-earnings"
                    checked={privacySettings.showEarnings}
                    onCheckedChange={(checked) => handlePrivacyChange('showEarnings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-project-history">Show Project History</Label>
                    <p className="text-sm text-muted-foreground">Display your completed projects</p>
                  </div>
                  <Switch
                    id="show-project-history"
                    checked={privacySettings.showProjectHistory}
                    onCheckedChange={(checked) => handlePrivacyChange('showProjectHistory', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Authenticator App</h3>
                    <p className="text-sm text-muted-foreground">Use an app like Google Authenticator</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="font-semibold">SMS Verification</h3>
                    <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                  </div>
                  <Badge variant="outline">Not Set</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage 2FA Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Login Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Login Activity</CardTitle>
              <CardDescription>Monitor your account access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Chrome on Windows • Riyadh, Saudi Arabia</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-muted-foreground">iOS App • Jeddah, Saudi Arabia</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <div className="max-w-md">
            {/* Language & Region */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Language & Region</CardTitle>
                <CardDescription>Customize your language and location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                  >
                    <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                  >
                    <option value="SAR">Saudi Riyal (SAR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          {/* Theme Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Presets
              </CardTitle>
              <CardDescription>Choose your preferred theme</CardDescription>
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
                      onClick={() => handleResetSection(category)}
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
    </div>
  );
}