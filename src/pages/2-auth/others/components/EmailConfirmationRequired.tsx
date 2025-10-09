import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { supabase } from '@/shared/supabase/client';

export function EmailConfirmationRequired() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email || !canResend) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: '✉️ Email Sent!',
        description: 'We sent a new confirmation link to your email.',
      });

      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            We sent a confirmation link to
          </p>
          <p className="text-primary font-semibold mt-1">{email}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Check your inbox</p>
                <p className="text-muted-foreground text-xs">Look for an email from nbcon</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Click the confirmation link</p>
                <p className="text-muted-foreground text-xs">This will activate your account</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Sign in to your account</p>
                <p className="text-muted-foreground text-xs">Use your email and password</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Confirmation Email
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend in {countdown}s
                </>
              )}
            </Button>

            <Button
              className="w-full"
              onClick={handleGoToSignIn}
            >
              Go to Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendEmail}
                disabled={!canResend}
                className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
              >
                request a new one
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

