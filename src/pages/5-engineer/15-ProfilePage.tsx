import { useState } from 'react';
import { User, Loader2, AlertCircle } from 'lucide-react';
import { ProfileHeader } from './others/features/profile/components/ProfileHeader';
import { ProfessionalSummary } from './others/features/profile/components/ProfessionalSummary';
import { SkillsSection } from './others/features/profile/components/SkillsSection';
import { CertificationsSection } from './others/features/profile/components/CertificationsSection';
import { ExperienceSection } from './others/features/profile/components/ExperienceSection';
import { PortfolioSection } from './others/features/profile/components/PortfolioSection';
import { EducationSection } from './others/features/profile/components/EducationSection';
import { RecommendationsSection } from './others/features/profile/components/RecommendationsSection';
import { ProfileStrengthMeter } from './others/features/profile/components/ProfileStrengthMeter';
import { ContactInfoCard } from './others/features/profile/components/ContactInfoCard';
import { ActivityFeed } from './others/features/profile/components/ActivityFeed';
import { SimilarEngineers } from './others/features/profile/components/SimilarEngineers';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Card, CardContent } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { useEngineerProfile } from './others/features/profile/hooks/useEngineerProfile';

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { profileData, isLoading, error, updateBasicInfo, addSkill, addCertification, addPortfolioProject } = useEngineerProfile();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-base font-bold mb-2">Failed to Load Profile</h3>
          <p className="text-xs text-muted-foreground mb-4">{error || 'Unable to fetch profile data'}</p>
          <Button onClick={() => window.location.reload()} size="sm" className="text-xs">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Engineer Profile</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showcase your expertise and connect with clients
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1">
              {profileData.profileCompletionPercentage}% Complete
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              Professional Profile
            </Badge>
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="mb-8">
          <ProfileHeader 
            profileData={profileData}
            isEditMode={isEditMode} 
            isOwner={true}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
            onUpdate={updateBasicInfo}
          />
        </div>

        {/* Main Content Grid: 2/3 Main + 1/3 Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left - 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <ProfessionalSummary 
              profileData={profileData}
              isEditMode={isEditMode}
              onUpdate={updateBasicInfo}
            />
            <SkillsSection 
              skills={profileData.skills}
              isEditMode={isEditMode}
              onAddSkill={addSkill}
            />
            <CertificationsSection 
              certifications={profileData.certifications}
              isEditMode={isEditMode}
              onAddCertification={addCertification}
            />
            <ExperienceSection isEditMode={isEditMode} />
            <PortfolioSection 
              projects={profileData.portfolio}
              isEditMode={isEditMode}
              onAddProject={addPortfolioProject}
            />
            <EducationSection isEditMode={isEditMode} />
            <RecommendationsSection 
              reviews={profileData.reviews}
              averageRating={profileData.averageRating}
              totalReviews={profileData.totalReviews}
            />
          </div>

          {/* Sidebar (Right - 1/3 width) */}
          <div className="space-y-6">
            <ProfileStrengthMeter 
              completionPercentage={profileData.profileCompletionPercentage}
              profileData={profileData}
            />
            <ContactInfoCard 
              email={profileData.email}
              phone={profileData.phone}
              isOwner={true}
            />
            <ActivityFeed />
            <SimilarEngineers />
          </div>
        </div>
      </div>
    </div>
  );
}

