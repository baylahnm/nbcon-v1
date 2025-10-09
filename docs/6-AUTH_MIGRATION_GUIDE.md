# 🔄 Authentication Migration Guide

**For:** Developers updating auth code  
**Version:** 2.0 (October 2025)  
**Breaking Changes:** Yes

---

## 🚨 **Breaking Changes**

### 1. Auth Store Consolidation

```typescript
// ❌ OLD - Don't use
import { useAuthStore } from "@/pages/1-HomePage/others/stores/auth";

// ✅ NEW - Use everywhere
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
```

### 2. Signup Functions

```typescript
// ❌ OLD - Creates duplicate auth accounts
const result = await performSignup({
  email: email,
  password: password,
  role: 'client',
  // ...
});

// ✅ NEW - Profile only (user already authenticated)
const result = await createProfileOnly({
  email: user.email,
  role: 'client',
  firstName: firstName,
  lastName: lastName,
  // ...
}, user.id);
```

---

## 📋 **Migration Steps**

### For Role-Specific Signup Forms:

**Step 1:** Update imports
```typescript
✅ import { createProfileOnly } from "@/pages/2-auth/others/utils/signup-helper";
✅ import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
❌ Remove: performSignup, Lock, Eye, EyeOff icons
```

**Step 2:** Add pre-fill
```typescript
const { user, isAuthenticated, login } = useAuthStore();

const [contactName, setContactName] = useState(user?.name || "");
const [contactEmail, setContactEmail] = useState(user?.email || "");
const [phone, setPhone] = useState(user?.phone?.replace(/^\+966/, "") || "");
```

**Step 3:** Remove password state
```typescript
❌ const [password, setPassword] = useState("");
❌ const [confirmPassword, setConfirmPassword] = useState("");
❌ const [showPassword, setShowPassword] = useState(false);
```

**Step 4:** Update validation
```typescript
const validateStep1 = () => {
  ❌ return password && confirmPassword && password === confirmPassword && ...
  ✅ return companyName && otherRequiredFields;
};
```

**Step 5:** Update submit handler
```typescript
const handleSubmit = async () => {
  // Check authentication
  if (!isAuthenticated || !user?.id) {
    toast({ title: 'Authentication Required' });
    navigate('/auth');
    return;
  }

  // Create profile only
  const result = await createProfileOnly({
    email: user.email,
    role: 'your_role',
    firstName, lastName, phone,
    locationCity, locationRegion,
    preferredLanguage,
  }, user.id);

  if (result.success) {
    login(result.user);
    navigate(`/${role}/dashboard`);
  }
};
```

---

## 🔐 **Admin Security**

Maintain enhanced security for admin accounts:

```typescript
// Required validations
const validateStep1 = () => {
  return invitationToken && !tokenError && 
         fullName && workEmail && 
         employeeId && department && accessReason;
};

const validateStep2 = () => {
  return (idVerification.length > 0 || selfieVerification.length > 0) && 
         acceptSecurityAgreement;
};
```

---

## ✅ **Verification**

After migrating:
1. No linter errors
2. Auth flow works end-to-end
3. Profile created in Supabase
4. No 406/403 errors in console

---

## 📚 **Reference**

- **Best Example:** `src/pages/2-auth/signup/ClientSignup.tsx`
- **Helper Functions:** `src/pages/2-auth/others/utils/signup-helper.ts`
- **Auth Store:** `src/pages/2-auth/others/stores/auth.ts`

---

**Need Help?** Check `docs/5-AUTH_SYSTEM_GUIDE.md` for complete reference.
