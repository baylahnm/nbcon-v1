import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/color-picker';
import { 
  Download, 
  Upload, 
  Shuffle, 
  Save, 
  RotateCcw, 
  Settings, 
  Lock, 
  Palette,
  Sun,
  Moon,
  Monitor,
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
import { useThemeStore, THEME_TOKENS, THEME_PRESETS, type ThemeMode, type ThemePreset } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { isLowContrast } from '@/lib/contrast';

export default function ThemePage() {
  const { theme, setTheme } = useTheme();
  const { profile } = useAuthStore();
  const {
    mode,
    preset,
    custom,
    applied,
    setMode,
    applyPreset,
    updateToken,
    resetSection,
    resetAll,
    importTheme,
    exportTheme,
    randomize,
    save
  } = useThemeStore();

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

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    if (newMode === 'system') {
      // Let next-themes handle system theme
      setTheme('system');
    } else {
      setTheme(newMode);
    }
  };

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
          } catch (error) {
            console.error('Failed to import theme:', error);
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
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await save();
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isEnterprise = profile?.role === 'enterprise' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <div className="theme-page-container p-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Themes</h1>
              <p className="text-muted-foreground mt-2">
                Customize your interface appearance and create your perfect workspace
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                disabled={isImporting}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={randomize}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Set Random
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="presets" className="theme-vertical-rhythm">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Tokens</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Color Mode Section */}
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
                    variant={preset === 'wazeer' ? 'default' : 'outline'}
                    onClick={() => handlePresetChange('wazeer')}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Palette className="h-4 w-4" />
                    Wazeer
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

          {/* Preset Themes */}
          <TabsContent value="presets" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Preset Themes
                </CardTitle>
                <CardDescription>
                  Choose from our curated collection of beautiful themes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(THEME_PRESETS).map(([presetKey, tokens]) => (
                    <PresetThemeCard
                      key={presetKey}
                      name={presetKey}
                      tokens={tokens}
                      isActive={preset === presetKey}
                      onClick={() => handlePresetChange(presetKey as ThemePreset)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Tokens */}
          <TabsContent value="custom" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Custom Theme Tokens</CardTitle>
                <CardDescription>
                  Fine-tune individual design tokens to create your perfect theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
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
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Import, export, and manage your theme configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

                {isEnterprise && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Organization Settings
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Set as Organization Default</h5>
                          <p className="text-sm text-muted-foreground">
                            Apply this theme as the default for all organization members
                          </p>
                        </div>
                        <Button variant="outline">
                          Set Default
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Lock Theme</h5>
                          <p className="text-sm text-muted-foreground">
                            Prevent members from changing their theme
                          </p>
                        </div>
                        <Button variant="outline">
                          <Lock className="h-4 w-4 mr-2" />
                          Lock Theme
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t">
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
    </div>
  );
}

// Preset Theme Card Component
function PresetThemeCard({ 
  name, 
  tokens, 
  isActive, 
  onClick 
}: { 
  name: string; 
  tokens: Record<string, string>; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  const primaryColor = tokens['--primary'] || '142 65% 47%';
  const secondaryColor = tokens['--secondary'] || '0 0% 94%';
  const accentColor = tokens['--accent'] || '0 0% 94%';

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/20 ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium capitalize">{name}</h3>
            {isActive && <Check className="h-4 w-4 text-primary" />}
          </div>
          <div className="space-y-2">
            <div className="flex gap-1">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: `hsl(${primaryColor})` }}
              />
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: `hsl(${secondaryColor})` }}
              />
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: `hsl(${accentColor})` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
