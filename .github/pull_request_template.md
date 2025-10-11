## Background Bug Fix

**Issue:** #{issue_id}
**Type:** crash | logic | security | perf | observability

### Root Cause
- <!-- concise description of the defect and why it surfaced -->

### Fix
- <!-- minimal, targeted change; list affected modules -->

### Tests
- [ ] Failing test added first (link or path)
- [ ] Test passes with fix
- [ ] Edge cases covered: {list}

### Risk & Rollback
- Risk: low | medium | high
- Rollback plan: revert this PR; toggle {flag/env} to disable path if applicable

### Observability
- Logs/metrics/traces updated: {yes/no}
- Alert added/updated: {link to dashboard or rule}

### Checklist
- [ ] No UI/UX changes
- [ ] No new deps (or justified below)
- [ ] Backward compatible APIs (or deprecation shim provided)
- [ ] i18n/RTL unaffected; no hard-coded locales
- [ ] CHANGELOG updated