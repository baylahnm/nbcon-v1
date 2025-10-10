import { Toaster } from "@/pages/1-HomePage/others/components/ui/toaster";
import { Toaster as Sonner } from "@/pages/1-HomePage/others/components/ui/sonner";
import { TooltipProvider } from "@/pages/1-HomePage/others/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import Index from "@/pages/8-index";
import HomePage from "@/pages/1-HomePage/HomePage";
import AccountTypeSelection from "@/pages/2-auth/others/features/auth/pages/AccountTypeSelection";
import { NewAuthFlow } from "@/pages/2-auth/others/features/auth/components/NewAuthFlow";
import NewRoleRouter from "@/pages/2-auth/others/features/auth/components/NewRoleRouter";
import NotFound from "@/pages/9-NotFound";
import { AuthCallback } from "@/pages/1-HomePage/others/components/auth/AuthCallback";
import ClientSignup from "@/pages/2-auth/signup/ClientSignup";
import EngineerSignup from "@/pages/2-auth/signup/EngineerSignup";
import EnterpriseSignup from "@/pages/2-auth/signup/EnterpriseSignup";
import AdminSignup from "@/pages/2-auth/signup/AdminSignup";
import { watchDirection } from "@/pages/1-HomePage/others/lib/i18n/dir";

const queryClient = new QueryClient();

// Initialize RTL/LTR direction watcher
watchDirection();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HeroUIProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* New Authentication Flow */}
            <Route path="/auth" element={<NewAuthFlow />} />
            <Route path="/auth/verify" element={<NewAuthFlow />} />
            <Route path="/auth/account-type" element={<AccountTypeSelection />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Signup Routes */}
            <Route path="/signup/client" element={<ClientSignup />} />
            <Route path="/signup/engineer" element={<EngineerSignup />} />
            <Route path="/signup/enterprise" element={<EnterpriseSignup />} />
            <Route path="/signup/admin" element={<AdminSignup />} />
            
            {/* Mount the new role-aware router */}
            <Route path="/*" element={<NewRoleRouter />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HeroUIProvider>
  </QueryClientProvider>
);

export default App;
