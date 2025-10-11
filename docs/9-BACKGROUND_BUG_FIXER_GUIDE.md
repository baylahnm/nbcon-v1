# Background Bug Fixer — Production-Ready Guide

## Role & Scope
- **Role:** Senior maintenance engineer for production-ready background fixes only.
- **Mission:** Deliver robust, testable, observable fixes that prevent regressions and enable safe rollbacks.
- **In scope:** APIs, server actions, auth/RBAC, billing/payments, state stores, data models, i18n/RTL/LTR, logging/metrics/tracing, build/config, performance optimization.
- **Out of scope:** UI/UX/layout/copy, component redesigns, non-bug features, product features.

## Priorities (P0 → P2)
1. **P0 - Critical:** Crashes & data corruption, security/auth/RBAC flaws
2. **P1 - High:** Incorrect results/business logic, performance regressions/memory leaks
3. **P2 - Medium:** Observability gaps (missing logs/metrics/traces)

## Production-Ready Workflow

### 1. Triage & Root Cause Analysis
- **Reproduce:** Create a minimal failing test that demonstrates the bug
- **Document:** Capture steps, scope, impact, and affected users/systems
- **Analyze:** Identify why the bug occurred and what processes failed to prevent it
- **Assess:** Determine priority level (P0/P1/P2) and blast radius

### 2. Propose Fix Strategy
- **Research:** Offer 1–2 minimal fix strategies
- **Evaluate:** Risk vs benefit analysis for each approach
- **Choose:** Pick the least risky, most maintainable approach
- **Document:** Why this approach is safest and what alternatives were rejected

### 3. Implement with Tests-First
- **Write failing test:** Prove the bug exists before fixing
- **Smallest viable fix:** Minimal code change; avoid broad refactors
- **Make test pass:** Verify the fix resolves the issue
- **Add edge cases:** null/undefined, empty arrays, boundaries, errors, concurrency
- **No new deps:** Unless essential and justified with security audit

### 4. Testing Strategy (Test Pyramid)
- **Unit tests (70%):** Fast, isolated, test individual functions/modules
- **Integration tests (20%):** Test component interactions, API contracts
- **E2E tests (10%):** Critical user flows, if applicable to background services
- **Performance tests:** Load testing for critical paths, memory leak detection
- **Error handling tests:** Network failures, timeouts, invalid inputs

### 5. Observability & Monitoring
- **Structured logging:** Include requestId, userId, role, timestamp, severity (no PII)
- **Metrics:** Track fix effectiveness with before/after comparisons
- **Distributed tracing:** Add trace IDs for debugging complex workflows
- **Alerts:** Configure alerts with proper thresholds and escalation paths
- **Dashboards:** Create/update dashboards showing key metrics

### 6. Feature Flags & Rollout
- **Feature flags:** Enable controlled rollouts for risky fixes
- **Kill switch:** Ability to quickly disable fix if issues arise
- **Gradual rollout:** 1% → 10% → 50% → 100% with monitoring at each stage
- **Rollback plan:** Document and test rollback before merging to production

### 7. Code Review & Quality
- **Peer review:** At least one senior engineer reviews the code
- **Code standards:** Follow project conventions, TypeScript strict mode
- **Security scan:** No new vulnerabilities introduced
- **Performance check:** Verify benchmarks meet SLAs
- **Documentation:** Update CHANGELOG, API docs, migration guides

### 8. Production Deployment
- **Pre-deployment checklist:** All tests pass, no linter errors, security scan clear
- **Staged rollout:** Follow gradual deployment plan
- **Monitor:** Watch metrics, error rates, performance during rollout
- **On-call briefing:** Ensure on-call engineer knows about the change

### 9. Post-Fix Debrief (Continuous Improvement)
- **Post-mortem:** Analyze root cause, contributing factors, detection gaps (for P0/P1)
- **Document lessons:** Update team wiki with patterns to avoid
- **Process improvements:** Add linting rules, new tests, improve monitoring
- **Prevent recurrence:** Add guardrails (type checks, runtime validations)
- **Share knowledge:** Brief team on bug cause, fix, and prevention strategies

## Definition of Done (Production-Ready)
- ✅ Failing test existed before fix; now passes
- ✅ No UI/UX changes; no unapproved deps
- ✅ Backward compatible or deprecation path provided with migration guide
- ✅ Observability updated (logs/metrics/alerts with proper severity)
- ✅ Code reviewed by senior engineer
- ✅ All automated tests pass (unit, integration, e2e)
- ✅ No linter errors or type errors
- ✅ Security scan passed
- ✅ Performance benchmarks meet SLAs
- ✅ CHANGELOG updated with issue link and risk level
- ✅ Rollback plan documented and tested
- ✅ Feature flag configured (if applicable)
- ✅ On-call engineer briefed

## Tools & Kits

### Internationalization
- **Intl helpers:** `formatSAR`, `formatDate` (locale from `document.lang`)
- **Testing:** Test with multiple locales (ar, en) and RTL/LTR layouts
- **Validation:** No hard-coded 'en-US' formatters

### Navigation
- **SPA routing:** Replace `window.location.assign` with router navigation
- **Testing:** Verify no full page reloads; state preservation

### Sanitization
- **Color/CSS:** Whitelist color/CSS tokens before injecting
- **HTML:** Use DOMPurify or equivalent for user-generated content
- **Testing:** Reject invalid tokens, XSS attempts

### Error Handling
- **Standard model:** `{ code, http, message, details, traceId }`
- **Structured errors:** Machine-readable codes for programmatic handling
- **Context:** Always provide context (requestId, userId, operation)

### Auth/RBAC
- **Centralized checks:** `RequireRole`, `hasPermission` utilities
- **Testing:** Test all role + subscription combinations
- **Validation:** Server-side validation; never trust client

### State Management (Zustand)
- **Immutability:** Use `set()` for all mutations; no direct state changes
- **Persistence:** Migration strategy for persist key changes
- **Testing:** Test state transitions, race conditions

### API Validation
- **Schema validation:** Zod schemas at all boundaries
- **Error handling:** Proper handling of non-200 responses
- **Timeouts:** Set reasonable timeouts with retry + backoff

## Code Quality Standards
- **TypeScript strict:** No 'any' types; use proper type guards
- **Naming:** Consistent conventions across codebase
- **Comments:** JSDoc for public APIs and complex logic
- **Error handling:** Always handle errors with proper types and context
- **Security:** Sanitize inputs, parameterized queries, server validation
- **Performance:** Profile critical paths; avoid premature optimization
- **Testing:** Testable code with dependency injection, loose coupling

## Related Documentation
- **Bug Radar:** `docs/9.1-BUG_RADAR_QUERIES.md` - High-signal searches for finding bugs
- **Commit Convention:** `docs/9.2-COMMIT_CONVENTION.md` - Standardized commit messages
- **Starter Tasks:** `docs/9.3-STARTER_TASKS_CHECKLIST.md` - Ready-to-use starter tasks
- **PR Template:** `.github/pull_request_template.md` - Comprehensive PR checklist
