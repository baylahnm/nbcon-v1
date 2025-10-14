import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './2-auth/others/stores/auth';
import HomePage from './1-HomePage/HomePage';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    // Safety check: Don't redirect if sign-out is in progress
    if (typeof window !== 'undefined') {
      const isSigningOut = sessionStorage.getItem('manual-signout') === 'true';
      if (isSigningOut) {
        console.log('[INDEX] Skipping redirect - sign-out in progress');
        return;
      }
    }

    // Only redirect if auth is fully initialized and user is authenticated
    if (!isLoading && isInitialized && user && profile) {
      console.log('[INDEX] Redirecting authenticated user to:', profile.role, 'dashboard');
      
      // Redirect authenticated users to their dashboard
      switch (profile.role) {
        case 'engineer':
          navigate('/engineer/dashboard', { replace: true });
          break;
        case 'client':
          navigate('/client/dashboard', { replace: true });
          break;
        case 'enterprise':
          navigate('/enterprise/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          console.warn('[INDEX] Unknown role:', profile.role, '- redirecting to role selection');
          navigate('/auth/role', { replace: true });
      }
    }
  }, [user, profile, isLoading, isInitialized, navigate]);

  // Show home page for unauthenticated users
  return <HomePage />;
};

export default Index;
