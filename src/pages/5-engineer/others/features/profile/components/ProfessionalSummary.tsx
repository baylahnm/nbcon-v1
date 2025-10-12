import { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  Globe2,
  Sparkles,
  Edit3,
  Save
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Textarea } from '../../../../../1-HomePage/others/components/ui/textarea';

interface ProfessionalSummaryProps {
  profileData: any; // EngineerProfileData from hook
  isEditMode?: boolean;
  onUpdate?: (updates: any) => Promise<{ success: boolean; error?: string }>;
}

export function ProfessionalSummary({ profileData, isEditMode = false, onUpdate }: ProfessionalSummaryProps) {
  const [bio, setBio] = useState(
    profileData.bio || "Add your professional bio to showcase your expertise and experience..."
  );

  // Transform Supabase data to component format
  const profile = {
    specializations: profileData.specializations?.length > 0 
      ? profileData.specializations 
      : ['Add your specializations'],
    hourlyRateMin: profileData.hourly_rate || 0,
    hourlyRateMax: profileData.hourly_rate ? Math.round(profileData.hourly_rate * 1.5) : 0,
    availableHoursPerWeek: 40, // Default for now
    startAvailability: profileData.availability_status === 'available' ? 'Immediate' : 'Upon Request',
    workPreference: 'Hybrid', // Default for now
    languages: [
      { name: 'Arabic', proficiency: 'Native' },
      { name: 'English', proficiency: 'Fluent' }
    ]
  };

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate({ bio });
    }
  };

  return (
    <Card className="gap-0 group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold">About Me</h2>
            <p className="text-xs text-muted-foreground">Professional summary</p>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="ghost" className="text-xs h-8">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-6 bg-background rounded-b-xl">
        {/* Bio */}
        <div>
          {isEditMode ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a professional summary about yourself..."
              className="min-h-[120px] text-sm leading-relaxed"
              maxLength={500}
            />
          ) : (
            <p className="text-sm leading-relaxed text-foreground/80">
              {bio}
            </p>
          )}
          {isEditMode && (
            <p className="text-xs text-muted-foreground mt-2">
              {bio.length}/500 characters
            </p>
          )}
        </div>

        {/* Specializations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Specializations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec) => (
              <Badge 
                key={spec}
                variant="outline" 
                className="px-3 py-1 bg-primary/10 text-primary border-primary/20 ring-1 ring-primary/10 text-xs hover:bg-primary/15 transition-colors"
              >
                {spec}
              </Badge>
            ))}
            {isEditMode && (
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                + Add
              </Button>
            )}
          </div>
        </div>

        {/* Pricing & Availability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Hourly Rate</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-emerald-600">
                {profile.hourlyRateMin}-{profile.hourlyRateMax}
              </span>
              <span className="text-sm text-muted-foreground">SAR/hour</span>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold">Availability</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{profile.startAvailability}</span>
                <span className="text-muted-foreground"> • {profile.availableHoursPerWeek} hours/week</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.workPreference} work
              </p>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-3 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang.name}</span>
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  {lang.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

