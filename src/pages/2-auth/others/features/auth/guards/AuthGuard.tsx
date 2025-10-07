import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../../stores/auth';
import { getLandingPage, getEffectiveRole, hasRolePermission } from '@/features/auth/lib/role-resolution';
import { UserRole } from '@/lib/auth/role';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading || !isInitialized) return;

    // If no user, redirect to auth
    if (!user) {
      navigate('/auth', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // If no profile, redirect to account type selection
    if (!profile) {
      navigate('/auth/account-type', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check role requirements
    if (requiredRole) {
      const userRole = profile.role as UserRole;
      const effectiveRole = getEffectiveRole(userRole);
      
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasPermission = roles.some(role => hasRolePermission(effectiveRole, role));

      if (!hasPermission) {
        // Redirect to appropriate landing page or forbidden
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          const landingPage = getLandingPage(effectiveRole);
          navigate(landingPage, { replace: true });
        }
        return;
      }
    }
  }, [user, profile, isLoading, isInitialized, requiredRole, redirectTo, navigate, location.pathname]);

  // Show loading state
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

  // Don't render children if not authenticated or authorized
  if (!user || !profile) {
    return null;
  }

  if (requiredRole) {
    const userRole = profile.role as UserRole;
    const effectiveRole = getEffectiveRole(userRole);
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasPermission = roles.some(role => hasRolePermission(effectiveRole, role));

    if (!hasPermission) {
      return null;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function EngineerGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="engineer">{children}</AuthGuard>;
}

export function ClientGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="client">{children}</AuthGuard>;
}

export function EnterpriseGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="enterprise">{children}</AuthGuard>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>;
}

export function MultiRoleGuard({ 
  children, 
  roles 
}: { 
  children: React.ReactNode;
  roles: UserRole[];
}) {
  return <AuthGuard requiredRole={roles}>{children}</AuthGuard>;
}
