# 📋 File Classification & Action Plan

## **🔴 REMOVE (Dead/Unused Files)**

### **Re-export Files (Remove)**
- `src/components/CheckInContent.tsx` → Use `src/features/checkin/CheckInContent.tsx`
- `src/components/HelpSupportContent.tsx` → Use `src/features/support/HelpSupportContent.tsx`
- `src/components/MessagesContent.tsx` → Use `src/features/messaging/MessagesContent.tsx`
- `src/components/ProfileContent.tsx` → Use `src/features/profile/ProfileContent.tsx`
- `src/components/SettingsContent.tsx` → Use `src/features/settings/SettingsContent.tsx`
- `src/components/UploadDeliverableContent.tsx` → Use `src/features/deliverables/UploadDeliverableContent.tsx`
- `src/components/RouteErrorBoundary.tsx` → Use `src/app/routing/RouteErrorBoundary.tsx`
- `src/components/RouteFallback.tsx` → Use `src/app/routing/RouteFallback.tsx`

### **Duplicate Files (Remove)**
- `src/components/StarBorder.jsx` → Keep `src/shared/components/star-border/StarBorder.tsx`
- `src/hooks/useCurrency.tsx` → Keep `src/hooks/useCurrency.ts`

### **Unused Data Files (Remove)**
- `src/data/engineers-complete.ts` → Not referenced anywhere
- `src/data/engineers-extended.ts` → Not referenced anywhere

### **Supabase Fix Files (Consolidate)**
- `supabase/fix_date_fields.sql`
- `supabase/fix_jobs_rls_policies.sql`
- `supabase/fix_rls_policies.sql`
- `supabase/fix_storage_policies.sql`

### **Outdated Documentation (Remove)**
- `docs/FixDateFieldError.md`
- `docs/FixProfileImageUpload.md`
- `docs/ProfileImageUsage.md`
- `docs/ProfilePictureUsage.md`
- `docs/AI_Expedite_Implementation_Plan.md`
- `docs/FullPlatformImplementation.md`

## **🟡 MOVE (Reorganize)**

### **New Billing Files (Move to features/billing/)**
- `src/components/billing/` → `src/features/billing/components/`
- `src/lib/billing/` → `src/features/billing/lib/`
- `src/lib/payments/` → `src/features/billing/services/`
- `src/pages/billing/` → `src/features/billing/pages/`
- `src/api/stripe/` → `src/features/billing/api/`

### **New Auth Files (Move to features/auth/)**
- `src/components/auth/AuthGuard.tsx` → `src/features/auth/guards/AuthGuard.tsx`
- `src/components/auth/NewAuthFlow.tsx` → `src/features/auth/components/NewAuthFlow.tsx`
- `src/components/auth/NewRoleRouter.tsx` → `src/features/auth/components/NewRoleRouter.tsx`
- `src/lib/auth/role-resolution.ts` → `src/features/auth/lib/role-resolution.ts`

### **Account Type Selection (Move)**
- `src/pages/AccountTypeSelection.tsx` → `src/features/auth/pages/AccountTypeSelection.tsx`

### **Supabase Functions (Organize)**
- `supabase/functions/stripe-webhooks/` → Keep (already organized)
- `supabase/migrations/20240101000000_add_billing_fields.sql` → Keep (new migration)

## **🟢 KEEP (Already Organized)**

### **Core Features (Keep)**
- `src/features/ai/` ✅
- `src/features/analytics/` ✅
- `src/features/browse/` ✅
- `src/features/checkin/` ✅
- `src/features/dashboard/` ✅
- `src/features/finance/` ✅
- `src/features/jobs/` ✅
- `src/features/messages/` ✅
- `src/features/profile/` ✅
- `src/features/projects/` ✅
- `src/features/settings/` ✅
- `src/features/support/` ✅

### **Shared Components (Keep)**
- `src/shared/components/star-border/` ✅
- `src/components/ui/` ✅ (shadcn/ui components)

### **App Structure (Keep)**
- `src/app/routing/` ✅
- `src/layouts/` ✅
- `src/pages/` ✅ (main page structure)
- `src/stores/` ✅
- `src/hooks/` ✅ (shared hooks)

### **Core Files (Keep)**
- `src/lib/constants.ts` ✅
- `src/lib/utils.ts` ✅
- `src/lib/userUtils.ts` ✅
- `src/config/` ✅
- `src/integrations/supabase/` ✅

## **📊 Impact Analysis**

### **Import Updates Required**
- **10 files** need import path updates for re-export removal
- **15+ files** need import path updates for billing reorganization
- **5+ files** need import path updates for auth reorganization

### **Dependencies to Update**
- TypeScript path aliases (tsconfig.json)
- Vite configuration (vite.config.ts)
- ESLint rules (eslint.config.js)

### **Build Verification Needed**
- All import paths resolve correctly
- No circular dependencies introduced
- Bundle size optimization maintained
- Type checking passes

## **⚡ Execution Order**

1. **Phase 1**: Remove dead files (safest, no import changes)
2. **Phase 2**: Update imports for removed re-exports
3. **Phase 3**: Move billing files to proper structure
4. **Phase 4**: Move auth files to proper structure
5. **Phase 5**: Consolidate documentation
6. **Phase 6**: Verify build and fix any issues
7. **Phase 7**: Add automation scripts

## **🚨 Risk Mitigation**

- **Backup**: Git commit before each phase
- **Testing**: Run build after each major change
- **Incremental**: Process one feature at a time
- **Rollback**: Keep detailed log of all changes
