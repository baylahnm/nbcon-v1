import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { Home, Search, Plus, Briefcase, MessageSquare, DollarSign, BarChart3, Settings, HelpCircle, LogOut, User, MapPin, Users, Building2, FileText, Moon, Sun, Monitor, Clock, Upload, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
const engineerMenuItems = [{
  title: 'Dashboard',
  url: '/engineer',
  icon: Home
}, {
  title: 'Check In',
  url: '/e/checkin',
  icon: Clock
}, {
  title: 'Jobs',
  url: '/engineer/jobs',
  icon: Briefcase
}, {
  title: 'Calendar',
  url: '/engineer/calendar',
  icon: Calendar
}, {
  title: 'Upload Deliverable',
  url: '/job/upload',
  icon: Upload
}, {
  title: 'Messages',
  url: '/engineer/messages',
  icon: MessageSquare
}];
const clientMenuItems = [{
  title: 'Dashboard',
  url: '/client',
  icon: Home
}, {
  title: 'Browse Engineers',
  url: '/client/browse',
  icon: Users
}, {
  title: 'My Jobs',
  url: '/client/jobs',
  icon: Briefcase
}, {
  title: 'Calendar',
  url: '/client/calendar',
  icon: Calendar
}, {
  title: 'Messages',
  url: '/client/messages',
  icon: MessageSquare
}];
const enterpriseMenuItems = [{
  title: 'Dashboard',
  url: '/enterprise',
  icon: Home
}, {
  title: 'Messages',
  url: '/enterprise/messages',
  icon: MessageSquare
}];
const bottomMenuItems = [{
  title: 'Profile',
  url: '/profile',
  icon: User
}, {
  title: 'My Network',
  url: '/network',
  icon: Users
}, {
  title: 'Payments',
  url: '/client/payments',
  icon: DollarSign
}, {
  title: 'Help & Support',
  url: '/help',
  icon: HelpCircle
}, {
  title: 'Settings',
  url: '/settings',
  icon: Settings
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile,
    signOut
  } = useAuthStore();
  const {
    setTheme,
    theme
  } = useTheme();
  const getMenuItems = () => {
    switch (profile?.role) {
      case 'engineer':
        return engineerMenuItems;
      case 'client':
        return clientMenuItems;
      case 'enterprise':
        return enterpriseMenuItems;
      default:
        return engineerMenuItems;
    }
  };
  const menuItems = getMenuItems();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === `/${profile?.role}`) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };
  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    if (firstName) {
      return firstName.slice(0, 2);
    }
    return profile?.role?.[0].toUpperCase() || 'U';
  };
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return profile?.email || 'User';
  };
  return <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className={`border-b border-sidebar-border ${collapsed ? 'px-4 py-[18px]' : 'p-4 py-[12px]'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className={`flex-shrink-0 ${collapsed ? 'w-8 h-8' : 'w-8 h-8'} bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft`}>
              <span className={`font-bold text-primary-foreground ${collapsed ? 'text-sm' : 'text-base'}`}>nb</span>
            </div>
            {!collapsed && <div>
                <h2 className="text-lg font-bold text-sidebar-foreground sidebar-logo-title">nbcon</h2>
                <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-role-portal">
                  {profile?.role} Portal
                </p>
              </div>}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="sidebar-main-group border-b border-sidebar-border">
          <SidebarGroupLabel className="sidebar-main-menu-label">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent className="sidebar-main-content">
            <SidebarMenu className="sidebar-main-menu">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
              
              {/* Special Create Job button for clients */}
              {profile?.role === 'client' && <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/client/jobs/create" className="bg-primary/10 text-primary border border-primary/20 transition-all duration-200 hover:bg-primary/20">
                      <Plus className="mr-3 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>Post New Job</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Navigation */}
        <SidebarGroup className="sidebar-bottom-group">
          <SidebarGroupContent className="sidebar-bottom-content">
            <SidebarMenu className="sidebar-bottom-menu">
              {bottomMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
              

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border px-0 py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-3 h-auto", collapsed && "justify-center")}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground sidebar-user-display-name">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-user-role">
                      {profile?.role}
                    </p>
                  </div>}
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56" align={collapsed ? "center" : "start"} alignOffset={12}>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
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
    </Sidebar>;
}