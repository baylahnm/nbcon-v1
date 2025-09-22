import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useAuth() {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    setLoading, 
    updateUser 
  } = useAuthStore();

  const handleLogout = useCallback(() => {
    logout();
    // Clear localStorage
    localStorage.removeItem('nbcon_user');
    localStorage.removeItem('nbcon-auth-storage');
    // Redirect to home
    navigate('/home');
  }, [logout, navigate]);

  const redirectToDashboard = useCallback(() => {
    if (!user) return;
    
    switch (user.role) {
      case 'engineer':
        navigate('/engineer');
        break;
      case 'client':
        navigate('/client');
        break;
      case 'enterprise':
        navigate('/enterprise');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/home');
    }
  }, [user, navigate]);

  const isRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user?.role]);

  const hasRole = useCallback((roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user?.role]);

  const isVerified = useCallback(() => {
    return user?.isVerified || false;
  }, [user?.isVerified]);

  const hasSCE = useCallback(() => {
    return !!(user?.sceNumber && user.sceNumber.trim() !== '');
  }, [user?.sceNumber]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout: handleLogout,
    setLoading,
    updateUser,
    
    // Helpers
    redirectToDashboard,
    isRole,
    hasRole,
    isVerified,
    hasSCE,
    
    // Computed
    isEngineer: isRole('engineer'),
    isClient: isRole('client'),
    isEnterprise: isRole('enterprise'),
    isAdmin: isRole('admin'),
    canAccessEngineerFeatures: hasRole(['engineer', 'admin']),
    canAccessClientFeatures: hasRole(['client', 'enterprise', 'admin']),
    canAccessEnterpriseFeatures: hasRole(['enterprise', 'admin']),
    canAccessAdminFeatures: isRole('admin'),
  };
}
