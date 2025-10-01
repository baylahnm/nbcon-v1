-- Extend profiles table to support comprehensive profile data
-- This migration adds fields needed for the functional profile editing system

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'Saudi Arabian',
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT[],
ADD COLUMN IF NOT EXISTS sce_number TEXT,
ADD COLUMN IF NOT EXISTS sce_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS licenses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[{"language": "Arabic", "proficiency": "native"}, {"language": "English", "proficiency": "fluent"}]'::jsonb,
ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS job_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_province ON public.profiles(province);
CREATE INDEX IF NOT EXISTS idx_profiles_specialization ON public.profiles USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_profiles_sce_status ON public.profiles(sce_status);

-- Update existing profiles with default values
UPDATE public.profiles 
SET 
  nationality = COALESCE(nationality, 'Saudi Arabian'),
  city = COALESCE(city, 'Riyadh'),
  province = COALESCE(province, 'Riyadh Province'),
  languages = COALESCE(languages, '[{"language": "Arabic", "proficiency": "native"}, {"language": "English", "proficiency": "fluent"}]'::jsonb),
  licenses = COALESCE(licenses, '[]'::jsonb),
  certifications = COALESCE(certifications, '[]'::jsonb),
  projects = COALESCE(projects, '[]'::jsonb),
  skills = COALESCE(skills, '[]'::jsonb),
  achievements = COALESCE(achievements, '[]'::jsonb),
  reviews = COALESCE(reviews, '[]'::jsonb),
  profile_visibility = COALESCE(profile_visibility, 'professional'),
  show_phone = COALESCE(show_phone, true),
  show_email = COALESCE(show_email, false),
  job_notifications = COALESCE(job_notifications, true),
  marketing_emails = COALESCE(marketing_emails, false)
WHERE 
  nationality IS NULL OR 
  city IS NULL OR 
  province IS NULL OR 
  languages IS NULL OR 
  licenses IS NULL OR 
  certifications IS NULL OR 
  projects IS NULL OR 
  skills IS NULL OR 
  achievements IS NULL OR 
  reviews IS NULL OR 
  profile_visibility IS NULL OR 
  show_phone IS NULL OR 
  show_email IS NULL OR 
  job_notifications IS NULL OR 
  marketing_emails IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth';
COMMENT ON COLUMN public.profiles.nationality IS 'User nationality';
COMMENT ON COLUMN public.profiles.city IS 'User city';
COMMENT ON COLUMN public.profiles.province IS 'User province/region';
COMMENT ON COLUMN public.profiles.title IS 'Professional title';
COMMENT ON COLUMN public.profiles.company IS 'Company or organization';
COMMENT ON COLUMN public.profiles.experience IS 'Years of experience';
COMMENT ON COLUMN public.profiles.specialization IS 'Array of professional specializations';
COMMENT ON COLUMN public.profiles.sce_number IS 'Saudi Council of Engineers license number';
COMMENT ON COLUMN public.profiles.sce_status IS 'SCE verification status';
COMMENT ON COLUMN public.profiles.licenses IS 'JSON array of professional licenses';
COMMENT ON COLUMN public.profiles.certifications IS 'JSON array of certifications';
COMMENT ON COLUMN public.profiles.languages IS 'JSON array of languages with proficiency levels';
COMMENT ON COLUMN public.profiles.projects IS 'JSON array of portfolio projects';
COMMENT ON COLUMN public.profiles.skills IS 'JSON array of skills with levels';
COMMENT ON COLUMN public.profiles.achievements IS 'JSON array of achievements and awards';
COMMENT ON COLUMN public.profiles.reviews IS 'JSON array of client reviews';
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Profile visibility setting';
COMMENT ON COLUMN public.profiles.show_phone IS 'Whether to show phone number publicly';
COMMENT ON COLUMN public.profiles.show_email IS 'Whether to show email publicly';
COMMENT ON COLUMN public.profiles.job_notifications IS 'Whether to receive job notifications';
COMMENT ON COLUMN public.profiles.marketing_emails IS 'Whether to receive marketing emails';
COMMENT ON COLUMN public.profiles.profile_image IS 'URL to profile image in storage';
