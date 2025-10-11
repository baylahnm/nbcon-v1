import { useState } from 'react';
import { User } from 'lucide-react';
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

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);

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
          <Badge variant="outline" className="text-xs px-3 py-1">
            Professional Profile
          </Badge>
        </div>

        {/* Profile Header Section */}
        <div className="mb-8">
          <ProfileHeader 
            isEditMode={isEditMode} 
            isOwner={true}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
          />
        </div>

        {/* Main Content Grid: 2/3 Main + 1/3 Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left - 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <ProfessionalSummary isEditMode={isEditMode} />
            <SkillsSection isEditMode={isEditMode} />
            <CertificationsSection isEditMode={isEditMode} />
            <ExperienceSection isEditMode={isEditMode} />
            <PortfolioSection isEditMode={isEditMode} />
            <EducationSection isEditMode={isEditMode} />
            <RecommendationsSection isEditMode={isEditMode} />
          </div>

          {/* Sidebar (Right - 1/3 width) */}
          <div className="space-y-6">
            <ProfileStrengthMeter />
            <ContactInfoCard isOwner={true} />
            <ActivityFeed />
            <SimilarEngineers />
          </div>
        </div>
      </div>
    </div>
  );
}

