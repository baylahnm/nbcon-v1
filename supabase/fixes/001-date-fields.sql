-- Fix date field constraints to allow null values
-- Run this in the Supabase SQL Editor

-- Update the date_of_birth column to allow null values
ALTER TABLE public.profiles 
ALTER COLUMN date_of_birth DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth - can be null if not provided';

-- Update any existing empty string values to null
UPDATE public.profiles 
SET date_of_birth = NULL 
WHERE date_of_birth = '' OR date_of_birth IS NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'date_of_birth';
