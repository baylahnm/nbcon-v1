import { useState } from 'react';
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
  const { user, getCurrentProfile } = useAuthStore();

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);

    try {
      // Create or update profile with selected role (avoid duplicate constraint on user_id)
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: user.id,
            role: selectedRole,
            email: user.email,
            phone: user.phone,
            preferred_language: 'en',
            theme_preference: 'light',
            rtl_enabled: false,
          },
          { onConflict: 'user_id' }
        );

      // Refresh profile in store
      await getCurrentProfile();

      toast({
        title: "Profile Created",
        description: `Welcome to nbcon as ${selectedRole === 'engineer' ? 'an' : 'a'} ${selectedRole}!`,
      });

      // Redirect to profile completion
      navigate(`/auth/profile/${selectedRole}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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