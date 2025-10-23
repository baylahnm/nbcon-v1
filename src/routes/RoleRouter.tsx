import { useMemo, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
import { ROLE_BASE, UserRole } from "@/pages/1-HomePage/others/lib/auth/role";
import EngineerLayout from "@/pages/2-auth/others/layouts/EngineerLayout";
import ClientLayout from "@/pages/2-auth/others/layouts/ClientLayout";
import React from "react";
const EnterpriseLayout = React.lazy(() => import("@/pages/2-auth/others/layouts/EnterpriseLayout"));
import AdminLayout from "@/pages/2-auth/others/layouts/AdminLayout";
import EngineerDashboard from "@/pages/5-engineer/others/features/dashboard/routes/EngineerDashboard";
import ClientDashboardPage from "@/pages/4-free/1-DashboardPage";
import BrowseEngineers from "@/pages/4-free/3-BrowseEngineersPage";
import PostJobPage from "@/pages/4-free/4-PostJobPage";
import JobsPage from "@/pages/5-engineer/2-JobsPage";
import CheckIn from "@/pages/5-engineer/12-CheckIn";
import { UploadDeliverableContent } from "@/pages/5-engineer/others/features/deliverables/UploadDeliverableContent";
import { MessagesPage } from "@/pages/5-engineer/4-MessagesPage";
import ClientMessagesPage from "@/pages/4-free/9-MessagesPage";
import ProfilePage from "@/pages/5-engineer/15-ProfilePage";
import ClientSettingsPage from "@/pages/4-free/12-SettingsPage";
import ClientSubscriptionPage from "@/pages/4-free/14-SubscriptionPage";
import ClientProfilePage from "@/pages/4-free/2-ProfilePage";
import HelpPage from "@/pages/5-engineer/10-HelpPage";
import MyNetwork from "@/pages/5-engineer/6-NetworkPage";
import ClientNetworkPage from "@/pages/4-free/6-NetworkPage";
import CalendarPage from "@/pages/5-engineer/3-CalendarPage";
import LearningPage from "@/pages/5-engineer/7-LearningPage";
import ClientLearningPage from "@/pages/4-free/7-LearningPage";
import ClientFinancePage from "@/pages/4-free/10-FinancePage";
import { NewCoursePage } from "@/pages/5-engineer/others/features/learning/pages/NewCoursePage";
import { ChatPage } from "@/pages/5-engineer/others/features/ai/ChatPage";
// AI Tools Pages
import AIToolsPlanningPage from "@/pages/4-free/15-AIToolsPlanningPage";
import CostBudgetingPage from "@/pages/4-free/16-CostBudgetingPage";
import ExecutionCoordinationPage from "@/pages/4-free/17-ExecutionCoordinationPage";
import QualityCompliancePage from "@/pages/4-free/18-QualityCompliancePage";
import CommunicationReportingPage from "@/pages/4-free/19-CommunicationReportingPage";
import ClosureHandoverPage from "@/pages/4-free/20-ClosureHandoverPage";
import CloseoutChecklistTool from "@/pages/4-free/others/features/ai-tools/tools/CloseoutChecklistTool";
import AsBuiltDocsTool from "@/pages/4-free/others/features/ai-tools/tools/AsBuiltDocsTool";
import LessonsLearnedTool from "@/pages/4-free/others/features/ai-tools/tools/LessonsLearnedTool";
import WarrantyDocsTool from "@/pages/4-free/others/features/ai-tools/tools/WarrantyDocsTool";
import FinalReportTool from "@/pages/4-free/others/features/ai-tools/tools/FinalReportTool";
import { PaymentsContent } from "@/pages/6-enterprise/others/features/finance/components/PaymentsContent";
import RankingPage from "@/pages/5-engineer/13-RankingPage";
import EngineerSettingsPage from "@/pages/5-engineer/11-SettingsPage";
import ReportsPage from "@/pages/5-engineer/14-ReportsPage";
import SubscriptionPage from "@/pages/5-engineer/16-SubscriptionPage";
import { DashboardPage as EnterpriseDashboardPage } from "@/pages/6-enterprise/1-DashboardPage";
import { TeamProjectsPage } from "@/pages/6-enterprise/4-TeamPage";
const AnalyticsPage = React.lazy(() =>
  import("@/pages/6-enterprise/5-AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);
const ProcurementPage = React.lazy(() =>
  import("@/pages/6-enterprise/7-ProcurementPage").then((m) => ({ default: m.ProcurementPage }))
);
const FinancePage = React.lazy(() =>
  import("@/pages/6-enterprise/6-FinancePage").then((m) => ({ default: m.FinancePage }))
);
import { HelpPage as EnterpriseHelpPage } from "@/pages/6-enterprise/11-HelpPage";
import { SettingsPage as EnterpriseSettingsPage } from "@/pages/6-enterprise/12-SettingsPage";
import { AIAssistantPage } from "@/pages/6-enterprise/9-AIAssistantPage";
import { CalendarPage as EnterpriseCalendarPage } from "@/pages/6-enterprise/3-CalendarPage";
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
    if (path.startsWith("/c/")) return path.replace("/c", "/free");
    if (path.startsWith("/x/")) return path.replace("/x", "/enterprise");
    if (path === "/free/payments" && role === "engineer") return "/engineer/finance";
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="jobs" element={<JobsPage />} />
          {/* Deep links - Job details routes removed */}
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="calendar/event/:eventId" element={<CalendarPage />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:threadId" element={<MessagesPage />} />
          <Route path="job">
            <Route path="upload" element={<UploadDeliverableContent />} />
            {/* Job details route removed */}
          </Route>
          <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="ai/thread/:threadId" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="network" element={<MyNetwork />} />
          <Route path="network/:userId" element={<MyNetwork />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="learning/course/:courseId" element={<NewCoursePage />} />
          <Route path="learning/certificates/:certificateId" element={<LearningPage />} />
          <Route path="finance" element={<PaymentsContent />} />
          <Route path="finance/:paymentId" element={<PaymentsContent />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<EngineerSettingsPage />} />
        </Route>

        <Route path="/free" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="browse" element={<BrowseEngineers />} />
          <Route path="myprojects" element={<JobsPage />} />
          {/* Deep links */}
          <Route path="myprojects/:projectId" element={<JobsPage />} />
          <Route path="myprojects/:projectId/tasks/:taskId" element={<JobsPage />} />
          <Route path="job">
            <Route path="new" element={<PostJobPage />} />
          </Route>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="calendar/event/:eventId" element={<CalendarPage />} />
          <Route path="finance" element={<ClientFinancePage />} />
          <Route path="finance/:paymentId" element={<ClientFinancePage />} />
          <Route path="payments" element={<ClientFinancePage />} />
          <Route path="payments/:paymentId" element={<ClientFinancePage />} />
          <Route path="messages" element={<ClientMessagesPage />} />
          <Route path="messages/:threadId" element={<ClientMessagesPage />} />
          <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="ai/thread/:threadId" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="profile" element={<ClientProfilePage />} />
          <Route path="network" element={<ClientNetworkPage />} />
          <Route path="network/:userId" element={<ClientNetworkPage />} />
          <Route path="learning" element={<ClientLearningPage />} />
          <Route path="learning/course/:courseId" element={<NewCoursePage />} />
          <Route path="learning/certificates/:certificateId" element={<ClientLearningPage />} />
          {/* AI Tools Routes */}
          <Route path="ai-tools">
            <Route index element={<Navigate to="planning" replace />} />
            <Route path="planning" element={<AIToolsPlanningPage />} />
            <Route path="budgeting" element={<CostBudgetingPage />} />
            <Route path="execution" element={<ExecutionCoordinationPage />} />
            <Route path="quality" element={<QualityCompliancePage />} />
            <Route path="communication" element={<CommunicationReportingPage />} />
            <Route path="closure" element={<ClosureHandoverPage />} />
            {/* Individual Closure Tool Routes */}
            <Route path="closure/closeout-checklist" element={<CloseoutChecklistTool />} />
            <Route path="closure/as-built-docs" element={<AsBuiltDocsTool />} />
            <Route path="closure/lessons-learned" element={<LessonsLearnedTool />} />
            <Route path="closure/warranty-docs" element={<WarrantyDocsTool />} />
            <Route path="closure/final-report" element={<FinalReportTool />} />
          </Route>
          <Route path="help" element={<HelpPage />} />
          <Route path="subscription" element={<ClientSubscriptionPage />} />
          <Route path="settings" element={<ClientSettingsPage />} />
        </Route>

        <Route path="/enterprise" element={<EnterpriseLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EnterpriseDashboardPage />} />
          <Route path="calendar" element={<EnterpriseCalendarPage />} />
          <Route path="calendar/event/:eventId" element={<EnterpriseCalendarPage />} />
          <Route path="team-projects" element={<TeamProjectsPage />} />
          <Route path="team-projects/:projectId" element={<TeamProjectsPage />} />
          <Route path="post-project" element={<div className="p-8 text-center">Post Project Page - Coming Soon</div>} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="messages" element={<div className="p-8 text-center">Messages Page - Coming Soon</div>} />
          <Route path="messages/:threadId" element={<div className="p-8 text-center">Messages Page - Coming Soon</div>} />
          <Route path="ai" element={<AIAssistantPage />} />
          <Route path="ai/thread/:threadId" element={<AIAssistantPage />} />
          <Route path="employers" element={<div className="p-8 text-center">Employers Page - Coming Soon</div>} />
          <Route path="employers/:employeeId" element={<div className="p-8 text-center">Employers Page - Coming Soon</div>} />
          <Route path="procurement" element={<ProcurementPage />} />
          <Route path="procurement/:entityId" element={<ProcurementPage />} />
          <Route path="performance" element={<div className="p-8 text-center">Performance Page - Coming Soon</div>} />
          <Route path="performance/:itemId" element={<div className="p-8 text-center">Performance Page - Coming Soon</div>} />
          <Route path="profile" element={<div className="p-8 text-center">Enterprise Profile - Coming Soon</div>} />
          <Route path="vendors" element={<div className="p-8 text-center">Vendors Page - Coming Soon</div>} />
          <Route path="vendors/:vendorId" element={<div className="p-8 text-center">Vendors Page - Coming Soon</div>} />
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
          <Route path="settings" element={<EngineerSettingsPage />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />
      </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}
