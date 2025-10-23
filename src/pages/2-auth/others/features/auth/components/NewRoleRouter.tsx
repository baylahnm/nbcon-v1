import { useEffect, useMemo, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
import { getLandingPage, getEffectiveRole, hasRolePermission } from "../lib/role-resolution";
import { UserRole } from "../../../../../1-HomePage/others/lib/auth/role";
import EngineerLayout from "../../../layouts/EngineerLayout";
import ClientLayout from "../../../layouts/ClientLayout";
import React from "react";
const EnterpriseLayout = React.lazy(() => import("../../../layouts/EnterpriseLayout"));
import AdminLayout from "../../../layouts/AdminLayout";
import EngineerDashboard from "../../../../../5-engineer/1-DashboardPage";
import ClientDashboardPage from "../../../../../4-free/1-DashboardPage";
import BrowseEngineers from "../../../../../4-free/3-BrowseEngineersPage";
import CreateJob from "../../../../../4-free/4-PostJobPage";
import JobsList from "../../../../../5-engineer/2-JobsPage";
import CheckIn from "../../../../../5-engineer/12-CheckIn";
import UploadDeliverable from "../../../../../5-engineer/5-UploadDeliverablePage";
import JobDetails from "../../../../../5-engineer/2-JobsPage";
import { MessagesPage } from "../../../../../5-engineer/4-MessagesPage";
import ClientMessagesPage from "../../../../../4-free/9-MessagesPage";
import SettingsPage from "../../../../../5-engineer/11-SettingsPage";
import ProfilePage from "../../../../../5-engineer/15-ProfilePage";
import ClientSettingsPage from "../../../../../4-free/12-SettingsPage";
import ClientProfilePage from "../../../../../4-free/2-ProfilePage";
// import VerificationPage from "../../../../../5-engineer/11-SettingsPage";
// import ThemePage from "../../../../../5-engineer/11-SettingsPage";
import HelpPage from "../../../../../5-engineer/10-HelpPage";
import MyNetwork from "../../../../../5-engineer/6-NetworkPage";
import CalendarPage from "../../../../../5-engineer/3-CalendarPage";
import LearningPage from "../../../../../5-engineer/7-LearningPage";
import ClientLearningPage from "../../../../../4-free/7-LearningPage";
import ClientFinancePage from "../../../../../4-free/10-FinancePage";
import { ChatPage } from "../../../../../5-engineer/others/features/ai/ChatPage";
import { PaymentsContent } from "../../../../../6-enterprise/others/features/finance/components/PaymentsContent";
import RankingPage from "../../../../../5-engineer/13-RankingPage";
import ReportsPage from "../../../../../5-engineer/14-ReportsPage";
import SubscriptionPage from "../../../../../5-engineer/16-SubscriptionPage";
import ClientSubscriptionPage from "../../../../../4-free/14-SubscriptionPage";
import AIToolsPlanningPage from "../../../../../4-free/15-AIToolsPlanningPage";
import ProjectCharterTool from "../../../../../4-free/others/features/ai-tools/tools/ProjectCharterTool";
import WBSBuilderTool from "../../../../../4-free/others/features/ai-tools/tools/WBSBuilderTool";
import StakeholderMapperTool from "../../../../../4-free/others/features/ai-tools/tools/StakeholderMapperTool";
import RiskRegisterTool from "../../../../../4-free/others/features/ai-tools/tools/RiskRegisterTool";
import TimelineBuilderTool from "../../../../../4-free/others/features/ai-tools/tools/TimelineBuilderTool";
import GanttChartTool from "../../../../../4-free/others/features/ai-tools/tools/GanttChartTool";
import ResourcePlannerTool from "../../../../../4-free/others/features/ai-tools/tools/ResourcePlannerTool";
import CostBudgetingPage from "../../../../../4-free/16-CostBudgetingPage";
import BOQGeneratorTool from "../../../../../4-free/others/features/ai-tools/tools/BOQGeneratorTool";
import CostEstimatorTool from "../../../../../4-free/others/features/ai-tools/tools/CostEstimatorTool";
import CashFlowPlannerTool from "../../../../../4-free/others/features/ai-tools/tools/CashFlowPlannerTool";
import BudgetTrackerTool from "../../../../../4-free/others/features/ai-tools/tools/BudgetTrackerTool";
import ValueEngineeringTool from "../../../../../4-free/others/features/ai-tools/tools/ValueEngineeringTool";
import PaymentScheduleTool from "../../../../../4-free/others/features/ai-tools/tools/PaymentScheduleTool";
import ExecutionCoordinationPage from "../../../../../4-free/17-ExecutionCoordinationPage";
import ClosureHandoverPage from "../../../../../4-free/20-ClosureHandoverPage";
import CloseoutChecklistTool from "../../../../../4-free/others/features/ai-tools/tools/CloseoutChecklistTool";
import AsBuiltDocsTool from "../../../../../4-free/others/features/ai-tools/tools/AsBuiltDocsTool";
import LessonsLearnedTool from "../../../../../4-free/others/features/ai-tools/tools/LessonsLearnedTool";
import WarrantyDocsTool from "../../../../../4-free/others/features/ai-tools/tools/WarrantyDocsTool";
import FinalReportTool from "../../../../../4-free/others/features/ai-tools/tools/FinalReportTool";
import DailySiteLogTool from "../../../../../4-free/others/features/ai-tools/tools/DailySiteLogTool";
import ProgressTrackingTool from "../../../../../4-free/others/features/ai-tools/tools/ProgressTrackingTool";
import ChangeOrderManagerTool from "../../../../../4-free/others/features/ai-tools/tools/ChangeOrderManagerTool";
import MeetingPlannerTool from "../../../../../4-free/others/features/ai-tools/tools/MeetingPlannerTool";
import IssueTrackerTool from "../../../../../4-free/others/features/ai-tools/tools/IssueTrackerTool";
import QualityCompliancePage from "../../../../../4-free/18-QualityCompliancePage";
import QualityChecklistTool from "../../../../../4-free/others/features/ai-tools/tools/QualityChecklistTool";
import InspectionReportTool from "../../../../../4-free/others/features/ai-tools/tools/InspectionReportTool";
import ComplianceTrackerTool from "../../../../../4-free/others/features/ai-tools/tools/ComplianceTrackerTool";
import DefectManagerTool from "../../../../../4-free/others/features/ai-tools/tools/DefectManagerTool";
import QualityMetricsTool from "../../../../../4-free/others/features/ai-tools/tools/QualityMetricsTool";
import CommunicationReportingPage from "../../../../../4-free/19-CommunicationReportingPage";
import ClientEmailTool from "../../../../../4-free/others/features/ai-tools/tools/ClientEmailTool";
import ProgressReportTool from "../../../../../4-free/others/features/ai-tools/tools/ProgressReportTool";
import MeetingMinutesTool from "../../../../../4-free/others/features/ai-tools/tools/MeetingMinutesTool";
import RFIManagerTool from "../../../../../4-free/others/features/ai-tools/tools/RFIManagerTool";
import PresentationDeckTool from "../../../../../4-free/others/features/ai-tools/tools/PresentationDeckTool";
import { DashboardPage as EnterpriseDashboardPage } from "../../../../../6-enterprise/1-DashboardPage";
import { TeamProjectsPage } from "../../../../../6-enterprise/4-TeamPage";
const AnalyticsPage = React.lazy(() =>
  import("../../../../../6-enterprise/5-AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);
import { TeamProjectsPage as EmployersPage } from "../../../../../6-enterprise/4-TeamPage";
const ProcurementPage = React.lazy(() =>
  import("../../../../../6-enterprise/7-ProcurementPage").then((m) => ({ default: m.ProcurementPage }))
);
import { AnalyticsPage as PerformancePage } from "../../../../../6-enterprise/5-AnalyticsPage";
import { ProcurementPage as VendorsPage } from "../../../../../6-enterprise/7-ProcurementPage";
const FinancePage = React.lazy(() =>
  import("../../../../../6-enterprise/6-FinancePage").then((m) => ({ default: m.FinancePage }))
);
import { HelpPage as EnterpriseHelpPage } from "../../../../../6-enterprise/11-HelpPage";
import { SettingsPage as EnterpriseSettingsPage } from "../../../../../6-enterprise/12-SettingsPage";
// import { DashboardPage as EnterpriseProfilePage } from "../../../../../6-enterprise/1-DashboardPage";
import { ProfilePage as EnterpriseProfilePage } from "../../../../../6-enterprise/others/features/profile/ProfilePage";
// Enterprise doesn't have a separate messages page - using DashboardPage
import { AIAssistantPage } from "../../../../../6-enterprise/9-AIAssistantPage";
import { CalendarPage as EnterpriseCalendarPage } from "../../../../../6-enterprise/3-CalendarPage";
import { DashboardPage as PostProjectPage } from "../../../../../6-enterprise/1-DashboardPage";
// import PostProjectPage from "../../../../../6-enterprise/others/features/projects/PostProjectPage";
import { RouteErrorBoundary } from "../../../../../1-HomePage/others/app/routing/RouteErrorBoundary";
import RouteFallback from "../../../../../1-HomePage/others/app/routing/RouteFallback";
import Forbidden from "../../../../../7-Forbidden";
import AdminDashboardPage from "../../../../../3-admin/1-AdminDashboardPage";

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
    if (path === "/client/payments" && role === "engineer") return "/engineer/finance";
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
          <p className="text-muted-foreground">Loading nbcon...</p>
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
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:threadId" element={<MessagesPage />} />
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
            <Route path="finance" element={<PaymentsContent />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Free Tier Routes */}
          <Route path="/free" element={<ClientLayout />}>
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
            <Route path="finance" element={<ClientFinancePage />} />
            <Route path="finance/:paymentId" element={<ClientFinancePage />} />
            <Route path="payments" element={<ClientFinancePage />} />
            <Route path="payments/:paymentId" element={<ClientFinancePage />} />
            <Route path="messages" element={<ClientMessagesPage />} />
            <Route path="messages/:threadId" element={<ClientMessagesPage />} />
            <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="ai/thread/:threadId" element={<ChatPage onBack={() => window.history.back()} />} />
            <Route path="profile" element={<ClientProfilePage />} />
            <Route path="network" element={<MyNetwork />} />
            <Route path="network/:userId" element={<MyNetwork />} />
            <Route path="learning" element={<ClientLearningPage />} />
            <Route path="learning/course/:courseId" element={<ClientLearningPage />} />
            <Route path="learning/certificates/:certificateId" element={<ClientLearningPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="subscription" element={<ClientSubscriptionPage />} />
            <Route path="settings" element={<ClientSettingsPage />} />
            <Route path="ai-tools">
              <Route path="planning" element={<AIToolsPlanningPage />} />
              <Route path="planning/charter" element={<ProjectCharterTool />} />
              <Route path="planning/wbs" element={<WBSBuilderTool />} />
              <Route path="planning/stakeholders" element={<StakeholderMapperTool />} />
              <Route path="planning/risks" element={<RiskRegisterTool />} />
              <Route path="planning/timeline" element={<TimelineBuilderTool />} />
              <Route path="planning/gantt" element={<GanttChartTool />} />
              <Route path="planning/resources" element={<ResourcePlannerTool />} />
              <Route path="budgeting" element={<CostBudgetingPage />} />
              <Route path="budgeting/boq" element={<BOQGeneratorTool />} />
              <Route path="budgeting/estimator" element={<CostEstimatorTool />} />
              <Route path="budgeting/cashflow" element={<CashFlowPlannerTool />} />
              <Route path="budgeting/tracker" element={<BudgetTrackerTool />} />
              <Route path="budgeting/value" element={<ValueEngineeringTool />} />
              <Route path="budgeting/payments" element={<PaymentScheduleTool />} />
              <Route path="execution" element={<ExecutionCoordinationPage />} />
              <Route path="execution/daily-log" element={<DailySiteLogTool />} />
              <Route path="execution/progress" element={<ProgressTrackingTool />} />
              <Route path="execution/change-orders" element={<ChangeOrderManagerTool />} />
              <Route path="execution/meetings" element={<MeetingPlannerTool />} />
              <Route path="execution/issues" element={<IssueTrackerTool />} />
              <Route path="quality" element={<QualityCompliancePage />} />
              <Route path="quality/checklist" element={<QualityChecklistTool />} />
              <Route path="quality/inspection" element={<InspectionReportTool />} />
              <Route path="quality/compliance" element={<ComplianceTrackerTool />} />
              <Route path="quality/defects" element={<DefectManagerTool />} />
              <Route path="quality/metrics" element={<QualityMetricsTool />} />
              <Route path="communication" element={<CommunicationReportingPage />} />
              <Route path="communication/client-email" element={<ClientEmailTool />} />
              <Route path="communication/progress-report" element={<ProgressReportTool />} />
              <Route path="communication/meeting-minutes" element={<MeetingMinutesTool />} />
              <Route path="communication/rfi-manager" element={<RFIManagerTool />} />
              <Route path="communication/presentation-deck" element={<PresentationDeckTool />} />
              <Route path="closure" element={<ClosureHandoverPage />} />
              <Route path="closure/closeout-checklist" element={<CloseoutChecklistTool />} />
              <Route path="closure/as-built-docs" element={<AsBuiltDocsTool />} />
              <Route path="closure/lessons-learned" element={<LessonsLearnedTool />} />
              <Route path="closure/warranty-docs" element={<WarrantyDocsTool />} />
              <Route path="closure/final-report" element={<FinalReportTool />} />
            </Route>
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
            <Route path="messages" element={<PostProjectPage />} />
            <Route path="messages/:threadId" element={<PostProjectPage />} />
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
