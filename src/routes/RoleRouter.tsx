import { useEffect, useMemo, useState, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/pages/1-HomePage/others/stores/auth";
import { ROLE_BASE, UserRole } from "@/pages/1-HomePage/others/lib/auth/role";
import EngineerLayout from "@/pages/2-auth/others/layouts/EngineerLayout";
import ClientLayout from "@/pages/2-auth/others/layouts/ClientLayout";
import React from "react";
const EnterpriseLayout = React.lazy(() => import("@/pages/2-auth/others/layouts/EnterpriseLayout"));
import AdminLayout from "@/pages/2-auth/others/layouts/AdminLayout";
import EngineerDashboard from "@/pages/5-engineer/others/features/dashboard/routes/EngineerDashboard";
import ClientDashboardPage from "@/pages/4-client/1-DashboardPage";
import BrowseEngineers from "@/pages/4-client/3-BrowseEngineersPage";
import CreateJob from "@/pages/4-client/others/features/jobs/CreateJob";
import JobsList from "@/pages/5-engineer/others/features/jobs/JobsList";
import CheckIn from "@/pages/5-engineer/12-CheckIn";
import UploadDeliverable from "@/pages/5-engineer/others/features/deliverables/UploadDeliverableContent";
import JobDetails from "@/pages/5-engineer/others/features/jobs/JobDetails";
import { MessagingPage } from "@/pages/5-engineer/4-MessagesPage";
import ClientMessagesPage from "@/pages/4-client/9-MessagesPage";
import SettingsPage from "@/pages/5-engineer/11-SettingsPage";
import ProfilePage from "@/pages/5-engineer/others/features/profile/ProfilePage";
import ClientSettingsPage from "@/pages/4-client/12-SettingsPage";
import ClientProfilePage from "@/pages/4-client/2-ProfilePage";
import VerificationPage from "@/pages/5-engineer/others/features/settings/VerificationPage";
import ThemePage from "@/pages/5-engineer/others/features/settings/ThemePage";
import HelpPage from "@/pages/5-engineer/10-HelpPage";
import MyNetwork from "@/pages/5-engineer/6-NetworkPage";
import CalendarPage from "@/pages/5-engineer/3-CalendarPage";
import LearningPage from "@/pages/5-engineer/7-LearningPage";
import { ChatPage } from "@/pages/5-engineer/others/features/ai/ChatPage";
import { PaymentsContent } from "@/pages/6-enterprise/others/features/finance/components/PaymentsContent";
import RankingPage from "@/pages/5-engineer/13-RankingPage";
import EngineerSettingsPage from "@/pages/5-engineer/11-SettingsPage";
import { DashboardPage as EnterpriseDashboardPage } from "@/pages/6-enterprise/1-DashboardPage";
import { TeamProjectsPage } from "@/pages/6-enterprise/4-TeamPage";
const AnalyticsPage = React.lazy(() =>
  import("@/pages/6-enterprise/5-AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);
import { EmployersPage } from "@/pages/6-enterprise/others/features/employers/EmployersPage";
const ProcurementPage = React.lazy(() =>
  import("@/pages/6-enterprise/7-ProcurementPage").then((m) => ({ default: m.ProcurementPage }))
);
import { PerformancePage } from "@/pages/6-enterprise/others/features/performance/PerformancePage";
import { VendorsPage } from "@/pages/6-enterprise/others/features/vendors/VendorsPage";
const FinancePage = React.lazy(() =>
  import("@/pages/6-enterprise/6-FinancePage").then((m) => ({ default: m.FinancePage }))
);
import { HelpPage as EnterpriseHelpPage } from "@/pages/6-enterprise/11-HelpPage";
import { SettingsPage as EnterpriseSettingsPage } from "@/pages/6-enterprise/12-SettingsPage";
import { ProfilePage as EnterpriseProfilePage } from "@/pages/6-enterprise/others/features/profile/ProfilePage";
import { MessagesPage as EnterpriseMessagesPage } from "@/pages/6-enterprise/others/features/messages/MessagesPage";
import { AIAssistantPage } from "@/pages/6-enterprise/9-AIAssistantPage";
import { CalendarPage as EnterpriseCalendarPage } from "@/pages/6-enterprise/3-CalendarPage";
import PostProjectPage from "@/pages/6-enterprise/others/features/projects/PostProjectPage";
import { RouteErrorBoundary } from "@/pages/1-HomePage/others/app/routing/RouteErrorBoundary";
import RouteFallback from "@/pages/1-HomePage/others/app/routing/RouteFallback";
import Forbidden from "@/pages/7-Forbidden";
import AdminDashboardPage from "@/pages/3-admin/1-AdminDashboardPage";

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
export default function RoleRouter() {
  const role = useActiveRole();

  if (!role) {
    return <LegacyRedirects fallback="/auth/role" />;
  }

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <LegacyRedirects />
        <Routes>
        <Route path="/" element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />

        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="jobs" element={<JobsList />} />
          {/* Deep links */}
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
          <Route path="settings" element={<EngineerSettingsPage />} />
        </Route>

        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="browse" element={<BrowseEngineers />} />
          <Route path="myprojects" element={<JobsList />} />
          {/* Deep links */}
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

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<div />} />
          <Route path="projects" element={<div />} />
          <Route path="payments" element={<div />} />
          <Route path="risk" element={<div />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />
      </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}
