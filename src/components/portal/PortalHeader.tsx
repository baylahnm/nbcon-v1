/**
 * Portal Header Component
 * 
 * Top navigation bar with portal branding, quick actions, and user menu.
 * Displays portal icon (gradient), title, subtitle, and action buttons.
 * 
 * Follows design system: bg-primary-gradient icons, text-base titles, text-xs subtitles.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { usePortalContext } from '@/context/PortalContext';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu,
  type LucideIcon 
} from 'lucide-react';
import { useTheme } from '@/shared/stores/theme';

/**
 * Portal Header Props
 */
export interface PortalHeaderProps {
  /**
   * Show mobile menu button
   */
  onMobileMenuClick?: () => void;
  
  /**
   * Additional action buttons
   */
  actions?: React.ReactNode;
  
  /**
   * Show portal switcher
   */
  showPortalSwitcher?: boolean;
}

/**
 * Portal Header Component
 * 
 * Displays portal branding and global actions.
 * 
 * @example
 * ```tsx
 * <PortalHeader 
 *   onMobileMenuClick={() => setMobileMenuOpen(true)}
 *   showPortalSwitcher={true}
 * />
 * ```
 */
export function PortalHeader({
  onMobileMenuClick,
  actions,
  showPortalSwitcher = false,
}: PortalHeaderProps) {
  const { currentPortal, userRole, isAuthenticated } = usePortalContext();
  const { theme, setTheme } = useTheme();
  
  if (!currentPortal || !userRole || !isAuthenticated) {
    return null;
  }
  
  const PortalIcon = (require('lucide-react') as Record<string, LucideIcon>)[currentPortal.icon];
  
  return (
    <header className="flex items-center justify-between pb-6 border-b border-border/40">
      {/* Left: Portal Branding */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {onMobileMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 p-0"
            onClick={onMobileMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        {/* Portal Icon */}
        <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
          {PortalIcon ? (
            <PortalIcon className="h-5 w-5 text-white" />
          ) : (
            <span className="text-lg font-bold text-white">
              {currentPortal.name[0]}
            </span>
          )}
        </div>
        
        {/* Portal Title */}
        <div>
          <h1 className="text-base font-bold tracking-tight">
            {currentPortal.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {currentPortal.description}
          </p>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Custom actions */}
        {actions}
        
        {/* Portal Switcher (placeholder) */}
        {showPortalSwitcher && (
          <Badge variant="outline" className="text-xs capitalize">
            {userRole}
          </Badge>
        )}
        
        {/* Search Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

