import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuthStore, type UserRole } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { Wrench, User, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
  {
    id: 'engineer' as UserRole,
    title: 'Engineer',
    subtitle: 'Provide engineering services',
    description: 'Join as a certified engineer to offer your professional services and grow your practice.',
    icon: Wrench,
    color: 'border-primary bg-primary/5',
  },
  {
    id: 'client' as UserRole,
    title: 'Client',
    subtitle: 'Hire engineering services',
    description: 'Find and hire qualified engineers for your projects and property needs.',
    icon: User,
    color: 'border-accent bg-accent/5',
  },
  {
    id: 'enterprise' as UserRole,
    title: 'Enterprise',
    subtitle: 'Manage team & projects',
    description: 'Enterprise solutions for companies managing multiple projects and engineering teams.',
    icon: Building2,
    color: 'border-info bg-info/5',
  },
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getCurrentProfile, isLoading: authLoading } = useAuthStore();

  // Debug: Log user state on component mount and changes
  useEffect(() => {
    console.log('RoleSelection - User state changed:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      isAuthenticated: !!user,
      authLoading
    });
    
    // If auth is not loading and no user, redirect to auth
    if (!authLoading && !user) {
      console.log('No user found and auth not loading, redirecting to auth...');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleContinue = async () => {
    if (!selectedRole) {
      console.log('No role selected');
      return;
    }

    if (!user) {
      console.log('No user found, trying to get current session...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
    }

    setIsLoading(true);

    try {
      const currentUser = user || (await supabase.auth.getUser()).data.user;
      
      if (!currentUser) {
        throw new Error('Unable to authenticate user');
      }

      console.log('Creating profile for user:', currentUser.id, 'with role:', selectedRole);
      
      // First try to check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (existingProfile) {
        console.log('Profile exists, updating role...');
        // Update existing profile
        const { data, error } = await supabase
          .from('profiles')
          .update({ role: selectedRole })
          .eq('user_id', currentUser.id)
          .select();

        if (error) throw error;
        console.log('Profile updated:', data);
        
        // If profile already exists and is complete, redirect to dashboard
        if (existingProfile.first_name && existingProfile.last_name) {
          navigate(`/${selectedRole}`);
          return;
        }
      } else {
        console.log('No existing profile, creating new one...');
        // Create new profile
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            user_id: currentUser.id,
            role: selectedRole,
            email: currentUser.email,
            phone: currentUser.phone,
            preferred_language: 'en',
            theme_preference: 'light',
            rtl_enabled: false,
          })
          .select();

        if (error) throw error;
        console.log('Profile created:', data);
      }

      // Refresh profile in store
      await getCurrentProfile();

      toast({
        title: "Profile Created",
        description: `Welcome to nbcon as ${selectedRole === 'engineer' ? 'an' : 'a'} ${selectedRole}!`,
      });

      // Redirect to profile completion
      navigate(`/auth/profile/${selectedRole}`);
    } catch (error: any) {
      console.error('Error in handleContinue:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <AuthLayout
        title="Choose Your Role"
        subtitle="How would you like to use nbcon?"
        showLogo={false}
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose Your Role"
      subtitle="How would you like to use nbcon?"
      showLogo={false}
    >
      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <Card
              key={role.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-medium",
                isSelected ? `${role.color} ring-2 ring-primary` : "hover:bg-muted/50"
              )}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{role.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300"
        disabled={!selectedRole || isLoading}
        onClick={handleContinue}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue as {selectedRole && roles.find(r => r.id === selectedRole)?.title}
      </Button>
    </AuthLayout>
  );
}