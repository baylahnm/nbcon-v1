import { supabase } from '@/shared/supabase/client';
import { AuthenticatedUser } from '../../../stores/auth';

export interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    city: string;
    province: string;
    bio: string;
    profileImage?: string;
  };
  professionalInfo: {
    title: string;
    company: string;
    experience: string;
    specialization: string[];
    sceNumber: string;
    sceStatus: "verified" | "pending" | "expired";
    licenses: License[];
    certifications: Certification[];
    languages: Language[];
  };
  portfolio: {
    projects: PortfolioProject[];
    skills: Skill[];
    achievements: Achievement[];
    reviews: Review[];
  };
  settings: {
    profileVisibility: "public" | "professional" | "private";
    showPhone: boolean;
    showEmail: boolean;
    jobNotifications: boolean;
    marketingEmails: boolean;
  };
}

export interface License {
  id: string;
  name: string;
  issuer: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expired" | "pending";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  language: string;
  proficiency: "native" | "fluent" | "intermediate" | "basic";
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  value: string;
  duration: string;
  status: "completed" | "ongoing" | "planning";
  images: string[];
  skills: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: "technical" | "software" | "management" | "communication";
  verified: boolean;
  yearsOfExperience?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  type: "award" | "certification" | "recognition" | "milestone";
}

export interface Review {
  id: string;
  clientName: string;
  projectName: string;
  rating: number;
  comment: string;
  date: string;
}

class ProfileClient {
  /**
   * Get user profile data from Supabase
   */
  async getProfile(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Transform database data to ProfileData format
      return this.transformToProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Update user profile data in Supabase
   */
  async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<boolean> {
    try {
      // Transform ProfileData to database format
      const dbData = this.transformToDbFormat(profileData);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...dbData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  /**
   * Create initial profile for new user
   */
  async createProfile(user: AuthenticatedUser): Promise<boolean> {
    try {
      const defaultProfile: ProfileData = {
        personalInfo: {
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phone || '',
          dateOfBirth: '',
          nationality: 'Saudi Arabian',
          city: user.location?.split(',')[0] || 'Riyadh',
          province: user.location?.split(',')[1]?.trim() || 'Riyadh Province',
          bio: '',
          profileImage: user.avatar
        },
        professionalInfo: {
          title: '',
          company: user.company || '',
          experience: '',
          specialization: [],
          sceNumber: '',
          sceStatus: 'pending',
          licenses: [],
          certifications: [],
          languages: [
            { language: 'Arabic', proficiency: 'native' },
            { language: 'English', proficiency: 'fluent' }
          ]
        },
        portfolio: {
          projects: [],
          skills: [],
          achievements: [],
          reviews: []
        },
        settings: {
          profileVisibility: 'professional',
          showPhone: true,
          showEmail: false,
          jobNotifications: true,
          marketingEmails: false
        }
      };

      const dbData = this.transformToDbFormat(defaultProfile);

      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          role: user.role,
          ...dbData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  }

  /**
   * Upload profile image to Supabase Storage
   */
  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      // Use the fileName directly without nested folder structure
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true // This allows overwriting existing files
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  }

  /**
   * Transform database format to ProfileData
   */
  private transformToProfileData(dbData: any): ProfileData {
    return {
      personalInfo: {
        firstName: dbData.first_name || '',
        lastName: dbData.last_name || '',
        email: dbData.email || '',
        phone: dbData.phone || '',
        dateOfBirth: dbData.date_of_birth || '',
        nationality: dbData.nationality || 'Saudi Arabian',
        city: dbData.city || '',
        province: dbData.province || '',
        bio: dbData.bio || '',
        profileImage: dbData.profile_image
      },
      professionalInfo: {
        title: dbData.title || '',
        company: dbData.company || '',
        experience: dbData.experience || '',
        specialization: dbData.specialization || [],
        sceNumber: dbData.sce_number || '',
        sceStatus: dbData.sce_status || 'pending',
        licenses: Array.isArray(dbData.licenses) ? dbData.licenses : [],
        certifications: Array.isArray(dbData.certifications) ? dbData.certifications : [],
        languages: Array.isArray(dbData.languages) ? dbData.languages : []
      },
      portfolio: {
        projects: Array.isArray(dbData.projects) ? dbData.projects : [],
        skills: Array.isArray(dbData.skills) ? dbData.skills : [],
        achievements: Array.isArray(dbData.achievements) ? dbData.achievements : [],
        reviews: Array.isArray(dbData.reviews) ? dbData.reviews : []
      },
      settings: {
        profileVisibility: dbData.profile_visibility || 'professional',
        showPhone: dbData.show_phone ?? true,
        showEmail: dbData.show_email ?? false,
        jobNotifications: dbData.job_notifications ?? true,
        marketingEmails: dbData.marketing_emails ?? false
      }
    };
  }

  /**
   * Transform ProfileData to database format
   */
  private transformToDbFormat(profileData: Partial<ProfileData>): any {
    const dbData: any = {};

    if (profileData.personalInfo) {
      dbData.first_name = profileData.personalInfo.firstName;
      dbData.last_name = profileData.personalInfo.lastName;
      dbData.email = profileData.personalInfo.email;
      dbData.phone = profileData.personalInfo.phone;
      // Handle empty date strings - convert to null for database
      dbData.date_of_birth = profileData.personalInfo.dateOfBirth && profileData.personalInfo.dateOfBirth.trim() !== '' 
        ? profileData.personalInfo.dateOfBirth 
        : null;
      dbData.nationality = profileData.personalInfo.nationality;
      dbData.city = profileData.personalInfo.city;
      dbData.province = profileData.personalInfo.province;
      dbData.bio = profileData.personalInfo.bio;
      dbData.profile_image = profileData.personalInfo.profileImage;
    }

    if (profileData.professionalInfo) {
      dbData.title = profileData.professionalInfo.title;
      dbData.company = profileData.professionalInfo.company;
      dbData.experience = profileData.professionalInfo.experience;
      dbData.specialization = profileData.professionalInfo.specialization;
      dbData.sce_number = profileData.professionalInfo.sceNumber;
      dbData.sce_status = profileData.professionalInfo.sceStatus;
      dbData.licenses = profileData.professionalInfo.licenses;
      dbData.certifications = profileData.professionalInfo.certifications;
      dbData.languages = profileData.professionalInfo.languages;
    }

    if (profileData.portfolio) {
      dbData.projects = profileData.portfolio.projects;
      dbData.skills = profileData.portfolio.skills;
      dbData.achievements = profileData.portfolio.achievements;
      dbData.reviews = profileData.portfolio.reviews;
    }

    if (profileData.settings) {
      dbData.profile_visibility = profileData.settings.profileVisibility;
      dbData.show_phone = profileData.settings.showPhone;
      dbData.show_email = profileData.settings.showEmail;
      dbData.job_notifications = profileData.settings.jobNotifications;
      dbData.marketing_emails = profileData.settings.marketingEmails;
    }

    return dbData;
  }
}

export const profileClient = new ProfileClient();
