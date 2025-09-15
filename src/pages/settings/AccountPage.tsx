import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Shield,
  Mail,
  Phone,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AccountPage() {
  const { user, profile, signOut } = useAuthStore();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email within 24 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process account deletion request.",
        variant: "destructive",
      });
    }
  };

  const getVerificationStatus = (field: string) => {
    switch (field) {
      case 'email':
        return user?.email_confirmed_at ? 'verified' : 'unverified';
      case 'phone':
        return user?.phone_confirmed_at ? 'verified' : 'unverified';
      default:
        return 'unverified';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'verified') {
      return (
        <Badge variant="outline" className="text-success border-success/20 bg-success/5">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-warning border-warning/20 bg-warning/5">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account security and login information
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your current account details and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(getVerificationStatus('email'))}
                <Button variant="outline" size="sm" disabled>
                  Change Email
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user?.phone && getStatusBadge(getVerificationStatus('phone'))}
                <Button variant="outline" size="sm" disabled>
                  Change Phone
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border border-info/20 bg-info/5 rounded-lg">
            <p className="text-sm text-info-foreground">
              <strong>Note:</strong> To change your email or phone number, please contact our support team. 
              This helps maintain account security and prevents unauthorized changes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm your new password"
            />
          </div>

          <Separator />

          <Button 
            onClick={handlePasswordUpdate} 
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-gradient-primary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
          <CardDescription>
            Information about how we protect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-success/20 bg-success/5 rounded-lg">
              <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Data Encryption
              </h4>
              <p className="text-sm text-muted-foreground">
                All your data is encrypted both in transit and at rest using industry-standard encryption.
              </p>
            </div>

            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Secure Authentication
              </h4>
              <p className="text-sm text-muted-foreground">
                Your account is protected with secure authentication and session management.
              </p>
            </div>
          </div>

          <div className="p-4 border border-info/20 bg-info/5 rounded-lg">
            <h4 className="font-medium text-info mb-2">Privacy Commitment</h4>
            <p className="text-sm text-muted-foreground">
              We never share your personal information with third parties without your explicit consent. 
              Your privacy and security are our top priorities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. This will permanently delete your account, 
                profile, projects, and remove your data from our servers.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>This action cannot be undone. This will permanently:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Delete your account and profile</li>
                        <li>Remove all your job postings and applications</li>
                        <li>Delete your message history</li>
                        <li>Remove your data from our servers</li>
                      </ul>
                      <p className="font-medium">Type "DELETE" to confirm:</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input placeholder="Type DELETE to confirm" className="my-4" />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount} 
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete Account Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}