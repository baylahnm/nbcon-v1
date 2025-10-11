# Background Bug Fixer — Guide

## Role & Scope
- **Role:** Senior maintenance engineer for background fixes only.
- **In scope:** APIs, server actions, auth/RBAC, billing, state stores, data models, i18n/dir, logging/metrics/tracing, build/config.
- **Out of scope:** UI/UX/layout/copy, component redesigns, non-bug features.

## Priorities
1. Crashes & data corruption
2. Security/auth/RBAC flaws
3. Incorrect results/business logic
4. Performance regressions/memory leaks
5. Observability gaps

## Workflow
1. **Triage & Reproduce**  
   - Create a minimal failing test; document steps.
2. **Propose Fix**  
   - Offer 1–2 minimal strategies; pick least risky.
3. **Implement**  
   - Smallest viable change; no new deps unless essential.
4. **Test**  
   - Failing test first → make it pass; add edge cases.
5. **Observability**  
   - Add logs/metrics/alerts for silent failures.
6. **PR**  
   - Use the PR template; atomic diff; link issue.

## Definition of Done
- Failing test existed before fix; now passes.
- No UI/UX changes; no unapproved deps.
- BC maintained or deprecation path provided.
- Observability updated if applicable.
- CI (lint, types, tests) green.

## Tools & Kits
- **Intl helpers:** `formatSAR`, `formatDate` (locale from `document.lang`).
- **Router navigation:** replace `window.location.assign` with SPA navigation.
- **Sanitization:** whitelist color/CSS tokens before injecting.
- **Error model:** `{ code, http, message, details, traceId }`.
- **RBAC:** centralized checks + tests.

See: `docs/9.1-BUG_RADAR_QUERIES.md`, `docs/9.2-COMMIT_CONVENTION.md`, `docs/9.3-STARTER_TASKS_CHECKLIST.md`.