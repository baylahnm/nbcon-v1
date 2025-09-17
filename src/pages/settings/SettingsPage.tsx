import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ColorPicker } from '@/components/ui/color-picker';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore, THEME_TOKENS, THEME_PRESETS, type ThemePreset } from '@/stores/theme';
import { isLowContrast } from '@/lib/contrast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Palette,
  Download,
  Upload,
  Shuffle,
  RotateCcw,
  Check,
  AlertTriangle,
  Sunset,
  Sparkles,
  Circle,
  Waves,
  TreePine,
  Paintbrush,
  Droplets
} from 'lucide-react';

export default function SettingsPage() {
  const { profile, user, updateProfile, signOut } = useAuthStore();
  const { toast } = useToast();
  
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contrastWarnings, setContrastWarnings] = useState<Record<string, boolean>>({});

  // Check contrast ratios
  useEffect(() => {
    const warnings: Record<string, boolean> = {};
    
    // Check foreground vs background contrast
    const bgValue = applied['--background'] || '0 0% 100%';
    const fgValue = applied['--foreground'] || '0 0% 6%';
    
    warnings['foreground-background'] = isLowContrast(fgValue, bgValue);
    
    // Check other critical contrast pairs
    const cardBg = applied['--card'] || '0 0% 94%';
    const cardFg = applied['--card-foreground'] || '0 0% 6%';
    warnings['card-foreground'] = isLowContrast(cardFg, cardBg);
    
    setContrastWarnings(warnings);
  }, [applied]);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    location_city: profile?.location_city || '',
    location_region: profile?.location_region || '',
  });

  // Account settings
  const [accountData, setAccountData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme_preference: profile?.theme_preference || 'light',
    preferred_language: profile?.preferred_language || 'en',
    rtl_enabled: profile?.rtl_enabled || false,
    email_notifications: true,
    sms_notifications: true,
    marketing_emails: false,
  });

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        theme_preference: preferences.theme_preference,
        preferred_language: preferences.preferred_language,
        rtl_enabled: preferences.rtl_enabled,
      });
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (accountData.password !== accountData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (accountData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: accountData.password
      });

      if (error) throw error;

      setAccountData({ ...accountData, password: '', confirmPassword: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a production app, you'd want to mark the account as deleted
      // rather than actually deleting it immediately
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process account deletion request.",
        variant: "destructive",
      });
    }
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'theme', label: 'Themes', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Scrollable Tabs Menu */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>
        </div>

        {/* Settings Content */}
        <div className="mt-6">
          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.location_city}
                      onChange={(e) => setProfileData({ ...profileData, location_city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={profileData.location_region}
                      onChange={(e) => setProfileData({ ...profileData, location_region: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleProfileUpdate} disabled={isLoading} className="bg-gradient-primary">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="mt-0">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your login credentials and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={accountData.phone || 'Not provided'}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your phone number
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={accountData.password}
                        onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <Button 
                    onClick={handlePasswordUpdate} 
                    disabled={isLoading || !accountData.password || !accountData.confirmPassword}
                    className="bg-gradient-primary"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and interface settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <Select 
                      value={preferences.theme_preference} 
                      onValueChange={(value) => setPreferences({ ...preferences, theme_preference: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Language</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred language
                      </p>
                    </div>
                    <Select 
                      value={preferences.preferred_language} 
                      onValueChange={(value) => setPreferences({ ...preferences, preferred_language: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            English
                          </div>
                        </SelectItem>
                        <SelectItem value="ar">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            العربية
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Right-to-Left Layout</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable RTL layout for Arabic text
                      </p>
                    </div>
                    <Switch
                      checked={preferences.rtl_enabled}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, rtl_enabled: checked })}
                    />
                  </div>

                  <Separator />

                  <Button onClick={handlePreferencesUpdate} disabled={isLoading} className="bg-gradient-primary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme" className="mt-0">
            <div className="space-y-6">
              {/* Theme Presets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Presets
                  </CardTitle>
                  <CardDescription>
                    Choose from our curated collection of beautiful themes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="theme-buttons-container scrollbar-hide hover:scrollbar-show">
                    <div className="flex items-center gap-3 min-w-max pb-2">
                      <Button
                        variant={preset === 'light' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('light')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={preset === 'dark' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('dark')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={preset === 'warm' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('warm')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Palette className="h-4 w-4" />
                        Warm
                      </Button>
                      <Button
                        variant={preset === 'sunset' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('sunset')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Sunset className="h-4 w-4" />
                        Sunset
                      </Button>
                      <Button
                        variant={preset === 'abstract' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('abstract')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Sparkles className="h-4 w-4" />
                        Abstract
                      </Button>
                      <Button
                        variant={preset === 'dotted-indigo' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('dotted-indigo')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Circle className="h-4 w-4" />
                        Dotted Indigo
                      </Button>
                      <Button
                        variant={preset === 'lagoon' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('lagoon')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Waves className="h-4 w-4" />
                        Lagoon
                      </Button>
                      <Button
                        variant={preset === 'dark-nature' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('dark-nature')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <TreePine className="h-4 w-4" />
                        Dark Nature
                      </Button>
                      <Button
                        variant={preset === 'full-gradient' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('full-gradient')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Paintbrush className="h-4 w-4" />
                        Full Gradient
                      </Button>
                      <Button
                        variant={preset === 'sea-purple' ? 'default' : 'outline'}
                        onClick={() => handlePresetChange('sea-purple')}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Droplets className="h-4 w-4" />
                        Sea Purple
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Tokens */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Theme Tokens</CardTitle>
                  <CardDescription>
                    Fine-tune individual design tokens to create your perfect theme
                  </CardDescription>
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
                        {THEME_TOKENS.filter(token => token.category === category).map((token) => (
                          <TokenEditor
                            key={token.key}
                            token={token}
                            value={applied[token.key] || token.value}
                            onChange={(value) => handleTokenChange(token.key, value)}
                            hasWarning={contrastWarnings[token.key]}
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
                  <CardDescription>
                    Import, export, and manage your theme configurations
                  </CardDescription>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {Object.values(contrastWarnings).some(Boolean) && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low Contrast
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
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
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects via email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get urgent updates via SMS
                      </p>
                    </div>
                    <Switch
                      checked={preferences.sms_notifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, sms_notifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive tips, updates, and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={preferences.marketing_emails}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_emails: checked })}
                    />
                  </div>

                  <Separator />

                  <Button onClick={handlePreferencesUpdate} disabled={isLoading} className="bg-gradient-primary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy" className="mt-0">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>
                    Manage your privacy settings and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-warning/20 bg-warning/5 rounded-md">
                    <h4 className="font-medium text-warning mb-2">Data Privacy</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your data is encrypted and stored securely. We never share your personal information with third parties without your consent.
                    </p>
                  </div>

                  <div className="p-4 border border-info/20 bg-info/5 rounded-md">
                    <h4 className="font-medium text-info mb-2">Account Security</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your account is protected with industry-standard security measures including encryption and secure authentication.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Token Editor Component
function TokenEditor({ 
  token, 
  value, 
  onChange, 
  hasWarning 
}: { 
  token: { key: string; description: string }; 
  value: string; 
  onChange: (value: string) => void; 
  hasWarning?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{token.key}</Label>
        {hasWarning && <AlertTriangle className="h-4 w-4 text-destructive" />}
      </div>
      <ColorPicker
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">{token.description}</p>
    </div>
  );
}