import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import AccountTypeSelection from "@/features/auth/pages/AccountTypeSelection";
import { NewAuthFlow } from "@/features/auth/components/NewAuthFlow";
import NewRoleRouter from "@/features/auth/components/NewRoleRouter";
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
          
          {/* New Authentication Flow */}
          <Route path="/auth" element={<NewAuthFlow />} />
          <Route path="/auth/verify" element={<NewAuthFlow />} />
          <Route path="/auth/account-type" element={<AccountTypeSelection />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Signup Routes - TODO: Implement these */}
          <Route path="/signup/client" element={<div>Client Signup - Coming Soon</div>} />
          <Route path="/signup/engineer" element={<div>Engineer Signup - Coming Soon</div>} />
          <Route path="/signup/enterprise" element={<div>Enterprise Signup - Coming Soon</div>} />
          <Route path="/signup/admin" element={<div>Admin Signup - Coming Soon</div>} />
          
          {/* Mount the new role-aware router */}
          <Route path="/*" element={<NewRoleRouter />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
