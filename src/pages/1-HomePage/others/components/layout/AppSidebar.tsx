import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuthStore } from '../../stores/auth';
import { R } from '../../lib/routes';
import { getUserDisplayName, getUserInitials, getUserProfileImage } from '../../lib/userUtils';
import { Home, Search, Plus, Briefcase, MessageSquare, DollarSign, BarChart3, Settings, HelpCircle, LogOut, User, MapPin, Users, Building2, FileText, Moon, Sun, Monitor, Clock, Upload, Calendar, BookOpen, Bot, TrendingUp, UserCheck, Package, Target, Building, Truck, Trophy, FolderOpen, Shield, Crown, BarChart, LucideIcon, ChevronDown, ChevronRight, Rocket, Calculator, ClipboardCheck, Gift, UserPlus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import NbLogo from '../ui/nb-logo';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const makeGroupedMenu = (role?: string): MenuGroup[] => {
  switch (role) {
    case 'engineer':
      return [
        {
          title: 'Work',
          defaultOpen: true,
          items: [
            { title: 'Dashboard', url: R.engineer.dashboard, icon: Home },
            { title: 'Jobs', url: R.engineer.jobs, icon: Briefcase },
            { title: 'Check In', url: R.engineer.checkin, icon: Clock },
            { title: 'Upload Deliverable', url: R.engineer.upload, icon: Upload },
            { title: 'Calendar', url: R.engineer.calendar, icon: Calendar },
          ]
        },
        {
          title: 'Communication',
          defaultOpen: true,
          items: [
            { title: 'Messages', url: R.engineer.messages, icon: MessageSquare },
            { title: 'AI Assistant', url: R.engineer.ai, icon: Bot },
            { title: 'Network', url: R.engineer.network, icon: Users },
          ]
        },
        {
          title: 'Development',
          defaultOpen: false,
          items: [
            { title: 'Learning', url: R.engineer.learning, icon: BookOpen },
            { title: 'Profile', url: R.engineer.profile, icon: User },
            { title: 'Ranking', url: '/engineer/ranking', icon: Trophy },
          ]
        },
        {
          title: 'Business',
          defaultOpen: false,
          items: [
            { title: 'Finance', url: R.engineer.finance, icon: DollarSign },
            { title: 'Reports', url: R.engineer.reports, icon: BarChart },
            { title: 'Subscription', url: R.engineer.subscription, icon: Crown },
          ]
        },
        {
          title: 'Support',
          defaultOpen: false,
          items: [
            { title: 'Help', url: R.engineer.help, icon: HelpCircle },
            { title: 'Settings', url: R.engineer.settings, icon: Settings }
          ]
        }
      ];
    case 'client':
      return [
        {
          title: 'Overview',
          defaultOpen: true,
          items: [
            { title: 'Dashboard', url: R.client.dashboard, icon: Home },
            { title: 'Browse Engineers', url: R.client.browse, icon: Users },
            { title: 'Calendar', url: R.client.calendar, icon: Calendar },
          ]
        },
        {
          title: 'Projects',
          defaultOpen: true,
          items: [
            { title: 'Post New Job', url: R.client.jobNew, icon: Plus },
            { title: 'Projects', url: R.client.jobs, icon: Briefcase },
          ]
        },
        {
          title: 'AI Tools',
          defaultOpen: true,
          items: [
            { title: 'AI Assistant', url: R.client.ai, icon: Bot },
            { title: 'Project Planning', url: R.client.aiToolsPlanning, icon: Rocket },
            { title: 'Cost & Budgeting', url: '/free/ai-tools/budgeting', icon: Calculator },
            { title: 'Execution & Coordination', url: '/free/ai-tools/execution', icon: ClipboardCheck },
            { title: 'Quality & Compliance', url: '/free/ai-tools/quality', icon: Shield },
            { title: 'Communication & Reporting', url: '/free/ai-tools/communication', icon: FileText },
            { title: 'Closure & Handover', url: '/free/ai-tools/closure', icon: Target },
          ]
        },
        {
          title: 'Communication',
          defaultOpen: false,
          items: [
            { title: 'Messages', url: R.client.messages, icon: MessageSquare },
            { title: 'Network', url: R.client.network, icon: Users },
          ]
        },
        {
          title: 'Development',
          defaultOpen: false,
          items: [
            { title: 'Learning', url: R.client.learning, icon: BookOpen },
            { title: 'Profile', url: R.client.profile, icon: User },
          ]
        },
        {
          title: 'Business',
          defaultOpen: false,
          items: [
            { title: 'Finance', url: R.client.finance, icon: DollarSign },
            { title: 'Subscription', url: R.client.subscription, icon: Crown },
          ]
        },
        {
          title: 'Support',
          defaultOpen: false,
          items: [
            { title: 'Help', url: R.client.help, icon: HelpCircle },
            { title: 'Settings', url: R.client.settings, icon: Settings }
          ]
        }
      ];
    case 'enterprise':
      return [
        {
          title: 'Overview',
          defaultOpen: true,
          items: [
            { title: 'Dashboard', url: R.enterprise.dashboard, icon: Home },
            { title: 'Team & Projects', url: R.enterprise.teamProjects, icon: Users },
            { title: 'Analytics & Reports', url: R.enterprise.analytics, icon: BarChart3 },
          ]
        },
        {
          title: 'Projects',
          defaultOpen: true,
          items: [
            { title: 'Post Project', url: R.enterprise.postProject, icon: Plus },
            { title: 'Calendar', url: R.enterprise.calendar, icon: Calendar },
          ]
        },
        {
          title: 'Management',
          defaultOpen: false,
          items: [
            { title: 'Employers', url: R.enterprise.employers, icon: UserCheck },
            { title: 'Procurement', url: R.enterprise.procurement, icon: Package },
            { title: 'Performance', url: R.enterprise.performance, icon: Target },
            { title: 'All Vendors', url: R.enterprise.vendors, icon: Truck },
          ]
        },
        {
          title: 'Communication',
          defaultOpen: false,
          items: [
            { title: 'Messages', url: R.enterprise.messages, icon: MessageSquare },
            { title: 'AI Assistant', url: R.enterprise.ai, icon: Bot },
          ]
        },
        {
          title: 'Business',
          defaultOpen: false,
          items: [
            { title: 'Company Profile', url: R.enterprise.profile, icon: Building },
            { title: 'Finance', url: R.enterprise.finance, icon: DollarSign },
          ]
        },
        {
          title: 'Support',
          defaultOpen: false,
          items: [
            { title: 'Help & Support', url: R.enterprise.help, icon: HelpCircle },
            { title: 'Settings', url: R.enterprise.settings, icon: Settings }
          ]
        }
      ];
    case 'admin':
      return [
        {
          title: 'Overview',
          defaultOpen: true,
          items: [
            { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
            { title: 'Users', url: '/admin/users', icon: Users },
            { title: 'Projects', url: '/admin/projects', icon: FolderOpen },
          ]
        },
        {
          title: 'Management',
          defaultOpen: false,
          items: [
            { title: 'Messages', url: '/admin/messages', icon: MessageSquare },
            { title: 'Payments', url: '/admin/payments', icon: DollarSign },
            { title: 'Risk Center', url: '/admin/risk', icon: Shield },
          ]
        },
        {
          title: 'System',
          defaultOpen: false,
          items: [
            { title: 'Settings', url: '/admin/settings', icon: Settings }
          ]
        }
      ];
    default:
      return [
        {
          title: 'Work',
          defaultOpen: true,
          items: [
            { title: 'Dashboard', url: R.engineer.dashboard, icon: Home },
            { title: 'Check In', url: R.engineer.checkin, icon: Clock },
            { title: 'Jobs', url: R.engineer.jobs, icon: Briefcase },
            { title: 'Calendar', url: R.engineer.calendar, icon: Calendar },
            { title: 'Upload Deliverable', url: R.engineer.upload, icon: Upload },
            { title: 'Messages', url: R.engineer.messages, icon: MessageSquare },
            { title: 'AI Assistant', url: R.engineer.ai, icon: Bot }
          ]
        }
      ];
  }
};

// Collapsible Menu Group Component
function CollapsibleMenuGroup({ 
  group, 
  collapsed, 
  isPathActive 
}: { 
  group: MenuGroup; 
  collapsed: boolean; 
  isPathActive: (path: string) => boolean;
}) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen || false);

  return (
    <div className="space-y-1">
      {/* Group Header with Dropdown Arrow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors",
          collapsed && "justify-center px-2"
        )}
      >
        <span className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>
          {group.title}
        </span>
        {!collapsed && (
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        )}
      </button>

      {/* Group Items */}
      {isOpen && !collapsed && (
        <div className="space-y-1 pl-2">
          {group.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isPathActive(item.url)}
                variant={item.isSpecial ? "outline" : "default"}
                className="shadow-none border-none"
              >
                <NavLink to={item.url}>
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="transition-opacity duration-200">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      )}

      {/* Collapsed State - Show only first item */}
      {collapsed && group.items.length > 0 && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={isPathActive(group.items[0].url)}
            variant={group.items[0].isSpecial ? "outline" : "default"}
            className="shadow-none border-none"
          >
            <NavLink to={group.items[0].url}>
              {React.createElement(group.items[0].icon, { className: "mr-3 h-4 w-4 flex-shrink-0" })}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </div>
  );
}

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
  const menuGroups = makeGroupedMenu(profile?.role);
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
            <div className="flex-shrink-0">
              <NbLogo />
            </div>
            <div className={cn("transition-opacity duration-200", collapsed && "opacity-0 w-0 overflow-hidden")}>
              <h2 className="text-lg font-bold text-sidebar-foreground sidebar-logo-title">nbcon</h2>
              <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-role-portal">
                {profile?.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation with Groups */}
        <SidebarGroup className="sidebar-main-group">
          <SidebarGroupContent className="sidebar-main-content">
            <SidebarMenu className="sidebar-main-menu">
              {menuGroups.map((group, index) => (
                <div key={group.title}>
                  <CollapsibleMenuGroup 
                    group={group} 
                    collapsed={collapsed} 
                    isPathActive={isPathActive} 
                  />
                  {/* Thin divider line between groups */}
                  {index < menuGroups.length - 1 && (
                    <div className="border-b border-sidebar-border/50 my-2" />
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border px-0 py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-3 h-auto gap-3", collapsed && "justify-center pr-0")}>
                <Avatar className="h-8 w-8 m-0">
                  <AvatarImage 
                    src={getUserProfileImage(profile) || undefined} 
                    alt={getUserDisplayName(profile)}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("text-left transition-opacity duration-200 m-0 flex-1", collapsed && "opacity-0 w-0 overflow-hidden")}>
                  <p className="text-sm font-medium text-sidebar-foreground sidebar-user-display-name">
                    {getUserDisplayName(profile)}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize sidebar-user-role">
                    {profile?.role}
                  </p>
                </div>
                {/* Dropdown Arrow */}
                {!collapsed && (
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 transition-colors" />
                )}
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                className="w-[280px] max-h-[calc(100vh-64px)] overflow-y-auto" 
                align={collapsed ? "center" : "start"} 
                alignOffset={12}
              >
                {/* Account Header */}
                <div className="my-2 flex items-center gap-2 px-1.5">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-medium">
                      {getUserDisplayName(profile).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center gap-[2px] leading-none">
                    <p className="text-sm font-medium">{getUserDisplayName(profile)}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>

                {/* Turn Pro Banner */}
                <div className="px-1.5 pb-1.5">
                  <div className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2">
                    <span className="flex items-center gap-1 text-sm">
                      <Crown className="h-4 w-4" />
                      Turn Pro
                    </span>
                    <Button 
                      size="sm" 
                      className="h-7 bg-primary hover:bg-primary/80 text-xs"
                      onClick={() => navigate('/subscription')}
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>

                {/* Credits Widget */}
                <div className="flex flex-col gap-1 px-1.5 pb-1.5 pt-1">
                  <div className="flex flex-col gap-2.5 rounded-xl bg-muted p-4 md:rounded-md md:p-3">
                    <div className="flex items-center justify-between cursor-pointer transition-all duration-150 ease-in-out hover:opacity-80">
                      <p className="text-base font-medium md:text-sm">Credits</p>
                      <div className="flex items-center gap-px">
                        <p className="text-base font-normal md:text-sm">Upgrade</p>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <div className="relative h-2.5 flex-1 overflow-hidden rounded-lg bg-muted-foreground/20"></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      <p className="text-base text-muted-foreground md:text-sm">Free credits reset on 01 Feb</p>
                    </div>
                  </div>
                </div>

                {/* Settings & Invite Buttons */}
                <div className="flex flex-row gap-1.5 px-1.5 pb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 gap-2 bg-muted hover:bg-accent"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 gap-2 bg-muted hover:bg-accent"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Button>
                </div>

                <DropdownMenuSeparator className="-mx-1 my-1" />

                {/* Workspaces Section */}
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm text-muted-foreground">Workspaces (1)</span>
                </div>

                <div className="flex max-h-[300px] w-full flex-col overflow-y-auto">
                  <DropdownMenuItem className="gap-2 py-1.5">
                    <Avatar className="h-[26px] w-[26px] rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary font-medium text-white">
                        {getUserDisplayName(profile).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="min-w-0 truncate text-sm">{getUserDisplayName(profile)}'s Workspace</p>
                    <span className="rounded-full px-2 py-px text-[10px] font-medium uppercase bg-muted text-muted-foreground ml-auto">
                      {profile?.role || 'FREE'}
                    </span>
                    <Check className="h-4 w-4 ml-1" />
                  </DropdownMenuItem>
                </div>

                <DropdownMenuItem className="gap-3.5 px-3 py-2.5">
                  <Plus className="h-4 w-4" />
                  <p>Create new workspace</p>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="-mx-1 my-1" />

                {/* Footer Actions */}
                <DropdownMenuItem className="gap-2">
                  <Gift className="h-4 w-4" />
                  <span>Get free credits</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => navigate('/help')}
                >
                  <HelpCircle className="h-5 w-5" />
                  <p>Help Center</p>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-foreground to-foreground/70" />
                    <p>Appearance</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className="-mx-1 my-1" />

                <DropdownMenuItem 
                  className="gap-2 text-foreground" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <p>Sign out</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>;
}