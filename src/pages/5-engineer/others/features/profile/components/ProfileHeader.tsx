import { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Star, 
  Briefcase, 
  Calendar, 
  CheckCircle2,
  Edit3,
  Share2,
  Download,
  MessageSquare,
  Award
} from 'lucide-react';
import { Card } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar } from '../../../../../1-HomePage/others/components/ui/avatar';

interface ProfileHeaderProps {
  profileData: any; // EngineerProfileData from hook
  isEditMode?: boolean;
  isOwner?: boolean;
  onToggleEdit?: () => void;
  onUpdate?: (updates: any) => Promise<{ success: boolean; error?: string }>;
}

export function ProfileHeader({ profileData, isEditMode = false, isOwner = true, onToggleEdit, onUpdate }: ProfileHeaderProps) {
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

  // Transform Supabase data to component format
  const profile = {
    firstName: profileData.first_name || 'Engineer',
    lastName: profileData.last_name || 'User',
    title: profileData.specializations?.[0] || 'Engineer', // First specialization as title
    location: [profileData.location_city, profileData.location_region]
      .filter(Boolean)
      .map((loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1))
      .join(', ') || 'Saudi Arabia',
    avatarUrl: profileData.avatar_url,
    availabilityStatus: (profileData.availability_status || 'available') as 'available' | 'busy' | 'unavailable',
    stats: {
      rating: profileData.averageRating || 0,
      totalReviews: profileData.totalReviews || 0,
      totalProjects: profileData.totalProjects || 0,
      yearsExperience: profileData.years_experience || 0
    },
    verifications: {
      sceVerified: !!profileData.sce_license_number,
      identityVerified: true, // Assuming verified if they have an account
      isTopRated: profileData.averageRating >= 4.8 && profileData.totalReviews >= 20
    },
    credentials: {
      sceLicense: profileData.sce_license_number || null,
      certifications: profileData.certifications
        ?.filter((c: any) => c.verification_status === 'verified')
        .map((c: any) => c.certification_name.split(' ')[0]) // Extract short name (e.g., "PMP" from "Project Management Professional")
        .slice(0, 3) || [] // Show max 3
    }
  };

  const availabilityConfig = {
    available: { 
      label: 'Available for Projects', 
      color: 'bg-green-500/10 text-green-600 ring-green-500/20',
      dot: 'bg-green-500'
    },
    busy: { 
      label: 'Currently Busy', 
      color: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
      dot: 'bg-amber-500'
    },
    unavailable: { 
      label: 'Not Available', 
      color: 'bg-red-500/10 text-red-600 ring-red-500/20',
      dot: 'bg-red-500'
    }
  };

  const availability = availabilityConfig[profile.availabilityStatus];

  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
      <div className="p-7">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Profile Photo */}
          <div className="flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHoveringPhoto(true)}
              onMouseLeave={() => setIsHoveringPhoto(false)}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="h-40 w-40 rounded-2xl overflow-hidden bg-primary/10 ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                      <span className="text-5xl font-bold text-primary">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verification Badge */}
                {profile.verifications.identityVerified && (
                  <div className="absolute bottom-2 right-2 bg-green-500 p-1.5 rounded-full ring-4 ring-card">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Upload Overlay */}
                {isOwner && isHoveringPhoto && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300">
                    <Camera className="h-8 w-8 text-white" />
                    <span className="text-xs text-white font-medium">Change Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Info */}
          <div className="flex-1 space-y-4">
            {/* Name & Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                {profile.firstName} {profile.lastName}
                {profile.verifications.sceVerified && (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                )}
              </h1>
              <p className="text-xl text-muted-foreground">{profile.title}</p>
              
              {/* Location & Availability */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <Badge className={`${availability.color} border-0 ring-1 px-3 py-1`}>
                  <div className={`h-2 w-2 rounded-full ${availability.dot} mr-2 animate-pulse`} />
                  {availability.label}
                </Badge>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/30">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold">{profile.stats.rating}</span>
                  <span className="text-sm text-muted-foreground">/5.0</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({profile.stats.totalReviews} reviews)
                </span>
              </div>

              <div className="h-6 w-px bg-border/40" />

              {/* Projects */}
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold">{profile.stats.totalProjects}</span>
                <span className="text-sm text-muted-foreground">Projects</span>
              </div>

              <div className="h-6 w-px bg-border/40" />

              {/* Experience */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold">{profile.stats.yearsExperience}</span>
                <span className="text-sm text-muted-foreground">Years Exp</span>
              </div>
            </div>

            {/* Credentials & Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* SCE License */}
              <Badge variant="outline" className="px-3 py-1 bg-green-500/10 text-green-700 border-green-500/20 ring-1 ring-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1.5" />
                SCE #{profile.credentials.sceLicense}
              </Badge>

              {/* Certifications */}
              {profile.credentials.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="px-3 py-1 bg-blue-500/10 text-blue-700 border-blue-500/20 ring-1 ring-blue-500/20">
                  <Award className="h-3 w-3 mr-1.5" />
                  {cert}
                </Badge>
              ))}

              {/* Top Rated Badge */}
              {profile.verifications.isTopRated && (
                <Badge variant="outline" className="px-3 py-1 bg-amber-500/10 text-amber-700 border-amber-500/20 ring-1 ring-amber-500/20">
                  <Star className="h-3 w-3 mr-1.5 fill-amber-600 text-amber-600" />
                  Top Rated
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col gap-2.5 min-w-[200px]">
            {isOwner ? (
              <>
                <Button 
                  onClick={onToggleEdit}
                  className="w-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs h-10"
                  variant={isEditMode ? "outline" : "default"}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
                <Button 
                  variant="outline"
                  className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="w-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs h-10"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  variant="outline"
                  className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-10"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Hire Ahmed
                </Button>
                <Button 
                  variant="outline"
                  className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

