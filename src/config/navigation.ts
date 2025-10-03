import type { UserRole } from "@/lib/auth/role";

export type NavItem = {
  labelKey: string;
  to: string;
  icon?: string;
  exact?: boolean;
  featureFlag?: string;
};

export const NAV: Record<UserRole, NavItem[]> = {
  engineer: [
    { labelKey: "nav.dashboard", to: "/engineer/dashboard", icon: "dashboard" },
    { labelKey: "nav.jobs", to: "/engineer/jobs", icon: "briefcase" },
    { labelKey: "nav.ranking", to: "/engineer/ranking", icon: "trophy" },
    { labelKey: "nav.calendar", to: "/engineer/calendar", icon: "calendar" },
    { labelKey: "nav.messages", to: "/engineer/messages", icon: "chat" },
    { labelKey: "nav.ai", to: "/engineer/ai", icon: "bot" },
    { labelKey: "nav.upload", to: "/engineer/job/upload", icon: "upload" },
    { labelKey: "nav.network", to: "/engineer/network", icon: "users" },
    { labelKey: "nav.learning", to: "/engineer/learning", icon: "book" },
    { labelKey: "nav.finance", to: "/engineer/payments", icon: "wallet" },
    { labelKey: "nav.help", to: "/engineer/help", icon: "help" },
    { labelKey: "nav.settings", to: "/engineer/settings", icon: "settings" },
  ],
  client: [
    { labelKey: "nav.dashboard", to: "/client/dashboard", icon: "dashboard" },
    { labelKey: "nav.browse", to: "/client/browse", icon: "search" },
    { labelKey: "nav.jobs", to: "/client/myprojects", icon: "briefcase" },
    { labelKey: "nav.calendar", to: "/client/calendar", icon: "calendar" },
    { labelKey: "nav.messages", to: "/client/messages", icon: "chat" },
    { labelKey: "nav.ai", to: "/client/ai", icon: "bot" },
    { labelKey: "nav.post", to: "/client/job/new", icon: "plus" },
    { labelKey: "nav.network", to: "/client/network", icon: "users" },
    { labelKey: "nav.learning", to: "/client/learning", icon: "book" },
    { labelKey: "nav.finance", to: "/client/payments", icon: "wallet" },
    { labelKey: "nav.help", to: "/client/help", icon: "help" },
    { labelKey: "nav.settings", to: "/client/settings", icon: "settings" },
  ],
  enterprise: [
    { labelKey: "nav.dashboard", to: "/enterprise/dashboard", icon: "dashboard" },
    { labelKey: "nav.projects", to: "/enterprise/team-projects", icon: "briefcase" },
    { labelKey: "nav.postProject", to: "/enterprise/post-project", icon: "plus" },
    { labelKey: "nav.workforce", to: "/enterprise/employers", icon: "users" },
    { labelKey: "nav.analytics", to: "/enterprise/analytics", icon: "chart" },
    { labelKey: "nav.finance", to: "/enterprise/finance", icon: "wallet" },
    { labelKey: "nav.compliance", to: "/enterprise/performance", icon: "shield" },
    { labelKey: "nav.messages", to: "/enterprise/messages", icon: "chat" },
    { labelKey: "nav.settings", to: "/enterprise/settings", icon: "settings" },
  ],
  admin: [
    { labelKey: "nav.dashboard", to: "/admin/dashboard", icon: "dashboard" },
    { labelKey: "nav.users", to: "/admin/users", icon: "users" },
    { labelKey: "nav.projects", to: "/admin/projects", icon: "briefcase" },
    { labelKey: "nav.payments", to: "/admin/payments", icon: "wallet" },
    { labelKey: "nav.risk", to: "/admin/risk", icon: "alert" },
    { labelKey: "nav.settings", to: "/admin/settings", icon: "settings" },
  ],
};


