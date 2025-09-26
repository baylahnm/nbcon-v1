import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileSetup } from "@/components/auth/ProfileSetup";
import { useAuthStore } from "@/stores/auth";

type ProfileSetupProps = React.ComponentProps<typeof ProfileSetup>;
type ProfileSetupUser = ProfileSetupProps['user'];

type Role = ProfileSetupUser['role'];

interface RegistrationLocationState {
  user?: ProfileSetupUser;
}

export function createRegistrationPage(role: Role, dashboardPath: string) {
  return function RegistrationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore(state => state.login);

    const state = location.state as RegistrationLocationState | null;
    const baseUser = state?.user;

    useEffect(() => {
      if (!baseUser) {
        navigate('/auth/role', { replace: true });
      }
    }, [baseUser, navigate]);

    if (!baseUser) {
      return null;
    }

    const initialUser = useMemo<ProfileSetupUser>(() => ({
      ...baseUser,
      role,
      language: baseUser.language ?? 'en',
      name: baseUser.name ?? '',
      email: baseUser.email ?? '',
      phone: baseUser.phone ?? '',
      location: baseUser.location ?? '',
      id: baseUser.id ?? '',
    }), [baseUser, role]);

    const handleProfileComplete = (user: ProfileSetupUser) => {
      login(user);
      navigate(dashboardPath, { replace: true });
    };

    const handleBack = () => {
      if (!baseUser) {
        navigate('/auth/role', { replace: true });
        return;
      }

      navigate('/auth/role', { replace: true, state: { user: baseUser } });
    };

    return (
      <ProfileSetup
        user={initialUser}
        onProfileComplete={handleProfileComplete}
        onBack={handleBack}
        shouldExitOnBack
      />
    );
  };
}
