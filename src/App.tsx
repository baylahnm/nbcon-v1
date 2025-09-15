import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import EmailAuth from "@/pages/auth/EmailAuth";
import PhoneAuth from "@/pages/auth/PhoneAuth";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import RoleSelection from "@/pages/auth/RoleSelection";
import ProfileSetup from "@/pages/auth/ProfileSetup";
import EngineerDashboard from "@/pages/dashboard/EngineerDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import BrowseEngineers from "@/pages/browse/BrowseEngineers";
import CreateJob from "@/pages/jobs/CreateJob";
import JobsList from "@/pages/jobs/JobsList";
import { MessagingPage } from "@/pages/messaging/MessagingPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ProfilePage from "@/pages/settings/ProfilePage";
import HelpPage from "@/pages/support/HelpPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<PhoneAuth />} />
          <Route path="/auth/phone" element={<PhoneAuth />} />
          <Route path="/auth/email" element={<EmailAuth />} />
          <Route path="/auth/verify" element={<VerifyOTP />} />
          <Route path="/auth/role" element={<RoleSelection />} />
          <Route path="/auth/profile/:role" element={<ProfileSetup />} />

          {/* Protected Routes with Layout */}
          <Route path="/engineer" element={<AppLayout />}>
            <Route index element={<EngineerDashboard />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="messages" element={<MessagingPage />} />
          </Route>
          
          <Route path="/client" element={<AppLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="browse" element={<BrowseEngineers />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="messages" element={<MessagingPage />} />
          </Route>
          
          <Route path="/enterprise" element={<AppLayout />}>
            <Route index element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Enterprise Dashboard</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="messages" element={<MessagingPage />} />
          </Route>

          {/* Shared Protected Routes */}
          <Route path="/settings" element={<AppLayout />}>
            <Route index element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="/profile" element={<AppLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>

          <Route path="/help" element={<AppLayout />}>
            <Route index element={<HelpPage />} />
          </Route>

          <Route path="/support" element={<AppLayout />}>
            <Route index element={<HelpPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
