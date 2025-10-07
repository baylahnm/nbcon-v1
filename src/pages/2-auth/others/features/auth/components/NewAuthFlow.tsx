import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth';
import { getLandingPage, getEffectiveRole } from '../lib/role-resolution';
import { supabase } from '../../../integrations/supabase/client';
import { AuthContent } from '../../../../../1-HomePage/others/components/auth/AuthContent';
import VerifyOTPContent from '../../../../../1-HomePage/others/components/auth/VerifyOTPContent';

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

type AuthStep = 'auth' | 'verify-otp' | 'account-type';

export function NewAuthFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, profile } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [currentUser, setCurrentUser] = useState<Partial<AuthenticatedUser> | null>(null);
  const [otpMethod, setOtpMethod] = useState<'sms' | 'email'>('sms');

  // Check for existing authentication on mount
  useEffect(() => {
    if (user && profile) {
      // User is already authenticated, redirect to appropriate dashboard
      const landingPage = getLandingPage(profile.role);
      navigate(landingPage, { replace: true });
      return;
    }

    // Check for stored user in localStorage
    const existingUser = localStorage.getItem('nbcon_user');
    if (existingUser) {
      try {
        const user = JSON.parse(existingUser);
        if (user && user.isVerified) {
          login(user);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('nbcon_user');
      }
    }
  }, [user, profile, navigate, login]);

  // Handle URL-based routing
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/auth/verify') {
      setCurrentStep('verify-otp');
    } else if (path === '/auth/account-type') {
      setCurrentStep('account-type');
    } else {
      setCurrentStep('auth');
    }
  }, [location.pathname]);

  // Handle URL navigation based on current step
  useEffect(() => {
    const path = location.pathname;
    
    if (currentStep === 'verify-otp' && path !== '/auth/verify') {
      navigate('/auth/verify', { replace: true });
    } else if (currentStep === 'account-type' && path !== '/auth/account-type') {
      navigate('/auth/account-type', { replace: true });
    } else if (currentStep === 'auth' && path !== '/auth') {
      navigate('/auth', { replace: true });
    }
  }, [currentStep, location.pathname, navigate]);

  const handleAuthSuccess = (user: AuthenticatedUser) => {
    // Store user in localStorage for persistence
    localStorage.setItem('nbcon_user', JSON.stringify(user));
    login(user);
  };

  const handleNeedOTPVerification = (user: Partial<AuthenticatedUser>, method: 'sms' | 'email') => {
    setCurrentUser(user);
    setOtpMethod(method);
    setCurrentStep('verify-otp');
  };

  const handleOTPVerified = (user: Partial<AuthenticatedUser>) => {
    setCurrentUser({ ...user, isVerified: true });
    setCurrentStep('account-type');
  };

  const handleAccountTypeSelected = async (accountType: string) => {
    if (!currentUser) return;

    try {
      const completeUser: AuthenticatedUser = {
        id: currentUser.id!,
        email: currentUser.email!,
        name: currentUser.name!,
        role: accountType as 'engineer' | 'client' | 'enterprise' | 'admin',
        isVerified: currentUser.isVerified || false,
        sceNumber: currentUser.sceNumber,
        company: currentUser.company,
        location: currentUser.location || '',
        phone: currentUser.phone || '',
        language: currentUser.language || 'en',
        avatar: `user-${accountType}-1`
      };

      // Check if user profile already exists in database
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', completeUser.id)
        .single();

      if (existingProfile && !error) {
        // Existing user - update role if it changed
        if (existingProfile.role !== completeUser.role) {
          await supabase
            .from('profiles')
            .update({ role: completeUser.role })
            .eq('user_id', completeUser.id);
        }
      } else {
        // New user - create profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: completeUser.id,
            email: completeUser.email,
            first_name: completeUser.name.split(' ')[0],
            last_name: completeUser.name.split(' ').slice(1).join(' ') || null,
            role: completeUser.role,
            location_city: completeUser.location,
            phone: completeUser.phone,
            preferred_language: completeUser.language,
            avatar_url: completeUser.avatar,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }

      // Complete authentication
      handleAuthSuccess(completeUser);
    } catch (error) {
      console.error('Account type selection failed:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  // Render appropriate step
  switch (currentStep) {
    case 'verify-otp':
      return (
        <VerifyOTPContent
          user={currentUser}
          method={otpMethod}
          onVerified={handleOTPVerified}
          onBack={() => setCurrentStep('auth')}
        />
      );

    case 'account-type':
      return (
        <AccountTypeSelection
          user={currentUser}
          onAccountTypeSelected={handleAccountTypeSelected}
          onBack={() => setCurrentStep('verify-otp')}
        />
      );

    default:
      return (
        <AuthContent
          onAuthSuccess={handleAuthSuccess}
          onNeedOTPVerification={handleNeedOTPVerification}
          onBack={handleBackToHome}
        />
      );
  }
}

// Simple account type selection component for the auth flow
interface AccountTypeSelectionProps {
  user: Partial<AuthenticatedUser> | null;
  onAccountTypeSelected: (type: string) => void;
  onBack: () => void;
}

function AccountTypeSelection({ user, onAccountTypeSelected, onBack }: AccountTypeSelectionProps) {
  const accountTypes = [
    { id: 'client', name: 'Client', description: 'Post jobs and manage projects' },
    { id: 'engineer', name: 'Engineer', description: 'Find jobs and get paid' },
    { id: 'enterprise', name: 'Enterprise', description: 'Team management and integrations' },
    { id: 'admin', name: 'Admin', description: 'System administration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Choose Your Account Type</h1>
          <p className="text-muted-foreground">Select the type of account that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {accountTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onAccountTypeSelected(type.id)}
              className="p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
              <p className="text-muted-foreground text-sm">{type.description}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to verification
          </button>
        </div>
      </div>
    </div>
  );
}
