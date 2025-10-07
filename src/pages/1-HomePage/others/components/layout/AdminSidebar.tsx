import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '../../stores/auth';
import { getUserDisplayName, getUserInitials, getUserProfileImage } from '@/lib/userUtils';
import { 
  Home, Users, FolderOpen, MessageSquare, DollarSign, Shield, Settings, 
  LogOut, User, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMenuItem {
  title: string;
  url: string;
  icon: any;
  group?: string;
}

const adminMenuItems: AdminMenuItem[] = [
  // Overview
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home, group: 'Overview' },
  
  // Management
  { title: 'Users', url: '/admin/users', icon: Users, group: 'Management' },
  { title: 'Projects', url: '/admin/projects', icon: FolderOpen, group: 'Management' },
  { title: 'Messages', url: '/admin/messages', icon: MessageSquare, group: 'Management' },
  
  // Finance
  { title: 'Payments', url: '/admin/payments', icon: DollarSign, group: 'Finance' },
  
  // Risk & Compliance
  { title: 'Risk Center', url: '/admin/risk', icon: Shield, group: 'Risk & Compliance' },
  
  // System
  { title: 'Settings', url: '/admin/settings', icon: Settings, group: 'System' }
];

const groupedMenuItems = adminMenuItems.reduce((acc, item) => {
  const group = item.group || 'Other';
  if (!acc[group]) {
    acc[group] = [];
  }
  acc[group].push(item);
  return acc;
}, {} as Record<string, AdminMenuItem[]>);

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuthStore();

  const currentPath = location.pathname;
  
  const isPathActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === path;
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = () => getUserInitials(profile);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className={cn("border-b border-sidebar-border", collapsed ? 'px-4 py-1' : 'px-4 py-3')}>
          <div className={cn("flex items-center", collapsed ? 'justify-center' : 'gap-3')}>
            <div className={cn("flex-shrink-0 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft", collapsed ? 'w-8 h-8' : 'w-8 h-8')}>
              <span className={cn("font-bold text-primary-foreground", collapsed ? 'text-sm' : 'text-base')}>nb</span>
            </div>
            <div className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>
              <h2 className="text-lg font-bold text-sidebar-foreground sidebar-logo-title">nbcon</h2>
              <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-role-portal">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        {Object.entries(groupedMenuItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName} className="border-b border-sidebar-border">
            <SidebarGroupLabel className="sidebar-main-menu-label">
              {!collapsed && groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent className="sidebar-main-content">
              <SidebarMenu className="sidebar-main-menu">
                {items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isPathActive(item.url)}
                      variant="ghost"
                      className="shadow-none border-none"
                    >
                      <NavLink to={item.url}>
                        <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border px-0 py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-3 h-auto", collapsed && "justify-center")}>
                <Avatar className="h-8 w-8 m-0">
                  <AvatarImage 
                    src={getUserProfileImage(profile) || undefined} 
                    alt={getUserDisplayName(profile)}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("text-left transition-opacity duration-200 m-0", collapsed && "opacity-0 w-0 overflow-hidden")}>
                  <p className="text-sm font-medium text-sidebar-foreground sidebar-user-display-name">
                    {getUserDisplayName(profile)}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-user-role">
                    Admin
                  </p>
                </div>
                <ChevronDown className={cn("ml-auto h-4 w-4 transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-56" align={collapsed ? "center" : "start"} alignOffset={12}>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
