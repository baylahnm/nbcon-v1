import * as React from "react";
import { Moon, Sun, Palette, Sunset, Paintbrush, Circle, Waves, TreePine, Sparkles, Droplets } from "lucide-react";
import { useActiveRole } from "../../../../2-auth/others/features/auth/components/NewRoleRouter";
import { useThemeStore as useEngineerThemeStore } from "../../../../5-engineer/others/stores/theme";
import { useThemeStore as useEnterpriseThemeStore } from "../../../../6-enterprise/others/stores/theme";
import { useThemeStore as useClientThemeStore } from "../../../../4-client/others/stores/theme";
import { useThemeStore as useAdminThemeStore } from "../../../../3-admin/others/stores/theme";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const themes = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'wazeer', label: 'Wazeer', icon: Palette },
  { key: 'sunset', label: 'Sunset', icon: Sunset },
  { key: 'abstract', label: 'Abstract', icon: Sparkles },
  { key: 'nika', label: 'Nika', icon: Circle },
  { key: 'lagoon', label: 'Lagoon', icon: Waves },
  { key: 'dark-nature', label: 'Dark Nature', icon: TreePine },
  { key: 'full-gradient', label: 'Full Gradient', icon: Paintbrush },
  { key: 'sea-purple', label: 'Sea Purple', icon: Droplets },
];

export function ThemeToggle() {
  const activeRole = useActiveRole();
  
  // Use the appropriate theme store based on the current role
  const engineerThemeStore = useEngineerThemeStore();
  const enterpriseThemeStore = useEnterpriseThemeStore();
  const clientThemeStore = useClientThemeStore();
  const adminThemeStore = useAdminThemeStore();
  
  // Get the theme store for the current role
  const getThemeStore = () => {
    switch (activeRole) {
      case 'engineer':
        return engineerThemeStore;
      case 'enterprise':
        return enterpriseThemeStore;
      case 'client':
        return clientThemeStore;
      case 'admin':
        return adminThemeStore;
      default:
        return engineerThemeStore; // Default fallback
    }
  };
  
  const { preset, applyPreset } = getThemeStore();

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
          const isActive = preset === themeOption.key;
          return (
            <DropdownMenuItem 
              key={themeOption.key} 
              onClick={() => applyPreset(themeOption.key as any)}
              className={isActive ? "bg-accent text-accent-foreground" : ""}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {themeOption.label}
              {isActive && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

