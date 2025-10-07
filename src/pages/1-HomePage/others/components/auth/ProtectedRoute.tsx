import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { getStoredUser } from '../../stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'engineer' | 'client' | 'enterprise' | 'admin';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth' 
}: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    // Check for stored user if not in state
    if (!user && !isAuthenticated) {
      const storedUser = getStoredUser();
      if (storedUser && storedUser.isVerified) {
        setUser(storedUser);
      } else {
        navigate(fallbackPath, { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }
    }

    // Check if user exists and is verified
    if (user && !user.isVerified) {
      navigate('/auth/verify', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check role-based access
    if (requiredRole && user && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'engineer':
          navigate('/engineer', { replace: true });
          break;
        case 'client':
          navigate('/client', { replace: true });
          break;
        case 'enterprise':
          navigate('/enterprise', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/home', { replace: true });
      }
      return;
    }
  }, [user, isAuthenticated, requiredRole, navigate, location.pathname, fallbackPath, setUser]);

  // Show loading state while checking authentication
  if (!user && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while verifying user
  if (user && !user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verifying account...</p>
        </div>
      </div>
    );
  }

  // Show access denied if role doesn't match
  if (requiredRole && user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Your account type is: <strong>{user.role}</strong>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
