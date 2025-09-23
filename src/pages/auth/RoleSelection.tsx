import { AuthenticationSystem } from "@/components/auth/AuthenticationSystem";
import { useNavigate } from "react-router-dom";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  isVerified: boolean;
  sceNumber?: string;
  company?: string;
  location: string;
  phone: string;
  language: 'ar' | 'en';
  avatar?: string;
}

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleAuthenticationComplete = (user: AuthenticatedUser) => {
    // Redirect based on user role
    switch (user.role) {
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
        navigate('/home', { replace: true });
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <AuthenticationSystem
      onAuthenticationComplete={handleAuthenticationComplete}
      onBackToHome={handleBackToHome}
    />
  );
}