import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/auth';
import { profileClient, ProfileData } from '../../../3-admin/others/api/profileClient';
import { toast } from 'sonner';

export function useProfile() {
  const { profile, setProfile } = useAuthStore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    if (profile?.id) {
      loadProfile();
    }
  }, [profile?.id]);

  const loadProfile = useCallback(async () => {
    if (!profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await profileClient.getProfile(profile.id);
      if (data) {
        setProfileData(data);
        
        // Update auth store with loaded profile data
        const authProfileUpdates = {
          first_name: data.personalInfo.firstName,
          last_name: data.personalInfo.lastName,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          avatar_url: data.personalInfo.profileImage,
        };
        
        // Update the auth store profile
        setProfile({
          ...profile,
          ...authProfileUpdates,
        });
      } else {
        // Create default profile if none exists
        const created = await profileClient.createProfile(profile);
        if (created) {
          // Reload the profile after creation
          const newData = await profileClient.getProfile(profile.id);
          setProfileData(newData);
          
          // Update auth store with new profile data
          if (newData) {
            const authProfileUpdates = {
              first_name: newData.personalInfo.firstName,
              last_name: newData.personalInfo.lastName,
              email: newData.personalInfo.email,
              phone: newData.personalInfo.phone,
              avatar_url: newData.personalInfo.profileImage,
            };
            
            setProfile({
              ...profile,
              ...authProfileUpdates,
            });
          }
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [profile, setProfile]);

  const updateProfile = useCallback(async (updates: Partial<ProfileData>) => {
    if (!profile?.id || !profileData) return false;

    setIsSaving(true);
    setError(null);

    try {
      const success = await profileClient.updateProfile(profile.id, updates);
      
      if (success) {
        // Update local state
        const updatedProfileData = profileData ? { ...profileData, ...updates } : null;
        setProfileData(updatedProfileData);
        
        // Update auth store profile if we have personal info updates
        if (updates.personalInfo && updatedProfileData) {
          const authProfileUpdates = {
            first_name: updates.personalInfo.firstName,
            last_name: updates.personalInfo.lastName,
            email: updates.personalInfo.email,
            phone: updates.personalInfo.phone,
            avatar_url: updates.personalInfo.profileImage,
          };
          
          // Update the auth store profile
          if (profile) {
            setProfile({
              ...profile,
              ...authProfileUpdates,
            });
          }
        }
        
        toast.success('Profile updated successfully');
        return true;
      } else {
        setError('Failed to update profile');
        toast.error('Failed to update profile');
        return false;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [profile?.id, profileData]);

  const updatePersonalInfo = useCallback(async (personalInfo: ProfileData['personalInfo']) => {
    return updateProfile({ personalInfo });
  }, [updateProfile]);

  const updateProfessionalInfo = useCallback(async (professionalInfo: ProfileData['professionalInfo']) => {
    return updateProfile({ professionalInfo });
  }, [updateProfile]);

  const updatePortfolio = useCallback(async (portfolio: ProfileData['portfolio']) => {
    return updateProfile({ portfolio });
  }, [updateProfile]);

  const updateSettings = useCallback(async (settings: ProfileData['settings']) => {
    return updateProfile({ settings });
  }, [updateProfile]);

  const uploadProfileImage = useCallback(async (file: File) => {
    if (!profile?.id) return null;

    try {
      const imageUrl = await profileClient.uploadProfileImage(profile.id, file);
      if (imageUrl) {
        // Update profile with new image URL
        await updatePersonalInfo({
          ...profileData?.personalInfo,
          profileImage: imageUrl
        });
        
        // Update auth store immediately with new image
        if (profile) {
          setProfile({
            ...profile,
            avatar_url: imageUrl,
          });
        }
        
        toast.success('Profile image updated successfully');
        return imageUrl;
      } else {
        toast.error('Failed to upload profile image');
        return null;
      }
    } catch (err) {
      console.error('Error uploading profile image:', err);
      toast.error('Failed to upload profile image');
      return null;
    }
  }, [profile?.id, profileData?.personalInfo, updatePersonalInfo, profile, setProfile]);

  const addSkill = useCallback(async (skill: ProfileData['portfolio']['skills'][0]) => {
    if (!profileData?.portfolio) return false;

    const updatedSkills = [...profileData.portfolio.skills, skill];
    return updatePortfolio({ ...profileData.portfolio, skills: updatedSkills });
  }, [profileData?.portfolio, updatePortfolio]);

  const removeSkill = useCallback(async (skillIndex: number) => {
    if (!profileData?.portfolio) return false;

    const updatedSkills = profileData.portfolio.skills.filter((_, index) => index !== skillIndex);
    return updatePortfolio({ ...profileData.portfolio, skills: updatedSkills });
  }, [profileData?.portfolio, updatePortfolio]);

  const addProject = useCallback(async (project: ProfileData['portfolio']['projects'][0]) => {
    if (!profileData?.portfolio) return false;

    const updatedProjects = [...profileData.portfolio.projects, project];
    return updatePortfolio({ ...profileData.portfolio, projects: updatedProjects });
  }, [profileData?.portfolio, updatePortfolio]);

  const removeProject = useCallback(async (projectId: string) => {
    if (!profileData?.portfolio) return false;

    const updatedProjects = profileData.portfolio.projects.filter(p => p.id !== projectId);
    return updatePortfolio({ ...profileData.portfolio, projects: updatedProjects });
  }, [profileData?.portfolio, updatePortfolio]);

  const addSpecialization = useCallback(async (specialization: string) => {
    if (!profileData?.professionalInfo) return false;

    const updatedSpecializations = [...profileData.professionalInfo.specialization, specialization];
    return updateProfessionalInfo({ ...profileData.professionalInfo, specialization: updatedSpecializations });
  }, [profileData?.professionalInfo, updateProfessionalInfo]);

  const removeSpecialization = useCallback(async (specializationIndex: number) => {
    if (!profileData?.professionalInfo) return false;

    const updatedSpecializations = profileData.professionalInfo.specialization.filter((_, index) => index !== specializationIndex);
    return updateProfessionalInfo({ ...profileData.professionalInfo, specialization: updatedSpecializations });
  }, [profileData?.professionalInfo, updateProfessionalInfo]);

  const addLanguage = useCallback(async (language: ProfileData['professionalInfo']['languages'][0]) => {
    if (!profileData?.professionalInfo) return false;

    const updatedLanguages = [...profileData.professionalInfo.languages, language];
    return updateProfessionalInfo({ ...profileData.professionalInfo, languages: updatedLanguages });
  }, [profileData?.professionalInfo, updateProfessionalInfo]);

  const removeLanguage = useCallback(async (languageIndex: number) => {
    if (!profileData?.professionalInfo) return false;

    const updatedLanguages = profileData.professionalInfo.languages.filter((_, index) => index !== languageIndex);
    return updateProfessionalInfo({ ...profileData.professionalInfo, languages: updatedLanguages });
  }, [profileData?.professionalInfo, updateProfessionalInfo]);

  return {
    profileData,
    isLoading,
    isSaving,
    error,
    loadProfile,
    updateProfile,
    updatePersonalInfo,
    updateProfessionalInfo,
    updatePortfolio,
    updateSettings,
    uploadProfileImage,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    addSpecialization,
    removeSpecialization,
    addLanguage,
    removeLanguage
  };
}
