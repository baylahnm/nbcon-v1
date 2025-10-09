import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './2-auth/others/stores/auth';
import HomePage from './1-HomePage/HomePage';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user && profile) {
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
        default:
          navigate('/auth/role', { replace: true });
      }
    }
  }, [user, profile, isLoading, navigate]);

  // Show home page for unauthenticated users
  return <HomePage />;
};

export default Index;
