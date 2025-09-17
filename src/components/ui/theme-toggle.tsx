import * as React from "react";
import { Moon, Sun, Palette, Sunset, Paintbrush, CircleDot, Waves, TreePine, Layers, Sparkles } from "lucide-react";
import { useThemeStore } from "@/stores/theme";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'warm', label: 'Warm', icon: Palette },
  { key: 'sunset', label: 'Sunset', icon: Sunset },
  { key: 'abstract', label: 'Abstract', icon: Paintbrush },
  { key: 'dotted-indigo', label: 'Dotted Indigo', icon: CircleDot },
  { key: 'lagoon', label: 'Lagoon', icon: Waves },
  { key: 'dark-nature', label: 'Dark Nature', icon: TreePine },
  { key: 'full-gradient', label: 'Full Gradient', icon: Layers },
  { key: 'sea-purple', label: 'Sea Purple', icon: Sparkles },
];

export function ThemeToggle() {
  const { preset, applyPreset } = useThemeStore();

  const getIcon = () => {
    const currentTheme = themes.find(t => t.key === preset);
    if (currentTheme) {
      const IconComponent = currentTheme.icon;
      return <IconComponent className="h-[1.2rem] w-[1.2rem]" />;
    }
    return <Sun className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border theme-toggle-menu">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <DropdownMenuItem 
              key={themeOption.key} 
              onClick={() => applyPreset(themeOption.key as any)}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {themeOption.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}