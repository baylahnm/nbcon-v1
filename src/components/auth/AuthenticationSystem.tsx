import { useState, useEffect } from "react";
import { AuthContent } from "./AuthContent";
import { VerifyOTPContent } from "./VerifyOTPContent";
import { RoleSelection } from "./RoleSelection";
import { ProfileSetup } from "./ProfileSetup";

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
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [currentUser, setCurrentUser] = useState<Partial<AuthenticatedUser> | null>(null);
  const [otpMethod, setOtpMethod] = useState<'sms' | 'email'>('sms');

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

  const handleRoleSelected = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentStep('profile-setup');
  };

  const handleProfileComplete = (user: AuthenticatedUser) => {
    // Store complete user in localStorage
    localStorage.setItem('nbcon_user', JSON.stringify(user));
    onAuthenticationComplete(user);
  };

  const handleResendOTP = () => {
    // In a real app, this would trigger an API call to resend OTP
    console.log('Resending OTP to:', currentUser?.email || currentUser?.phone);
    // Simulate resend success
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
        return currentUser ? (
          <RoleSelection
            user={currentUser}
            onRoleSelected={handleRoleSelected}
            onBack={handleBack}
          />
        ) : null;

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
