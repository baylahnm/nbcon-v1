import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuthStore } from '../../stores/auth';
import { R } from '../../lib/routes';
import { getUserDisplayName, getUserInitials, getUserProfileImage } from '../../lib/userUtils';
import { Home, Search, Plus, Briefcase, MessageSquare, DollarSign, BarChart3, Settings, HelpCircle, LogOut, User, MapPin, Users, Building2, FileText, Moon, Sun, Monitor, Clock, Upload, Calendar, BookOpen, Bot, TrendingUp, UserCheck, Package, Target, Building, Truck, Trophy, FolderOpen, Shield, Crown, BarChart, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import NbLogo from '../ui/nb-logo';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

const makeTopMenu = (role?: string): MenuItem[] => {
  switch (role) {
    case 'engineer':
      return [
        { title: 'Dashboard', url: R.engineer.dashboard, icon: Home },
        { title: 'Check In', url: R.engineer.checkin, icon: Clock },
        { title: 'Jobs', url: R.engineer.jobs, icon: Briefcase },
        { title: 'Calendar', url: R.engineer.calendar, icon: Calendar },
        { title: 'Upload Deliverable', url: R.engineer.upload, icon: Upload },
        { title: 'Messages', url: R.engineer.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.engineer.ai, icon: Bot },
        { title: 'Profile', url: R.engineer.profile, icon: User },
        { title: 'Ranking', url: '/engineer/ranking', icon: Trophy },
        { title: 'Network', url: R.engineer.network, icon: Users },
        { title: 'Learning', url: R.engineer.learning, icon: BookOpen },
        { title: 'Finance', url: R.engineer.finance, icon: DollarSign },
        { title: 'Reports', url: R.engineer.reports, icon: BarChart },
        { title: 'Subscription', url: R.engineer.subscription, icon: Crown },
        { title: 'Help', url: R.engineer.help, icon: HelpCircle },
        { title: 'Settings', url: R.engineer.settings, icon: Settings }
      ];
    case 'client':
      return [
        { title: 'Dashboard', url: R.client.dashboard, icon: Home },
        { title: 'Post New Job', url: R.client.jobNew, icon: Plus },
        { title: 'Browse Engineers', url: R.client.browse, icon: Users },
        { title: 'My Projects', url: R.client.jobs, icon: Briefcase },
        { title: 'Calendar', url: R.client.calendar, icon: Calendar },
        { title: 'Messages', url: R.client.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.client.ai, icon: Bot },
        { title: 'Profile', url: R.client.profile, icon: User },
        { title: 'Network', url: R.client.network, icon: Users },
        { title: 'Learning', url: R.client.learning, icon: BookOpen },
        { title: 'Finance', url: R.client.finance, icon: DollarSign },
        { title: 'Subscription', url: R.client.subscription, icon: Crown },
        { title: 'Help', url: R.client.help, icon: HelpCircle },
        { title: 'Settings', url: R.client.settings, icon: Settings }
      ];
    case 'enterprise':
      return [
        { title: 'Dashboard', url: R.enterprise.dashboard, icon: Home },
        { title: 'Calendar', url: R.enterprise.calendar, icon: Calendar },
        { title: 'Team & Projects', url: R.enterprise.teamProjects, icon: Users },
        { title: 'Post Project', url: R.enterprise.postProject, icon: Plus },
        { title: 'Analytics & Reports', url: R.enterprise.analytics, icon: BarChart3 },
        { title: 'Messages', url: R.enterprise.messages, icon: MessageSquare },
        { title: 'AI Assistant', url: R.enterprise.ai, icon: Bot },
        { title: 'Employers', url: R.enterprise.employers, icon: UserCheck },
        { title: 'Procurement', url: R.enterprise.procurement, icon: Package },
        { title: 'Performance', url: R.enterprise.performance, icon: Target },
        { title: 'Company Profile', url: R.enterprise.profile, icon: Building },
        { title: 'All Vendors', url: R.enterprise.vendors, icon: Truck },
        { title: 'Finance', url: R.enterprise.finance, icon: DollarSign },
        { title: 'Help & Support', url: R.enterprise.help, icon: HelpCircle },
        { title: 'Settings', url: R.enterprise.settings, icon: Settings }
      ];
    case 'admin':
      return [
        { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
        { title: 'Users', url: '/admin/users', icon: Users },
        { title: 'Projects', url: '/admin/projects', icon: FolderOpen },
        { title: 'Messages', url: '/admin/messages', icon: MessageSquare },
        { title: 'Payments', url: '/admin/payments', icon: DollarSign },
        { title: 'Risk Center', url: '/admin/risk', icon: Shield },
        { title: 'Settings', url: '/admin/settings', icon: Settings }
      ];
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
  const isPathActive = (path: string) => {
    if (path === `/${profile?.role}`) {
      return currentPath === path;
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      // Wait a moment for Supabase to fully clear the session
      await new Promise(resolve => setTimeout(resolve, 500));
      // Use hard redirect to fully clear React state and force fresh initialization
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback to auth page even on error
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = '/auth';
    }
  };
  const getInitials = () => getUserInitials(profile);
  return <Sidebar collapsible="icon">
      <SidebarContent>
         {/* Logo Section */}
         <div className={`border-b border-sidebar-border ${collapsed ? 'px-4 py-1' : 'px-4 py-3'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-t from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-sm shadow-primary/50">
              <NbLogo className="w-6 h-6 !flex" />
            </div>
            <div className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>
              <h2 className="text-lg font-bold text-sidebar-foreground sidebar-logo-title">nbcon</h2>
              <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-role-portal">
                {profile?.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="sidebar-main-group border-b border-sidebar-border">
          <SidebarGroupContent className="sidebar-main-content">
            <SidebarMenu className="sidebar-main-menu">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isPathActive(item.url)}
                    variant={item.isSpecial ? "outline" : "default"}
                    className="shadow-none border-none"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>{item.title}</span>
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
              <Button variant="ghost" className={cn("w-full justify-start p-3 h-auto gap-3", collapsed && "justify-center")}>
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
                    {profile?.role}
                  </p>
                </div>
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