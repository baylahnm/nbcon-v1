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

    // Step 2: Create profile in database with retry logic
    let profileError: any = null;
    const maxProfileRetries = 3;
    
    for (let attempt = 1; attempt <= maxProfileRetries; attempt++) {
      console.log(`[SIGNUP] Profile insert attempt ${attempt}/${maxProfileRetries}`);
      
      const { error } = await supabase
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

      if (!error) {
        console.log('[SIGNUP] Profile created successfully');
        profileError = null;
        break; // Success!
      }
      
      profileError = error;
      console.error(`[SIGNUP] Profile insert error (attempt ${attempt}):`, error);
      
      // Retry on 406 errors (RLS policy issues)
      if (error.code === 'PGRST116' && attempt < maxProfileRetries) {
        console.warn('[SIGNUP] 406 error - retrying after delay...');
        await sleep(1000 * attempt); // Exponential backoff
        continue;
      }
      
      // Different error or last attempt - stop retrying
      break;
    }

    if (profileError) {
      console.error('[SIGNUP] Failed to create profile after retries:', profileError);
      // Continue anyway - user auth account is created, they can retry profile setup
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
 * Helper function to wait for a specified duration
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create or update profile only (for users who already have auth account)
 * Used in role-specific signup forms after initial auth signup
 * 
 * Enhanced with:
 * - Retry logic for transient failures (406 errors)
 * - Better error handling with specific error codes
 * - Exponential backoff for retries
 */
export async function createProfileOnly(
  data: SignupData, 
  userId: string,
  options: { maxRetries?: number; retryDelay?: number } = {}
): Promise<SignupResult> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: any = null;

  // Retry loop for handling transient failures
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[PROFILE_CREATE] Attempt ${attempt}/${maxRetries} for user ${userId}`);

      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors when not found

      // Handle 406 errors on SELECT (RLS policy issue)
      if (checkError) {
        console.warn(`[PROFILE_CREATE] Check error on attempt ${attempt}:`, checkError);
        
        // If it's a 406 error and not the last attempt, retry
        if (checkError.code === 'PGRST116' && attempt < maxRetries) {
          lastError = checkError;
          await sleep(retryDelay * attempt); // Exponential backoff
          continue;
        }
        
        // If last attempt or different error, try to insert anyway
        if (checkError.code !== 'PGRST116') {
          console.warn('[PROFILE_CREATE] Non-406 error, proceeding with insert:', checkError);
        }
      }

      if (existingProfile) {
        console.log('[PROFILE_CREATE] Profile exists, updating');
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
          console.error(`[PROFILE_CREATE] Update error on attempt ${attempt}:`, updateError);
          
          // Retry on 406 errors
          if (updateError.code === 'PGRST116' && attempt < maxRetries) {
            lastError = updateError;
            await sleep(retryDelay * attempt);
            continue;
          }
          
          return {
            success: false,
            error: `Failed to update profile: ${updateError.message || 'Unknown error'}`
          };
        }

        console.log('[PROFILE_CREATE] Profile updated successfully');
      } else {
        console.log('[PROFILE_CREATE] Profile does not exist, inserting');
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
          console.error(`[PROFILE_CREATE] Insert error on attempt ${attempt}:`, insertError);
          
          // Special handling for 406 errors (likely missing RLS INSERT policy)
          if (insertError.code === 'PGRST116' && attempt < maxRetries) {
            console.warn(`[PROFILE_CREATE] 406 error detected - RLS INSERT policy missing. Retrying...`);
            lastError = insertError;
            await sleep(retryDelay * attempt); // Exponential backoff
            continue;
          }
          
          // If last attempt or different error, return detailed error
          const errorMessage = insertError.code === 'PGRST116' 
            ? 'Unable to create profile. Database permission issue detected. Please contact support or try again later.'
            : insertError.message || 'Failed to create profile.';
          
          return {
            success: false,
            error: errorMessage
          };
        }

        console.log('[PROFILE_CREATE] Profile created successfully');
      }

      // Success! Create AuthenticatedUser object
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

      console.log('[PROFILE_CREATE] Success! User object created:', authenticatedUser);

      return {
        success: true,
        user: authenticatedUser
      };
      
    } catch (error: any) {
      console.error(`[PROFILE_CREATE] Unexpected error on attempt ${attempt}:`, error);
      lastError = error;
      
      // Retry on network or transient errors
      if (attempt < maxRetries) {
        await sleep(retryDelay * attempt);
        continue;
      }
    }
  }

  // All retries exhausted
  console.error('[PROFILE_CREATE] All retry attempts exhausted', lastError);
  return {
    success: false,
    error: lastError?.message || 'Failed to create profile after multiple attempts. Please contact support.'
  };
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
    'permission issue': {
      en: 'Account created but profile setup incomplete. Please contact support with error code: RLS-406',
      ar: 'تم إنشاء الحساب ولكن لم يكتمل إعداد الملف الشخصي. يرجى الاتصال بالدعم مع رمز الخطأ: RLS-406'
    },
    'database permission': {
      en: 'System configuration issue detected. Please try again in a few moments or contact support.',
      ar: 'تم اكتشاف مشكلة في تكوين النظام. يرجى المحاولة مرة أخرى بعد قليل أو الاتصال بالدعم.'
    },
    'multiple attempts': {
      en: 'Unable to complete signup after multiple retries. Please check your connection and try again.',
      ar: 'تعذر إكمال التسجيل بعد محاولات متعددة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
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

/**
 * Check if error is a 406/RLS permission error
 */
export function is406Error(error: any): boolean {
  return error?.code === 'PGRST116' || 
         error?.message?.includes('406') ||
         error?.message?.toLowerCase().includes('permission');
}

/**
 * Get detailed error information for debugging
 */
export function getErrorDetails(error: any): {
  code: string;
  message: string;
  isRetryable: boolean;
  userMessage: string;
} {
  const code = error?.code || 'UNKNOWN';
  const message = error?.message || 'Unknown error';
  
  // 406 errors are retryable but indicate config issue
  const isRetryable = code === 'PGRST116' || 
                      message.toLowerCase().includes('network') ||
                      message.toLowerCase().includes('timeout');
  
  const userMessage = is406Error(error)
    ? 'Database configuration issue. Our team has been notified.'
    : message;
  
  return { code, message, isRetryable, userMessage };
}

