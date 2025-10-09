import { supabase } from '@/shared/supabase/client';
import type { AuthenticatedUser } from '../stores/auth';

export interface SignupData {
  // Auth credentials
  email: string;
  password: string;
  
  // Base profile data
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  firstName: string;
  lastName: string;
  phone: string;
  locationCity: string;
  locationRegion?: string;
  preferredLanguage: 'ar' | 'en';
  
  // Optional fields
  company?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface SignupResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

/**
 * Shared signup helper function that creates a Supabase auth account and profile
 */
export async function performSignup(data: SignupData): Promise<SignupResult> {
  try {
    // Step 1: Create Supabase auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          role: data.role,
        }
      }
    });

    if (authError) {
      // Handle common errors
      if (authError.message.includes('already registered')) {
        return {
          success: false,
          error: 'This email is already registered. Please sign in instead.'
        };
      }
      return {
        success: false,
        error: authError.message || 'Signup failed. Please try again.'
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create account. Please try again.'
      };
    }

    // Step 2: Create profile in database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        location_city: data.locationCity,
        location_region: data.locationRegion || null,
        preferred_language: data.preferredLanguage,
        theme_preference: 'light',
        rtl_enabled: data.preferredLanguage === 'ar',
        avatar_url: data.avatarUrl || null,
        bio: data.bio || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Continue anyway - profile might have been created by trigger
    }

    // Step 3: Create AuthenticatedUser object
    const authenticatedUser: AuthenticatedUser = {
      id: authData.user.id,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: data.role,
      isVerified: !!authData.user.email_confirmed_at,
      location: `${data.locationCity}${data.locationRegion ? ', ' + data.locationRegion : ''}`,
      phone: data.phone,
      language: data.preferredLanguage,
      avatar: data.avatarUrl,
      company: data.company,
      source: 'supabase'
    };

    return {
      success: true,
      user: authenticatedUser
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.'
    };
  }
}

/**
 * Create or update profile only (for users who already have auth account)
 * Used in role-specific signup forms after initial auth signup
 */
export async function createProfileOnly(data: SignupData, userId: string): Promise<SignupResult> {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: data.role,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          location_city: data.locationCity,
          location_region: data.locationRegion || null,
          preferred_language: data.preferredLanguage,
          rtl_enabled: data.preferredLanguage === 'ar',
          avatar_url: data.avatarUrl || null,
          bio: data.bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message || 'Failed to update profile.'
        };
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          role: data.role,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          location_city: data.locationCity,
          location_region: data.locationRegion || null,
          preferred_language: data.preferredLanguage,
          theme_preference: 'light',
          rtl_enabled: data.preferredLanguage === 'ar',
          avatar_url: data.avatarUrl || null,
          bio: data.bio || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        return {
          success: false,
          error: insertError.message || 'Failed to create profile.'
        };
      }
    }

    // Create AuthenticatedUser object
    const authenticatedUser: AuthenticatedUser = {
      id: userId,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: data.role,
      isVerified: true, // Assume verified since they completed initial signup
      location: `${data.locationCity}${data.locationRegion ? ', ' + data.locationRegion : ''}`,
      phone: data.phone,
      language: data.preferredLanguage,
      avatar: data.avatarUrl,
      company: data.company,
      source: 'supabase'
    };

    return {
      success: true,
      user: authenticatedUser
    };
  } catch (error: any) {
    console.error('Profile creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create profile. Please try again.'
    };
  }
}

/**
 * Helper to handle signup errors and return user-friendly messages
 */
export function getSignupErrorMessage(error: string, language: 'ar' | 'en' = 'en'): string {
  const errors: Record<string, { en: string; ar: string }> = {
    'already registered': {
      en: 'This email is already registered. Please sign in instead.',
      ar: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.'
    },
    'invalid email': {
      en: 'Please enter a valid email address.',
      ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
    },
    'weak password': {
      en: 'Password must be at least 8 characters long.',
      ar: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.'
    },
    default: {
      en: 'Signup failed. Please try again.',
      ar: 'فشل التسجيل. يرجى المحاولة مرة أخرى.'
    }
  };

  // Find matching error
  for (const [key, value] of Object.entries(errors)) {
    if (error.toLowerCase().includes(key)) {
      return value[language];
    }
  }

  return errors.default[language];
}

