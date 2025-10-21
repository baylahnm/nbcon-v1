import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { R } from '../../lib/routes';

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setStatus('error');
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;
          
          // Extract user data from OAuth provider
          const userMetadata = user.user_metadata;
          const fullName = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0] || 'User';
          const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;
          
          // Check if user already has a profile with a role
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (existingProfile?.role) {
            // User has a profile - log them in and redirect to dashboard
            const authenticatedUser = {
              id: user.id,
              email: user.email || '',
              name: fullName,
              role: existingProfile.role,
              isVerified: user.email_confirmed_at ? true : false,
              location: userMetadata?.location || 'Riyadh, Saudi Arabia',
              phone: userMetadata?.phone || '',
              language: 'en' as const,
              avatar: avatarUrl,
              company: userMetadata?.company || '',
              source: 'supabase' as const
            };

            login(authenticatedUser);
            setStatus('success');
            
            setTimeout(() => {
              const roleRoute = R[existingProfile.role]?.dashboard || '/home';
              navigate(roleRoute, { replace: true });
            }, 1500);
          } else {
            // New OAuth user without profile - redirect to account type selection
            // Store OAuth user data in session for account type selection
            sessionStorage.setItem('oauth_user_data', JSON.stringify({
              id: user.id,
              email: user.email,
              name: fullName,
              avatar: avatarUrl,
              phone: userMetadata?.phone || '',
              language: 'en',
              isVerified: true,
              source: 'supabase'
            }));
            
            setStatus('success');
            
            setTimeout(() => {
              navigate('/auth/account-type', { replace: true });
            }, 1000);
          }
        } else {
          // Check if we're in the middle of an OAuth flow
          const urlParams = new URLSearchParams(window.location.search);
          const errorParam = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');
          
          if (errorParam) {
            setError(`Authentication error: ${errorDescription || errorParam}`);
          } else {
            setError('No user session found. Please try logging in again.');
          }
          setStatus('error');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('An unexpected error occurred. Please try again.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [login, navigate]);

  const handleRetry = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br bg-primary-gradient/80 rounded-xl flex items-center justify-center">
            {status === 'loading' && <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-primary-foreground" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-primary-foreground" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <p className="text-muted-foreground">
              Please wait while we complete your authentication...
            </p>
          )}
          
          {status === 'success' && (
            <p className="text-muted-foreground">
              Welcome! Redirecting you to your dashboard...
            </p>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Function to ensure user profile exists in database
// Note: This function is currently unused but kept for reference
const ensureUserProfileExists = async (user: { 
  id: string; 
  email?: string; 
  name: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  phone?: string;
  location: string;
  language: string;
  avatar?: string;
  user_metadata?: { name?: string; full_name?: string } 
}) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            role: user.role,
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            phone: user.phone || null,
            location_city: user.location.split(',')[0]?.trim() || null,
            location_region: user.location.split(',').slice(1).join(',').trim() || null,
            preferred_language: user.language,
            theme_preference: 'light',
            rtl_enabled: user.language === 'ar',
            avatar_url: user.avatar || null
          }
        ]);

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        console.log('User profile created successfully');
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile exists:', error);
  }
};
