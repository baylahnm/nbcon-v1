import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import LandingPage from './LandingPage';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user && profile) {
      // Redirect authenticated users to their dashboard
      switch (profile.role) {
        case 'engineer':
          navigate('/engineer');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'enterprise':
          navigate('/enterprise');
          break;
        default:
          navigate('/auth/role');
      }
    }
  }, [user, profile, isLoading, navigate]);

  // Show landing page for unauthenticated users
  return <LandingPage />;
};

export default Index;
