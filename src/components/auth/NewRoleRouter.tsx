import { useEffect, useMemo, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { getLandingPage, getEffectiveRole, hasRolePermission } from "@/lib/auth/role-resolution";
import { UserRole } from "@/lib/auth/role";
import EngineerLayout from "@/layouts/EngineerLayout";
import ClientLayout from "@/layouts/ClientLayout";
import React from "react";
const EnterpriseLayout = React.lazy(() => import("@/layouts/EnterpriseLayout"));
import AdminLayout from "@/layouts/AdminLayout";
import EngineerDashboard from "@/pages/dashboard/EngineerDashboard";
import ClientDashboardPage from "@/pages/client/DashboardPage";
import BrowseEngineers from "@/pages/browse/BrowseEngineers";
import CreateJob from "@/pages/jobs/CreateJob";
import JobsList from "@/pages/jobs/JobsList";
import CheckIn from "@/pages/engineer/CheckIn";
import UploadDeliverable from "@/pages/jobs/UploadDeliverable";
import JobDetails from "@/pages/jobs/JobDetails";
import { MessagingPage } from "@/pages/messaging/MessagingPage";
import ClientMessagesPage from "@/pages/client/MessagesPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ProfilePage from "@/pages/settings/ProfilePage";
import ClientSettingsPage from "@/pages/client/SettingsPage";
import ClientProfilePage from "@/pages/client/ProfilePage";
import VerificationPage from "@/pages/settings/VerificationPage";
import ThemePage from "@/pages/settings/ThemePage";
import HelpPage from "@/pages/support/HelpPage";
import MyNetwork from "@/pages/network/MyNetwork";
import CalendarPage from "@/pages/calendar/CalendarPage";
import LearningPage from "@/pages/learning/LearningPage";
import { ChatPage } from "@/features/ai/ChatPage";
import { PaymentsContent } from "@/features/finance/components/PaymentsContent";
import RankingPage from "@/pages/engineer/RankingPage";
import { DashboardPage as EnterpriseDashboardPage } from "@/pages/enterprise/DashboardPage";
import { TeamProjectsPage } from "@/pages/enterprise/TeamProjectsPage";
const AnalyticsPage = React.lazy(() =>
  import("@/pages/enterprise/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);
import { EmployersPage } from "@/pages/enterprise/EmployersPage";
const ProcurementPage = React.lazy(() =>
  import("@/pages/enterprise/ProcurementPage").then((m) => ({ default: m.ProcurementPage }))
);
import { PerformancePage } from "@/pages/enterprise/PerformancePage";
import { VendorsPage } from "@/pages/enterprise/VendorsPage";
const FinancePage = React.lazy(() =>
  import("@/pages/enterprise/FinancePage").then((m) => ({ default: m.FinancePage }))
);
import { HelpPage as EnterpriseHelpPage } from "@/pages/enterprise/HelpPage";
import { SettingsPage as EnterpriseSettingsPage } from "@/pages/enterprise/SettingsPage";
import { ProfilePage as EnterpriseProfilePage } from "@/pages/enterprise/ProfilePage";
import { MessagesPage as EnterpriseMessagesPage } from "@/pages/enterprise/MessagesPage";
import { AIAssistantPage } from "@/pages/enterprise/AIAssistantPage";
import { CalendarPage as EnterpriseCalendarPage } from "@/pages/enterprise/CalendarPage";
import PostProjectPage from "@/pages/enterprise/PostProjectPage";
import { RouteErrorBoundary } from "@/app/routing/RouteErrorBoundary";
import RouteFallback from "@/app/routing/RouteFallback";
import Forbidden from "@/pages/Forbidden";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

const ROLE_BASE = {
  engineer: '/engineer',
  client: '/client',
  enterprise: '/enterprise',
  admin: '/admin'
};

export function useActiveRole(): UserRole | null {
  const { profile } = useAuthStore();
  return (profile?.role as UserRole) ?? null;
}

interface LegacyRedirectsProps {
  fallback?: string;
}

function LegacyRedirects({ fallback }: LegacyRedirectsProps = {}) {
  const role = useActiveRole();
  const location = useLocation();
  const path = location.pathname;

  const redirect = useMemo(() => {
    if (path === "/e") return "/engineer/dashboard";
    if (path === "/e/checkin") return "/engineer/checkin";
    if (path === "/job/upload") return "/engineer/job/upload";
    if (path === "/ai") return role ? `${ROLE_BASE[role]}/ai` : "/auth";
    if (path === "/profile") return role ? `${ROLE_BASE[role]}/profile` : "/auth";
    if (path === "/network") return role ? `${ROLE_BASE[role]}/network` : "/auth";
    if (path === "/learning") return role ? `${ROLE_BASE[role]}/learning` : "/auth";
    if (path.startsWith("/c/")) return path.replace("/c", "/client");
    if (path.startsWith("/x/")) return path.replace("/x", "/enterprise");
    if (path === "/client/payments" && role === "engineer") return "/engineer/payments";
    return null;
  }, [path, role]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }
  if (fallback) {
    return <Navigate to={fallback} replace />;
  }
  return null;
}

export default function NewRoleRouter() {
  const role = useActiveRole();
  const { user, profile, isLoading, isInitialized } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">nb</span>
          </div>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading nbcon Pro...</p>
        </div>
      </div>
    );
  }

  // If no user or profile, redirect to auth
  if (!user || !profile || !role) {
    return <LegacyRedirects fallback="/auth" />;
  }

  // Get effective role based on subscriptions (if any)
  const effectiveRole = getEffectiveRole(role);

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <LegacyRedirects />
        <Routes>
          {/* Root redirect to appropriate dashboard */}
          <Route path="/" element={<Navigate to={getLandingPage(effectiveRole)} replace />} />

          {/* Engineer Routes */}
          <Route path="/engineer" element={<EngineerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EngineerDashboard />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
            <Route path="jobs/:jobId/tasks/:taskId" element={<JobDetails />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="calendar/event/:eventId" element={<CalendarPage />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="messages" element={<MessagingPage />} />
            <Route path="messages/:threadId" element={<MessagingPage />} />
            <Route path="job">
              <Route path="upload" element={<UploadDeliverable />} />
              <Route path=":id" element={<JobDetails />} />
            </Route>
            <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="ai/thread/:threadId" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="network" element={<MyNetwork />} />
            <Route path="network/:userId" element={<MyNetwork />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="learning/:courseId" element={<LearningPage />} />
            <Route path="learning/certificates/:certificateId" element={<LearningPage />} />
            <Route path="payments" element={<PaymentsContent />} />
            <Route path="payments/:paymentId" element={<PaymentsContent />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="browse" element={<BrowseEngineers />} />
            <Route path="myprojects" element={<JobsList />} />
            <Route path="myprojects/:projectId" element={<JobsList />} />
            <Route path="myprojects/:projectId/tasks/:taskId" element={<JobsList />} />
            <Route path="job">
              <Route path="new" element={<CreateJob />} />
            </Route>
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="calendar/event/:eventId" element={<CalendarPage />} />
            <Route path="payments" element={<PaymentsContent />} />
            <Route path="payments/:paymentId" element={<PaymentsContent />} />
            <Route path="messages" element={<ClientMessagesPage />} />
            <Route path="messages/:threadId" element={<ClientMessagesPage />} />
            <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="ai/thread/:threadId" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="profile" element={<ClientProfilePage />} />
            <Route path="network" element={<MyNetwork />} />
            <Route path="network/:userId" element={<MyNetwork />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="learning/:courseId" element={<LearningPage />} />
            <Route path="learning/certificates/:certificateId" element={<LearningPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<ClientSettingsPage />} />
          </Route>

          {/* Enterprise Routes */}
          <Route path="/enterprise" element={<EnterpriseLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EnterpriseDashboardPage />} />
            <Route path="calendar" element={<EnterpriseCalendarPage />} />
            <Route path="calendar/event/:eventId" element={<EnterpriseCalendarPage />} />
            <Route path="team-projects" element={<TeamProjectsPage />} />
            <Route path="team-projects/:projectId" element={<TeamProjectsPage />} />
            <Route path="post-project" element={<PostProjectPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="messages" element={<EnterpriseMessagesPage />} />
            <Route path="messages/:threadId" element={<EnterpriseMessagesPage />} />
            <Route path="ai" element={<AIAssistantPage />} />
            <Route path="ai/thread/:threadId" element={<AIAssistantPage />} />
            <Route path="employers" element={<EmployersPage />} />
            <Route path="employers/:employeeId" element={<EmployersPage />} />
            <Route path="procurement" element={<ProcurementPage />} />
            <Route path="procurement/:entityId" element={<ProcurementPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="performance/:itemId" element={<PerformancePage />} />
            <Route path="profile" element={<EnterpriseProfilePage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="vendors/:vendorId" element={<VendorsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="finance/:paymentId" element={<FinancePage />} />
            <Route path="help" element={<EnterpriseHelpPage />} />
            <Route path="settings" element={<EnterpriseSettingsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<div>User Management - Coming Soon</div>} />
            <Route path="projects" element={<div>Project Management - Coming Soon</div>} />
            <Route path="payments" element={<div>Payment Management - Coming Soon</div>} />
            <Route path="risk" element={<div>Risk Management - Coming Soon</div>} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Error Routes */}
          <Route path="/403" element={<Forbidden />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={getLandingPage(effectiveRole)} replace />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}
