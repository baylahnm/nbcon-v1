import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { ROLE_BASE, UserRole } from "@/lib/auth/role";
import EngineerLayout from "@/layouts/EngineerLayout";
import ClientLayout from "@/layouts/ClientLayout";
import EnterpriseLayout from "@/layouts/EnterpriseLayout";
import AdminLayout from "@/layouts/AdminLayout";
import EngineerDashboard from "@/pages/dashboard/EngineerDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import BrowseEngineers from "@/pages/browse/BrowseEngineers";
import CreateJob from "@/pages/jobs/CreateJob";
import JobsList from "@/pages/jobs/JobsList";
import CheckIn from "@/pages/engineer/CheckIn";
import UploadDeliverable from "@/pages/jobs/UploadDeliverable";
import JobDetails from "@/pages/jobs/JobDetails";
import { MessagingPage } from "@/pages/messaging/MessagingPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ProfilePage from "@/pages/settings/ProfilePage";
import VerificationPage from "@/pages/settings/VerificationPage";
import ThemePage from "@/pages/settings/ThemePage";
import HelpPage from "@/pages/support/HelpPage";
import MyNetwork from "@/pages/network/MyNetwork";
import CalendarPage from "@/pages/calendar/CalendarPage";
import LearningPage from "@/pages/learning/LearningPage";
import { ChatPage } from "@/features/ai/ChatPage";
import { PaymentsContent } from "@/features/finance/components/PaymentsContent";

export function useActiveRole(): UserRole | null {
  const { profile } = useAuthStore();
  return (profile?.role as UserRole) ?? null;
}

function LegacyRedirects() {
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
  return null;
}

export default function RoleRouter() {
  const role = useActiveRole();

  if (!role) {
    return <LegacyRedirects />;
  }

  return (
    <>
      <LegacyRedirects />
      <Routes>
        <Route path="/" element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />

        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="messages" element={<MessagingPage />} />
          <Route path="job">
            <Route path="upload" element={<UploadDeliverable />} />
            <Route path=":id" element={<JobDetails />} />
          </Route>
          <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="network" element={<MyNetwork />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="payments" element={<PaymentsContent />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="browse" element={<BrowseEngineers />} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="job">
            <Route path="new" element={<CreateJob />} />
          </Route>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="payments" element={<PaymentsContent />} />
          <Route path="messages" element={<MessagingPage />} />
          <Route path="ai" element={<ChatPage onBack={() => window.history.back()} />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="network" element={<MyNetwork />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/enterprise" element={<EnterpriseLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Enterprise Dashboard</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
          <Route path="projects" element={<div />} />
          <Route path="workforce" element={<div />} />
          <Route path="analytics" element={<div />} />
          <Route path="finance" element={<div />} />
          <Route path="compliance" element={<div />} />
          <Route path="messages" element={<MessagingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<div />} />
          <Route path="users" element={<div />} />
          <Route path="projects" element={<div />} />
          <Route path="payments" element={<div />} />
          <Route path="risk" element={<div />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />
      </Routes>
    </>
  );
}


