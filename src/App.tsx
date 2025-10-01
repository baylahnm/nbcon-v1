import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import EmailAuth from "@/pages/auth/EmailAuth";
import PhoneAuth from "@/pages/auth/PhoneAuth";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import RoleSelection from "@/pages/auth/RoleSelection";
import EngineerRegistration from "@/pages/auth/registration/EngineerRegistration";
import ClientRegistration from "@/pages/auth/registration/ClientRegistration";
import EnterpriseRegistration from "@/pages/auth/registration/EnterpriseRegistration";
import VerificationPage from "@/pages/settings/VerificationPage";
import ThemePage from "@/pages/settings/ThemePage";
import RoleRouter from "@/routes/RoleRouter";
import NotFound from "./pages/NotFound";
import { AuthCallback } from "@/components/auth/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<PhoneAuth />} />
          <Route path="/auth/phone" element={<PhoneAuth />} />
          <Route path="/auth/email" element={<EmailAuth />} />
          <Route path="/auth/verify" element={<VerifyOTP />} />
          <Route path="/auth/role" element={<RoleSelection />} />
          <Route path="/auth/registration/engineer" element={<EngineerRegistration />} />
          <Route path="/auth/registration/client" element={<ClientRegistration />} />
          <Route path="/auth/registration/enterprise" element={<EnterpriseRegistration />} />
          <Route path="/auth/profile/:role" element={<Navigate to="/auth/role" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Mount the unified role-aware router */}
          <Route path="/*" element={<RoleRouter />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
