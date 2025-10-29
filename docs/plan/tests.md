# Tier-by-Tier Testing & Validation

> **Purpose:** Comprehensive diagnostic procedures for validating subscription tier enforcement across the platform.

---

## 🎯 Testing Objective

Run complete system diagnostics for all subscription tiers (Free, Basic, Pro, Enterprise) to verify:

- ✅ Functionality and access control
- ✅ Upgrade gating logic
- ✅ UI behavior and navigation
- ✅ Feature gate prompts
- ✅ Upgrade flow redirects

---

## ⚙️ General Setup

### Prerequisites

1. **Environment:**
   ```bash
   # Confirm dependencies
   pnpm install
   
   # Verify Supabase connection
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

2. **Clear Auth/State:**
   ```bash
   # Clear browser storage before each tier test
   localStorage.clear()
   sessionStorage.clear()
   ```

3. **Test User Accounts:**
   - `free@nbcon.org` (Free tier)
   - `basic@nbcon.org` (Basic tier)
   - `info@nbcon.org` (Pro tier)
   - `mahdi.n.baylah@outlook.com` (Enterprise tier)

---

## 🔹 Phase 1: Free Tier Diagnostic

### Core Pages Validation

Visit all Free-tier accessible pages:

```
/free/overview
/free/dashboard
/free/calendar
/free/browse-engineers
/free/jobs
/free/post-job
/free/projects
/free/my-projects
/free/ai (AI Assistant)
/free/ai-tools/planning (Project Planning Tools)
/free/messages
/free/network
/free/learning
/free/finance
/free/subscription
/free/help
/free/settings
```

### Validation Checklist

- [ ] All routes render without errors
- [ ] AI Assistant functional with Quick Actions
- [ ] All 7 planning tools accessible
- [ ] Token widget shows ≤ 100,000 tokens
- [ ] Locked AI categories display 🔒 with "Pro required"
- [ ] Creating 2nd project triggers upgrade prompt
- [ ] Advanced analytics gated
- [ ] API/integrations sections gated
- [ ] Enterprise ops hidden/gated
- [ ] `/subscription` shows Free badge + upgrade CTA

### Feature Gate Tests

```tsx
// Expected behavior
<FeatureGate requiredTier="pro" featureName="Advanced AI Tools">
  // Should show upgrade prompt for Free users
</FeatureGate>
```

### Upgrade Prompt Validation

Record all upgrade prompts encountered:

| Feature | Route | Target Tier | CTA Text |
|---------|-------|-------------|----------|
| Specialized AI Agents | `/ai-tools` | `pro` | "Upgrade to Pro" |
| Advanced Analytics | `/analytics` | `pro` | "Upgrade to Pro" |
| API Access | `/settings/api` | `pro` | "Upgrade to Pro" |

### Summary Template

```
✅ Passed: [X / Y] tests
❌ Failed: [X / Y] tests
🛠️ Needs Review: [X / Y] tests

Details:
- [Feature] – ✅ / ❌ / 🛠️ – Notes
```

---

## 🔹 Phase 2: Basic Tier Diagnostic

### Enhanced Features Validation

Visit all Basic routes plus new capabilities:

```
[All Free routes] +
/calendar (multi-project view)
/finance?tab=reports (advanced reports)
/engineers (enhanced filtering)
```

### Validation Checklist

- [ ] Up to 5 concurrent projects allowed
- [ ] Finance advanced reports visible
- [ ] AI quota higher than Free
- [ ] AI Advanced Tools/Agents gated ("Pro required")
- [ ] Calendar aggregates multiple projects
- [ ] `/subscription` shows Basic badge + upgrade to Pro CTA
- [ ] Priority support badge visible

### Multi-Project Test

```typescript
// Create projects until limit
for (let i = 0; i < 6; i++) {
  createProject(`Project ${i}`);
  // 6th attempt should trigger upgrade prompt
}
```

### Summary Template

```
✅ Passed: [X / Y] tests
❌ Failed: [X / Y] tests
🛠️ Needs Review: [X / Y] tests

Details:
- Multi-project management – ✅ / ❌ – Works up to 5 projects
- Advanced reporting – ✅ / ❌ – Reports accessible
```

---

## 🔹 Phase 3: Pro Tier Diagnostic

### Power-User Features Validation

Visit all Pro routes:

```
[All Basic routes] +
/ai/advanced (specialized agents)
/ai/agents (agent selector)
/finance?tab=analytics (advanced analytics)
/timesheets
/api/keys (API management)
/integrations
```

### Validation Checklist

- [ ] Unlimited project creation
- [ ] AI quota effectively unlimited
- [ ] All AI Tools & Agents usable
- [ ] API keys section enabled
- [ ] Integrations panel functional
- [ ] Advanced analytics dashboards render
- [ ] White-label/export branding available
- [ ] Enterprise routes gated ("Enterprise required")
- [ ] No upgrade prompts for Pro features

### AI Modules Test

```typescript
// Test all specialized AI agents
const agents = [
  'code-reviewer',
  'devops-assistant', 
  'budget-analyst',
  'project-planner'
];

agents.forEach(agent => {
  loadAIAgent(agent); // Should load without upgrade prompt
});
```

### Summary Template

```
✅ Passed: [X / Y] tests
❌ Failed: [X / Y] tests
🛠️ Needs Review: [X / Y] tests

Details:
- Unlimited projects – ✅ / ❌ – Created 10+ projects
- AI agents – ✅ / ❌ – All 4 agents accessible
```

---

## 🔹 Phase 4: Enterprise Tier Diagnostic

### Organization Features Validation

Visit all Enterprise routes:

```
[All Pro routes] +
/enterprise/workforce
/enterprise/teams
/enterprise/contracts
/enterprise/profile
/enterprise/bi (business intelligence)
/enterprise/settings/sso
/enterprise/settings/branding
```

### Validation Checklist

- [ ] No FeatureGate components visible
- [ ] SSO/SAML settings present
- [ ] Org management functional (add/remove users)
- [ ] Team roles/permissions configurable
- [ ] Custom branding panel active
- [ ] SLA dashboard visible
- [ ] Audit logs accessible
- [ ] Governance panels functional
- [ ] API/integrations fully unrestricted

### Multi-User Test

```typescript
// Test organization management
addTeamMember('user@example.com', 'admin');
assignRole('user@example.com', 'project-manager');
createTeam('Engineering Team');
```

### Summary Template

```
✅ Passed: [X / Y] tests
❌ Failed: [X / Y] tests
🛠️ Needs Review: [X / Y] tests

Details:
- SSO configuration – ✅ / ❌ – Settings accessible
- Multi-user management – ✅ / ❌ – Added 3 users successfully
```

---

## 📊 Final Aggregate Report

### Cross-Tier Matrix

| Feature Group | Free | Basic | Pro | Enterprise |
|---------------|------|-------|-----|------------|
| Core Pages | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ |
| AI Tools | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ |
| Projects | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ |
| Finance | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ |
| Enterprise Ops | ❌ | ❌ | ❌ | ✅ / ❌ |

### Issues & Recommendations

1. **Mismatched FeatureGate Logic:**
   - Issue: [Description]
   - Fix: [Recommendation]

2. **Leaky Access Control:**
   - Issue: [Description]
   - Fix: [Recommendation]

3. **Missing Upgrade Prompts:**
   - Issue: [Description]
   - Fix: [Recommendation]

---

## 🧪 Automated Test Commands

### Unit Tests

```bash
# Test subscription service
pnpm exec vitest run tests/unit/subscriptionService.spec.ts

# Test token service
pnpm exec vitest run tests/unit/tokenService.spec.ts
```

### E2E Tests

```bash
# Run all subscription gating tests
pnpm exec playwright test tests/e2e/subscriptionGating.spec.ts --project=chromium

# Run specific tier test
pnpm exec playwright test tests/e2e/subscriptionGating.spec.ts --grep "Free Tier"
```

### Integration Tests

```bash
# Test feature gate component
pnpm exec vitest run tests/integration/featureGate.spec.tsx

# Test portal access hook
pnpm exec vitest run tests/integration/portalAccess.spec.ts
```

---

## 📋 Report Format (Per Tier)

```markdown
# [Tier] Diagnostic Report

## Summary
✅ [X / total] Passed
❌ [X / total] Failed
🛠️ [X / total] Needs Review

## Detailed Results

### Core Functionality
- Dashboard – ✅ – Loads correctly with tier badge
- Projects – ✅ – Limit enforced (1 for Free)
- AI Assistant – ❌ – Quota widget not showing

### Feature Gates
- Advanced AI Tools – ✅ – Shows "Upgrade to Pro" prompt
- Analytics – ✅ – Gated correctly

### Navigation
- Sidebar – ✅ – Correct items visible
- Locked items – ✅ – Show lock icon

## Recommendations
1. Fix quota widget display issue
2. Add missing upgrade CTA on Analytics page
```

---

## ✅ Success Criteria

**Goal:** 100% alignment between feature gating, UI visibility, and plan hierarchy across all tiers.

- ✅ All tier-appropriate pages accessible
- ✅ All restricted features properly gated
- ✅ All upgrade prompts functional
- ✅ No unauthorized access
- ✅ Smooth upgrade UX

---

## 📊 Latest Diagnostic Results

**Test Date:** 2025-10-29  
**Build Commit:** `fd3c82c`  
**Method:** Static Code Analysis

### Tier Pass Rates

| Tier | Pass Rate | Status |
|------|-----------|--------|
| Free | 77.8% (7/9) | 🟢 |
| Basic | 88.9% (8/9) | 🟢 |
| Pro | 80.0% (8/10) | 🟢 |
| Enterprise | 83.3% (10/12) | 🟢 |

**System Average:** 🎯 **82.5%**

### Critical Findings

1. ✅ **Navigation Gating:** 100% active (40 pages)
2. 🟡 **Content Gates:** 40% coverage (4/10 pages)
3. ❌ **Project Limits:** 0% integrated (service exists)
4. ✅ **Upgrade Prompts:** Working correctly

### Detailed Results

See [DIAGNOSTIC_SUMMARY.md](DIAGNOSTIC_SUMMARY.md) for complete tier-by-tier analysis.

---

**See Also:**  
- [Tier Descriptions](tiers.md) for expected feature access  
- [Navigation System](navigation.md) for menu validation  
- [Integration Guide](integration.md) for fixing issues  
- [DIAGNOSTIC_SUMMARY.md](DIAGNOSTIC_SUMMARY.md) for full results

