## Background Bug Fix

**Issue:** #{issue_id}  
**Type:** crash | logic | security | perf | observability  
**Priority:** P0 | P1 | P2  
**Impact:** production | staging | development

---

### Root Cause Analysis
<!-- Provide detailed analysis of what caused the bug -->
- **What happened:** 
- **Why it happened:** 
- **What process failed to prevent it:** 
- **When it was introduced:** (commit/PR if known)

---

### Fix Strategy
<!-- Describe the minimal, targeted change -->
- **Approach chosen:** 
- **Alternative approaches considered:** 
- **Why this approach is safest:** 
- **Modules affected:** 
- **API changes:** (none | backward-compatible | breaking with deprecation)

---

### Tests
- [ ] **Failing test added first** (link or path): 
- [ ] **Test passes with fix**
- [ ] **Edge cases covered:** 
  - [ ] null/undefined handling
  - [ ] empty arrays/objects
  - [ ] boundary conditions
  - [ ] error states
  - [ ] concurrent operations (if applicable)
- [ ] **Integration tests added** (if applicable)
- [ ] **Performance tests** (if perf-related)

---

### Risk Assessment & Rollback
- **Risk level:** low | medium | high
- **Blast radius:** (what could break if this fails)
- **Rollback plan:** 
  1. Revert this PR: `git revert <commit-sha>`
  2. Feature flag toggle: `{flag_name} = false` (if applicable)
  3. Environment variable: `{env_var} = {fallback_value}` (if applicable)
- **Rollback tested:** yes | no
- **Monitoring during rollout:** (metrics to watch)

---

### Feature Flags & Rollout
- [ ] **Feature flag configured:** {flag_name} (if applicable)
- [ ] **Kill switch implemented:** (ability to disable quickly)
- **Rollout strategy:** 
  - [ ] 1% traffic
  - [ ] 10% traffic
  - [ ] 50% traffic
  - [ ] 100% traffic
- **Monitoring at each stage:** (describe what to watch)

---

### Observability
- **Logs updated:** yes | no
  - [ ] Structured logging with requestId/userId/role
  - [ ] Appropriate severity levels
  - [ ] No PII in logs
- **Metrics added/updated:** yes | no
  - [ ] Before/after comparison metrics
  - [ ] Error rate tracking
  - [ ] Performance metrics
- **Traces updated:** yes | no
  - [ ] Distributed tracing with trace IDs
- **Alerts configured:** yes | no
  - Link to alert rule: 
  - Thresholds set: 
  - Escalation path: 
- **Dashboard:** (link to dashboard or note if created/updated)

---

### Performance Impact
- **Before:** (baseline metrics)
- **After:** (metrics with fix)
- **Load testing:** completed | not-required
- **Memory impact:** (increase/decrease/none)
- **Database impact:** (query changes, index needs)

---

### Security Considerations
- [ ] **No new vulnerabilities introduced**
- [ ] **Security scan passed**
- [ ] **Input validation added/verified**
- [ ] **Auth/RBAC checks maintained**
- [ ] **No credentials in code**
- [ ] **SQL injection safe** (parameterized queries)
- [ ] **XSS safe** (sanitized outputs)

---

### Production Deployment Checklist
- [ ] All tests pass (unit, integration, e2e)
- [ ] No linter or type errors
- [ ] Performance benchmarks meet SLAs
- [ ] Security scan passed
- [ ] Feature flag configured (if applicable)
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented and tested
- [ ] Staged rollout plan defined
- [ ] On-call engineer briefed

---

### Code Quality Checklist
- [ ] **No UI/UX changes**
- [ ] **No new deps** (or justified below with security audit)
- [ ] **Backward compatible APIs** (or deprecation shim + migration guide provided)
- [ ] **i18n/RTL unaffected**; no hard-coded locales
- [ ] **TypeScript strict:** no 'any' types
- [ ] **Error handling:** all errors properly caught and logged
- [ ] **Code reviewed** by senior engineer
- [ ] **CHANGELOG updated** with issue link and risk level
- [ ] **Documentation updated** (if API/behavior changed)

---

### Post-Deployment
- [ ] **Monitor metrics** for 24h after full rollout
- [ ] **Conduct post-mortem** (for P0/P1 bugs)
- [ ] **Update team wiki** with lessons learned
- [ ] **Add guardrails** (linter rules, tests) to prevent recurrence
- [ ] **Brief team** on root cause and prevention
