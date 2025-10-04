import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContent } from "./AuthContent";
import VerifyOTPContent from "./VerifyOTPContent";
import { RoleSelection } from "./RoleSelection";
import { ProfileSetup } from "./ProfileSetup";
import { supabase } from "@/integrations/supabase/client";

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

interface AuthenticationSystemProps {
  onAuthenticationComplete: (user: AuthenticatedUser) => void;
  onBackToHome: () => void;
}

type AuthStep = 'auth' | 'verify-otp' | 'role-selection' | 'profile-setup';

export function AuthenticationSystem({ onAuthenticationComplete, onBackToHome }: AuthenticationSystemProps) {
  const hasHandledStoredUser = useRef(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [currentUser, setCurrentUser] = useState<Partial<AuthenticatedUser> | null>(null);
  const [otpMethod, setOtpMethod] = useState<'sms' | 'email'>('sms');
  const navigate = useNavigate();
  const location = useLocation();

  // Keep the URL aligned with the current step
  useEffect(() => {
    if (currentStep === 'role-selection' && location.pathname !== '/auth/role') {
      navigate('/auth/role', { replace: true });
    }
  }, [currentStep, location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname === '/auth/role' && currentStep !== 'role-selection') {
      setCurrentStep('role-selection');
    }
  }, [location.pathname, currentStep]);

  useEffect(() => {
    const state = location.state as { user?: Partial<AuthenticatedUser> } | null;
    if (state?.user) {
      setCurrentUser(prev => ({ ...prev, ...state.user }));
    }
  }, [location.state]);

  // Check for existing authentication on mount
  useEffect(() => {
    const existingUser = localStorage.getItem('nbcon_user');
    if (existingUser) {
      try {
        const user = JSON.parse(existingUser);
        if (user && user.isVerified) {
          onAuthenticationComplete(user);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('nbcon_user');
      }
    }
  }, [onAuthenticationComplete]);

  const handleAuthSuccess = (user: AuthenticatedUser) => {
    // Store user in localStorage for persistence
    localStorage.setItem('nbcon_user', JSON.stringify(user));
    onAuthenticationComplete(user);
  };

  const handleNeedOTPVerification = (user: Partial<AuthenticatedUser>, method: 'sms' | 'email') => {
    setCurrentUser(user);
    setOtpMethod(method);
    setCurrentStep('verify-otp');
  };

  const handleOTPVerified = (user: Partial<AuthenticatedUser>) => {
    setCurrentUser({ ...user, isVerified: true });
    setCurrentStep('role-selection');
  };

  const handleRoleSelected = async (user: AuthenticatedUser) => {
    setCurrentUser(user);
    
    try {
      // Check if user profile already exists in database
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', user.id)
        .single();

      if (existingProfile && !error) {
        // Existing user - update role if it changed and complete authentication
        if (existingProfile.role !== user.role) {
          await supabase
            .from('profiles')
            .update({ role: user.role })
            .eq('user_id', user.id);
        }
        onAuthenticationComplete(user);
      } else {
        // New user - create profile first
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              role: user.role,
              first_name: user.name.split(' ')[0],
              last_name: user.name.split(' ').slice(1).join(' ') || '',
              email: user.email,
              phone: user.phone,
              location_city: user.location.split(',')[0]?.trim() || 'Riyadh',
              location_region: user.location.split(',').slice(1).join(',').trim() || 'Saudi Arabia',
              preferred_language: user.language,
              theme_preference: 'light',
              rtl_enabled: user.language === 'ar',
              avatar_url: user.avatar
            }
          ]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          // Navigate to registration page as fallback
          navigate(`/auth/registration/${user.role}`, { state: { user }, replace: true });
        } else {
          // Profile created successfully - complete authentication
          onAuthenticationComplete(user);
        }
      }
    } catch (error) {
      console.error('Error in role selection:', error);
      // On error, try to create profile or navigate to registration
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              role: user.role,
              first_name: user.name.split(' ')[0],
              last_name: user.name.split(' ').slice(1).join(' ') || '',
              email: user.email,
              phone: user.phone,
              location_city: user.location.split(',')[0]?.trim() || 'Riyadh',
              location_region: user.location.split(',').slice(1).join(',').trim() || 'Saudi Arabia',
              preferred_language: user.language,
              theme_preference: 'light',
              rtl_enabled: user.language === 'ar',
              avatar_url: user.avatar
            }
          ]);

        if (!insertError) {
          onAuthenticationComplete(user);
        } else {
          navigate(`/auth/registration/${user.role}`, { state: { user }, replace: true });
        }
      } catch (finalError) {
        console.error('Final error in role selection:', finalError);
        navigate(`/auth/registration/${user.role}`, { state: { user }, replace: true });
      }
    }
  };

  const handleProfileComplete = (user: AuthenticatedUser) => {
    // Store complete user in localStorage
    localStorage.setItem('nbcon_user', JSON.stringify(user));
    onAuthenticationComplete(user);
  };

  const handleResendOTP = async () => {
    if (!currentUser) return;
    
    try {
      // Resend OTP using Supabase
      if (currentUser.email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: currentUser.email
        });
        
        if (error) {
          console.error('Error resending OTP:', error);
        }
      }
    } catch (error) {
      console.error('Error in resend OTP:', error);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify-otp':
        setCurrentStep('auth');
        break;
      case 'role-selection':
        setCurrentStep('verify-otp');
        break;
      case 'profile-setup':
        setCurrentStep('role-selection');
        break;
      default:
        onBackToHome();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'auth':
        return (
          <AuthContent
            onAuthSuccess={handleAuthSuccess}
            onNeedOTPVerification={handleNeedOTPVerification}
            onBack={onBackToHome}
          />
        );

      case 'verify-otp':
        return currentUser ? (
          <VerifyOTPContent
            user={currentUser}
            otpMethod={otpMethod}
            onOTPVerified={handleOTPVerified}
            onBack={handleBack}
            onResendOTP={handleResendOTP}
          />
        ) : null;

      case 'role-selection':
        return (
          <RoleSelection
            user={currentUser ?? {}}
            onRoleSelected={handleRoleSelected}
            onBack={handleBack}
          />
        );

      case 'profile-setup':
        return currentUser && 'role' in currentUser ? (
          <ProfileSetup
            user={currentUser as AuthenticatedUser}
            onProfileComplete={handleProfileComplete}
            onBack={handleBack}
          />
        ) : null;

      default:
        return (
          <AuthContent
            onAuthSuccess={handleAuthSuccess}
            onNeedOTPVerification={handleNeedOTPVerification}
            onBack={onBackToHome}
          />
        );
    }
  };

  return <>{renderCurrentStep()}</>;
}

