import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../../2-auth/others/stores/auth';
import { supabase } from '../../../../../../shared/supabase/client';

export interface EngineerProfileData {
  // Basic Profile Info (from profiles table)
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  location_city: string | null;
  location_region: string | null;
  account_number: string | null;
  created_at: string;
  
  // Engineer-Specific Info (from engineer_profiles table)
  specializations: string[];
  years_experience: number | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  availability_status: string | null;
  sce_license_number: string | null;
  
  // Skills (from engineer_skills table)
  skills: Array<{
    id: string;
    skill_name: string;
    skill_category: string | null;
    proficiency_level: number | null;
    years_experience: number | null;
    is_verified: boolean;
  }>;
  
  // Certifications (from engineer_certifications table)
  certifications: Array<{
    id: string;
    certification_name: string;
    issuing_organization: string;
    certificate_number: string | null;
    issue_date: string | null;
    expiry_date: string | null;
    verification_status: 'pending' | 'verified' | 'rejected' | 'expired';
    certificate_url: string | null;
  }>;
  
  // Portfolio Projects (from engineer_portfolio table)
  portfolio: Array<{
    id: string;
    project_name: string;
    project_description: string | null;
    project_url: string | null;
    project_image_url: string | null;
    technologies_used: string[] | null;
    project_category: string | null;
    start_date: string | null;
    end_date: string | null;
    is_featured: boolean;
  }>;
  
  // Ratings & Reviews (from client_reviews table)
  reviews: Array<{
    id: string;
    overall_rating: number;
    communication_rating: number | null;
    quality_rating: number | null;
    timeliness_rating: number | null;
    review_text: string | null;
    created_at: string;
    reviewer_name?: string;
    reviewer_company?: string;
    project_name?: string;
  }>;
  
  // Calculated Metrics
  averageRating: number;
  totalReviews: number;
  totalProjects: number;
  profileCompletionPercentage: number;
}

export function useEngineerProfile(userId?: string) {
  const { user } = useAuthStore();
  const targetUserId = userId || user?.id;
  
  const [profileData, setProfileData] = useState<EngineerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    fetchEngineerProfile();
  }, [targetUserId]);

  const fetchEngineerProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Fetch basic profile info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (profileError) throw profileError;

      // 2. Fetch engineer-specific profile
      const { data: engineerProfile, error: engineerError } = await supabase
        .from('engineer_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      // 3. Fetch skills
      const { data: skills, error: skillsError } = await supabase
        .from('engineer_skills')
        .select('*')
        .eq('engineer_id', targetUserId)
        .order('proficiency_level', { ascending: false });

      // 4. Fetch certifications
      const { data: certifications, error: certsError } = await supabase
        .from('engineer_certifications')
        .select('*')
        .eq('engineer_id', targetUserId)
        .order('issue_date', { ascending: false });

      // 5. Fetch portfolio projects
      const { data: portfolio, error: portfolioError } = await supabase
        .from('engineer_portfolio')
        .select('*')
        .eq('engineer_id', targetUserId)
        .order('is_featured', { ascending: false })
        .order('end_date', { ascending: false });

      // 6. Fetch reviews (joining with client profiles for reviewer info)
      const { data: reviews, error: reviewsError } = await supabase
        .from('client_reviews')
        .select(`
          *,
          client:profiles!client_reviews_client_id_fkey(first_name, last_name),
          project:client_projects(project_name)
        `)
        .eq('engineer_id', targetUserId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Calculate metrics
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
        : 0;

      const totalProjects = portfolio?.length || 0;

      // Calculate profile completion percentage
      const completionFields = [
        profile?.first_name,
        profile?.last_name,
        profile?.email,
        profile?.phone,
        profile?.avatar_url,
        profile?.bio,
        profile?.location_city,
        engineerProfile?.specializations?.length > 0,
        engineerProfile?.hourly_rate,
        engineerProfile?.sce_license_number,
        skills && skills.length >= 3,
        certifications && certifications.length >= 1,
        portfolio && portfolio.length >= 1,
        reviews && reviews.length >= 1
      ];
      
      const filledFields = completionFields.filter(Boolean).length;
      const completionPercentage = Math.round((filledFields / completionFields.length) * 100);

      // Construct the complete profile data
      const completeProfile: EngineerProfileData = {
        // Basic info
        id: profile.id,
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location_city: profile.location_city,
        location_region: profile.location_region,
        account_number: profile.account_number,
        created_at: profile.created_at,
        
        // Engineer-specific
        specializations: engineerProfile?.specializations || [],
        years_experience: engineerProfile?.years_experience || null,
        hourly_rate: engineerProfile?.hourly_rate || null,
        daily_rate: engineerProfile?.daily_rate || null,
        availability_status: engineerProfile?.availability_status || 'available',
        sce_license_number: engineerProfile?.sce_license_number || null,
        
        // Related data
        skills: skills || [],
        certifications: certifications || [],
        portfolio: portfolio || [],
        reviews: reviews?.map(r => ({
          ...r,
          reviewer_name: r.client ? `${r.client.first_name || ''} ${r.client.last_name || ''}`.trim() : 'Anonymous',
          reviewer_company: r.client?.company || 'N/A',
          project_name: r.project?.project_name || 'Project'
        })) || [],
        
        // Calculated
        averageRating: avgRating,
        totalReviews: reviews?.length || 0,
        totalProjects,
        profileCompletionPercentage: completionPercentage
      };

      setProfileData(completeProfile);
    } catch (err: any) {
      console.error('Error fetching engineer profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBasicInfo = async (updates: Partial<EngineerProfileData>) => {
    if (!targetUserId) return { success: false, error: 'No user ID' };

    try {
      // Update profiles table
      const profileUpdates: any = {};
      if (updates.first_name !== undefined) profileUpdates.first_name = updates.first_name;
      if (updates.last_name !== undefined) profileUpdates.last_name = updates.last_name;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.bio !== undefined) profileUpdates.bio = updates.bio;
      if (updates.location_city !== undefined) profileUpdates.location_city = updates.location_city;
      if (updates.location_region !== undefined) profileUpdates.location_region = updates.location_region;
      if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ ...profileUpdates, updated_at: new Date().toISOString() })
          .eq('user_id', targetUserId);

        if (profileError) throw profileError;
      }

      // Update engineer_profiles table
      const engineerUpdates: any = {};
      if (updates.specializations !== undefined) engineerUpdates.specializations = updates.specializations;
      if (updates.years_experience !== undefined) engineerUpdates.years_experience = updates.years_experience;
      if (updates.hourly_rate !== undefined) engineerUpdates.hourly_rate = updates.hourly_rate;
      if (updates.daily_rate !== undefined) engineerUpdates.daily_rate = updates.daily_rate;
      if (updates.availability_status !== undefined) engineerUpdates.availability_status = updates.availability_status;
      if (updates.sce_license_number !== undefined) engineerUpdates.sce_license_number = updates.sce_license_number;

      if (Object.keys(engineerUpdates).length > 0) {
        // Check if engineer profile exists
        const { data: existing } = await supabase
          .from('engineer_profiles')
          .select('id')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabase
            .from('engineer_profiles')
            .update({ ...engineerUpdates, updated_at: new Date().toISOString() })
            .eq('user_id', targetUserId);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('engineer_profiles')
            .insert({ user_id: targetUserId, ...engineerUpdates });

          if (insertError) throw insertError;
        }
      }

      // Refresh profile data
      await fetchEngineerProfile();

      return { success: true };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      return { success: false, error: err.message };
    }
  };

  const addSkill = async (skillData: {
    skill_name: string;
    skill_category?: string;
    proficiency_level?: number;
    years_experience?: number;
  }) => {
    if (!targetUserId) return { success: false, error: 'No user ID' };

    try {
      const { error } = await supabase
        .from('engineer_skills')
        .insert({
          engineer_id: targetUserId,
          ...skillData
        });

      if (error) throw error;

      await fetchEngineerProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addCertification = async (certData: {
    certification_name: string;
    issuing_organization: string;
    certificate_number?: string;
    issue_date?: string;
    expiry_date?: string;
    certificate_url?: string;
  }) => {
    if (!targetUserId) return { success: false, error: 'No user ID' };

    try {
      const { error } = await supabase
        .from('engineer_certifications')
        .insert({
          engineer_id: targetUserId,
          ...certData
        });

      if (error) throw error;

      await fetchEngineerProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addPortfolioProject = async (projectData: {
    project_name: string;
    project_description?: string;
    project_url?: string;
    project_image_url?: string;
    technologies_used?: string[];
    project_category?: string;
    start_date?: string;
    end_date?: string;
    is_featured?: boolean;
  }) => {
    if (!targetUserId) return { success: false, error: 'No user ID' };

    try {
      const { error } = await supabase
        .from('engineer_portfolio')
        .insert({
          engineer_id: targetUserId,
          ...projectData
        });

      if (error) throw error;

      await fetchEngineerProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    profileData,
    isLoading,
    error,
    updateBasicInfo,
    addSkill,
    addCertification,
    addPortfolioProject,
    refresh: fetchEngineerProfile
  };
}

