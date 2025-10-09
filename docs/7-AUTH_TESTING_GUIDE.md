# 🧪 Authentication Testing Guide

**Prerequisites:** Dev server running (`npm run dev`)  
**Browser:** Chrome/Firefox/Edge with DevTools open

---

## 🎯 **Quick Test - Client Flow (5 mins)**

### Already Tested ✅
- Email/password signup
- OTP verification
- Smart button routing
- Profile creation
- **Result:** CLI000001 created successfully

---

## 🧪 **TEST 1: Engineer Signup**

### Test Data
```
Email: engineer.test@example.com
Password: Engineer123!
Name: Ahmed Al-Sayed
Phone: 555123456
City: Jeddah
Region: Makkah
License: ENG-2024-12345
```

### Steps
1. `/auth` → Sign up → Verify OTP
2. `/auth/account-type` → Select Engineer
3. `/signup/engineer`:
   - ✅ Email **pre-filled and disabled**
   - ✅ **No password fields**
   - Fill: Name, specializations, experience, license
   - Click "Complete Signup"
4. **Verify:** Profile with `ENG000001` in Supabase

---

## 🧪 **TEST 2: Enterprise Signup**

### Test Data
```
Email: enterprise.test@example.com
Password: Enterprise123!
Company: Al-Bawani Construction Co.
POC: Khalid Al-Bawani
Team Seats: 25
```

### Steps
1. `/auth` → Sign up → Verify OTP
2. `/auth/account-type` → Select Enterprise
3. `/signup/enterprise`:
   - ✅ POC name/email **pre-filled**
   - ✅ **No password fields**
   - Fill: Company details, team info, billing
   - Click "Complete Signup"
4. **Verify:** Profile with `ENT000001` in Supabase

---

## 🧪 **TEST 3: Admin Signup (SECURE)**

### ⚠️ Security Requirements
Must validate:
- ✅ Invitation token (10+ chars)
- ✅ Work email
- ✅ Employee ID
- ✅ Department
- ✅ Access reason
- ✅ ID verification upload
- ✅ Selfie upload
- ✅ Security agreement

### Test Data
```
Email: admin.test@nbcon.app
Password: SecureAdmin123!
Token: ADMIN-INV-2024-TEST-12345
Name: Sara Al-Mansour
Work Email: sara.almansour@nbcon.app
Employee ID: NBN-EMP-001
Department: IT & Security
```

### Steps
1. `/auth` → Sign up → Verify OTP
2. `/auth/account-type` → Select Admin
3. `/signup/admin`:
   - **Step 1:** Enter token, verify validation works
   - **Step 2:** Upload ID/selfie, accept agreement
   - Click "Complete Signup"
4. **Verify:** Profile with `ADM000001` in Supabase

---

## ✅ **Success Criteria**

### Frontend
- [ ] No password fields in signup forms
- [ ] Email/name/phone pre-filled
- [ ] No "user already exists" errors
- [ ] No 406 HTTP errors
- [ ] Success toast displays
- [ ] Correct dashboard redirect

### Backend
- [ ] Profile in `profiles` table
- [ ] Correct role assigned
- [ ] Account number generated
- [ ] All fields populated
- [ ] Status: active
- [ ] No RLS errors

---

## 🐛 **Troubleshooting**

| Error | Cause | Fix |
|-------|-------|-----|
| "User already exists" | Using `performSignup()` | Use `createProfileOnly()` |
| "RLS policy violation" | Missing policies | Check Supabase RLS policies |
| "Authentication Required" | Not logged in | Complete `/auth` flow first |
| 406 errors | Old profile queries | Refresh page (fix applied) |

---

## 📸 **Expected UI**

### No Password Fields in Signup Forms ✅
```
┌──────────────────────────────┐
│  Email: user@example.com     │
│  (Pre-filled, disabled)      │
│                              │
│  ❌ NO PASSWORD FIELDS!      │
│                              │
│  Full Name: [__________]     │
│  Company: [__________]       │
│  ...                         │
└──────────────────────────────┘
```

---

**For detailed instructions:** See test sections above  
**For code examples:** Check `docs/6-AUTH_MIGRATION_GUIDE.md`
