# 🔐 Authentication Guide - Complete System Reference

**Last Updated:** October 9, 2025  
**Status:** Production Ready

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Authentication Flows](#authentication-flows)
3. [Security Features](#security-features)
4. [Developer Guide](#developer-guide)
5. [Testing Guide](#testing-guide)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What's Implemented

**Enterprise-grade authentication system with:**
- ✅ Email/password signup with OTP verification
- ✅ OAuth (Google, Facebook)
- ✅ Role-based access control (4 roles)
- ✅ Smart routing based on user state
- ✅ Pre-filled forms for better UX
- ✅ Bilingual support (EN/AR with RTL)
- ✅ Session management with auto-refresh

### Four User Roles

1. **Engineer** - Service providers (freelance professionals)
2. **Client** - Service requesters (individuals & SMBs)
3. **Enterprise** - Large organizations with teams
4. **Admin** - Platform administrators (invite-only)

---

## 🔄 Authentication Flows

### Flow 1: New User Signup

```
Step 1: /auth (Email/Password + OTP)
│   └─ Create Supabase auth account
│   └─ Set password once
│   └─ Send email verification
│
Step 2: /auth/verify
│   └─ Enter 6-digit OTP
│   └─ Verify email
│
Step 3: /auth/account-type (Smart Button)
│   └─ Select role (Engineer/Client/Enterprise/Admin)
│   └─ View pricing
│   └─ Smart routing based on state
│
Step 4: /signup/{role} (Profile Only)
│   └─ Pre-filled: email, name, phone
│   └─ No password fields (already set)
│   └─ Role-specific business data
│   └─ Call createProfileOnly()
│
Step 5: /{role}/dashboard
│   └─ Profile created ✅
│   └─ Account number assigned ✅
│   └─ Dashboard loads ✅
```

### Flow 2: Existing User Login

```
/auth → Sign In tab
→ Enter email/password
→ Supabase authentication
→ Fetch profile from database
→ Update auth store with role
→ Redirect to /{role}/dashboard
```

### Flow 3: OAuth (Google/Facebook)

```
/auth → OAuth button
→ Provider authentication
→ /auth/callback
→ Check if profile exists:
  - Has profile → Dashboard
  - No profile → /auth/account-type → /signup/{role}
```

---

## 🛡️ Security Features

### Password Requirements

- Minimum 8 characters
- Show/hide toggle
- Confirmation field
- Set once during initial signup (not in role-specific forms)

### Email Verification

- 6-digit OTP sent to email
- 60-second resend cooldown
- Email masking for privacy (e.g., `m***@example.com`)
- Auto-submit on code completion

### Admin Security (Enhanced)

Required validations for admin signup:
1. ✅ Invitation token (10+ characters)
2. ✅ Work email verification
3. ✅ Employee ID required
4. ✅ Department selection
5. ✅ Access reason (text explanation)
6. ✅ ID verification file upload
7. ✅ Selfie verification file upload
8. ✅ Security agreement acceptance

### Row Level Security (RLS)

**Profiles Table:**
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile  
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles using function"
ON public.profiles FOR SELECT
USING (
  public.get_user_role() = 'admin'
  OR
  auth.uid() = user_id
);
```

---

## 💻 Developer Guide

### Making Changes to Auth Code

#### 1. Auth Store Location

```typescript
// ✅ USE THIS - Central auth store
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";

// ❌ DON'T USE - Legacy store (being phased out)
import { useAuthStore } from "@/pages/1-HomePage/others/stores/auth";
```

#### 2. Signup Functions

**For Initial Signup (Email/Password):**
```typescript
import { performSignup } from "@/pages/2-auth/others/utils/signup-helper";

const result = await performSignup({
  email: email,
  password: password,
  role: 'engineer', // Will be overridden by role-specific form
  firstName: name,
  lastName: '',
  phone: phone
});
```

**For Role-Specific Forms (Profile Only):**
```typescript
import { createProfileOnly } from "@/pages/2-auth/others/utils/signup-helper";

const result = await createProfileOnly({
  email: user.email,
  role: 'engineer', // Correct role
  firstName: firstName,
  lastName: lastName,
  phone: phone,
  locationCity: city,
  locationRegion: region,
  preferredLanguage: 'en'
}, user.id);

if (result.success) {
  login(result.user);
  navigate('/engineer/dashboard');
}
```

#### 3. Pre-fill Forms

```typescript
const { user, isAuthenticated } = useAuthStore();

// Pre-fill from auth store
const [contactName, setContactName] = useState(user?.name || "");
const [contactEmail, setContactEmail] = useState(user?.email || "");
const [phone, setPhone] = useState(user?.phone?.replace(/^\+966/, "") || "");
```

#### 4. Form Validation

**Don't validate password in role-specific forms:**
```typescript
// ❌ WRONG
const validateStep1 = () => {
  return password && confirmPassword && password === confirmPassword && ...
};

// ✅ CORRECT
const validateStep1 = () => {
  return companyName && contactEmail && otherRequiredFields;
};
```

#### 5. Error Handling with Retry Logic

```typescript
import { createProfileOnly, is406Error, getErrorDetails } from "@/pages/2-auth/others/utils/signup-helper";
import { errorMonitor } from "@/pages/2-auth/others/utils/error-monitor";

try {
  const result = await createProfileOnly(data, userId, {
    maxRetries: 3,      // Auto-retry 3 times
    retryDelay: 1000    // 1s, 2s, 3s exponential backoff
  });

  if (!result.success) {
    // Log error
    errorMonitor.logError(result.error, 'EngineerSignup', userId, email);
    
    // Show user-friendly message
    const message = is406Error(result.error)
      ? t('errors.databaseIssue') // "Database configuration issue..."
      : result.error;
    
    toast({ description: message, variant: 'destructive' });
  } else {
    login(result.user);
    navigate('/engineer/dashboard');
  }
} catch (error) {
  errorMonitor.logError(error, 'Unexpected', userId, email);
  toast({ description: getErrorDetails(error).userMessage });
}
```

---

## 🧪 Testing Guide

### Test Account Credentials

**For Manual Testing:**
```
Email:    test@example.com
Password: Test123!
Role:     Any (select during signup)
```

**Existing Test Accounts:**
- Client: `mahdi.n.baylah@outlook.com` / `Qazwsx1234@`
- Engineer: `info@nbcon.org` / `Qazwsx1234@`

### Test Case 1: Engineer Signup

**Steps:**
1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Fill form:
   - Name: Ahmed Al-Sayed
   - Email: engineer.test@example.com
   - Password: Engineer123!
   - Phone: +966555123456
   - Location: Jeddah, Makkah
   - ✅ Accept Terms
4. Click "Create Account"
5. Enter OTP from email
6. Select "Engineer" plan
7. Complete 4-step Engineer registration:
   - **Step 1:** Professional details
   - **Step 2:** License verification
   - **Step 3:** Tax & contact info
   - **Step 4:** Payment & terms
8. Click "Complete Signup"

**Expected Results:**
- ✅ Redirected to `/engineer/dashboard` (NOT /client!)
- ✅ Sidebar shows "Engineer Portal"
- ✅ No 406 errors in console
- ✅ Profile in Supabase with account number `ENG000001`
- ✅ Success toast appears

### Test Case 2: Sign In Flow

**Steps:**
1. Navigate to `/auth`
2. Enter credentials
3. Click "Sign In"

**Expected Results:**
- ✅ Authentication succeeds (<2s)
- ✅ Role fetched from profile (~500ms)
- ✅ Redirect to correct dashboard
- ✅ Dashboard loads (~2s)
- ✅ User info displayed correctly

### Test Case 3: Sign Out Flow

**Steps:**
1. Click user badge/avatar
2. Select "Sign Out"

**Expected Results:**
- ✅ Session cleared (~800ms)
- ✅ Redirect to `/auth`
- ✅ Form cleared
- ✅ Can sign in again

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### "User already exists" Error

**Cause:** Using `performSignup()` in role-specific forms  
**Fix:** Use `createProfileOnly()` instead

**Before:**
```typescript
const result = await performSignup({ email, password, role: 'client' });
```

**After:**
```typescript
const result = await createProfileOnly({ email, role: 'client' }, userId);
```

---

#### 406 RLS Policy Violation

**Cause:** Missing INSERT policy on profiles table  
**Fix:** Apply database fix (see [4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md))

**Symptoms:**
- Console shows `PGRST116` error
- Profile not created in database
- Wrong role assigned (defaults to 'client')

**Temporary Workaround:**
The retry logic (3 attempts) helps mitigate this, but the SQL fix is required for permanent resolution.

---

#### "Authentication Required" Error

**Cause:** User not logged in when accessing role-specific signup  
**Fix:** Ensure user completes `/auth` flow first

**Check:**
```typescript
const { user, isAuthenticated } = useAuthStore();

if (!isAuthenticated || !user?.id) {
  toast({ title: 'Please sign in first' });
  navigate('/auth');
  return;
}
```

---

#### Form Not Pre-filling

**Cause:** Missing auth store access  
**Fix:** Access user data from auth store

```typescript
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";

const { user } = useAuthStore();

// Pre-fill
const [email, setEmail] = useState(user?.email || "");
const [name, setName] = useState(user?.name || "");
```

---

#### Redirect Loop After Sign Out

**Cause:** Profile query timeout (3s)  
**Fix:** Apply database fix to optimize queries  
**Impact:** Minor UX issue, doesn't block functionality

---

### Debugging Tips

**1. Check Console Logs:**
```javascript
// The auth system logs detailed information:
[AUTH LISTENER] Event: SIGNED_IN
[AUTH LISTENER] Role fetched from profile: engineer
[RETRY] Attempt 1 of 3 failed, retrying in 1000ms
```

**2. View Error Statistics:**
```javascript
// In browser console:
errorMonitor.getStats()
// Returns: { total, errors406, lastError, commonErrors }

errorMonitor.exportErrors()
// Returns JSON for support tickets
```

**3. Check Supabase:**
- Auth → Users (verify account exists)
- Database → profiles (verify profile created)
- Auth → Policies (verify RLS policies active)

---

## 📚 Code References

### Best Example Components

**Client Signup (Best Example):**
```
src/pages/2-auth/signup/ClientSignup.tsx
```

**Engineer Signup (With Error Handling):**
```
src/pages/2-auth/signup/EngineerSignup.tsx
```

**Admin Signup (Security Validation):**
```
src/pages/2-auth/signup/AdminSignup.tsx
```

### Helper Functions

**Signup Utilities:**
```
src/pages/2-auth/others/utils/signup-helper.ts
- performSignup()
- createProfileOnly()
- is406Error()
- getErrorDetails()
- retryOperation()
```

**Error Monitoring:**
```
src/pages/2-auth/others/utils/error-monitor.ts
- errorMonitor.logError()
- errorMonitor.is406Error()
- errorMonitor.getStats()
- errorMonitor.exportErrors()
```

**Auth Store:**
```
src/pages/2-auth/others/stores/auth.ts
- useAuthStore() hook
- login(), logout(), updateUser()
```

---

## ✅ Production Checklist

### Core Functionality
- [x] Email/password signup working
- [x] OTP verification functional
- [x] OAuth login working
- [x] Smart account type selection
- [x] All 4 role signup forms updated
- [x] Profile creation in database
- [x] Account number auto-generation
- [x] Dashboard redirection
- [x] RLS policies secure
- [x] Pre-fill functionality
- [x] Bilingual support (EN/AR)
- [x] Error handling with retry

### Code Quality
- [x] No linter errors
- [x] TypeScript type safety
- [x] Shared helper functions
- [x] Proper error handling
- [x] Centralized error monitoring

### Security
- [x] Password requirements enforced
- [x] Email verification required
- [x] Admin invitation token validation
- [x] RLS policies prevent unauthorized access
- [x] OAuth security handled by providers
- [x] Session auto-refresh enabled

---

## 🎯 Key Features

### Smart Button Logic

The account type selection page has intelligent button text:

| User State | Button Text | Action |
|------------|-------------|--------|
| Not authenticated | "Get Started" | → `/auth` |
| Authenticated, no profile | "Complete Profile" | → `/signup/{role}` |
| Authenticated with profile | "Go to Dashboard" | → `/{role}/dashboard` |
| Checking... | "Loading..." | Disabled |

### Retry Logic

Automatically retries failed operations:
- 3 attempts maximum
- Exponential backoff (1s → 2s → 3s)
- Targets 406 RLS errors specifically
- User-friendly error messages

### Error Monitoring

Centralized tracking of all errors:
- Console logging with context
- Statistics for debugging
- Export for support tickets
- Sentry integration ready

---

## 🔮 Future Enhancements

- [ ] Password strength indicator
- [ ] Email change functionality
- [ ] Password change in settings
- [ ] Multi-factor authentication (2FA)
- [ ] Social profile photo import
- [ ] Enterprise SSO integration
- [ ] Remember device option
- [ ] Login history tracking

---

**For database issues:** See [4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)  
**For recent changes:** See [5-IMPLEMENTATION_GUIDE.md](5-IMPLEMENTATION_GUIDE.md)  
**For architecture:** See [2-PROJECT_GUIDE.md](2-PROJECT_GUIDE.md)

