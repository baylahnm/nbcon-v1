import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { R } from '@/lib/routes';
import { getUserDisplayName, getUserInitials } from '@/lib/userUtils';
import { Home, Search, Plus, Briefcase, MessageSquare, DollarSign, BarChart3, Settings, HelpCircle, LogOut, User, MapPin, Users, Building2, FileText, Moon, Sun, Monitor, Clock, Upload, Calendar, BookOpen, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
const makeTopMenu = (role?: string) => {
  switch (role) {
    case 'engineer':
      return [{ title: 'Dashboard', url: R.engineer.dashboard, icon: Home },
        { title: 'Check In', url: R.engineer.checkin, icon: Clock },
        { title: 'Jobs', url: R.engineer.jobs, icon: Briefcase },
        { title: 'Calendar', url: R.engineer.calendar, icon: Calendar },
        { title: 'Upload Deliverable', url: R.engineer.upload, icon: Upload },
        { title: 'Messages', url: R.engineer.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.engineer.ai, icon: Bot }];
    case 'client':
      return [{ title: 'Dashboard', url: R.client.dashboard, icon: Home },
        { title: 'Browse Engineers', url: R.client.browse, icon: Users },
        { title: 'My Jobs', url: R.client.jobs, icon: Briefcase },
        { title: 'Calendar', url: R.client.calendar, icon: Calendar },
        { title: 'Messages', url: R.client.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.client.ai, icon: Bot }];
    case 'enterprise':
      return [{ title: 'Dashboard', url: R.enterprise.dashboard, icon: Home },
        { title: 'Messages', url: R.enterprise.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: '/enterprise/ai', icon: Bot }];
    default:
      return [{ title: 'Dashboard', url: R.engineer.dashboard, icon: Home },
        { title: 'Check In', url: R.engineer.checkin, icon: Clock },
        { title: 'Jobs', url: R.engineer.jobs, icon: Briefcase },
        { title: 'Calendar', url: R.engineer.calendar, icon: Calendar },
        { title: 'Upload Deliverable', url: R.engineer.upload, icon: Upload },
        { title: 'Messages', url: R.engineer.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.engineer.ai, icon: Bot }];
  }
};

const makeBottomMenu = (role?: string) => {
  const common = [{ title: 'Help & Support', url: role === 'engineer' ? R.engineer.help : role === 'client' ? R.client.help : role === 'enterprise' ? R.enterprise.settings : R.engineer.help, icon: HelpCircle },
    { title: 'Settings', url: role === 'engineer' ? R.engineer.settings : role === 'client' ? R.client.settings : role === 'enterprise' ? R.enterprise.settings : R.engineer.settings, icon: Settings }];
  const roleScoped = [{ title: 'Profile', url: role === 'engineer' ? R.engineer.profile : role === 'client' ? R.client.profile : R.enterprise.settings, icon: User },
    { title: 'My Network', url: role === 'engineer' ? R.engineer.network : role === 'client' ? R.client.network : R.enterprise.settings, icon: Users },
    { title: 'Learning', url: role === 'engineer' ? R.engineer.learning : role === 'client' ? R.client.learning : R.enterprise.settings, icon: BookOpen }];
  const finance = role === 'engineer' ? [{ title: 'Finance', url: R.engineer.payments, icon: DollarSign }] : role === 'client' ? [{ title: 'Finance', url: R.client.payments, icon: DollarSign }] : [];
  return [...roleScoped, ...finance, ...common];
};
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
  const menuItems = makeTopMenu(profile?.role);
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
  const getInitials = () => getUserInitials(profile);
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
                    <NavLink to="/client/jobs/create" className="bg-accent text-accent-foreground border border-sidebar-border transition-all duration-200 hover:bg-accent/80">
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
              {makeBottomMenu(profile?.role).map(item => <SidebarMenuItem key={item.title}>
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
                      {getUserDisplayName(profile)}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-user-role">
                      {profile?.role}
                    </p>
                  </div>}
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56" align={collapsed ? "center" : "start"} alignOffset={12}>
                <DropdownMenuItem onClick={() => navigate(profile?.role === 'engineer' ? R.engineer.profile : profile?.role === 'client' ? R.client.profile : R.enterprise.settings)}>
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
    </Sidebar>;
}