# NBCON Platform — Multi-Tier Subscription Documentation

> **Purpose:** Central reference for NBCON's plan-based subscription system (Free, Basic, Pro, Enterprise). This replaces the legacy role-based portal architecture with a unified, scalable tier structure.

---

## 📚 Quick Navigation

| Document | Purpose |
|----------|---------|
| **[Tier Descriptions](plan/tiers.md)** | Detailed feature breakdown for Free, Basic, Pro, and Enterprise plans |
| **[Navigation System](plan/navigation.md)** | Unified menu configuration and plan-based visibility rules |
| **[Testing Guide](plan/tests.md)** | Tier-by-tier diagnostic procedures and validation commands |
| **[Integration Guide](plan/integration.md)** | Subscription infrastructure and activation checklist |

---

## 🎯 System Overview

NBCON uses a **tiered subscription model** with the following hierarchy:

```
Free (Tier 0) → Basic (Tier 1) → Pro (Tier 2) → Enterprise (Tier 3)
```

Each tier includes **all features from lower tiers** plus additional capabilities.

---

## 📊 Feature Matrix (Quick Reference)

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| **Active Projects** | 1 | 5 | Unlimited | Unlimited |
| **AI Quota** | 100K tokens | 250K tokens | Unlimited | Unlimited |
| **AI Planning Tools** | ✅ 7 tools | ✅ 7 tools | ✅ All tools | ✅ All tools |
| **Specialized AI Agents** | 🔒 | 🔒 | ✅ | ✅ |
| **Advanced Analytics** | 🔒 | 🔒 | ✅ | ✅ |
| **API Access** | 🔒 | 🔒 | ✅ | ✅ |
| **Multi-User Management** | 🔒 | 🔒 | 🔒 | ✅ |
| **SSO/SAML** | 🔒 | 🔒 | 🔒 | ✅ |
| **Custom Branding** | 🔒 | 🔒 | Partial | ✅ Full |

---

## 🚀 Quick Start

### For Developers

1. **Review Infrastructure:** Read [Integration Guide](plan/integration.md) to understand the subscription stack
2. **Activate Gating:** Add `requiredSubscription` values to pages in `portalRegistry.ts`
3. **Run Diagnostics:** Follow [Testing Guide](plan/tests.md) for tier-by-tier validation
4. **Deploy:** Ensure all tests pass before production deployment

### For Product/Planning

1. **Understand Tiers:** Read [Tier Descriptions](plan/tiers.md) for feature allocations
2. **Review Navigation:** See [Navigation System](plan/navigation.md) for menu structure
3. **Plan Features:** Reference the feature matrix when planning new capabilities

---

## 🔧 Core Implementation Files

| File | Purpose |
|------|---------|
| `src/shared/services/subscriptionService.ts` | Tier management, quota enforcement, feature access |
| `src/components/portal/shared/FeatureGate.tsx` | UI component for subscription-gated content |
| `src/pages/2-auth/others/stores/auth.ts` | User subscription data persistence |
| `src/hooks/usePortalAccess.ts` | Permission checking hook |
| `src/config/portalRegistry.ts` | Page definitions with subscription requirements |

---

## 📝 Diagnostic Sequence

Run tier-by-tier diagnostics in this order:

1. **Phase 0:** Infrastructure reconnaissance ([Integration Guide](plan/integration.md))
2. **Phase 1:** Free tier validation ([Testing Guide](plan/tests.md))
3. **Phase 2:** Basic tier validation
4. **Phase 3:** Pro tier validation
5. **Phase 4:** Enterprise tier validation
6. **Phase 5:** Cross-tier upgrade flows

---

## ✅ Current Status

- ✅ **Infrastructure:** Complete and production-ready
- ✅ **FeatureGate Component:** Implemented with upgrade prompts
- ✅ **Subscription Service:** Full tier hierarchy and quota system
- ⚠️ **Route Gating:** Infrastructure ready, awaiting activation
- ⚠️ **E2E Tests:** Test suite exists, needs tier-specific coverage

---

## 🔗 Related Resources

- **Archive:** Legacy documentation in `docs/archive/`
- **Database:** Supabase migrations in `supabase/migrations/`
- **Tests:** E2E tests in `tests/e2e/subscriptionGating.spec.ts`

---

**Last Updated:** October 29, 2025  
**Version:** 1.0.0

