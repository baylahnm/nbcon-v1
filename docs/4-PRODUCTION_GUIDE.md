# 🚀 nbcon - Production Guide

**Last Updated:** October 12, 2025  
**Version:** 2.0  
**Status:** Production Ready

---

## 📖 Table of Contents

1. [Bug Fixing Workflow](#bug-fixing-workflow)
2. [Database Fixes](#database-fixes)
3. [Error Handling](#error-handling)
4. [Testing Guide](#testing-guide)
5. [Deployment](#deployment)
6. [Bug Radar Queries](#bug-radar-queries)
7. [Commit Convention](#commit-convention)

---

## 🐛 Bug Fixing Workflow

### Role & Scope

**Background Bug Fixer** - Senior maintenance engineer for production-ready background fixes only.

**In Scope:**
- ✅ APIs, server actions
- ✅ Auth/RBAC
- ✅ Billing/payments
- ✅ State stores
- ✅ Data models
- ✅ i18n/RTL/LTR
- ✅ Logging/metrics
- ✅ Performance

**Out of Scope:**
- ❌ UI/UX/layout
- ❌ Component redesigns
- ❌ Product features

### Priority Levels

**P0 - Critical:**
- Crashes & data corruption
- Security/auth flaws
- **Fix Time:** < 4 hours

**P1 - High:**
- Incorrect business logic
- Performance regressions
- **Fix Time:** < 2 days

**P2 - Medium:**
- Observability gaps
- Tech debt
- **Fix Time:** < 1 week

### 9-Step Workflow

```
1. Triage & Root Cause Analysis
   └─ Reproduce, document, analyze, assess priority

2. Propose Fix Strategy
   └─ Research 1-2 approaches, evaluate risk/benefit

3. Implement with Tests-First
   └─ Write failing test, minimal fix, make pass, add edge cases

4. Testing Strategy
   └─ Unit (70%), Integration (20%), E2E (10%)

5. Observability & Monitoring
   └─ Structured logs, metrics, traces, alerts

6. Feature Flags & Rollout
   └─ Flags for risky changes, gradual rollout (1% → 100%)

7. Code Review & Quality
   └─ Peer review, security scan, performance check

8. Production Deployment
   └─ Staged rollout, monitor metrics, on-call briefing

9. Post-Fix Debrief
   └─ Post-mortem (P0/P1), lessons learned, prevent recurrence
```

### Definition of Done

- [x] Failing test existed before fix; now passes
- [x] No UI/UX changes; no unapproved deps
- [x] Backward compatible or deprecation path
- [x] Observability updated (logs/metrics/alerts)
- [x] Code reviewed by senior engineer
- [x] All automated tests pass
- [x] No linter or type errors
- [x] Security scan passed
- [x] Performance benchmarks meet SLAs
- [x] CHANGELOG updated
- [x] Rollback plan documented
- [x] Feature flag configured (if risky)
- [x] On-call engineer briefed

---

## 🗄️ Database Fixes

### 🔴 Critical Fix (Apply First)

**Problem:** Missing INSERT policy causes 406 errors during signup

**File:** `supabase/fixes/012-safe-incremental-fix.sql`

**What it fixes:**
1. ✅ Adds missing INSERT policy on profiles table
2. ✅ Creates engineer_profiles table (if missing)
3. ✅ Renames tables (job_postings → jobs, ai_conversations → ai_threads)
4. ✅ Adds performance indexes
5. ✅ Creates update triggers
6. ✅ Runs verification queries

### How to Apply (3 Steps)

**Step 1: Apply SQL Fix**
1. Open Supabase SQL Editor
2. Copy contents of `supabase/fixes/012-safe-incremental-fix.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify success messages:
   - ✅ PASS - INSERT Policy Check
   - ✅ PASS - engineer_profiles Table Check
   - 🎉 Database fixes applied successfully!

**Step 2: Clean Test Data**
1. Delete test users from Supabase Auth dashboard
2. Clear browser localStorage and cookies
3. Close and reopen browser

**Step 3: Test Signup**
1. Navigate to `http://localhost:8080/auth`
2. Complete signup flow for Engineer
3. Verify correct dashboard redirect (`/engineer/dashboard`)
4. Check console - no 406 errors

### Verification Queries

```sql
-- Check INSERT policy exists
SELECT count(*) FROM pg_policies 
WHERE tablename = 'profiles' 
  AND policyname = 'Users can insert their own profile';
-- Expected: 1

-- Check engineer_profiles exists
SELECT count(*) FROM information_schema.tables 
WHERE table_name = 'engineer_profiles';
-- Expected: 1

-- Check tables renamed
SELECT count(*) FROM jobs LIMIT 1;
SELECT count(*) FROM ai_threads LIMIT 1;
```

### Before vs After Fix

**Before:**
```
User Signs Up:
  ✅ Auth account created
  ❌ Profile INSERT fails (406)
  ❌ Defaults to 'client' role
  ❌ Redirects to /client/dashboard
  ❌ Wrong features shown
```

**After:**
```
User Signs Up:
  ✅ Auth account created
  ✅ Profile INSERT succeeds
  ✅ Correct role assigned
  ✅ Account number: ENG000001
  ✅ Redirects to /engineer/dashboard
  ✅ No 406 errors
```

---

## 🛡️ Error Handling

### Retry Logic (Implemented)

**Automatic retry for failed operations:**

```typescript
import { createProfileOnly } from "@/pages/2-auth/others/utils/signup-helper";

const result = await createProfileOnly(data, userId, {
  maxRetries: 3,      // Try up to 3 times
  retryDelay: 1000    // 1s, 2s, 3s exponential backoff
});
```

**Retry Flow:**
```
Attempt 1 → Fail (406) → Wait 1s
Attempt 2 → Fail (406) → Wait 2s  
Attempt 3 → Success ✅ or show error
```

### Error Monitoring System

```typescript
import { errorMonitor, is406Error, getErrorDetails } from '@/pages/2-auth/others/utils/error-monitor';

try {
  await createProfile();
} catch (error) {
  // Log with context
  errorMonitor.logError(error, 'EngineerSignup', userId, email);
  
  // Check error type
  const message = is406Error(error)
    ? 'Database configuration issue. Team notified.'
    : getErrorDetails(error).userMessage;
  
  toast({ description: message, variant: 'destructive' });
}

// Get statistics
const stats = errorMonitor.getStats();
// { total, errors406, lastError, commonErrors }

// Export for support
const errorLog = errorMonitor.exportErrors();
```

### Error Codes Reference

| Code | Type | Retryable | User Message |
|------|------|-----------|--------------|
| `PGRST116` | 406 - RLS Policy Missing | ✅ Yes | Database config issue |
| `23505` | Unique constraint | ❌ No | Email already exists |
| `42501` | Insufficient privilege | ⚠️ Maybe | Permission denied |
| `NETWORK` | Network/timeout | ✅ Yes | Check connection |

---

## 🧪 Testing Guide

### Test Accounts

```
Engineer: info@nbcon.org / Qazwsx1234@
Client:   mahdi.n.baylah@outlook.com / Qazwsx1234@
```

### Test Case 1: Engineer Signup

**Steps:**
1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Fill form:
   - Name: Test Engineer
   - Email: test@example.com
   - Password: Test123!
   - Phone: +966555123456
   - Location: Riyadh, Riyadh
4. Enter OTP from email
5. Select "Engineer" plan
6. Complete 4-step registration
7. Click "Complete Signup"

**Expected Results:**
- ✅ Redirected to `/engineer/dashboard`
- ✅ Sidebar shows "Engineer Portal"
- ✅ No 406 errors in console
- ✅ Profile in Supabase with `ENG000001`
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

### Test Case 3: Learning Center

**Steps:**
1. Sign in as engineer
2. Navigate to `/engineer/learning`
3. Click on a course card "View Details" button
4. Verify course player modal opens
5. Press Escape to close
6. Navigate to `/engineer/learning/course/4` (AutoCAD course)
7. Verify dynamic course page loads

**Expected Results:**
- ✅ Course cards display correctly
- ✅ Course detail modal is full-screen with sidebar
- ✅ Video player controls functional
- ✅ Curriculum sections expand/collapse
- ✅ Dynamic pages route correctly
- ✅ No TypeScript errors in console

### Performance Metrics

| Metric | Target | Typical |
|--------|--------|---------|
| Sign In | <2s | ~1.5s |
| Role Fetch | <1s | ~500ms |
| Dashboard Load | <2s | ~2s |
| Sign Out | <1s | ~800ms |
| Page Navigation | <500ms | ~300ms |

---

## 🔍 Bug Radar Queries

### Top Priority Searches

**1. Locale & Formatting (i18n bugs)**
```bash
# Hard-coded locales
grep -r "toLocaleDateString('en-US'" src/
grep -r "Intl.NumberFormat('en-US'" src/
grep -r "toFixed(" src/pages/*/finance src/pages/*/payments

# Fix: Use formatSAR, formatDate from i18n utils
```

**2. Navigation & SPA (Full page reload bugs)**
```bash
# Full page reloads
grep -r "window.location.assign(" src/
grep -r "window.location.href =" src/

# Fix: Use React Router navigate() or <Link>
```

**3. Unsafe DOM / Injection (XSS)**
```bash
# Potential XSS
grep -r "dangerouslySetInnerHTML" src/
grep -r "innerHTML =" src/
grep -r "outerHTML =" src/

# Fix: Use DOMPurify before setting HTML
```

**4. Hidden Technical Debt**
```bash
# Code quality issues
grep -r "TODO" src/
grep -r "FIXME" src/
grep -r "@ts-ignore" src/
grep -r ": any" src/

# Fix: Address TODOs, remove ts-ignores, add proper types
```

**5. Swallowed Errors (Silent failures)**
```bash
# Empty catch blocks
grep -r "catch (e) {}" src/
grep -r "catch {}" src/
grep -r ".catch(() => {})" src/

# Fix: Log errors with errorMonitor
```

**6. React Pitfalls**
```bash
# Stale closures
grep -r "useEffect(() => {" src/ | grep "], [])"

# State mutations
grep -r "useState.*\[.*\]" src/

# Fix: Add deps to useEffect, use set() for state updates
```

**7. Zustand Issues**
```bash
# Direct mutations
grep -r "state\." src/ | grep " = "

# Missing version
grep -r "persist(" src/ | grep -v "version:"

# Fix: Use set(), add version field
```

**8. API Validation**
```bash
# Missing validation
grep -r "export.*async.*function" src/ | grep -v "zod\|yup"

# No timeout
grep -r "fetch(" src/ | grep -v "timeout\|signal"

# Fix: Add zod schemas, add timeouts
```

**9. Auth & Security**
```bash
# Hard-coded credentials
grep -r "apiKey.*=" src/
grep -r "password.*=" src/

# Weak crypto
grep -r "Math.random()" src/

# Fix: Use env vars, use crypto.randomUUID()
```

**10. Performance Issues**
```bash
# N+1 queries
grep -r "\.map.*await" src/

# No pagination
grep -r "SELECT \*" supabase/

# Fix: Batch queries, add LIMIT/OFFSET
```

### Bug Categories (18 Total)

1. Locale & Formatting
2. Navigation & SPA
3. Unsafe DOM / Injection
4. Hidden Technical Debt
5. Swallowed Errors
6. Typing / Logic Risks
7. React Pitfalls
8. Zustand / State
9. API Validation
10. Auth & Authorization
11. Database & SQL
12. Performance Issues
13. Memory Leaks
14. Payments / Invoices
15. Concurrency Issues
16. Error Handling
17. Testing Gaps
18. Configuration & Environment

**Total:** 150+ high-signal search queries

---

## 📝 Commit Convention

### Format

```
<type>(<scope>): <short summary> (#issue)

<optional body with details>

<optional footer with breaking changes>
```

### Types

- `fix(bg)` — Functional defect / bug fix
- `test(bg)` — Test addition or modification
- `perf(bg)` — Performance improvement
- `security(bg)` — Security vulnerability fix
- `chore(obs)` — Observability enhancement (logs, metrics)
- `refactor(bg)` — Code refactoring
- `docs(bg)` — Documentation updates
- `revert` — Rollback of previous commit

### Scopes

- `auth` — Authentication/authorization
- `api` — API endpoints
- `db` — Database queries/migrations
- `payments` — Payment processing
- `i18n` — Internationalization
- `state` — State management (Zustand)
- `validation` — Input validation

### Examples

**Bug Fix:**
```
fix(bg): use formatSAR instead of hard-coded 'en-US' locale (#1243)

Replaced Intl.NumberFormat('en-US') with formatSAR() to support
Arabic currency formatting.

Test: src/utils/__tests__/formatCurrency.test.ts
Risk: Low - Pure formatting fix
```

**Performance:**
```
perf(bg): batch invoice lookups to eliminate N+1 queries (#2034)

Reduced 50+ individual queries to single batched query.

Before: 2300ms avg response time
After: 180ms avg response time
Risk: Low - Pure performance win
```

**Security:**
```
security(bg): sanitize HTML in messages before rendering (#3001)

Added DOMPurify to prevent XSS attacks in user messages.

CVE: Internal finding
Risk: High - Deployed with feature flag
```

---

## 🧪 Starter Tasks Checklist

### P0 - Critical Security

- [ ] **Audit auth endpoints** for missing RBAC checks
  - Search: `export.*function.*auth` without `RequireRole`
  - Test: Attempt access with wrong role
  - Risk: High

- [ ] **Sanitize user content** for XSS prevention
  - Search: `dangerouslySetInnerHTML` without DOMPurify
  - Add: DOMPurify sanitization
  - Test: Submit XSS payloads
  - Risk: High

- [ ] **Add SQL injection protection**
  - Search: `${` in SQL strings
  - Replace: Parameterized queries
  - Test: Submit SQL injection attempts
  - Risk: Critical

### P1 - High Impact

- [ ] **Replace hard-coded 'en-US' formatters**
  - Search: `toLocaleDateString('en-US'`
  - Replace: Use `formatSAR`, `formatDate` utils
  - Test: Verify AR/EN formatting
  - Risk: Medium

- [ ] **Replace full page reloads** with SPA navigation
  - Search: `window.location.assign(`
  - Replace: `navigate()` from React Router
  - Test: Verify no page reload
  - Risk: Low

- [ ] **Add validation schemas** to all API endpoints
  - Add: Zod schemas at entry points
  - Test: Submit invalid data
  - Risk: Medium

### P2 - Medium Impact

- [ ] **Eliminate N+1 queries**
  - Search: Loops with DB calls inside
  - Replace: Batch queries
  - Test: Monitor query count
  - Risk: Low

- [ ] **Add structured logging**
  - Format: JSON with requestId, userId, timestamp
  - Remove: console.log statements
  - Test: Verify parseable JSON
  - Risk: Low

- [ ] **Configure alerts** for error rates
  - Add: Alerts for >5% error rate
  - Add: PagerDuty/Slack integration
  - Test: Trigger thresholds
  - Risk: Low

---

## 📊 Testing Strategy

### Test Pyramid

```
E2E Tests (10%)
  └─ Critical user flows
  └─ Cross-browser testing

Integration Tests (20%)
  └─ Component interactions
  └─ API contracts
  └─ Database operations

Unit Tests (70%)
  └─ Individual functions
  └─ Edge cases
  └─ Fast, isolated
```

### Edge Case Testing

**Always test:**
- `null` values
- `undefined` values
- Empty arrays `[]`
- Empty objects `{}`
- Boundary conditions (min/max)
- Network failures
- Timeouts
- Concurrent operations
- Invalid inputs

### Example Test

```typescript
describe('createProfileOnly', () => {
  it('should retry 3 times on 406 error', async () => {
    // Arrange
    const mockError = { code: 'PGRST116' };
    supabase.from = jest.fn().mockReturnValue({
      insert: jest.fn()
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({ data: mockProfile, error: null })
    });

    // Act
    const result = await createProfileOnly(data, userId);

    // Assert
    expect(result.success).toBe(true);
    expect(supabase.from).toHaveBeenCalledTimes(3);
  });

  it('should handle null userId gracefully', async () => {
    const result = await createProfileOnly(data, null);
    expect(result.success).toBe(false);
    expect(result.error).toContain('User ID required');
  });
});
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] All tests pass (`npm test`)
- [ ] No linter errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Feature flags set (if applicable)
- [ ] Rollback plan documented
- [ ] On-call engineer briefed

### Gradual Rollout Strategy

```
1% → Monitor for 1 hour
  └─ Check error rates, performance metrics
  └─ If stable, proceed

10% → Monitor for 2 hours
  └─ Check user feedback, error logs
  └─ If stable, proceed

50% → Monitor for 4 hours
  └─ Check all metrics, business KPIs
  └─ If stable, proceed

100% → Fully deployed
  └─ Continue monitoring for 24 hours
```

### Rollback Plan

**Quick Rollback (Feature Flag):**
```typescript
// In code
if (featureFlags.ENABLE_NEW_FEATURE) {
  // New behavior
} else {
  // Old behavior (fallback)
}

// To rollback
featureFlags.ENABLE_NEW_FEATURE = false;
```

**Full Rollback (Git):**
```bash
# Revert commit
git revert <commit-hash>
git push origin main

# Or rollback to previous deploy
vercel rollback <deployment-url>
```

---

## 📈 Observability

### Structured Logging

```typescript
// ✅ Good: Structured JSON logs
logger.info({
  event: 'profile_created',
  userId: user.id,
  role: user.role,
  requestId: req.id,
  timestamp: new Date().toISOString()
});

// ❌ Bad: Unstructured console logs
console.log('Profile created for', user.email);
```

### Metrics to Track

**Auth:**
- `auth_success_rate`
- `auth_failure_by_reason`
- `signup_completion_rate`

**Payments:**
- `payment_success_rate`
- `payment_processing_time`
- `payment_retry_count`

**Jobs:**
- `job_match_rate`
- `job_completion_time`
- `application_success_rate`

### Alert Configuration

```typescript
// Example alert thresholds
alerts: {
  error_rate: {
    threshold: 5,      // >5% error rate
    window: '5m',      // Over 5 minutes
    severity: 'high'
  },
  response_time: {
    threshold: 30000,  // >30s p95
    window: '5m',
    severity: 'critical'
  },
  payment_failures: {
    threshold: 10,     // >10 failures
    window: '1m',
    severity: 'critical'
  }
}
```

---

## 🔧 Tools & Utilities

### i18n Helpers

```typescript
import { formatSAR, formatDate } from '@/pages/1-HomePage/others/lib/i18n/intl';

// Currency (locale-aware)
formatSAR(45000)
// EN: "SAR 45,000.00"
// AR: "٤٥٬٠٠٠٫٠٠ ر.س."

// Date (locale-aware)
formatDate(new Date())
// EN: "Oct 12, 2025"
// AR: "١٢ أكتوبر ٢٠٢٥"

// Get locale
const locale = document.documentElement.lang; // 'en' or 'ar'
```

### Navigation

```typescript
import { useNavigate } from 'react-router-dom';

// ✅ Good: SPA navigation
const navigate = useNavigate();
navigate('/engineer/dashboard');

// ❌ Bad: Full page reload
window.location.href = '/engineer/dashboard';
```

### Sanitization

```typescript
import DOMPurify from 'dompurify';

// ✅ Good: Sanitize HTML
const sanitized = DOMPurify.sanitize(userInput);

// ❌ Bad: Direct HTML injection
dangerouslySetInnerHTML={{ __html: userInput }}
```

### State Management (Zustand)

```typescript
// ✅ Good: Use set()
set({ profile: newProfile });

// ❌ Bad: Direct mutation
state.profile = newProfile;

// ✅ Good: Include version
persist({
  name: 'auth-store',
  version: 1,
  migrate: (oldState, version) => { /* ... */ }
})

// ❌ Bad: No version
persist({ name: 'auth-store' })
```

---

## 🆘 Troubleshooting

### Common Issues

**"User already exists" Error**
- Cause: Using `performSignup()` in role-specific forms
- Fix: Use `createProfileOnly()` instead

**406 RLS Policy Violation**
- Cause: Missing INSERT policy
- Fix: Apply `012-safe-incremental-fix.sql`

**Wrong Dashboard After Login**
- Cause: Profile role mismatch
- Fix: Delete test user, clear cache, apply DB fix, retry

**Form Not Pre-filling**
- Cause: Missing auth store access
- Fix: Import `useAuthStore()` and use `user` data

**Redirect Loop After Sign Out**
- Cause: Profile query timeout
- Fix: Apply database optimization in `012-safe-incremental-fix.sql`

**TypeScript errors in Learning Center**
- Cause: `undefined` array access
- Fix: Use optional chaining `?` and nullish coalescing `|| []`

**Course player not opening**
- Cause: Missing curriculum data
- Fix: Check `course.curriculum?.length` before rendering

---

## 📚 Code Quality Standards

### TypeScript Strict Mode

```tsx
// ✅ Good
interface Props {
  course: Course;
  onEnroll: (id: string) => void;
}

function CourseCard({ course, onEnroll }: Props) {
  // Type-safe
}

// ❌ Bad
function CourseCard({ course, onEnroll }: any) {
  // No type safety
}
```

### Null Safety

```tsx
// ✅ Good
course.students?.toLocaleString() || '0'
course.curriculum?.[0]?.lectures?.[0]?.id || ''
(path.instructors || []).slice(0, 3)

// ❌ Bad
course.students.toLocaleString()  // Crash if undefined
course.curriculum[0].lectures[0].id  // Crash if any is undefined
path.instructors.slice(0, 3)  // Crash if undefined
```

### Error Handling

```typescript
// ✅ Good
try {
  const result = await operation();
  if (!result.success) {
    errorMonitor.logError(result.error, 'Context', userId);
    toast({ description: result.error, variant: 'destructive' });
    return;
  }
  // Continue with success
} catch (error) {
  errorMonitor.logError(error, 'Unexpected', userId);
  toast({ description: 'An unexpected error occurred' });
}

// ❌ Bad
try {
  await operation();
} catch (e) {
  // Silent failure
}
```

### Naming Conventions

```typescript
// ✅ Good
const isLoading = true;
const hasPermission = checkRole();
const canEdit = isOwner && isAuthenticated;

// ❌ Bad
const loading = true;  // Not clear it's boolean
const permission = checkRole();  // Unclear type
const edit = isOwner && isAuth;  // Too short
```

---

## 🎯 Performance Best Practices

### Code Splitting

```typescript
// Lazy load heavy pages
const EnterpriseLayout = React.lazy(() => import("./layouts/EnterpriseLayout"));
const FinancePage = React.lazy(() => import("./pages/FinancePage"));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <FinancePage />
</Suspense>
```

### Memoization

```typescript
// Memoize expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Memoize computed values
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### Image Optimization

```tsx
// ✅ Good
<img
  src="/e-learning/Best Sellers/AutoCAD for Civil Engineers.jpg"
  alt="AutoCAD for Civil Engineers course"
  loading="lazy"
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder.svg';
  }}
/>

// ❌ Bad
<img src={course.thumbnail} />  // No fallback, no lazy load
```

---

## 📦 Deployment Checklist

### Before Deploy

- [ ] Apply database migrations
- [ ] Update environment variables
- [ ] Test on staging environment
- [ ] Run security scan
- [ ] Check bundle size (<500KB)
- [ ] Verify all images optimized
- [ ] Test with real user accounts
- [ ] Review error logs
- [ ] Check performance metrics

### After Deploy

- [ ] Monitor error rates (first 1 hour)
- [ ] Check response times
- [ ] Verify all features working
- [ ] Test auth flows
- [ ] Check database performance
- [ ] Monitor memory usage
- [ ] Review user feedback
- [ ] Update documentation

---

## 🔄 Continuous Improvement

### Post-Mortem (for P0/P1 bugs)

**Template:**
```markdown
## Incident Summary
- **Date:** YYYY-MM-DD
- **Priority:** P0/P1
- **Impact:** X users affected, Y minutes downtime

## Root Cause
- What failed and why

## Timeline
- Detection: HH:MM
- Fix deployed: HH:MM
- Resolved: HH:MM
- MTTR: X minutes

## Fix Applied
- Description of fix
- PR link

## Prevention
- What we'll do to prevent recurrence
- New tests added
- New monitoring added
- Process improvements
```

### Lessons Learned

Document in team wiki:
- Root cause analysis
- Contributing factors
- Detection gaps
- Prevention strategies
- Process improvements

### Guardrails to Add

- Linting rules
- Type checks
- Runtime validations
- Automated tests
- Monitoring alerts

---

## 🎓 Best Practices Summary

### Code Quality
- ✅ TypeScript strict mode (no `any`)
- ✅ Proper error handling with context
- ✅ Null safety with optional chaining
- ✅ Consistent naming conventions
- ✅ JSDoc for public APIs

### Security
- ✅ Sanitize all user inputs
- ✅ Parameterized database queries
- ✅ Server-side validation
- ✅ No credentials in code
- ✅ RBAC checks on all protected routes

### Performance
- ✅ Code splitting for heavy pages
- ✅ Lazy loading for images
- ✅ Memoization for expensive operations
- ✅ Debouncing for frequent events
- ✅ Pagination for large lists

### Observability
- ✅ Structured JSON logging
- ✅ Request/trace IDs
- ✅ Metrics for critical operations
- ✅ Alerts for error thresholds
- ✅ No PII in logs

### Testing
- ✅ Tests before fixes (TDD)
- ✅ Edge case coverage
- ✅ Integration tests for flows
- ✅ Performance tests for critical paths
- ✅ Security tests for auth/payments

---

## 🆘 Emergency Procedures

### Production Incident Response

**1. Detect (0-5 min)**
- Alert triggered or user report
- Check error dashboard
- Assess severity (P0/P1/P2)

**2. Triage (5-15 min)**
- Identify affected users/features
- Check recent deployments
- Review error logs
- Determine blast radius

**3. Mitigate (15-60 min)**
- If feature flag exists: disable
- If recent deploy: rollback
- If config issue: fix config
- If DB issue: run fix script

**4. Fix (1-4 hours)**
- Create hotfix branch
- Write failing test
- Implement minimal fix
- Test thoroughly
- Deploy with monitoring

**5. Post-Mortem (24-48 hours)**
- Write incident report
- Share lessons learned
- Add prevention measures
- Update documentation

### Rollback Procedures

**Feature Flag Rollback (Fastest - 1 minute):**
```typescript
// Set flag to false
featureFlags.ENABLE_NEW_FEATURE = false;
```

**Code Rollback (Fast - 5 minutes):**
```bash
# Revert commit
git revert <commit-hash>
git push origin main

# Vercel auto-deploys
```

**Database Rollback (Careful - 10 minutes):**
```sql
-- Only if migration has down/rollback script
-- Test on staging first!
-- Run down migration
```

---

## 📞 Support & Resources

### Documentation

- **Getting Started** → 1-GETTING_STARTED.md
- **Architecture** → 2-ARCHITECTURE_GUIDE.md  
- **UI Design** → 3-UI_DESIGN_SYSTEM.md
- **This Guide** → 4-PRODUCTION_GUIDE.md (you are here)

### Code References

**Auth:**
- `src/pages/2-auth/others/utils/signup-helper.ts`
- `src/pages/2-auth/others/utils/error-monitor.ts`
- `src/pages/2-auth/others/stores/auth.ts`

**Best Examples:**
- Client Signup: `src/pages/2-auth/signup/ClientSignup.tsx`
- Dashboard: `src/pages/5-engineer/1-DashboardPage.tsx`
- Profile: `src/pages/5-engineer/15-ProfilePage.tsx`

### External Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion

---

## ✅ Quick Reference

### Most Common Fixes

**1. Fix 406 Error:**
```bash
# Apply database fix
# File: supabase/fixes/012-safe-incremental-fix.sql
# Time: 2 minutes
```

**2. Fix Hard-Coded Locale:**
```typescript
// Before
amount.toLocaleString('en-US')

// After
formatSAR(amount)  // From i18n utils
```

**3. Fix Full Page Reload:**
```typescript
// Before
window.location.href = '/engineer/dashboard';

// After
navigate('/engineer/dashboard');
```

**4. Fix Unsafe HTML:**
```typescript
// Before
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// After
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

**5. Fix Direct State Mutation:**
```typescript
// Before (Zustand)
state.profile = newProfile;

// After
set({ profile: newProfile });
```

---

## 🎯 Success Metrics

### Quality Targets

- **Regression Rate:** < 2%
- **Test Coverage:** > 80% for background services
- **Code Review Time:** < 1 hour average

### Speed Targets

- **P0 Fix Time:** < 4 hours
- **P1 Fix Time:** < 2 days
- **P2 Fix Time:** < 1 week

### Safety Targets

- **Rollback Success:** > 99%
- **Incident MTTR:** < 15 minutes
- **Security Scan Pass:** 100%

---

## 🐛 **Bug Inspection Report**

### **Critical Issues Found & Fixed**

**Total Issues Found:** 8  
**Critical (P0):** 3  
**High (P1):** 3  
**Medium (P2):** 2

---

### **🔴 P0 - Critical Issues (FIXED)**

#### **1. Auth Race Condition - Dual Role Initialization**

**Problem:**
- TWO separate auth initialization paths running in parallel
- Both `getSession()` callback AND `onAuthStateChange` listener
- Both can timeout and default to 'client'
- Created race condition where wrong role can win

**Fix Applied:**
- Consolidated to single initialization path
- Removed duplicate logic
- Clear separation of concerns
- ✅ Status: FIXED

---

#### **2. Missing Environment Variables Configuration**

**Problem:**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// ^^^ These can be EMPTY STRINGS! No validation!
```

**Fix Applied:**
```typescript
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('⚠️ Missing env vars, using hardcoded fallbacks');
  // Use fallbacks from environment.ts
}
```
- ✅ Status: FIXED

---

#### **3. Test/Debug Routes in Production Code**

**Problem:**
- Test routes with debug content in production
- Two profile routes defined (root + nested)
- Overrides actual ProfilePage component

**Fix Applied:**
- Removed all test routes
- Using actual ProfilePage component
- Clean routing configuration
- ✅ Status: FIXED

---

### **🟠 P1 - High Priority Issues (FIXED)**

#### **4. Profile Query Timeout Too Long**

**Before:** 10 seconds  
**After:** 5 seconds  
**Benefit:** Faster UX, better fallback handling  
**Status:** ✅ FIXED

---

#### **5. Duplicate Settings Import**

**Before:** Same file imported twice with different names  
**After:** Single import, consistent naming  
**Benefit:** Smaller bundle, clearer code  
**Status:** ✅ FIXED

---

#### **6. Client Learning Route Mismatch**

**Before:** `/client/learning/:courseId` ❌  
**After:** `/client/learning/course/:courseId` ✅  
**Benefit:** Consistent routing across roles  
**Status:** ✅ FIXED

---

### **🟡 P2 - Medium Priority Issues (FIXED)**

#### **7. Unused useEffect Import**

**Status:** ✅ Removed unused imports

#### **8. CSS Scroll Container Overscroll Issue**

**Status:** ✅ Added browser fallbacks

---

### **✅ What's Working Well**

1. **✅ No TypeScript `any` types** - All code is properly typed
2. **✅ No `@ts-ignore` comments** - No type checking bypassed
3. **✅ No dangerouslySetInnerHTML** - No XSS vulnerabilities
4. **✅ Error boundaries present** - Graceful error handling
5. **✅ Lazy loading implemented** - Good performance
6. **✅ RLS enabled on all tables** - Database security
7. **✅ All imports resolved** - No module errors

---

## 🔒 **Logout Redirect Loop Fix**

### **Problem**

After signing out, users experienced infinite redirect loop between `/auth` ↔ `/dashboard`:

```
1. User clicks Sign Out
2. Auth state cleared ✅
3. Protected route sees !user → redirect to /auth
4. /auth checks localStorage (stale) → redirect to /dashboard ❌
5. Dashboard sees !user → redirect to /auth ❌
6. INFINITE LOOP 🔄
```

---

### **Root Cause**

- **No session hydration check** - redirects happened before Supabase session was loaded
- **localStorage checked before session** - stale data caused wrong redirects
- **Multiple auth initialization paths** - race conditions

---

### **Solution Implemented**

**3 Files Created/Modified:**

| File | Action | Purpose |
|------|--------|---------|
| `src/shared/hooks/useAuthSession.ts` | ✅ Created | Centralized session hydration |
| `NewAuthFlow.tsx` | ✅ Updated | Prevent premature redirects |
| `AuthGuard.tsx` | ✅ Updated | Wait for session before guarding |

---

### **Technical Implementation**

**1. Created `useAuthSession` Hook:**

```typescript
export function useAuthSession() {
  // undefined = loading, null = no session, Session = active
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
    
    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => setSession(newSession)
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { session, isLoading: session === undefined };
}
```

**2. Updated NewAuthFlow.tsx:**

```typescript
const { session, isLoading: sessionLoading } = useAuthSession();

useEffect(() => {
  if (sessionLoading) return; // Wait!
  
  // Only redirect if session is valid
  if (user && profile && session) {
    navigate(landingPage);
  }
  
  // Clear stale localStorage if no session
  if (!session) {
    localStorage.removeItem('nbcon_user');
  }
}, [user, profile, session, sessionLoading]);
```

**3. Updated AuthGuard.tsx:**

```typescript
const { session, isLoading: sessionLoading } = useAuthSession();

if (sessionLoading || isLoading) return; // Wait for hydration

// Only redirect if session is actually null
if (session === null && !user) {
  navigate('/auth'); // Safe!
}
```

---

### **Testing Results**

**Test 1: Normal Logout** ✅ PASS
- Redirects to `/auth` exactly ONCE
- No redirect loop
- URL stays at `/auth`

**Test 2: Logout from Different Pages** ✅ PASS
- All pages redirect correctly
- No loops on any page

**Test 3: Login After Logout** ✅ PASS
- Redirects to correct dashboard
- No redirect to `/auth`

**Test 4: Refresh Page While Logged In** ✅ PASS
- Stays on dashboard
- Session persists correctly

---

### **Key Insight**

The fix follows this principle:
> **"Never redirect based on state that might be stale. Always wait for the source of truth (Supabase session) to load first."**

---

### **Files Changed**

**Created:**
- ✅ `src/shared/hooks/useAuthSession.ts` (71 lines)

**Modified:**
- ✅ `NewAuthFlow.tsx` - Added session hydration check
- ✅ `AuthGuard.tsx` - Wait for session before redirecting

**Status:** ✅ **COMPLETE - Production Ready**

---

## 🎓 **Full-Stack Development Learning Journey**

### **Key Learning Insights**

#### **1. Horizontal Scrolling with CSS Snap Points**

**Challenge:** Creating smooth, responsive horizontal scrolling for course cards

**Solution Implemented:**
```typescript
export const HorizontalScrollCards: React.FC = ({
  cardsPerView = {
    mobile: 1.2,    // Show 1.2 cards (partial view hints more content)
    tablet: 2.2,
    desktop: 3.2,
    wide: 4.2
  }
}) => {
  // Dynamic width calculation for optimal space usage
  const containerWidth = scrollContainerRef.current?.clientWidth || width;
  const gapPixels = parseInt(gap) || 16;
  const totalGaps = (cardsPerView - 1) * gapPixels;
  const availableWidth = containerWidth - totalGaps - 32;
  const calculatedCardWidth = Math.floor(availableWidth / cardsPerView);
};
```

**Key Learning:**
- CSS scroll snap provides smooth, native scrolling behavior
- Partial card visibility (1.2, 2.2) indicates scrollable content
- Dynamic width calculation ensures optimal space usage

---

#### **2. Scroll Containment and Overflow Prevention**

**Problem:** Horizontal scrolling was affecting the entire page

**Solution:**
```css
/* Global overflow prevention */
body, html {
  overflow-x: hidden;
  max-width: 100%;
}

/* Horizontal scroll container with containment */
.horizontal-scroll-container {
  overflow-x: auto;
  overscroll-behavior-x: contain; /* Prevent scroll chaining */
  scroll-behavior: smooth;
}
```

**Key Learning:**
- `overscroll-behavior-x: contain` prevents scroll chaining to parent
- Global overflow prevention requires both body and html styling

---

#### **3. Theme System with CSS Variables**

**Innovation:** Comprehensive theme system with Zustand persistence

```typescript
const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'light',
      setTheme: (theme) => {
        const themeConfig = THEME_TOKENS[theme];
        Object.entries(themeConfig).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        set({ currentTheme: theme });
      },
      updateToken: (token, value) => {
        document.documentElement.style.setProperty(token, value);
        set({ customTokens: { ...get().customTokens, [token]: value } });
      }
    }),
    { name: 'theme-storage', version: 1 }
  )
);
```

**Key Learning:**
- CSS variables provide powerful theming capabilities
- Zustand with persistence creates robust state management
- Token-based theming allows granular customization

---

#### **4. Circular Dependency Resolution**

**Problem:** React components importing from each other causing circular dependencies

**Solution:** Centralized data layer
```typescript
// courseData.ts - Centralized data management
export interface Course { /* ... */ }
export interface Lesson { /* ... */ }
export const seedCourse: Course = { /* ... */ };

// Both LearningPage.tsx and CoursePage.tsx import from courseData.ts
import { seedCourse } from './data/courseData';
```

**Benefits:**
- Eliminates circular import errors
- Centralized data management
- Easier testing and maintenance

---

#### **5. Consistent Spacing System**

**Innovation:** Unified spacing system using 16px as base unit

**Implementation:**
- Card Gaps: `gap-4` (16px)
- Card Content Padding: `p-4` (16px)
- Icon Container Sizing: `h-5 w-5` (20px)

**Benefits:**
- Visual consistency across all pages
- Better mobile experience
- Professional, polished appearance

---

### **Challenges Overcome**

**Challenge 1: Router Configuration**
- **Problem:** Routes redirecting to dashboard instead of rendering
- **Solution:** Identified correct router file (`NewRoleRouter.tsx`)
- **Learning:** Always verify which router file is actually being used

**Challenge 2: Component Library Integration**
- **Problem:** File overwrite conflicts during component installation
- **Solution:** Selective component addition, careful conflict resolution
- **Learning:** Component library updates require careful handling

**Challenge 3: Design Pattern Consistency**
- **Problem:** Inconsistent spacing and typography across pages
- **Solution:** Systematic pattern application (Bauhaus borders, card headers)
- **Learning:** Systematic design pattern application ensures consistency

---

### **Novel Solutions**

**1. Bauhaus-Inspired Design System**
```css
.card-bauhaus {
  border: 2px solid transparent;
  background-image: 
    linear-gradient(hsl(var(--card)), hsl(var(--card))),
    linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

**2. Dynamic Card System**
- Responsive card counts (1.2, 2.2, 3.2, 4.2)
- Fractional visibility hints more content
- Optimal space utilization

**3. Session Hydration Pattern**
- `undefined` = loading (don't redirect)
- `null` = no session (logged out)
- `Session` = active session (logged in)

---

### **Best Practices Learned**

**1. User Experience First**
- Always prioritize end-user experience
- Small optimizations have significant impact

**2. Performance Matters**
- Code splitting for heavy layouts
- Lazy loading for images
- Memoization for expensive operations

**3. Consistency is Key**
- Standardized spacing (16px system)
- Design patterns create polished interfaces
- Component reusability reduces duplication

**4. Testing is Essential**
- Comprehensive testing prevents bugs
- Edge case coverage is critical

**5. Documentation is Critical**
- Well-documented code saves time
- Clear documentation prevents confusion

---

### **Success Metrics**

**Code Quality:**
- ✅ Consistent, readable, maintainable code
- ✅ TypeScript strict mode throughout
- ✅ Zero linter errors

**Performance:**
- ✅ Fast load times
- ✅ Smooth interactions
- ✅ Optimized bundle size

**User Experience:**
- ✅ Intuitive navigation
- ✅ Accessible design
- ✅ Responsive across devices

---

**This guide ensures production-ready fixes with minimal risk!** 🚀

**Version:** 2.0  
**Maintained By:** Development Team  
**Last Review:** January 15, 2025

